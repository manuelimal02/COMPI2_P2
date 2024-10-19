import { Registros as r } from "./Registros.js"
import { RegistrosFlotantes as f } from "./Registros.js";
import { Generador } from "./Generador.js"

/**
 * @param {Generador} code
 */
export const ConcatenarString = (code) => {
    code.push(r.HP);
    const FinalLabel1 = code.getLabel()
    const BucleLabel1 = code.addLabel()

    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, FinalLabel1)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(BucleLabel1)
    code.addLabel(FinalLabel1)

    const FinalLabel2 = code.getLabel()
    const BucleLabel2 = code.addLabel()

    code.lb(r.T1, r.A1)
    code.beq(r.T1, r.ZERO, FinalLabel2)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A1, r.A1, 1)
    code.j(BucleLabel2)
    code.addLabel(FinalLabel2)

    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}

/**
 * @param {Generador} code
 */
export const CompararString = (code) => {
    code.mv(r.A0, r.T0);
    code.mv(r.A1, r.T1);
    
    const loopLabel = code.getLabel();
    const notEqualLabel = code.getLabel();
    const equalLabel = code.getLabel();

    code.addLabel(loopLabel);
    code.lb(r.T2, r.A0);
    code.lb(r.T3, r.A1);
    code.bne(r.T2, r.T3, notEqualLabel);
    code.beq(r.T2, r.ZERO, equalLabel);
    code.addi(r.A0, r.A0, 1);
    code.addi(r.A1, r.A1, 1);
    code.j(loopLabel);

    code.addLabel(notEqualLabel);
    code.li(r.T0, 0);
    code.ret();

    code.addLabel(equalLabel);
    code.li(r.T0, 1);
    code.ret();
}

/**
 * @param {Generador} code
 */
export const toLowerCase = (code) => {
    const IncioLabel = code.getLabel()
    const BucleLabel = code.getLabel()
    const SaltarCaracter = code.getLabel()
    code.pop(r.T0)
    code.push(r.T0)
    code.addLabel(BucleLabel)
    code.lb(r.T1, r.T0)
    code.beqz(r.T1, IncioLabel)
    code.li(r.T2, 65)
    code.li(r.T3, 90)
    code.slt(r.T4, r.T1, r.T2)
    code.bnez(r.T4, SaltarCaracter)
    code.slt(r.T4, r.T3, r.T1) 
    code.bnez(r.T4, SaltarCaracter)
    code.addi(r.T1, r.T1, 32)
    code.sb(r.T1, r.T0)
    code.addLabel(SaltarCaracter)
    code.addi(r.T0, r.T0, 1)
    code.j(BucleLabel)
    code.addLabel(IncioLabel)
}

/**
 * @param {Generador} code
 */
const toUpperCase = (code) => {
    const IncioLabel = code.getLabel();
    const BucleLabel = code.getLabel();
    const skipUpperLabel = code.getLabel();
    code.pop(r.T0);
    code.push(r.T0);
    code.addLabel(BucleLabel);
    code.lb(r.T1, r.T0);
    code.beqz(r.T1, IncioLabel);
    code.li(r.T2, 97);
    code.li(r.T3, 122);
    code.slt(r.T4, r.T1, r.T2);
    code.bnez(r.T4, skipUpperLabel);
    code.slt(r.T4, r.T3, r.T1);
    code.bnez(r.T4, skipUpperLabel);
    code.addi(r.T1, r.T1, -32);
    code.sb(r.T1, r.T0);
    code.addLabel(skipUpperLabel);
    code.addi(r.T0, r.T0, 1);
    code.j(BucleLabel);
    code.addLabel(IncioLabel);
}

/**
 * @param {Generador} code
 */
const parseInt = (code) => {
    const BucleLabel = code.getLabel();
    const FinalLabel = code.getLabel();
    const NegativoLabel = code.getLabel();
    const DecimalLabel = code.getLabel();
    code.li(r.T0, 0);
    code.li(r.T3, 0);
    code.lb(r.T1, r.A0);
    
    code.li(r.T2, 45);  
    code.beq(r.T1, r.T2, NegativoLabel);
    code.j(BucleLabel);
    
    code.addLabel(NegativoLabel);
    code.li(r.T3, 1);
    code.addi(r.A0, r.A0, 1);
    code.addLabel(BucleLabel);
    
    code.lb(r.T1, r.A0);
    code.beqz(r.T1, FinalLabel);
    
    code.li(r.T2, 46);  
    code.beq(r.T1, r.T2, FinalLabel);
    
    code.addi(r.T1, r.T1, -48);
    
    code.li(r.T2, 10);
    code.mul(r.T0, r.T0, r.T2);
    code.add(r.T0, r.T0, r.T1);
    code.addi(r.A0, r.A0, 1);
    code.j(BucleLabel);
    
    code.addLabel(FinalLabel);
    
    code.beqz(r.T3, DecimalLabel);
    code.sub(r.T0, r.ZERO, r.T0);
    code.addLabel(DecimalLabel);
    
    code.mv(r.A0, r.T0);
}

/**
 * @param {Generador} code
 */
const parseFloat = (code) => {
    const InicioLabel = code.getLabel()
    const FinalLabel = code.getLabel()
    const NegativoLabel = code.getLabel()
    const FraccionValorLabel = code.getLabel()
    const FraccionBucleLabel = code.getLabel()
    
    code.li(r.T0, 0)       
    code.li(r.T3, 0)       
    code.li(r.T4, 1)       
    code.fmvs(f.FT0, r.ZERO)    
    code.li(r.T5, 0)       
    
    code.lb(r.T1, r.A0)
    code.li(r.T2, 45) 
    code.beq(r.T1, r.T2, NegativoLabel)
    code.j(InicioLabel)
    
    code.addLabel(NegativoLabel)
    code.li(r.T3, 1) 
    code.addi(r.A0, r.A0, 1)
    
    code.addLabel(InicioLabel)
    code.lb(r.T1, r.A0)
    
    code.beqz(r.T1, FinalLabel)
    code.li(r.T2, 46)
    code.beq(r.T1, r.T2, FraccionValorLabel)
    
    code.addi(r.T1, r.T1, -48) 
    code.li(r.T2, 10)
    code.mul(r.T0, r.T0, r.T2) 
    code.add(r.T0, r.T0, r.T1) 
    code.addi(r.A0, r.A0, 1)     
    code.j(InicioLabel)
    
    code.addLabel(FraccionValorLabel)
    code.addi(r.A0, r.A0, 1) 
    
    code.addLabel(FraccionBucleLabel)
    code.lb(r.T1, r.A0)
    code.beqz(r.T1, FinalLabel) 
    
    code.addi(r.T1, r.T1, -48) 
    
    code.li(r.T5, 10)
    code.mul(r.T4, r.T4, r.T5)
    
    code.fcvtsw(f.FT1, r.T1) 
    code.fcvtsw(f.FT2, r.T4) 
    
    code.fdiv(f.FT1, f.FT1, f.FT2) 
    code.fadd(f.FT0, f.FT0, f.FT1) 
    
    code.addi(r.A0, r.A0, 1) 
    code.j(FraccionBucleLabel)
    
    code.addLabel(FinalLabel)
    
    code.beqz(r.T3, 'fin')
    code.sub(r.T0, r.ZERO, r.T0) 
    code.fneg(f.FT0, f.FT0)
    
    code.addLabel('fin')
    
    code.fcvtsw(f.FT2, r.T0) 
    code.fadd(f.FT0, f.FT0, f.FT2) 
    
    code.fmvx(r.A0, f.FT0)
}

/**
 * @param {Generador} code
 */
export const toString = (code) => {
    code.push(r.HP);

    const FinalFuncionLabel = code.getLabel()
    const IntStringLabel = code.getLabel()
    const BooleanStringLabel = code.getLabel()
    const CharStringLabel = code.getLabel()
    const StringStringLabel = code.getLabel()
    const FinalizacionLabel = code.getLabel()

    code.li(r.T0, 1)
    code.beq(r.A1, r.T0, IntStringLabel)
    code.li(r.T0, 2)
    code.beq(r.A1, r.T0, BooleanStringLabel)
    code.li(r.T0, 3)
    code.beq(r.A1, r.T0, CharStringLabel)
    code.li(r.T0, 4)
    code.beq(r.A1, r.T0, StringStringLabel)
    
    code.addLabel(IntStringLabel)
    const InicioIntLabel = code.getLabel()
    const BucleIntLabel = code.getLabel()
    const InversoIntLabel = code.getLabel()
    
    code.add(r.T1, r.ZERO, r.HP)
    
    code.bgez(r.A0, BucleIntLabel)
    code.li(r.T2, 45)  
    code.sb(r.T2, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.neg(r.A0, r.A0)
    
    code.addLabel(BucleIntLabel)
    code.li(r.T2, 10)
    code.rem(r.T3, r.A0, r.T2)
    code.div(r.A0, r.A0, r.T2)
    
    code.addi(r.T3, r.T3, 48)
    code.sb(r.T3, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.bnez(r.A0, BucleIntLabel)
    
    code.add(r.T2, r.ZERO, r.HP)
    code.addi(r.T2, r.T2, -1)
    
    code.addLabel(InversoIntLabel)
    code.bge(r.T1, r.T2, InicioIntLabel)
    code.lb(r.T3, (r.T1))
    code.lb(r.T4, (r.T2))
    code.sb(r.T4, (r.T1))
    code.sb(r.T3, (r.T2))
    code.addi(r.T1, r.T1, 1)
    code.addi(r.T2, r.T2, -1)
    code.j(InversoIntLabel)
    
    code.addLabel(InicioIntLabel)
    code.j(FinalFuncionLabel)

    const CopiarStringLabel = code.getLabel()
    const FinalCopiarStringLabel = code.getLabel()
    code.addLabel(BooleanStringLabel)
    code.beqz(r.A0, FinalizacionLabel)
    code.la(r.T1, 'true_como_cadena')
    code.j(CopiarStringLabel)
    code.addLabel(FinalizacionLabel)
    code.la(r.T1, 'false_como_cadena')

    code.addLabel(CopiarStringLabel)
    code.lb(r.T2, (r.T1))
    code.beqz(r.T2, FinalCopiarStringLabel)
    code.sb(r.T2, (r.HP))
    code.addi(r.HP, r.HP, 1)
    code.addi(r.T1, r.T1, 1)
    code.j(CopiarStringLabel)
    code.addLabel(FinalCopiarStringLabel)
    code.j(FinalFuncionLabel)

    code.addLabel(CharStringLabel)
    code.sb(r.A0, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.j(FinalFuncionLabel)

    code.addLabel(StringStringLabel)
    const FinalStringStringLabel = code.getLabel()
    const BucleStringStringLabel = code.addLabel()
    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, FinalStringStringLabel)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(BucleStringStringLabel)
    code.addLabel(FinalStringStringLabel)
    code.addLabel(FinalFuncionLabel)

    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}

/**
 * @param {Generador} code
 */
export const floatToString = (code) => {
    // FA0 -> valor a convertir (float)
    code.comment('Guardando en el stack la dirección en heap del resultado')
    code.push(r.HP);

    const endFunction = code.getLabel()
    const floatCase = code.getLabel()
    const floatLoop = code.getLabel()
    const floatReverse = code.getLabel()
    const floatEnd = code.getLabel()

    code.comment('Convertir float a string')
    // No necesitamos mover FA0 a otro registro, ya está en FA0

    code.addLabel(floatCase)
    code.add(r.T1, r.ZERO, r.HP)

    // Si es negativo, poner el signo '-'
    code.flt(r.T0, r.FA0, r.FT0)  // Asumimos que FT0 es 0.0
    code.beqz(r.T0, floatLoop)
    code.li(r.T2, 45)    // ASCII de '-'
    code.sb(r.T2, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.fneg(r.FA0, r.FA0)   // Hacer positivo el número

    code.addLabel(floatLoop)
    // Multiplicar por 10 para mover el punto decimal
    code.li(r.T2, 10)
    code.fcvtsw(r.FT2, r.T2)
    code.fmul(r.FA0, r.FA0, r.FT2)

    // Obtener la parte entera
    code.fmvxw(r.T3, r.FA0)
    
    // Convertir dígito a ASCII y guardarlo
    code.addi(r.T3, r.T3, 48)   // ASCII '0' = 48
    code.sb(r.T3, r.HP)
    code.addi(r.HP, r.HP, 1)

    // Actualizar FA0 para la siguiente iteración
    code.fcvtsw(r.FT1, r.T3)
    code.fsub(r.FA0, r.FA0, r.FT1)

    // Verificar si hemos terminado (si FA0 == 0)
    code.feq(r.T0, r.FA0, r.FT0)  // Asumimos que FT0 es 0.0
    code.bnez(r.T0, floatReverse)
    
    // Verificar si hemos procesado suficientes dígitos (por ejemplo, 6)
    code.addi(r.T4, r.T4, 1)
    code.li(r.T5, 6)
    code.blt(r.T4, r.T5, floatLoop)

    // Revertir los dígitos
    code.addLabel(floatReverse)
    code.add(r.T2, r.ZERO, r.HP)  // T2 = fin
    code.addi(r.T2, r.T2, -1)     // Ajustar para último dígito

    code.addLabel(floatReverse)  // Cambiado de code.label a code.addLabel
    code.bge(r.T1, r.T2, floatEnd)
    code.lb(r.T3, r.T1, 0)      // Cargar dígito del inicio
    code.lb(r.T4, r.T2, 0)      // Cargar dígito del final
    code.sb(r.T4, r.T1, 0)      // Guardar dígito del final al inicio
    code.sb(r.T3, r.T2, 0)      // Guardar dígito del inicio al final
    code.addi(r.T1, r.T1, 1)    // Mover inicio hacia adelante
    code.addi(r.T2, r.T2, -1)   // Mover final hacia atrás
    code.j(floatReverse)

    code.addLabel(floatEnd)
    code.j(endFunction)

    // Fin de la función
    code.addLabel(endFunction)
    code.comment('Agregando el caracter nulo al final')
    code.sb(r.ZERO, r.HP, 0)
    code.addi(r.HP, r.HP, 1)
}

export const Constructores = {
    ConcatenarString: ConcatenarString,
    CompararString: CompararString,
    toLowerCase: toLowerCase,
    toUpperCase: toUpperCase,
    parseInt: parseInt,
    parseFloat: parseFloat,
    toString: toString,
    floatToString: floatToString
}