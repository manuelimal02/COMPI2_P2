import { Registros as r } from "./Registros.js";
import { RegistrosFlotantes as f } from "./Registros.js";
import { Generador } from "./Generador.js";
export class OperacionBinariaHandler {
    /**
     * @param {string} operador
     * @param {any} izquierda
     * @param {any} derecha
     * @param {any} izquierdaFlotante
     * @param {any} derechaFlotante
     * @param {Generador} code
     */

    constructor(operador, izquierda, derecha, izquierdaFlotante, derechaFlotante,code) {
        this.operador = operador;
        this.izquierda = izquierda;
        this.derecha = derecha;
        this.izquierdaFlotante = izquierdaFlotante;
        this.derechaFlotante = derechaFlotante;
        this.code = code;
    }
    EjecutarHandler() {
        switch (this.operador) {
            case '+':
            case '+=': 
                return this.validarSuma();
            case '-':
            case '-=': 
                return this.validarResta();
            case '*':
                return this.validarMultiplicacion();
            case '/':
                return this.validarDivision();
            case '%':
                return this.validarModulo();
            case '==':
                return this.validarIgualdad();
            case '!=':  
                return this.validarDesigualdad();
            case '>':
                return this.validarMayorQue();
            case '>=':
                return this.validarMayorIgualQue();
            case '<':
                return this.validarMenorQue();
            case '<=':
                return this.validarMenorIgualQue();
            case '&&':
                return this.validarAnd();
            case '||':
                return this.validarOr();
        }
    }

    validarFlotantes() {
        if (!this.izquierdaFlotante) this.code.fcvtsw(f.FT1, r.T1);
        if (!this.derechaFlotante) this.code.fcvtsw(f.FT0, r.T0);
    }

    validarSuma() {
        this.validarFlotantes();
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int + int = int
                case 'int':
                    this.code.add(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int + float = float
                case 'float':
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                //float + int = float
                case 'int':
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
                //float + float = float
                case 'float':
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
                
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            //string + string = string
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T0);
            this.code.callBuiltin('ConcatenarString');
            return { type: 'string', length: 4 };
        }  
    }

    validarResta() {
        this.validarFlotantes();
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int - int = int
                case 'int':
                    this.code.sub(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int - float = float
                case 'float':
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float - int = float
                case 'int':
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
                //float - float = float
                case 'float':
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
    }

    validarMultiplicacion() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                //int * int = int
                case 'int':
                    this.code.mul(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int * float = float
                case 'float':
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float * int = float
                case 'int':
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
                //float * float = float
                case 'float':
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
    }

    validarDivision() {
        this.validarFlotantes();
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int / int = int
                case 'int':
                    this.code.div(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int / float = float
                case 'float':
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float / int = float
                case 'int':
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
                //float / float = float
                case 'float':
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
    }

    validarModulo() {
        if (this.izquierda.type === 'int' && this.derecha.type === 'int') {
            this.code.rem(r.T0, r.T1, r.T0);
            this.code.push(r.T0);
            return { type: 'int', length: 4 };
        }
    }

    validarIgualdad() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int == int = boolean
                case 'int':
                this.code.xor(r.T0, r.T1, r.T0);
                this.code.seqz(r.T0, r.T0);
                this.code.push(r.T0);
                return { type: 'boolean', length: 4 };
                // int == float = boolean
                case 'float':
                    this.code.feq(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float == int = boolean
                case 'int':
                    this.code.feq(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float == float = boolean
                case 'float':
                    this.code.feq(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string == string = boolean
        }
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean == boolean = boolean
            this.code.xor(r.T0, r.T1, r.T0);
            this.code.seqz(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char == char = boolean
            this.code.xor(r.T0, r.T1, r.T0);
            this.code.seqz(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarDesigualdad() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int != int = boolean
                case 'int':
                    this.code.xor(r.T0, r.T1, r.T0);
                    this.code.snez(r.T0, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int != float = boolean
                case 'float':
                    this.code.feq(r.T0, f.FT1, f.FT0);
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float != int = boolean
                case 'int':
                    this.code.feq(r.T0, f.FT1, f.FT0);
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float != float = boolean
                case 'float':
                    this.code.feq(r.T0, f.FT1, f.FT0);
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string != string = boolean
        }
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean != boolean = boolean
            this.code.xor(r.T0, r.T1, r.T0);
            this.code.snez(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char != char = boolean
            this.code.xor(r.T0, r.T1, r.T0);
            this.code.snez(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarMayorQue() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int > int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int > float = boolean
                case 'float':
                    this.code.flt(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float > int = boolean
                case 'int':
                    this.code.flt(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float > float = boolean
                case 'float':
                    this.code.flt(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char > char = boolean
            this.code.slt(r.T0, r.T0, r.T1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarMayorIgualQue() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int >= int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T1, r.T0);  
                    this.code.xori(r.T0, r.T0, 1);    
                    this.code.push(r.T0);  
                    return { type: 'boolean', length: 4 };
                // int >= float = boolean
                case 'float':
                    this.code.fle(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float >= int = boolean
                case 'int':
                    this.code.fle(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float >= float = boolean
                case 'float':
                    this.code.fle(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            this.code.slt(r.T0, r.T1, r.T0);
            this.code.xori(r.T0, r.T0, 1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarMenorQue() {
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int < int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int < float = boolean
                case 'float':
                    this.code.flt(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float < int = boolean
                case 'int':
                    this.code.flt(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float < float = boolean
                case 'float':
                    this.code.flt(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char < char = boolean
            this.code.slt(r.T0, r.T1, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarMenorIgualQue(){
        this.validarFlotantes();
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int <= int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T0, r.T1);
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int <= float = boolean
                case 'float':
                    this.code.fle(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float <= int = boolean
                case 'int':
                    this.code.fle(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // float <= float = boolean
                case 'float':
                    this.code.fle(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            this.code.slt(r.T0, r.T0, r.T1);
            this.code.xori(r.T0, r.T0, 1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
            
        }
    }

    validarAnd() {
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean && boolean = boolean
            this.code.and(r.T0, r.T0, r.T1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }


    validarOr() {
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean || boolean = boolean
            this.code.or(r.T0, r.T0, r.T1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }
}