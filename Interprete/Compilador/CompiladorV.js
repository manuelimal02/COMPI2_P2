import { BaseVisitor } from "../Visitor/Visitor.js";
import { Registros as r } from "./Registros.js";
import { Generador } from "./Generador.js";
import { OperacionBinariaHandler } from "./Binaria.js";
import { OperacionUnariaHandler } from "./Unaria.js";

export class Compilador extends BaseVisitor {

    constructor() {
        super();
        this.code = new Generador();
        this.PilaBreaks = [];
        this.PilaContinues = [];
    }

    /**
    * @type {BaseVisitor['visitSentenciaExpresion']}
    */
    visitSentenciaExpresion(node) {
        node.expresion.accept(this);
        this.code.popObject(r.T0);
    }

    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitOperacionBinaria(node) {
        this.code.comment(`Operacion-Binaria: ${node.operador}`);
        node.izquierda.accept(this);
        node.derecha.accept(this);

        const derecha = this.code.popObject(r.T0);
        const izquierda = this.code.popObject(r.T1); 

        const Handler = new OperacionBinariaHandler(node.operador, izquierda, derecha, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
        this.code.comment('Fin-De-Operacion-Binaria');
    }

    /**
    * @type {BaseVisitor['visitOperacionUnaria']}
    */
    visitOperacionUnaria(node) {
        this.code.comment(`Operacion-Unaria: ${node.operador}`);
        node.expresion.accept(this);
        const izquierda = this.code.popObject(r.T0);
        const Handler = new OperacionUnariaHandler(node.operador, izquierda, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
        this.code.comment(`Fin-Operacion-Unaria`);
    }

    /**
    * @type {BaseVisitor['visitAgrupacion']}
    */
    visitAgrupacion(node) {
        return node.expresion.accept(this);
    }

    /**
    * @type {BaseVisitor['visitEntero']}
    */
    visitEntero(node) {
        this.code.comment(`Entero: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Entero: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitDecimal']}
    */
    visitDecimal(node) {
    }

    /**
    * @type {BaseVisitor['visitCadena']}
    */
    visitCadena(node) {
        this.code.comment(`Cadena:`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Cadena`);
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        this.code.comment(`Caracter: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor});
        this.code.comment(`Fin-Caracter: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        this.code.comment(`Booleano: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Booleano: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        this.code.comment(`Inicio-Declaracion-Variable`);
        if (node.expresion) {
            node.expresion.accept(this);
        } else {
            console.log('ENTRA A DECLARACION VAR por defecto', node);
            switch (node.tipo) {
                case 'int':
                    this.code.pushObject({ type: 'int', valor: 0 });
                    break;
                case 'float':
                    break;
                case 'boolean':
                    this.code.pushObject({ type: 'boolean', valor: false });
                    break;
                case 'string':
                    this.code.pushObject({ type: 'string', valor: "" });
                    break;
                case 'char':
                    this.code.pushObject({ type: 'string', valor: "" });
                    break;
            }
        }
        this.code.tagObject(node.id);
        this.code.comment(`Fin-Declaracion-Variable`);
    }

    /**
    * @type {BaseVisitor['visitReferenciaVariable']}
    */
    visitReferenciaVariable(node) {
        this.code.comment(`Referencia-Variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });
        this.code.comment(`Fin-Referencia-Variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
    }

    /**
    * @type {BaseVisitor['visitPrint']}
    */
    visitPrint(node) {
        this.code.comment('Print');
        const tipoPrint = {
            'int': () => this.code.printInt(),
            'string': () => this.code.printString(),
            'boolean': () => this.code.printBoolean(),
            'char': () => this.code.printChar()
        }
        for (let i = 0; i < node.expresion.length; i++) {
            node.expresion[i].accept(this);
            const object = this.code.popObject(r.A0);
            tipoPrint[object.type]();
        }
        this.code.printNewLine();
        this.code.comment('Fin-Print');
    }
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {
        this.code.comment(`Asignacion-Variable: ${node.id}`);
        node.asignacion.accept(this);
        const valueObject = this.code.popObject(r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T1, r.SP, offset);
        this.code.sw(r.T0, r.T1);
        variableObject.type = valueObject.type;
        this.code.push(r.T0);
        this.code.pushObject(valueObject);
        this.code.comment(`Fin-Asignacion-Variable: ${node.id}`);
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        this.code.comment('Inicio-Bloque');
        this.code.newScope();
        node.sentencias.forEach(d => d.accept(this));
        this.code.comment('Reduciendo-Pila');
        const bytesToRemove = this.code.endScope();
        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }
        this.code.comment('Fin-Bloque');
    }

    /**
    * @type {BaseVisitor['visitIf']}
    */
    visitIf(node) {
        this.code.comment('Inicio-del-If');
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        const hasElse = !!node.sentenciasFalso
        if (hasElse) {
            const elseLabel = this.code.getLabel();
            const endIfLabel = this.code.getLabel();
            this.code.beq(r.T0, r.ZERO, elseLabel);
            node.sentenciasVerdadero.accept(this);
            this.code.j(endIfLabel);
            this.code.addLabel(elseLabel);
            node.sentenciasFalso.accept(this);
            this.code.addLabel(endIfLabel);
        } else {
            const endIfLabel = this.code.getLabel();
            this.code.beq(r.T0, r.ZERO, endIfLabel);
            node.sentenciasVerdadero.accept(this);
            this.code.addLabel(endIfLabel);
        }
        this.code.comment('Fin-del-If');
    }

    /**
    * @type {BaseVisitor['visitWhile']}
    */
    visitWhile(node) {
        this.code.comment('Inicio-de-While');

        const startWhile = this.code.getLabel();
        this.PilaContinues.push({ type: 'while', label: startWhile });
        const endWhile = this.code.getLabel();
        this.PilaBreaks.push({ type: 'while', label: endWhile });

        this.code.addLabel(startWhile);
        this.code.comment('Condicion-Del-While');
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('Fin-De-Condicion');
        this.code.beq(r.T0, r.ZERO, endWhile);

        this.code.comment('Cuerpo-Del-While');
        node.sentencias.accept(this);
        this.code.j(startWhile);

        this.code.addLabel(endWhile);

        this.PilaContinues.pop();
        this.PilaBreaks.pop();
        this.code.comment('Fin-Del-While');
    }

    /**
    * @type {BaseVisitor['visitSwitch']}
    */
    visitSwitch(node) {
        this.code.comment('Inicio-del-Switch');
        node.condicion.accept(this);
        this.code.popObject(r.T1);
        const LabelFinalizacion = this.code.getLabel();
        this.PilaBreaks.push({ type: 'switch', label: LabelFinalizacion });
        const LabelCasos = node.cases.map(() => this.code.getLabel());
        const LabelDefault = node.default1 ? this.code.getLabel() : LabelFinalizacion;

        node.cases.forEach((caseNode, index) => {
            caseNode.valor.accept(this);
            this.code.popObject(r.T0);
            this.code.beq(r.T1, r.T0, LabelCasos[index]);
        });
        this.code.j(LabelDefault);

        node.cases.forEach((caseNode, index) => {
            this.code.addLabel(LabelCasos[index]);
            caseNode.bloquecase.forEach(sentencia => {
                sentencia.accept(this)
            });
        });

        if (node.default1) {
            this.code.addLabel(LabelDefault);
            node.default1.sentencias.forEach(sentencia => {
                sentencia.accept(this);
            });
        }
        this.code.addLabel(LabelFinalizacion);
        this.PilaBreaks.pop();
        this.code.comment('Fin-del-Switch');
    }

    /**
    * @type {BaseVisitor['visitFor']}
    */

    visitFor(node) {
        this.code.comment('Inicio-del-For');
        node.declaracion.accept(this);

        const startFor = this.code.getLabel();
        const endFor = this.code.getLabel();
        const incrementFor = this.code.getLabel();

        this.PilaContinues.push({ type: 'for', label: incrementFor });
        this.PilaBreaks.push({ type: 'for', label: endFor });

        this.code.addLabel(startFor);

        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.beq(r.T0, r.ZERO, endFor);

        node.sentencia.accept(this);

        this.code.addLabel(incrementFor);
        node.incremento.accept(this);
        this.code.j(startFor);

        this.code.addLabel(endFor);

        this.PilaContinues.pop();
        this.PilaBreaks.pop();

        this.code.comment('Fin-del-For');
    }

    /**
    * @type {BaseVisitor['visitBreak']}
    */
    visitBreak(node) {
        this.code.comment('Break');
        if(this.PilaBreaks.length === 0) {
            throw new Error('Break fuera De Un Ciclo o Switch');
        }
        const {type, label} = this.PilaBreaks[this.PilaBreaks.length - 1];
        this.code.j(label);
        this.code.comment('Fin-Break');
    }
    
    /**
    * @type {BaseVisitor['visitContinue']}
    */
    visitContinue(node) {
        this.code.comment('Continue');
        if(this.PilaContinues.length === 0) {
            throw new Error('Continue fuera De Un Ciclo');
        }
        const {type, label} = this.PilaContinues[this.PilaContinues.length - 1];
        this.code.j(label);
        this.code.comment('Fin-Continue');
    }
    
    /**
    * @type {BaseVisitor['visitReturn']}
    */
    visitReturn(node) {
    }

    /**
     * @type {BaseVisitor['visitLlamada']}
     */
    visitLlamada(node) {
    
    }

    /**
     * @type {BaseVisitor['visitParseInt']}
     */ 
    visitParseInt(node) {
        node.Argumento.accept(this);
        this.code.popObject(r.A0);
        this.code.callBuiltin('parseInt');
        this.code.push(r.A0); 
        this.code.pushObject({ type: 'int', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitParseInt']}
     */ 
    visitParseFloat(node) {
        console.log('ENTRA A PARSE FLOAT');
    }
    

    /**
     * @type {BaseVisitor['visitToString']}
     */ 
    visitToString(node) {
        console.log('ENTRA A TO STRING');
    }

    /**
     * @type {BaseVisitor['visitToLowerCase']}
     */ 
    visitToLowerCase(node) {
        node.Argumento.accept(this);
        this.code.callBuiltin('toLowerCase');
    }
    

    /**
     * @type {BaseVisitor['visitToUpperCase']}
     */ 
    visitToUpperCase(node) {
        node.Argumento.accept(this);
        this.code.callBuiltin('toUpperCase');
    }

    /**
     * @type {BaseVisitor['visitTypeOf']}
     */ 
    visitTypeOf(node) {
        node.Argumento.accept(this);
        const valor = this.code.popObject(r.T0);
        if (valor.type === 'int') {
            this.code.pushConstant({ type: 'string', valor: 'int' });
        } else if (valor.type === 'float') {
            this.code.pushConstant({ type: 'string', valor: 'float' });
        } else if (valor.type === 'char') {
            this.code.pushConstant({ type: 'string', valor: 'char' });
        } else if (valor.type === 'boolean') {
            this.code.pushConstant({ type: 'string', valor: 'boolean' });
        } else if (valor.type === 'string') {
            this.code.pushConstant({ type: 'string', valor: 'string' });
        }
        this.code.pushObject({ type: 'string', length: 4 });
        return
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo1']}
     */ 
    visitDeclaracionArreglo1(node) {
        this.code.comment('Inicio-Declaracion-Arreglo');
        this.code.la(r.T5, node.id);

        const valores = node.valores;

        valores.forEach((valor, index) => {
            valor.accept(this);
            this.code.popObject(r.T0);
            this.code.sw(r.T0, r.T5, index * 4);
        });

        this.code.NuevoArreglo(node.id, node.tipo, valores.length);
        this.code.pushObject({ type: node.tipo, length: valores.length*4});
        this.code.tagObject(node.id);
    
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo2']}
     */ 
    visitDeclaracionArreglo2(node) {
    
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo3']}
     */ 
    visitDeclaracionArreglo3(node) {
    
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitIndexArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitJoinArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitLengthArreglo']}
     */
    visitLengthArreglo(node) {
    
    }
    
    /**
     * @type {BaseVisitor['visitAccesoArreglo']}
     */
    visitAccesoArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitAsignacionArreglo']}
     */
    visitAsignacionArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitForEach']}
     */
    visitForEach(node) {
    
    }

    /**
     * @type {BaseVisitor['visitFuncionForanea']}
     */
    visitFuncionForanea(node) {
    
    }
} 