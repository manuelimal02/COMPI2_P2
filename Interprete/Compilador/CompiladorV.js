import { BaseVisitor } from "../Visitor/Visitor.js";
import { registers as r } from "./Constantes.js";
import { Generador } from "./Generador.js";
import { OperacionBinariaHandler } from "./Binaria.js";
import { OperacionUnariaHandler } from "./Unaria.js";

export class Compilador extends BaseVisitor {

    constructor() {
        super();
        this.code = new Generador();
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
        //this.code.comment(`Primitivo Entero: ${node.valor}`);
        this.code.pushContant({ type: node.tipo, valor: node.valor });
        //this.code.comment(`Fin Primitivo: ${node.valor}`);
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
        //this.code.comment(`Primitivo Cadena: ${node.valor}`);
        this.code.pushContant({ type: node.tipo, valor: node.valor });
        //this.code.comment(`Fin Primitivo: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        console.log(node);
        //this.code.comment(`Primitivo Caracter: ${node.valor}`);
        this.code.pushContant({ type: node.tipo, valor: node.valor.charCodeAt(0) });
        //this.code.comment(`Fin Primitivo: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        //this.code.comment(`Primitivo Booleano: ${node.valor}`);
        this.code.pushContant({ type: node.tipo, valor: node.valor });
        //this.code.comment(`Fin Primitivo: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        //this.code.comment(`Declaracion Variable: ${node.id}`);
        node.expresion.accept(this);
        this.code.tagObject(node.id);
        //this.code.comment(`Fin declaracion Variable: ${node.id}`);
    }
    

    /**
    * @type {BaseVisitor['visitReferenciaVariable']}
    */
    visitReferenciaVariable(node) {
        //this.code.comment(`Referencia a variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...variableObject, id: undefined });
        //this.code.comment(`Fin referencia de variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
    }

    /**
    * @type {BaseVisitor['visitPrint']}
    */
    visitPrint(node) {
        //this.code.comment('Print');
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
        //this.code.comment('Fin Print');
    }
    
    /**
    * @type {BaseVisitor['visitTernario']}
    */
    visitTernario(node) {
    }
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {
        //this.code.comment(`Asignacion Variable: ${node.id}`);
        node.asignacion.accept(this);
        const valueObject = this.code.popObject(r.T0);
        const [offset, variableObject] = this.code.getObject(node.id);
        this.code.addi(r.T1, r.SP, offset);
        this.code.sw(r.T0, r.T1);
        variableObject.type = valueObject.type;
        this.code.push(r.T0);
        this.code.pushObject(valueObject);
        //this.code.comment(`Fin Asignacion Variable: ${node.id}`);
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        //this.code.comment('Inicio de bloque');
        this.code.newScope();
        node.sentencias.forEach(d => d.accept(this));
        //this.code.comment('Reduciendo la pila');
        const bytesToRemove = this.code.endScope();
        if (bytesToRemove > 0) {
            this.code.addi(r.SP, r.SP, bytesToRemove);
        }
        //this.code.comment('Fin de bloque');
    }

    /**
    * @type {BaseVisitor['visitIf']}
    */
    visitIf(node) {
    }

    /**
    * @type {BaseVisitor['visitWhile']}
    */
    visitWhile(node) {

    }
    /**
    * @type {BaseVisitor['visitSwitch']}
    */
    visitSwitch(node) {
    
    }

    /**
    * @type {BaseVisitor['visitFor']}
    */
    visitFor(node) {
    
    }

    /**
    * @type {BaseVisitor['visitBreak']}
    */
    visitBreak(node) {
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
     * @type {BaseVisitor['visitEmbebida']}
     */ 
    visitEmbebida(node) {
    
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