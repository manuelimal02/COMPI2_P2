
/**

 * @typedef {import('../Nodo/Nodos.js').Expresion} Expresion


 * @typedef {import('../Nodo/Nodos.js').SentenciaExpresion} SentenciaExpresion


 * @typedef {import('../Nodo/Nodos.js').OperacionBinaria} OperacionBinaria


 * @typedef {import('../Nodo/Nodos.js').OperacionAND} OperacionAND


 * @typedef {import('../Nodo/Nodos.js').OperacionOR} OperacionOR


 * @typedef {import('../Nodo/Nodos.js').OperacionUnaria} OperacionUnaria


 * @typedef {import('../Nodo/Nodos.js').Agrupacion} Agrupacion


 * @typedef {import('../Nodo/Nodos.js').Entero} Entero


 * @typedef {import('../Nodo/Nodos.js').Decimal} Decimal


 * @typedef {import('../Nodo/Nodos.js').Cadena} Cadena


 * @typedef {import('../Nodo/Nodos.js').Caracter} Caracter


 * @typedef {import('../Nodo/Nodos.js').Booleano} Booleano


 * @typedef {import('../Nodo/Nodos.js').DeclaracionVar} DeclaracionVar


 * @typedef {import('../Nodo/Nodos.js').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('../Nodo/Nodos.js').Print} Print


 * @typedef {import('../Nodo/Nodos.js').Asignacion} Asignacion


 * @typedef {import('../Nodo/Nodos.js').Bloque} Bloque


 * @typedef {import('../Nodo/Nodos.js').If} If


 * @typedef {import('../Nodo/Nodos.js').While} While


 * @typedef {import('../Nodo/Nodos.js').Switch} Switch


 * @typedef {import('../Nodo/Nodos.js').For} For


 * @typedef {import('../Nodo/Nodos.js').ForEach} ForEach


 * @typedef {import('../Nodo/Nodos.js').Break} Break


 * @typedef {import('../Nodo/Nodos.js').Continue} Continue


 * @typedef {import('../Nodo/Nodos.js').Return} Return


 * @typedef {import('../Nodo/Nodos.js').Llamada} Llamada


 * @typedef {import('../Nodo/Nodos.js').ParseInt} ParseInt


 * @typedef {import('../Nodo/Nodos.js').ParseFloat} ParseFloat


 * @typedef {import('../Nodo/Nodos.js').ToString} ToString


 * @typedef {import('../Nodo/Nodos.js').ToLowerCase} ToLowerCase


 * @typedef {import('../Nodo/Nodos.js').ToUpperCase} ToUpperCase


 * @typedef {import('../Nodo/Nodos.js').TypeOf} TypeOf


 * @typedef {import('../Nodo/Nodos.js').DeclaracionArreglo1} DeclaracionArreglo1


 * @typedef {import('../Nodo/Nodos.js').DeclaracionArreglo2} DeclaracionArreglo2


 * @typedef {import('../Nodo/Nodos.js').DeclaracionArreglo3} DeclaracionArreglo3


 * @typedef {import('../Nodo/Nodos.js').IndexArreglo} IndexArreglo


 * @typedef {import('../Nodo/Nodos.js').JoinArreglo} JoinArreglo


 * @typedef {import('../Nodo/Nodos.js').LengthArreglo} LengthArreglo


 * @typedef {import('../Nodo/Nodos.js').AccesoArreglo} AccesoArreglo


 * @typedef {import('../Nodo/Nodos.js').AsignacionArreglo} AsignacionArreglo


 * @typedef {import('../Nodo/Nodos.js').FuncionForanea} FuncionForanea

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {SentenciaExpresion} node
     * @returns {any}
     */
    visitSentenciaExpresion(node) {
        throw new Error('Metodo visitSentenciaExpresion no implementado');
    }
    

    /**
     * @param {OperacionBinaria} node
     * @returns {any}
     */
    visitOperacionBinaria(node) {
        throw new Error('Metodo visitOperacionBinaria no implementado');
    }
    

    /**
     * @param {OperacionAND} node
     * @returns {any}
     */
    visitOperacionAND(node) {
        throw new Error('Metodo visitOperacionAND no implementado');
    }
    

    /**
     * @param {OperacionOR} node
     * @returns {any}
     */
    visitOperacionOR(node) {
        throw new Error('Metodo visitOperacionOR no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {Entero} node
     * @returns {any}
     */
    visitEntero(node) {
        throw new Error('Metodo visitEntero no implementado');
    }
    

    /**
     * @param {Decimal} node
     * @returns {any}
     */
    visitDecimal(node) {
        throw new Error('Metodo visitDecimal no implementado');
    }
    

    /**
     * @param {Cadena} node
     * @returns {any}
     */
    visitCadena(node) {
        throw new Error('Metodo visitCadena no implementado');
    }
    

    /**
     * @param {Caracter} node
     * @returns {any}
     */
    visitCaracter(node) {
        throw new Error('Metodo visitCaracter no implementado');
    }
    

    /**
     * @param {Booleano} node
     * @returns {any}
     */
    visitBooleano(node) {
        throw new Error('Metodo visitBooleano no implementado');
    }
    

    /**
     * @param {DeclaracionVar} node
     * @returns {any}
     */
    visitDeclaracionVar(node) {
        throw new Error('Metodo visitDeclaracionVar no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitSwitch no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {ForEach} node
     * @returns {any}
     */
    visitForEach(node) {
        throw new Error('Metodo visitForEach no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {ParseInt} node
     * @returns {any}
     */
    visitParseInt(node) {
        throw new Error('Metodo visitParseInt no implementado');
    }
    

    /**
     * @param {ParseFloat} node
     * @returns {any}
     */
    visitParseFloat(node) {
        throw new Error('Metodo visitParseFloat no implementado');
    }
    

    /**
     * @param {ToString} node
     * @returns {any}
     */
    visitToString(node) {
        throw new Error('Metodo visitToString no implementado');
    }
    

    /**
     * @param {ToLowerCase} node
     * @returns {any}
     */
    visitToLowerCase(node) {
        throw new Error('Metodo visitToLowerCase no implementado');
    }
    

    /**
     * @param {ToUpperCase} node
     * @returns {any}
     */
    visitToUpperCase(node) {
        throw new Error('Metodo visitToUpperCase no implementado');
    }
    

    /**
     * @param {TypeOf} node
     * @returns {any}
     */
    visitTypeOf(node) {
        throw new Error('Metodo visitTypeOf no implementado');
    }
    

    /**
     * @param {DeclaracionArreglo1} node
     * @returns {any}
     */
    visitDeclaracionArreglo1(node) {
        throw new Error('Metodo visitDeclaracionArreglo1 no implementado');
    }
    

    /**
     * @param {DeclaracionArreglo2} node
     * @returns {any}
     */
    visitDeclaracionArreglo2(node) {
        throw new Error('Metodo visitDeclaracionArreglo2 no implementado');
    }
    

    /**
     * @param {DeclaracionArreglo3} node
     * @returns {any}
     */
    visitDeclaracionArreglo3(node) {
        throw new Error('Metodo visitDeclaracionArreglo3 no implementado');
    }
    

    /**
     * @param {IndexArreglo} node
     * @returns {any}
     */
    visitIndexArreglo(node) {
        throw new Error('Metodo visitIndexArreglo no implementado');
    }
    

    /**
     * @param {JoinArreglo} node
     * @returns {any}
     */
    visitJoinArreglo(node) {
        throw new Error('Metodo visitJoinArreglo no implementado');
    }
    

    /**
     * @param {LengthArreglo} node
     * @returns {any}
     */
    visitLengthArreglo(node) {
        throw new Error('Metodo visitLengthArreglo no implementado');
    }
    

    /**
     * @param {AccesoArreglo} node
     * @returns {any}
     */
    visitAccesoArreglo(node) {
        throw new Error('Metodo visitAccesoArreglo no implementado');
    }
    

    /**
     * @param {AsignacionArreglo} node
     * @returns {any}
     */
    visitAsignacionArreglo(node) {
        throw new Error('Metodo visitAsignacionArreglo no implementado');
    }
    

    /**
     * @param {FuncionForanea} node
     * @returns {any}
     */
    visitFuncionForanea(node) {
        throw new Error('Metodo visitFuncionForanea no implementado');
    }
    
}
