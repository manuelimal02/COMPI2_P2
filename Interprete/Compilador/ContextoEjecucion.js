import { BaseVisitor } from "../Visitor/Visitor.js";

export class ContextoEjecucion extends BaseVisitor {

    constructor(baseOffset) {
        super();
        this.frame = [];
        this.localSize = 0;
        this.baseOffset = baseOffset;
    }

    visitSentenciaExpresion(node) {
        //Visit SentenciaExpresion
    }

    visitOperacionBinaria(node) {
        //Visit Operación Binaria
    }

    visitOperacionUnaria(node) {
        //Visit Operación Unaria
    }

    visitAgrupacion(node) {
        // Visit Agrupación
    }

    visitEntero(node) {
        // Visit Entero
    }

    visitDecimal(node) {
        // Visit Decimal
    }

    visitCadena(node) {
        // Visit Cadena
    }

    visitCaracter(node) {
        // Visit Caracter
    }

    visitBooleano(node) {
        // Visit Booleano
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize += 1;
    }

    visitReferenciaVariable(node) {
        // Visit Referencia Variable
    }

    visitPrint(node) {
        // Visit Print
    }
    
    visitAsignacion(node) {
        // Visit Asignación
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        node.sentencias.forEach(sentencia => sentencia.accept(this));
    }

    /**
    * @type {BaseVisitor['visitIf']}
    */
    visitIf(node) {
        node.sentenciasVerdadero.accept(this);
        if (node.sentenciasFalso){
            node.sentenciasFalso.accept(this);
        }
    }

    visitTernario(node) {
        // Visit Ternario
    }

    /**
    * @type {BaseVisitor['visitWhile']}
    */
    visitWhile(node) {
        node.sentencias.accept(this);
    }

    visitSwitch(node) {
        // Visit Switch
    }

    /**
    * @type {BaseVisitor['visitFor']}
    */
    visitFor(node) {
        node.sentencia.accept(this);
    }

    visitBreak(node) {
        // Visit Break
    }

    visitContinue(node) {
        // Visit Continue
    }

    visitReturn(node) {
        // Visit Return
    }

    visitLlamada(node) {
        // Visit Llamada
    }

    visitParseInt(node) {
        // Visit ParseInt
    }

    visitParseFloat(node) {
        // Visit ParseFloat
    }

    visitToString(node) {
        // Visit ToString
    }

    visitToLowerCase(node) {
        // Visit ToLowerCase
    }

    visitToUpperCase(node) {
        // Visit ToUpperCase
    }

    visitTypeOf(node) {
        // Visit TypeOf
    }

    visitDeclaracionArreglo1(node) {
        // Visit Declaración Arreglo 1
    }

    visitDeclaracionArreglo2(node) {
        // Visit Declaración Arreglo 2
    }

    visitDeclaracionArreglo3(node) {
        // Visit Declaración Arreglo 3
    }

    visitIndexArreglo(node) {
        // Visit Index Arreglo
    }

    visitJoinArreglo(node) {
        // Visit Join Arreglo
    }

    visitLengthArreglo(node) {
        // Visit Length Arreglo
    }

    visitAccesoArreglo(node) {
        // Visit Acceso Arreglo
    }

    visitAsignacionArreglo(node) {
        // Visit Asignación Arreglo
    }

    visitForEach(node) {
        // Visit ForEach
    }

    visitFuncionForanea(node) {
        // Visit Función Foranea
    }

}