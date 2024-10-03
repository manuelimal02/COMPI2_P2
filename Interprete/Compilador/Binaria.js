import { registers as r } from "./Constantes.js";
import { Generador } from "./Generador.js";
export class OperacionBinariaHandler {
    /**
     * @param {string} operador
     * @param {any} izquierda
     * @param {any} derecha
     * @param {Generador} code
     */

    constructor(operador, izquierda, derecha, code) {
        this.operador = operador;
        this.izquierda = izquierda;
        this.derecha = derecha;
        this.code = code;
    }
    EjecutarHandler() {
        switch (this.operador) {
            case '+':
                return this.validarSuma();
            case '-':
                return this.validarResta();
            case '+=': 
                return this.validarSumaImplicita();
            case '-=': 
                return this.validarRestaImplicita();
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

    validarSuma() {
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int + int = int
                case 'int':
                    this.code.add(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int + float = float
                case 'float':
                    //suma
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                //float + int = float
                case 'int':
                    //suma
                //float + float = float
                case 'float':
                    //suma
                
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            //string + string = string
            
        }  
    }

    validarResta() {
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int - int = int
                case 'int':
                    this.code.sub(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int - float = float
                case 'float':
                    //resta
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float - int = float
                case 'int':
                    //resta
                //float - float = float
                case 'float':
                    //resta
            }
        }
    }

    validarMultiplicacion() {
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                //int * int = int
                case 'int':
                    this.code.mul(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int * float = float
                case 'float':
                    //multi
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float * int = float
                case 'int':
                    //multi
                //float * float = float
                case 'float':
                    //multi
            }
        }
    }

    validarDivision() {
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int / int = int
                case 'int':
                    this.code.div(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'int', length: 4 };
                    
                //int / float = float
                case 'float':
                    //div
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float / int = float
                case 'int':
                    //div
                //float / float = float
                case 'float':
                    //div
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
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int == int = boolean
                case 'int':
                // int == float = boolean
                this.code.xor(r.T0, r.T0, r.T1);
                this.code.seqz(r.T0, r.T0);
                this.code.push(r.T0);
                return { type: 'boolean', length: 4 };
                case 'float':
                    //Igual
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float == int = boolean
                case 'int':
                // float == float = boolean
                    //Igual
                case 'float':
                    //Igual
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string == string = boolean
                //Igual
        }
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean == boolean = boolean
                //Igual
        
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char == char = boolean
                //Igual
        }
    }

    validarDesigualdad() {
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int != int = boolean
                case 'int':
                    this.code.xor(r.T0, r.T0, r.T1);
                    this.code.snez(r.T0, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };

                // int != float = boolean
                case 'float':
                    //Diferente
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float != int = boolean
                case 'int':
                // float != float = boolean
                    //Diferente
                case 'float':
                    //Diferente
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string != string = boolean
                //Diferente
        }
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean != boolean = boolean
                //Diferente
        
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char != char = boolean
                //Diferente
        }
    }

    validarMayorQue() {
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int > int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };

                // int > float = boolean
                case 'float':
                    //Mayor
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float > int = boolean
                case 'int':
                // float > float = boolean
                    //Mayor
                case 'float':
                    //Mayor
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char > char = boolean
                //Mayor
        }
    }

    validarMayorIgualQue() {
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int >= int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T0, r.T1);
                    this.code.seq(r.T1, r.T1, r.T0);
                    this.code.or(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };

                // int >= float = boolean
                case 'float':
                    //Mayor Igual
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float >= int = boolean
                case 'int':
                // float >= float = boolean
                    //Mayor Igual
                case 'float':
                    //Mayor Igual
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char >= char = boolean
                //Mayor Igual
        }
    }

    validarMenorQue() {
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int < int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };

                // int < float = boolean
                case 'float':
                    //Menor
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float < int = boolean
                case 'int':
                // float < float = boolean
                    //Menor
                case 'float':
                    //Menor
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char < char = boolean
                //Menor
        }
    }

    validarMenorIgualQue(){
        if(this.izquierda.type === 'int') {
            
            switch(this.derecha.type) {
                // int <= int = boolean
                case 'int':
                    this.code.sle(r.T0, r.T1, r.T0);
                    this.code.seq(r.T1, r.T1, r.T0);
                    this.code.or(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };

                // int <= float = boolean
                case 'float':
                    //Menor Igual
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float <= int = boolean
                case 'int':
                // float <= float = boolean
                    //Menor Igual
                case 'float':
                    //Menor Igual
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char <= char = boolean
                //Menor Igual
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