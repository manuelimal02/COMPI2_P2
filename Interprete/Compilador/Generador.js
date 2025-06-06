import { Registros as r } from "./Registros.js";
import { CadenaComoArregloBytes } from "./Cadena.js";
import { DecimalComoF32 } from "./Decimal.js";
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
        this.instrucciones_funciones = []
        this.objectStack = []
        this.depth = 0
        this._constructores = new Set()
        this._contador_label = 0;
        this.lista_arreglo = [];
    }

    getLabel() {
        return `L${this._contador_label++}`
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

    and(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('and', rd, rs1, rs2))
    }

    or(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('or', rd, rs1, rs2))
    }

    xor(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('xor', rd, rs1, rs2))
    }

    xori(rd, rs1, inmediato) {
        this.instrucciones.push(new Instruction('xori', rd, rs1, inmediato))
    }

    jalr(rd, rs1, imm) {
        this.instrucciones.push(new Instruction('jalr', rd, rs1, imm))
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

    rem(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('rem', rd, rs1, rs2))
    }

    mv(rd, rs) {
        this.instrucciones.push(new Instruction('mv', rd, rs))
    }

    ecall() {
        this.instrucciones.push(new Instruction('ecall'))
    }

    push(rd = r.T0) {
        this.addi(r.SP, r.SP, -4) 
        this.sw(rd, r.SP)
    }

    pop(rd = r.T0) {
        this.lw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }

    pushFloat(rd = r.FT0) {
        this.addi(r.SP, r.SP, -4)
        this.fsw(rd, r.SP)
    }

    popFloat(rd = r.FT0) {
        this.flw(rd, r.SP)
        this.addi(r.SP, r.SP, 4)
    }

    fadd(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fadd.s', rd, rs1, rs2))
    }

    fsub(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fsub.s', rd, rs1, rs2))
    }

    fmul(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fmul.s', rd, rs1, rs2))
    }

    fdiv(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fdiv.s', rd, rs1, rs2))
    }

    fmv(rd, rs) {
        this.instrucciones.push(new Instruction('fmv.w.x', rd, rs))
    }

    flw(rd, rs1, inmediato = 0) {
        this.instrucciones.push(new Instruction('flw', rd, `${inmediato}(${rs1})`))
    }

    fmvx(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.x.s', rd, rs1))
    }

    fmvs(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.s.x', rd, rs1))
    }

    fmvx(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.x.s', rd, rs1))
    }

    fmvxw(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.x.w', rd, rs1))
    }

    fsw(rs1, rs2, inmediato = 0) {
        this.instrucciones.push(new Instruction('fsw', rs1, `${inmediato}(${rs2})`))
    }

    fcvtsw(rd, rs1) {
        this.instrucciones.push(new Instruction('fcvt.s.w', rd, rs1))
    }

    feq(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('feq.s', rd, rs1, rs2))
    }

    fle(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('fle.s', rd, rs1, rs2));
    }

    flt(rd, rs1, rs2) {
        this.instrucciones.push(new Instruction('flt.s', rd, rs1, rs2))
    }

    fneg(rd, rs) {
        this.instrucciones.push(new Instruction('fneg.s', rd, rs))
    }

    fcvtws (rd, rs1) {
        this.instrucciones.push(new Instruction('fcvt.w.s', rd, rs1))
    }
    
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

    bgez(rs1, label) {
        this.instrucciones.push(new Instruction('bgez', rs1, label))
    }

    neg(rd, rs1) {
        this.instrucciones.push(new Instruction('neg', rd, rs1))
    }

    fmvwx(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.x.w', rd, rs1))
    }

    fmvxw(rd, rs1) {
        this.instrucciones.push(new Instruction('fmv.x.w', rd, rs1))
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

    NuevoArreglo(id, tipo, tamano) {
        this.lista_arreglo.push({ id, espaciomemoria:4*tamano });
    }

    LlamarConstructor(NombreConstructor) {
        if (!Constructores[NombreConstructor]) {
            throw new Error(`Constructor ${NombreConstructor} No Encontrado.`)
        }
        this._constructores.add(NombreConstructor)
        this.jal(NombreConstructor)
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

    printFloat() {
        this.li(r.A7, 2)
        this.ecall()
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
        const ContadorLabel = this._contador_label++
        if (rd !== r.A0) {
            this.push(r.A0)
            this.add(r.A0, rd, r.ZERO)
        } else {
            this.add(r.A0, rd, r.ZERO)
        }

        this.beqz(r.A0, `Imprimir_Cadena_Falso${ContadorLabel}`)
        this.la(r.A0, "true_como_cadena")
        this.j(`Imprimir_String${ContadorLabel}`)
        this.addLabel(`Imprimir_Cadena_Falso${ContadorLabel}`)
        this.la(r.A0, "false_como_cadena")
        this.addLabel(`Imprimir_String${ContadorLabel}`)
        this.li(r.A7, 4)
        this.ecall()

        if (rd !== r.A0) {
            this.pop(r.A0)
        }
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
            case 'float':
                const float32 = DecimalComoF32(object.valor);
                this.li(r.T0, float32);
                this.push(r.T0);
                length = 4;
                break;
            case 'string':
                const stringArray = CadenaComoArregloBytes(object.valor);
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
        this.objectStack.push({
            ...object,
            depth: this.depth,
        });
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
            case 'float':
                this.popFloat(rd);
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
    }

    getObject(id) {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].id === id) {
                return [byteOffset, this.objectStack[i]];
            }
            byteOffset += this.objectStack[i].length;
        }
        throw new Error(`Variable ${id} No Encontrada.`);
    }

    getTopObject() {
        return this.objectStack[this.objectStack.length - 1];
    }

    getFrameLocal(index) {
        const frameRelativeLocal = this.objectStack.filter(obj => obj.type === 'local');
        return frameRelativeLocal[index];
    }

    toString() {
        this.comment('Fin-Programa')
        this.endProgram()
        this.comment('Constructores')
        
        this.comment('Funciones-Foraneas')
        this.instrucciones_funciones.forEach(instruccion => this.instrucciones.push(instruccion))

        Array.from(this._constructores).forEach(NombreConstructor => {
            this.addLabel(NombreConstructor)
            Constructores[NombreConstructor](this)
            this.ret()
        })
        return `.data\n${this.lista_arreglo.map((array, index) => `${array.id}: .space ${array.espaciomemoria}`).join('\n')}
                    true_como_cadena: .string "true"
                    false_como_cadena: .string "false"
                heap:
                    .text
                    # inicializando El Heap Pointer
                    la ${r.HP}, heap
            main:
            ${this.instrucciones.map(instruccion => `${instruccion}`).join('\n')}`
    }
}