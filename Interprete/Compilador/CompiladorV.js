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
        console.log('ENTRA A SENTENCIA EXPRESION');
        node.expresion.accept(this);
        this.code.popObject(r.T0);
    }

    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitOperacionBinaria(node) {
        this.code.comment(`Operacion: ${node.operador}`);
        node.izquierda.accept(this); // izquierda |
        node.derecha.accept(this); // izquierda | derecha

        const derecha = this.code.popObject(r.T0); // derecha
        const izquierda = this.code.popObject(r.T1); // izquierda

        const Handler = new OperacionBinariaHandler(node.operador, izquierda, derecha, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
        this.code.comment('Fin-De-Operacion-Binaria');

        /*if (izquierda.type === 'string' && derecha.type === 'string') {
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T0);
            this.code.callBuiltin('ConcatenarString');
            this.code.pushObject({ type: 'string', length: 4 });
            return;
        }

        if (node.operador === '<') {
            
            this.code.slt(r.T0, r.T1, r.T0); // Si T1 < T0, T0 = 1
            this.code.push(r.T0);
            this.code.pushObject({ type: 'boolean', length: 4 });
            return;
        }
        

        switch (node.operador) {
            case '+':
                this.code.add(r.T0, r.T0, r.T1);
                this.code.push(r.T0);
                break;
            case '-':
                this.code.sub(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
            case '*':
                this.code.mul(r.T0, r.T0, r.T1);
                this.code.push(r.T0);
                break;
            case '/':
                this.code.div(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
            case '%':
                this.code.rem(r.T0, r.T1, r.T0);
                this.code.push(r.T0);
                break;
        }
        this.code.pushObject({ type: 'int', length: 4 });*/
    }

    /**
    * @type {BaseVisitor['visitOperacionAND']}
    */
    visitOperacionAND(node) {
        
        this.code.comment('Operacion-&&');
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            this.code.and(r.T0, r.T0, r.T1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
        this.code.pushObject({ type: 'boolean', length: 4 });
        this.code.comment('Fin-De-Operacion-Binaria');
        return
    }
    

    /**
    * @type {BaseVisitor['visitOperacionOR']}
    */
    visitOperacionOR(node) {
        this.code.comment('Operacion-||');
        node.izquierda.accept(this); // izquierda
        this.code.popObject(r.T0); // izquierda
        const labelTrue = this.code.getLabel();
        const labelEnd = this.code.getLabel();
        this.code.bne(r.T0, r.ZERO, labelTrue); // if (izquierda) goto labelTrue
        node.derecha.accept(this); // derecha
        this.code.popObject(r.T0); // derecha
        this.code.bne(r.T0, r.ZERO, labelTrue); // if (derecha) goto labelTrue
        this.code.li(r.T0, 0);
        this.code.push(r.T0);
        this.code.j(labelEnd);
        this.code.addLabel(labelTrue);
        this.code.li(r.T0, 1);
        this.code.push(r.T0);
        this.code.addLabel(labelEnd);
        this.code.pushObject({ type: 'boolean', length: 4 });
        this.code.comment('Fin-De-Operacion-Binaria');
        return
    }

    /**
    * @type {BaseVisitor['visitOperacionUnaria']}
    */
    visitOperacionUnaria(node) {
        node.expresion.accept(this);
        const izquierda = this.code.popObject(r.T0);
        const Handler = new OperacionUnariaHandler(node.operador, izquierda, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
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
        this.code.comment(`Fin Entero: ${node.valor}`);
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
        console.log('ENTRA A CADENA', node.valor);
        this.code.comment(`Cadena: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin Cadena: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        this.code.comment(`Caracter: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor});
        this.code.comment(`Fin Caracter: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        console.log('ENTRA A BOOLEANO', node.valor);
        this.code.comment(`Booleano: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin Booleano: ${node.valor}`);
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
        this.code.comment(`Referencia a variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });
        this.code.comment(`Fin referencia de variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
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
    }

    /*
    this.code.comment('Print');

        const tipoPrint = {
            'int': () => this.code.printInt(),
            'string': () => this.code.printString(),
            'bool': () => this.code.printBool(),
            'char': () => this.code.printChar()
        }

        for (let i = 0; i < node.exp.length; i++) {
            node.exp[i].accept(this);
            // hacer pop de la pila
            const object = this.code.popObject(r.A0);
            tipoPrint[object.type]();
        }
    }
    */
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {

        this.code.comment(`Asignacion Variable: ${node.id}`);

        node.asignacion.accept(this);
        
        const valueObject = this.code.popObject(r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);

        this.code.addi(r.T1, r.SP, offset);
        //this.code.lw(r.T2, r.T1);
        this.code.sw(r.T0, r.T1);

        variableObject.type = valueObject.type;

        this.code.push(r.T0);
        this.code.pushObject(valueObject);

        this.code.comment(`Fin Asignacion Variable: ${node.id}`);
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        this.code.comment('Inicio de bloque');

        this.code.newScope();

        node.sentencias.forEach(d => d.accept(this));

        this.code.comment('Reduciendo la pila');
        const bytesToRemove = this.code.endScope();

        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }

        this.code.comment('Fin de bloque');
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
        const endWhile = this.code.getLabel();
        this.code.addLabel(startWhile);
        this.code.comment('Condicion');
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('Fin-de-condicion');
        this.code.beq(r.T0, r.ZERO, endWhile);

        this.code.comment('Cuerpo-del-While');
        node.sentencias.accept(this);
        this.code.j(startWhile);

        this.code.addLabel(endWhile);

        this.code.comment('Fin-del-While');
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
        this.code.addLabel(startFor);
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.beq(r.T0, r.ZERO, endFor);
        node.sentencia.accept(this);
        node.incremento.accept(this);
        this.code.j(startFor);
        this.code.addLabel(endFor);
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
    }
    
    /**
    * @type {BaseVisitor['visitContinue']}
    */
    visitContinue(node) {
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
        const valor = this.code.popObject(r.T0);
        if (valor.type === 'string') {
            this.code.pushConstant({ type: 'int', valor: parseInt(valor.valor)});
        } 
        return
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