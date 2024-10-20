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
        // Convierte el valor en T1 de entero a flotante si izquierda no es flotante
        if (!this.izquierdaFlotante) this.code.fcvtsw(f.FT1, r.T1);
        // Convierte el valor en T0 de entero a flotante si derecha no es flotante
        if (!this.derechaFlotante) this.code.fcvtsw(f.FT0, r.T0);
    }

    validarSuma() {
        
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int + int = int
                case 'int':
                    //Suma los valores en T1 y T0, guarda el resultado en T0
                    this.code.add(r.T0, r.T0, r.T1);
                    // Empuja el resultado a la pila
                    this.code.push(r.T0);
                    // Retorna el tipo y longitud del resultado
                    return { type: 'int', length: 4 };
                    
                //int + float = float
                case 'float':
                    this.validarFlotantes();
                    // Suma los valores flotantes en FT1 y FT0, guarda el resultado en FT0
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    // Empuja el resultado a la pila
                    this.code.pushFloat(f.FT0);
                    // Retorna el tipo y longitud del resultado
                    return { type: 'float', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                //float + int = float
                //float + float = float
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    // Suma los valores flotantes en FT1 y FT0, guarda el resultado en FT0
                    this.code.fadd(f.FT0, f.FT1, f.FT0);
                    // Empuja el resultado a la pila
                    this.code.pushFloat(f.FT0);
                    // Retorna el tipo y longitud del resultado
                    return { type: 'float', length: 4 };
                
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            //string + string = string
            // Prepara los argumentos para la función ConcatenarString
            this.code.add(r.A0, r.ZERO, r.T1);
            this.code.add(r.A1, r.ZERO, r.T0);
            // Llama a la función ConcatenarString
            this.code.LlamarConstructor('ConcatenarString');
            // Retorna el tipo y longitud del resultado
            return { type: 'string', length: 4 };
        }  
    }

    validarResta() {
        
        if (this.izquierda.type === 'int') {
            switch (this.derecha.type) {
                //int - int = int
                case 'int':
                    // Resta T1 de T0, almacena el resultado en T0 
                    this.code.sub(r.T0, r.T1, r.T0);
                    // Empuja el resultado a la pila
                    this.code.push(r.T0);
                    // Retorna el tipo y longitud del resultado
                    return { type: 'int', length: 4 };
                    
                //int - float = float
                case 'float':
                    this.validarFlotantes();
                    // Resta FT1 de FT0, almacena el resultado en FT0
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    // Empuja el resultado a la pila
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float - int = float
                //float - float = float
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    // Resta FT1 de FT0, almacena el resultado en FT0
                    this.code.fsub(f.FT0, f.FT1, f.FT0);
                    // Empuja el resultado a la pila
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
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
                    this.validarFlotantes();
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float * int = float
                //float * float = float
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    this.code.fmul(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
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
                    this.validarFlotantes();
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
        if (this.izquierda.type === 'float') {
            switch (this.derecha.type) {
                //float / int = float
                //float / float = float
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    this.code.fdiv(f.FT0, f.FT1, f.FT0);
                    this.code.pushFloat(f.FT0);
                    return { type: 'float', length: 4 };
            }
        }
    }

    validarModulo() {
        if (this.izquierda.type === 'int' && this.derecha.type === 'int') {
            // int % int = int
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
                    // XOR de T0 y T1, guarda el resultado en T0
                    this.code.xor(r.T0, r.T1, r.T0);
                    // Si T0 es 0, guarda 1 en T0, de lo contrario 0
                    this.code.seqz(r.T0, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                    // int == float = boolean
                case 'float':
                    this.validarFlotantes();
                    // Compara los valores flotantes en FT0 y FT1, guarda el resultado en T0
                    this.code.feq(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float == int = boolean
                // float == float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    // Compara los valores flotantes en FT0 y FT1, guarda el resultado en T0
                    this.code.feq(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string == string = boolean
            // LLama a la función CompararString
            this.code.LlamarConstructor('CompararString');
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
        if(this.izquierda.type === 'boolean' && this.derecha.type === 'boolean') {
            // boolean == boolean = boolean
            // XOR de T0 y T1, guarda el resultado en T0
            this.code.xor(r.T0, r.T1, r.T0);
            // Si T0 es 0, guarda 1 en T0, de lo contrario 0
            this.code.seqz(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char == char = boolean
            // XOR de T0 y T1, guarda el resultado en T0
            this.code.xor(r.T0, r.T1, r.T0);
            // Si T0 es 0, guarda 1 en T0, de lo contrario 0
            this.code.seqz(r.T0, r.T0);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
        }
    }

    validarDesigualdad() {
        
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int != int = boolean
                case 'int':
                    // XOR de T0 y T1, guarda el resultado en T0
                    this.code.xor(r.T0, r.T1, r.T0);
                    // Si T0 es 0, guarda 0 en T0, de lo contrario 1
                    this.code.snez(r.T0, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int != float = boolean
                case 'float':
                    this.validarFlotantes();
                    // Compara los valores flotantes en FT0 y FT1, guarda el resultado en T0
                    this.code.feq(r.T0, f.FT1, f.FT0);
                    // Si T0 es 0, guarda 0 en T0, de lo contrario 1
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float != int = boolean
                // float != float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    this.code.feq(r.T0, f.FT1, f.FT0);
                    this.code.xori(r.T0, r.T0, 1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'string' && this.derecha.type === 'string') {
            // string != string = boolean
            this.code.LlamarConstructor('CompararString');
            this.code.xori(r.T0, r.T0, 1);
            this.code.push(r.T0);
            return { type: 'boolean', length: 4 };
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
        
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int > int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T0, r.T1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int > float = boolean
                case 'float':
                    this.validarFlotantes();
                    this.code.flt(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float > int = boolean
                // float > float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
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
                    this.validarFlotantes();
                    this.code.fle(r.T0, f.FT0, f.FT1);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float >= int = boolean
                // float >= float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
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
        
        if(this.izquierda.type === 'int') {
            switch(this.derecha.type) {
                // int < int = boolean
                case 'int':
                    this.code.slt(r.T0, r.T1, r.T0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
                // int < float = boolean
                case 'float':
                    this.validarFlotantes();
                    this.code.flt(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float < int = boolean
                // float < float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
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
                    this.validarFlotantes();
                    this.code.fle(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if(this.izquierda.type === 'float') {
            switch(this.derecha.type) {
                // float <= int = boolean
                // float <= float = boolean
                case 'int':
                case 'float':
                    this.validarFlotantes();
                    this.code.fle(r.T0, f.FT1, f.FT0);
                    this.code.push(r.T0);
                    return { type: 'boolean', length: 4 };
            }
        }
        if (this.izquierda.type === 'char' && this.derecha.type === 'char') {
            // char <= char = boolean
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