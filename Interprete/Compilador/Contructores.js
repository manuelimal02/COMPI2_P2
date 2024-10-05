import { Registros as r } from "./Registros.js"
import { Generador } from "./Generador.js"

/**
 * @param {Generador} code
 */

export const ConcatenarString = (code) => {
    code.push(r.HP);
    const end1 = code.getLabel()
    const loop1 = code.addLabel()

    code.lb(r.T1, r.A0)
    code.beq(r.T1, r.ZERO, end1)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A0, r.A0, 1)
    code.j(loop1)
    code.addLabel(end1)

    const end2 = code.getLabel()
    const loop2 = code.addLabel()

    code.lb(r.T1, r.A1)
    code.beq(r.T1, r.ZERO, end2)
    code.sb(r.T1, r.HP)
    code.addi(r.HP, r.HP, 1)
    code.addi(r.A1, r.A1, 1)
    code.j(loop2)
    code.addLabel(end2)

    code.sb(r.ZERO, r.HP)
    code.addi(r.HP, r.HP, 1)
}

export const Constructores = {
    ConcatenarString: ConcatenarString
}