import { Foranea } from "../Instruccion/Foranea.js";

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
                throw new Error(`El Tipo De La variable "${nombre}" Es "string". No Coincide Con El Tipo Del Valor Asignado.`);
            }
            if (variable.tipo === "int" && valor.tipo !== "int") {
                throw new Error(`El Tipo De La variable "${nombre}" Es "int". No Coincide Con El Tipo Del Valor Asignado.`);
            }
            if (variable.tipo === "float" && valor.tipo === "int") {
                valor.valor = parseFloat(valor.valor);
                valor.tipo = 'float';
            }
            if (variable.tipo === "float" && valor.tipo !== "float") {
                throw new Error(`El Tipo De La variable "${nombre}" Es "float". No Coincide Con El Tipo Del Valor Asignado.`);
            }
            if (variable.tipo === "char" && valor.tipo !== "char") {
                throw new Error(`El Tipo De La variable "${nombre}" Es "char". No Coincide Con El Tipo Del Valor Asignado.`);
            }
            if (variable.tipo === "boolean" && valor.tipo !== "boolean") {
                throw new Error(`El Tipo De La variable "${nombre}" Es "boolean". No Coincide Con El Tipo Del Valor Asignado.`);
            }
            this.valores[nombre].valor = {valor: valor.valor, tipo: valor.tipo};
            this.valores[nombre].tipo = valor.tipo; 
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
