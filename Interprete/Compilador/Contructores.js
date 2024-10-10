import { Registros as r } from "./Registros.js"
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


export const Constructores = {
    ConcatenarString: ConcatenarString,
    toLowerCase: toLowerCase,
    toUpperCase: toUpperCase
}