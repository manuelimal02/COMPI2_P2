import { Registros as r } from "./Registros.js";
import { RegistrosFlotantes as f } from "./Registros.js";
export class OperacionUnariaHandler {
    /**
     * @param {string} operador
     * @param {any} izquierda
     * @param {Generador} code
     */

    constructor(operador, izquierda, izquierdaFlotante, code) {
        this.operador = operador;
        this.izquierda = izquierda;
        this.izquierdaFlotante = izquierdaFlotante;
        this.code = code;
    }

    EjecutarHandler() {
        if (!this.izquierdaFlotante) this.code.fcvtsw(f.FT1, r.T1);
        switch (this.operador) {
            case '-':
                if (this.izquierda.type === 'int') {
                    // -int = int
                    this.code.li(r.T1, 0);
                    this.code.sub(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 }
                }else if (this.izquierda.type === 'float'){
                    // -float = float
                    this.code.fneg(f.FT0, f.FT1);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 }
                }
            case '++':
                if (this.izquierda.type === 'int') {
                    this.code.addi(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 }
                } else if (this.izquierda.type === 'float') {
                    // float + 1 = float
                }
            case '--':
                if (this.izquierda.type === 'int') {
                    this.code.addi(r.T0, r.T0, -1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 }
                } else if (this.izquierda.type === 'float') {
                    // float - 1 = float
                } 
            case '!':
                if (this.izquierda.type === 'boolean') {
                    this.code.li(r.T1, 1);
                    this.code.xor(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 }
                } 
        }
    }
}