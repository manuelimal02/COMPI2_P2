import { registers as r } from "./Constantes.js";
import { ManejoCadena } from "./Cadena.js";

class Instruction {
    constructor(instruccion, rd, rs1, rs2) {
        this.instruccion = instruccion;
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString() {
        const operandos = []
        if (this.rd !== undefined) operandos.push(this.rd)
        if (this.rs1 !== undefined) operandos.push(this.rs1)
        if (this.rs2 !== undefined) operandos.push(this.rs2)
        return `${this.instruccion} ${operandos.join(', ')}`
    }
}

export class Generador {

    constructor() {

        this.instrucciones = []
        this.objectStack = []
        this.depth = 0 
    }
    
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

    slt(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('slt', rd, rs1, rs2))
        
    }

    seq(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('seq', rd, rs1, rs2))
    }
    
    seqz(rd, rs1) {
        this.instrucciones.push(new Instruction('seqz', rd, rs1))
    }

    and(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('and', rd, rs1, rs2))
    }

    or(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('or', rd, rs1, rs2))
    }

    xor(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('xor', rd, rs1, rs2))
    }

    addi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('addi', rd, rs1, inmediato))
    }

    snez(rd, rs1) {
        this.instrucciones.push(new Instruction('snez', rd, rs1))
    }

    sw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sw', rs1, `${inmediato}(${rs2})`))
    }

    lw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('lw', rd, `${inmediato}(${rs1})`))
    }

    rem(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('rem', rd, rs1, rs2))
    }

    li(rd, inmediato) {
        this.instrucciones.push(new Instruction('li', rd, inmediato))
    }

    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) 
        this.sw(rd, r.SP) 
    }

    pop(rd = r.T0) {
        this.lw(rd, r.SP) 
        this.addi(r.SP, r.SP, 4) 
    }

    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    printInt(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO) 
        }
        this.li(r.A7, 1) 
        this.ecall()
        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }

    printString(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        }
        this.li(r.A7, 4) 
        this.ecall()
        if (rd !== r.A0) {
            this.pop(r.A0)
        }
    }

    printChar(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0);
            this.add(r.A0, rd, r.ZERO);
        }
        this.li(r.A7, 11);
        this.ecall();
        if (rd !== r.A0) {
            this.pop(r.A0);
        }
    }

    printBoolean(rd = r.A0) {
        if (rd !== r.A0) {
            this.push(r.A0);
            this.add(r.A0, rd, r.ZERO);
        }
        this.li(r.A7, 1);
        this.ecall();
        if (rd !== r.A0) {
            this.pop(r.A0);
        }
    }

    printNewLine() {
        this.li(r.A0, 10); 
        this.li(r.A7, 11); 
        this.ecall(); 
    }

    endProgram() {
        this.li(r.A7, 10) 
        this.ecall()
    }

    comment(text) {
        this.instrucciones.push(new Instruction(`# ${text}`))
    }

    pushContant(object) {
        let length = 0;
        switch (object.type) {
            case 'int':
                this.li(r.T0, object.valor);
                this.push()
                length = 4;
                break;

            case 'string':
                const ArrayCadena = ManejoCadena(object.valor);
                this.addi(r.T0, r.HP, 4); 
                this.push(r.T0); 
                ArrayCadena.forEach((block32bits) => {
                    this.li(r.T0, block32bits);
                    this.addi(r.HP, r.HP, 4);
                    this.sw(r.T0, r.HP);
                });
                length = 4;
                break;

            case 'char':
                this.li(r.T0, object.valor);
                this.push(r.T0);
                length = 4;                    
                break;

            case 'boolean':
                this.li(r.T0, object.valor ? 1 : 0);
                this.push();
                length = 4;
                break;

        }
        this.pushObject({ type: object.type, length, depth: this.depth });
    }

    pushObject(object) {
        this.objectStack.push(object);
    }

    popObject(rd = r.T0) {
        const object = this.objectStack.pop();
        switch (object.type) {
            case 'int':
                this.pop(rd);
                break;
            case 'string':
                this.pop(rd);
                break;
            case 'char':
                this.pop(rd);
                break;
            case 'boolean':
                this.pop(rd);
                break;
            default:
                break;
        }
        return object;
    }

    newScope() {
        this.depth++
    }

    endScope() {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].depth === this.depth) {
                byteOffset += this.objectStack[i].length;
                this.objectStack.pop();
            } else {
                break;
            }
        }
        this.depth--
        return byteOffset;
    }

    tagObject(id) {
        this.objectStack[this.objectStack.length - 1].id = id;
    }

    getObject(id) {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].id === id) {
                return [byteOffset, this.objectStack[i]];
            }
            byteOffset += this.objectStack[i].length;
        }
    }

    toString() {
        this.endProgram();
        return `.data
                        heap:
                .text
                # Inicializando el heap pointer
                    la ${r.HP}, heap
                main:
                    ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}
            `
    }
}
