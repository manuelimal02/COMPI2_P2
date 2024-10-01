import { registers as r } from "./Constantes.js";
import { stringTo32BitsArray } from "./Utilities.js";

class Instruction {
    constructor(instruccion, rd, rs1, rs2) {
        // Crea una instrucción con los registros y operandos proporcionados
        this.instruccion = instruccion;
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString() {
        // Convierte la instrucción en una cadena de texto
        const operandos = []
        if (this.rd !== undefined) operandos.push(this.rd)
        if (this.rs1 !== undefined) operandos.push(this.rs1)
        if (this.rs2 !== undefined) operandos.push(this.rs2)
        return `${this.instruccion} ${operandos.join(', ')}`
    }
}

export class Generador {

    constructor() {
        // Inicializa las listas de instrucciones y el stack de objetos
        this.instrucciones = []
        this.objectStack = []
        this.depth = 0 // Profundidad del entorno actual
    }

    // Funciones que generan instrucciones aritméticas básicas
    add(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('add', rd, rs1, rs2))
    }

    sub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('sub', rd, rs1, rs2))
    }

    mul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('mul', rd, rs1, rs2))
    }

    div(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('div', rd, rs1, rs2))
    }

    // Instrucción con un valor inmediato (addi)
    addi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('addi', rd, rs1, inmediato))
    }

    // Funciones de almacenamiento y carga
    sw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sw', rs1, `${inmediato}(${rs2})`))
    }

    lw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('lw', rd, `${inmediato}(${rs1})`))
    }

    li(rd, inmediato) {
        // Carga un valor inmediato a un registro
        this.instrucciones.push(new Instruction('li', rd, inmediato))
    }

    // Instrucciones para trabajar con la pila (push y pop)
    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) // Reduce el puntero de pila en 4 bytes
        this.sw(rd, r.SP) // Guarda el valor en la pila
    }

    pop(rd = r.T0) {
        this.lw(rd, r.SP) // Carga el valor desde la pila
        this.addi(r.SP, r.SP, 4) // Incrementa el puntero de pila
    }

    // Llamada al sistema ecall (interrupción)
    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    // Imprime un entero desde un registro
    printInt(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO) // Copia el valor de `rd` a `A0` (registro para ecall)
        }

        this.li(r.A7, 1) // Setea `A7` a 1 (ecall para imprimir entero)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }

    // Imprime una cadena desde un registro
    printString(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO) // Copia el valor de `rd` a `A0`
        }

        this.li(r.A7, 4) // Setea `A7` a 4 (ecall para imprimir cadena)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }

    // Finaliza el programa
    endProgram() {
        this.li(r.A7, 10) // Setea `A7` a 10 (ecall para finalizar programa)
        this.ecall()
    }

    // Añade un comentario al código
    comment(text) {
        this.instrucciones.push(new Instruction(`# ${text}`))
    }

    // Función para apilar una constante (entero o cadena)
    pushContant(object) {
        let length = 0;

        switch (object.type) {
            case 'int':
                this.li(r.T0, object.valor); // Carga un entero a `T0`
                this.push() // Apila el entero
                length = 4; // Tamaño en bytes
                break;

            case 'string':
                const stringArray = stringTo32BitsArray(object.valor); // Convierte la cadena en un arreglo de bloques de 32 bits

                this.comment(`Pushing string ${object.valor}`);
                this.addi(r.T0, r.HP, 4); // Apunta al heap
                this.push(r.T0); // Apila la referencia al heap

                stringArray.forEach((block32bits) => {
                    this.li(r.T0, block32bits); // Carga los bloques de 32 bits en `T0`
                    this.addi(r.HP, r.HP, 4); // Ajusta el heap pointer
                    this.sw(r.T0, r.HP); // Guarda los bloques en memoria
                });

                length = 4; // Longitud para el heap
                break;

            default:
                break;
        }

        this.pushObject({ type: object.type, length, depth: this.depth });
    }

    // Función para apilar un objeto en el stack
    pushObject(object) {
        this.objectStack.push(object);
    }

    // Función para desapilar un objeto desde el stack
    popObject(rd = r.T0) {
        const object = this.objectStack.pop();

        switch (object.type) {
            case 'int':
                this.pop(rd); // Desapila un entero
                break;

            case 'string':
                this.pop(rd); // Desapila una cadena
                break;
            default:
                break;
        }

        return object;
    }

    /*
    FUNCIONES PARA MANEJAR ENTORNOS (SCOPE)
    */

    newScope() {
        // Incrementa el nivel de profundidad del entorno
        this.depth++
    }

    endScope() {
        // Finaliza el entorno actual y desapila los objetos de dicho entorno
        let byteOffset = 0;

        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].depth === this.depth) {
                byteOffset += this.objectStack[i].length;
                this.objectStack.pop(); // Elimina los objetos del entorno
            } else {
                break;
            }
        }
        this.depth--

        return byteOffset; // Devuelve el tamaño en bytes de los objetos desapilados
    }

    // Marca un objeto en el stack con un identificador
    tagObject(id) {
        this.objectStack[this.objectStack.length - 1].id = id;
    }

    // Busca un objeto en el stack por su identificador
    getObject(id) {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].id === id) {
                return [byteOffset, this.objectStack[i]]; // Retorna el desplazamiento y el objeto
            }
            byteOffset += this.objectStack[i].length;
        }

        throw new Error(`Variable ${id} not found`); // Lanza un error si no encuentra el objeto
    }

    // Genera el código assembler RISC-V
    toString() {
        this.endProgram(); // Asegura que se finalice el programa con `ecall`
        return `
                .data
                        heap:
                .text

                # Inicializando el heap pointer
                    la ${r.HP}, heap

                main:
                    ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}
            `
    }
}
