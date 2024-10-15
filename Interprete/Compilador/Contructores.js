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
};
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
    // ASCII de '-'
    code.li(r.T2, 45);  
    code.beq(r.T1, r.T2, NegativoLabel);
    code.j(BucleLabel);
    
    code.addLabel(NegativoLabel);
    code.li(r.T3, 1);
    code.addi(r.A0, r.A0, 1);
    code.addLabel(BucleLabel);
    
    code.lb(r.T1, r.A0);
    
    code.beqz(r.T1, FinalLabel);
    
    // Si es '.' (Punto Decimal)
    // ASCII de '.'
    code.li(r.T2, 46);  
    code.beq(r.T1, r.T2, FinalLabel);
    
    // Convertir el carácter ASCII a dígito
    code.addi(r.T1, r.T1, -48);
    
    // Multiplicar el resultado actual por 10
    code.li(r.T2, 10);
    code.mul(r.T0, r.T0, r.T2);
    
    // Sumar el nuevo dígito
    code.add(r.T0, r.T0, r.T1);
    
    // Avanzar al siguiente carácter
    code.addi(r.A0, r.A0, 1);
    
    // Volver al inicio del bucle
    code.j(BucleLabel);
    
    code.addLabel(FinalLabel);
    
    // Si el flag de NegativoLabel está activo, negar el resultado
    code.beqz(r.T3, DecimalLabel);
    code.sub(r.T0, r.ZERO, r.T0);
    
    code.addLabel(DecimalLabel);
    
    // Mover el resultado a A0 para retornarlo
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

export const Constructores = {
    ConcatenarString: ConcatenarString,
    toLowerCase: toLowerCase,
    toUpperCase: toUpperCase,
    parseInt: parseInt,
    parseFloat: parseFloat,
    toString: toString,
    CompararString: CompararString
}