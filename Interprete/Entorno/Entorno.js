import { Foranea } from "../Instruccion/Foranea.js";
import ErrorManager from "../Errores/Errores.js";

let Simbolos = [];
let SimbolosConvertidos = [];
export class Entorno {
    
    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     * @param {string} linea
     * @param {string} columna
     */
    setVariable(tipo, nombre, valor, linea, columna) {
        if (this.valores[nombre]) {
            throw new Error(`La Variable: "${nombre}" Ya Está Definida.`);
        }
        Simbolos.push({tipo: tipo, nombre: nombre, valor: valor, fila: linea, columna: columna });
        this.valores[nombre] = { valor, tipo, linea, columna }
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const variable = this.valores[nombre];
        if (variable!=undefined) {
            return variable;
        }
        if (!variable && this.padre) {
            return this.padre.getVariable(nombre);
        }
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     * @param {string} linea
     * @param {string} columna
     */
    assignVariable(nombre, valor) {
        const variable = this.valores[nombre]
        if (variable != undefined) {
            if (variable.tipo === "string" && valor.tipo !== "string") {
                console.warn(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`);
                ErrorManager.NuevoError(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`, variable.linea, variable.columna);
                this.valores[nombre].valor = {valor: null, tipo: 'string'};
                this.valores[nombre].tipo = 'string';
            }else if (variable.tipo === "int" && valor.tipo !== "int") {
                console.warn(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`);
                ErrorManager.NuevoError(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`, variable.linea, variable.columna);
                this.valores[nombre].valor = {valor: null, tipo: 'int'};
                this.valores[nombre].tipo = 'int';
            }else if (variable.tipo === "float" && valor.tipo === "int") {
                valor.valor = parseFloat(valor.valor);
                valor.tipo = 'float';
            }else if (variable.tipo === "float" && valor.tipo !== "float") {
                console.warn(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`);
                ErrorManager.NuevoError(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`, variable.linea, variable.columna);
                this.valores[nombre].valor = {valor: null, tipo: 'float'};
                this.valores[nombre].tipo = 'float';
            }else if (variable.tipo === "char" && valor.tipo !== "char") {
                console.warn(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`);
                ErrorManager.NuevoError(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`, variable.linea, variable.columna);
                this.valores[nombre].valor = {valor: null, tipo: 'char'};
                this.valores[nombre].tipo = 'char';
            }else if (variable.tipo === "boolean" && valor.tipo !== "boolean") {
                console.warn(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`);
                ErrorManager.NuevoError(`El Tipo De La Variable: "${nombre}" Es "${variable.tipo}". El Tipo Del Valor Es: "${valor.tipo}" Se Asignará Null.`, variable.linea, variable.columna);
                this.valores[nombre].valor = {valor: null, tipo: 'boolean'};
                this.valores[nombre].tipo = 'boolean';
            }else {
            this.valores[nombre].valor = {valor: valor.valor, tipo: valor.tipo};
            this.valores[nombre].tipo = valor.tipo; 
            }
            return;
        }
        if (!variable && this.padre) {
            this.padre.assignVariable(nombre, valor);
            return;
        }
        throw new Error(`La Variable "${nombre}" No Está Definida.`);
    }

    /**
     * @param {string} nombre
     */
    setTemporal(tipo, nombre, valor) {
        if(this.valores[nombre]) {
            throw new Error(`La Variable: "${nombre}" Ya Está Definida.`);
        }
        this.valores[nombre] = {valor, tipo}
    }

    LimpiarTabla () {
        Simbolos = [];
    }
    
    RetornarEntorno() {
        SimbolosConvertidos = [];

        for (let i = 0; i < Simbolos.length; i++) {
            const simbolo = Simbolos[i];
            if (simbolo.valor instanceof Foranea) {
                SimbolosConvertidos.push({
                    tipo: simbolo.tipo,
                    simbolo: "Función",
                    nombre: simbolo.nombre,
                    valor: "Función Foránea",
                    fila: simbolo.fila||'N/A',
                    columna: simbolo.columna||'N/A'
                });
            } else if (Array.isArray(simbolo.valor.valor)) {
                SimbolosConvertidos.push({
                    tipo: simbolo.tipo,
                    simbolo: "Array",
                    nombre: simbolo.nombre,
                    valor: simbolo.valor.valor,
                    fila: simbolo.fila||'N/A',
                    columna: simbolo.columna||'N/A'
                });
            }
            else if (simbolo.tipo !== "funcion") {
                SimbolosConvertidos.push({
                    tipo: simbolo.tipo,
                    simbolo: "Variable",
                    nombre: simbolo.nombre,
                    valor: simbolo.valor.valor,
                    fila: simbolo.fila||'N/A',
                    columna: simbolo.columna||'N/A'
                }
                );
            }
        }
        return SimbolosConvertidos;
    }
    
}
