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
    }

    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitOperacionBinaria(node) {
        node.izquierda.accept(this);
        node.derecha.accept(this);
        const derecha = this.code.popObject(r.T0);
        const izquierda = this.code.popObject(r.T1);
        const Handler = new OperacionBinariaHandler(node.operador, izquierda, derecha, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
    }

    /**
    * @type {BaseVisitor['visitOperacionAND']}
    */
    visitOperacionAND(node) {
        node.izquierda.accept(this); // izquierda
        this.code.popObject(r.T0); // izquierda
        const labelFalse = this.code.getLabel();
        const labelEnd = this.code.getLabel();
        this.code.beq(r.T0, r.ZERO, labelFalse); // if (!izquierda) goto labelFalse
        node.derecha.accept(this); // derecha
        this.code.popObject(r.T0); // derecha
        this.code.beq(r.T0, r.ZERO, labelFalse); // if (!derecha) goto labelFalse
        this.code.li(r.T0, 1);
        this.code.push(r.T0);
        this.code.j(labelEnd);
        this.code.addLabel(labelFalse);
        this.code.li(r.T0, 0);
        this.code.push(r.T0);
        this.code.addLabel(labelEnd);
        this.code.pushObject({ type: 'boolean', length: 4 });
        return
    }
    

    /**
    * @type {BaseVisitor['visitOperacionOR']}
    */
    visitOperacionOR(node) {
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
        this.code.pushContant({ type: node.tipo, valor: node.valor });
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
        this.code.pushContant({ type: node.tipo, valor: node.valor });
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        this.code.pushContant({ type: node.tipo, valor: node.valor.charCodeAt(0) });
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        this.code.pushContant({ type: node.tipo, valor: node.valor });
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        this.code.comment(`Inicio-Declaracion-Variable`);
        if (node.expresion) {
            node.expresion.accept(this);
        } else {
            switch (node.tipo) {
                case 'int':
                    this.code.li(r.T0, 0);
                    this.code.push(r.T0);
                    this.code.pushObject({ type: 'int', length: 4 });
                    break;
                case 'float':
                    break;
                case 'boolean':
                    this.code.li(r.T0, 0);
                    this.code.push(r.T0);
                    this.code.pushObject({ type: 'boolean', length: 4 });
                    break;
                case 'string':
                    this.code.push(r.HP);
                    this.code.li(r.T0, 0);
                    this.code.sb(r.T0, r.HP);
                    this.code.addi(r.HP, r.HP, 1);
                    this.code.pushObject({ type: 'string', length: 4 });
                    break;
                case 'char':
                    this.code.li(r.T0, 0);
                    this.code.push(r.T0);
                    this.code.pushObject({ type: 'char', length: 4 });
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
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });
    }

    /**
    * @type {BaseVisitor['visitPrint']}
    */
    visitPrint(node) {
        node.expresion.forEach(expresion => {
            expresion.accept(this);
            const object = this.code.popObject(r.A0);
            const tipoPrint = {
                'int': () => this.code.printInt(),
                'string': () => this.code.printString(),
                'char': () => this.code.printChar(),
                'boolean': () => this.code.printBoolean()
            }
            const printFn = tipoPrint[object.type];
            if (printFn) {
                printFn();
            }
        });
        this.code.printNewLine();
    }
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {
        node.asignacion.accept(this);
        const valueObject = this.code.popObject(r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T1, r.SP, offset);
        this.code.sw(r.T0, r.T1);
        variableObject.type = valueObject.type;
        this.code.push(r.T0);
        this.code.pushObject(valueObject);
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        this.code.newScope();
        node.sentencias.forEach(d => d.accept(this));
        const bytesToRemove = this.code.endScope();
        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }
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
        this.code.comment('Inicio-del-While');
        const startWhile = this.code.getLabel();
        const endWhile = this.code.getLabel();
        this.code.addLabel(startWhile);
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.beq(r.T0, r.ZERO, endWhile);
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
            this.code.pushContant({ type: 'int', valor: parseInt(valor.valor)});
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
            this.code.pushContant({ type: 'string', valor: 'int' });
        } else if (valor.type === 'float') {
            this.code.pushContant({ type: 'string', valor: 'float' });
        } else if (valor.type === 'char') {
            this.code.pushContant({ type: 'string', valor: 'char' });
        } else if (valor.type === 'boolean') {
            this.code.pushContant({ type: 'string', valor: 'boolean' });
        } else if (valor.type === 'string') {
            this.code.pushContant({ type: 'string', valor: 'string' });
        }
        //this.code.pushObject({ type: 'string', length: 4 });
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