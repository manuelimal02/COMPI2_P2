import { Registros as r } from "./Registros.js";
import { stringTo1ByteArray } from "./Cadena.js";
import { Constructores } from "./Contructores.js";

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
        this._usedBuiltins = new Set()
        this._labelCounter = 0;
    }

    getLabel() {
        return `L${this._labelCounter++}`
    }

    addLabel(label) {
        label = label || this.getLabel()
        this.instrucciones.push(new Instruction(`${label}:`))
        return label
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

    addi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('addi', rd, rs1, inmediato))
    }

    slt(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('slt', rd, rs1, rs2))
    }

    seqz(rd, rs1) {
        this.instrucciones.push(new Instruction('seqz', rd, rs1))
    }

    snez(rd, rs1) {
        this.instrucciones.push(new Instruction('snez', rd, rs1))
    }

    xor(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('xor', rd, rs1, rs2))
    }

    xori(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('xori', rd, rs1, inmediato))
    }

    jal(label) {
        this.instrucciones.push(new Instruction('jal', label))
    }

    j(label) {
        this.instrucciones.push(new Instruction('j', label))
    }

    ret() {
        this.instrucciones.push(new Instruction('ret'))
    }
    sw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sw', rs1, `${inmediato}(${rs2})`))
    }

    sb(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('sb', rs1, `${inmediato}(${rs2})`))
    }

    lw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('lw', rd, `${inmediato}(${rs1})`))
    }

    lb(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('lb', rd, `${inmediato}(${rs1})`))
    }

    li(rd, inmediato) {
        this.instrucciones.push(new Instruction('li', rd, inmediato))
    }

    la(rd, label) {
        this.instrucciones.push(new Instruction('la', rd, label))
    }

    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) 
        this.sw(rd, r.SP)
    }

    rem(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('rem', rd, rs1, rs2))
    }

    mv(rd, rs) {
        this.instrucciones.push(new Instruction('mv', rd, rs))
    }

    pop(rd = r.T0) {
        this.lw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }

    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    //--------------------------------------------
    // Instrucciones Adicionales
        
    slti(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('slti', rd, rs1, inmediato))
    }

    seq(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('seq', rd, rs1, rs2))
    }

    sltz(rd, rs1) {
        this.instrucciones.push(new Instruction('sltz', rd, rs1))
    }

    sgtz(rd, rs1) {
        this.instrucciones.push(new Instruction('sgtz', rd, rs1))
    }

    andi(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('andi', rd, rs1, inmediato))
    }

    ori(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('ori', rd, rs1, inmediato))
    }

    not(rd, rs1) {
        this.instrucciones.push(new Instruction('not', rd, rs1))
    }

    beqz(rs1, label) {
        this.instrucciones.push(new Instruction('beqz', rs1, label))
    }

    bne(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bne', rs1, rs2, label))
    }

    bnez(rs1, label) {
        this.instrucciones.push(new Instruction('bnez', rs1, label))
    }

    blt(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('blt', rs1, rs2, label))
    }

    bltu(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bltu', rs1, rs2, label))
    }

    bltz(rs1, label) {
        this.instrucciones.push(new Instruction('bltz', rs1, label))
    }

    bgt(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bgt', rs1, rs2, label))
    }

    bgtu(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bgtu', rs1, rs2, label))
    }

    bgtz(rs1, label) {
        this.instrucciones.push(new Instruction('bgtz', rs1, label))
    }

    beq(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('beq', rs1, rs2, label))
    }

    ble(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('ble', rs1, rs2, label))
    }

    bleu(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bleu', rs1, rs2, label))
    }

    blez(rs1, label) {
        this.instrucciones.push(new Instruction('blez', rs1, label))
    }

    bge(rs1, rs2, label) {
        this.instrucciones.push(new Instruction('bge', rs1, rs2, label))
    }

    //--------------------------------------------

    callBuiltin(builtinName) {
        if (!Constructores[builtinName]) {
            throw new Error(`Constructor ${builtinName} No Encontrado.`)
        }
        this._usedBuiltins.add(builtinName)
        this.jal(builtinName)
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

    printBoolean(rd = r.A0) {
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

    and(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('and', rd, rs1, rs2))
    }

    or(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('or', rd, rs1, rs2))
    }

    printChar(rd = r.A0) {
        if (rd !== r.A0) {
            this.mv(r.A0, rd)
        }
        this.andi(r.A0, r.A0, 0xFF)
        this.li(r.A7, 11)
        this.ecall()
    }
    
    endProgram() {
        this.li(r.A7, 10)
        this.ecall()
    }

    comment(text) {
        this.instrucciones.push(new Instruction(`# ${text}`))
    }

    pushConstant(object) {
        let length = 0;
        switch (object.type) {
            case 'int':
                this.li(r.T0, object.valor);
                this.push()
                length = 4;
                break;
            case 'string':
                const stringArray = stringTo1ByteArray(object.valor);
                this.push(r.HP);
                stringArray.forEach((charCode) => {
                    this.li(r.T0, charCode);
                    this.sb(r.T0, r.HP);
                    this.addi(r.HP, r.HP, 1);
                });
                length = 4;
                break;
            case 'boolean':
                const value = object.valor ? 1 : 0;
                console.log(value)
                this.li(r.T0, value);
                this.push(r.T0);
                length = 4;
                break;
            case 'char':
                this.li(r.T0, object.valor.charCodeAt(0));
                this.push(r.T0);
                length = 4;
                break;
            default:
                break;
        }
        this.pushObject({ type: object.type, length, depth: this.depth });
    }

    pushObject(object) {
        this.objectStack.push(object);
    }

    printNewLine() {
        this.li(r.A0, 10); 
        this.li(r.A7, 11); 
        this.ecall(); 
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
            case 'boolean':
                this.pop(rd);
                break;
            case 'char':
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
        console.log("tag", this.objectStack)
    }

    getObject(id) {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].id === id) {
                return [byteOffset, this.objectStack[i]];
            }
            byteOffset += this.objectStack[i].length;
        }
        throw new Error(`Variable ${id} Not found`);
    }

    toString() {
        this.comment('Fin-Programa')
        this.endProgram()
        this.comment('Constructores')
        Array.from(this._usedBuiltins).forEach(builtinName => {
            this.addLabel(builtinName)
            Constructores[builtinName](this)
            this.ret()
        })
        return `.data
                heap:
                    .text
                    # inicializando El Heap Pointer
                    la ${r.HP}, heap
            main:
            ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}`
    }
}