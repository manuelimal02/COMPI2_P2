import { BaseVisitor } from "../Visitor/Visitor.js";
import { Registros as r } from "./Registros.js";
import { RegistrosFlotantes as f } from "./Registros.js";
import { Generador } from "./Generador.js";
import { OperacionBinariaHandler } from "./Binaria.js";
import { OperacionUnariaHandler } from "./Unaria.js";

export class Compilador extends BaseVisitor {

    constructor() {
        super();
        this.code = new Generador();
        this.ContinueLabel = null;
        this.BreakLabel = null;
    }

    /**
    * @type {BaseVisitor['visitSentenciaExpresion']}
    */
    visitSentenciaExpresion(node) {
        node.expresion.accept(this);
        const EsFlotante = this.code.getTopObject().type === 'float';
        this.code.popObject(EsFlotante ? f.FT0 : r.T0);
    }

    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitOperacionBinaria(node) {
        this.code.comment(`Operacion-Binaria: ${node.operador}`);
        node.izquierda.accept(this);
        node.derecha.accept(this);

        const EsDerechaFloat = this.code.getTopObject().type === 'float';
        const derecha = this.code.popObject(EsDerechaFloat ? f.FT0 : r.T0);
        const EsIzquierdaFloat = this.code.getTopObject().type === 'float';
        const izquierda = this.code.popObject(EsIzquierdaFloat ? f.FT1 : r.T1);

        const Handler = new OperacionBinariaHandler(node.operador, izquierda, derecha, EsIzquierdaFloat, EsDerechaFloat,this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
        this.code.comment('Fin-De-Operacion-Binaria');
    }

    /**
    * @type {BaseVisitor['visitOperacionUnaria']}
    */
    visitOperacionUnaria(node) {
        this.code.comment(`Operacion-Unaria: ${node.operador}`);
        node.expresion.accept(this);
        const EsIzquierdaFloat = this.code.getTopObject().type === 'float';
        const izquierda = this.code.popObject(EsIzquierdaFloat ? f.FT1 : r.T1);
        const Handler = new OperacionUnariaHandler(node.operador, izquierda, EsIzquierdaFloat, this.code);
        const Resultado = Handler.EjecutarHandler();
        this.code.pushObject(Resultado);
        this.code.comment(`Fin-Operacion-Unaria`);
    }

    /**
    * @type {BaseVisitor['visitAgrupacion']}
    */
    visitAgrupacion(node) {
        return node.expresion.accept(this);
    }

    /**
    * @type {BaseVisitor['visitEntero']}
    */
    visitEntero(node) {
        this.code.comment(`Entero: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Entero: ${node.valor}`);
        return node.valor;
    }

    /**
    * @type {BaseVisitor['visitDecimal']}
    */
    visitDecimal(node) {
        this.code.comment(`Decimal: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Decimal: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitCadena']}
    */
    visitCadena(node) {
        this.code.comment(`Cadena:`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Cadena`);
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        this.code.comment(`Caracter: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor});
        this.code.comment(`Fin-Caracter: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        this.code.comment(`Booleano: ${node.valor}`);
        this.code.pushConstant({ type: node.tipo, valor: node.valor });
        this.code.comment(`Fin-Booleano: ${node.valor}`);
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        this.code.comment(`Inicio-Declaracion-Variable`);
        if (node.expresion) {
            node.expresion.accept(this);
        } else {
            switch (node.tipo) {
                case 'int':
                    this.code.pushObject({ type: 'int', valor: 0 });
                    break;
                case 'float':
                    this.code.pushObject({ type: 'float', valor: 0.0 });
                case 'boolean':
                    this.code.pushObject({ type: 'boolean', valor: false });
                    break;
                case 'string':
                    this.code.pushObject({ type: 'string', valor: "" });
                    break;
                case 'char':
                    this.code.pushObject({ type: 'string', valor: "" });
                    break;
            }
        }
        this.code.tagObject(node.id);
        this.code.comment(`Fin-Declaracion-Variable`);
    }

    /**
    * @type {BaseVisitor['visitReferenciaVariable']}
    */
    visitReferenciaVariable(node) {
        this.code.comment(`Referencia-Variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
        const [offset, VariableObjeto] = this.code.getObject(node.id);
        this.code.addi(r.T0, r.SP, offset);
        this.code.lw(r.T1, r.T0);
        this.code.push(r.T1);
        this.code.pushObject({ ...VariableObjeto, id: undefined });
        this.code.comment(`Fin-Referencia-Variable ${node.id}: ${JSON.stringify(this.code.objectStack)}`);
    }

    /**
    * @type {BaseVisitor['visitPrint']}
    */
    visitPrint(node) {
        this.code.comment('Print');
        const TipoDePrint = {
            'int': () => this.code.printInt(),
            'string': () => this.code.printString(),
            'boolean': () => this.code.printBoolean(),
            'char': () => this.code.printChar(),
            'float': () => this.code.printFloat()
        }
        for (let i = 0; i < node.expresion.length; i++) {
            node.expresion[i].accept(this);
            const EsFlotante = this.code.getTopObject().type === 'float';
            const VariableObjeto = this.code.popObject(EsFlotante ? f.FA0 : r.A0);
            TipoDePrint[VariableObjeto.type]();
        }
        this.code.printNewLine();
        this.code.comment('Fin-Print');
    }
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {
        this.code.comment(`Asignacion-Variable: ${node.id}`);
        node.asignacion.accept(this);

        if(this.code.getTopObject().type === "float") {  
            const ValorObjeto = this.code.popObject(f.FT0)
            const [offset, Variable] = this.code.getObject(node.id)
            this.code.li(r.T1, offset)
            this.code.fcvtsw(f.FT1, r.T1)
            this.code.fcvtsw(f.FT2, r.SP)
            this.code.addi(r.T1, r.SP, offset)
            this.code.sw(r.T0, r.T1)
            this.code.fadd(f.FT1, f.FT2, f.FT1)
            this.code.fsw(f.FT0, r.T1)
            this.code.pushFloat(f.FT0)
            this.code.pushObject(ValorObjeto)
            this.code.comment(`Fin-Asignacion-Variable: ${node.id}`);
            return
        }
        const ValorObjeto = this.code.popObject(r.T0);
        const [offset, VariableObjeto] = this.code.getObject(node.id);
        this.code.addi(r.T1, r.SP, offset);
        this.code.sw(r.T0, r.T1);
        VariableObjeto.type = ValorObjeto.type;
        this.code.push(r.T0);
        this.code.pushObject(ValorObjeto);
        this.code.comment(`Fin-Asignacion-Variable: ${node.id}`);
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        this.code.comment('Inicio-Bloque');
        this.code.newScope();
        node.sentencias.forEach(d => d.accept(this));
        this.code.comment('Reduciendo-Pila');
        const BytesEliminados = this.code.endScope();
        if (BytesEliminados > 0) {
            this.code.addi(r.SP, r.SP, BytesEliminados);
        }
        this.code.comment('Fin-Bloque');
    }

    /**
    * @type {BaseVisitor['visitIf']}
    */
    visitIf(node) {
        this.code.comment('Inicio-del-If');
        this.code.comment('Condicion-Del-If');
        node.condicion.accept(this);
        this.code.comment('Fin-De-Condicion');
        this.code.popObject(r.T0);
        const ExisteElse = !!node.sentenciasFalso
        if (ExisteElse) {
            const ElseLabel = this.code.getLabel();
            const FinalIfLabel = this.code.getLabel();
            this.code.beq(r.T0, r.ZERO, ElseLabel);
            this.code.comment('Sentencias-Verdadero');
            node.sentenciasVerdadero.accept(this);
            this.code.j(FinalIfLabel);
            this.code.addLabel(ElseLabel);
            this.code.comment('Sentencias-Falso');
            node.sentenciasFalso.accept(this);
            this.code.addLabel(FinalIfLabel);
        } else {
            const FinalIfLabel = this.code.getLabel();
            this.code.beq(r.T0, r.ZERO, FinalIfLabel);
            this.code.comment('Sentencias-Verdadero');
            node.sentenciasVerdadero.accept(this);
            this.code.addLabel(FinalIfLabel);
        }
        this.code.comment('Fin-del-If');
    }

    /**
    * @type {BaseVisitor['visitTernario']}
    */
    visitTernario(node) {
        this.code.comment('Inicio-Ternario');
        node.Condicion.accept(this);
        this.code.popObject(r.T0);
        const ElseTernarioLabel = this.code.getLabel();
        const FinalTernarioLabel = this.code.getLabel();
        this.code.beq(r.T0, r.ZERO, ElseTernarioLabel);
        node.Verdadero.accept(this);
        this.code.j(FinalTernarioLabel);
        this.code.addLabel(ElseTernarioLabel);
        node.Falso.accept(this);
        this.code.addLabel(FinalTernarioLabel);
        this.code.comment('Fin-Ternario');
    }

    /**
    * @type {BaseVisitor['visitWhile']}
    */
    visitWhile(node) {
        this.code.comment('Inicio-de-While');

        const InicioWhileLabel = this.code.getLabel();
        const ContinueLabelPrevio = this.ContinueLabel;
        this.ContinueLabel = InicioWhileLabel;

        const FinalWhileLabel = this.code.getLabel();
        const BreakLabelPrevio = this.BreakLabel;
        this.BreakLabel = FinalWhileLabel;

        this.code.addLabel(InicioWhileLabel);
        this.code.comment('Condicion-Del-While');
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('Fin-De-Condicion');
        this.code.beq(r.T0, r.ZERO, FinalWhileLabel);

        this.code.comment('Cuerpo-Del-While');
        node.sentencias.accept(this);
        this.code.comment('Fin-Del-Cuerpo-While');
        this.code.j(InicioWhileLabel);

        this.code.addLabel(FinalWhileLabel);

        this.ContinueLabel = ContinueLabelPrevio;
        this.BreakLabel = BreakLabelPrevio;
        this.code.comment('Fin-Del-While');
    }

    /**
    * @type {BaseVisitor['visitSwitch']}
    */
    visitSwitch(node) {
        this.code.comment('Inicio-del-Switch');
        
        node.condicion.accept(this);
        this.code.popObject(r.T1);

        const FinalSwitchLabel = this.code.getLabel();
        const BreakLabelPrevio = this.BreakLabel;
        this.BreakLabel = FinalSwitchLabel;

        const CasosSwitchLabel = node.cases.map(() => this.code.getLabel());
        const DefaultSwitchLabel = node.default1 ? this.code.getLabel() : FinalSwitchLabel;

        node.cases.forEach((NodoDelCaso, index) => {
            NodoDelCaso.valor.accept(this);
            this.code.popObject(r.T0);
            this.code.beq(r.T1, r.T0, CasosSwitchLabel[index]);
        });
        this.code.j(DefaultSwitchLabel);

        node.cases.forEach((NodoDelCaso, index) => {
            this.code.addLabel(CasosSwitchLabel[index]);
            NodoDelCaso.bloquecase.forEach(sentencia => {
                sentencia.accept(this)
            });
        });

        if (node.default1) {
            this.code.addLabel(DefaultSwitchLabel);
            node.default1.sentencias.forEach(sentencia => {
                sentencia.accept(this);
            });
        }
        this.code.addLabel(FinalSwitchLabel);
        this.BreakLabel = BreakLabelPrevio;
        this.code.comment('Fin-del-Switch');
    }

    /**
    * @type {BaseVisitor['visitFor']}
    */

    visitFor(node) {
        this.code.comment('Inicio-del-For');

        const InicioForLabel = this.code.getLabel();

        const FinalForLabel = this.code.getLabel();
        const BreakLabelPrevio = this.BreakLabel;
        this.BreakLabel = FinalForLabel;

        const IncrementoForLabel = this.code.getLabel();
        const ContinueLabelPrevio = this.ContinueLabel;
        this.ContinueLabel = IncrementoForLabel;

        this.code.newScope();

        this.code.comment('Inicio-Declaracion/Asignacion-For');
        node.declaracion.accept(this);
        this.code.comment('Fin-Declaracion/Asignacion-For');

        this.code.addLabel(InicioForLabel);
        this.code.comment('Condicion-For');
        node.condicion.accept(this);
        this.code.popObject(r.T0);
        this.code.comment('Fin-Condicion-For');
        this.code.beq(r.T0, r.ZERO, FinalForLabel);

        this.code.comment('Cuerpo-For');
        node.sentencia.accept(this);
        this.code.comment('Fin-Cuerpo-For');

        this.code.addLabel(IncrementoForLabel);
        this.code.comment('Inicio-Incremento-For');
        node.incremento.accept(this);
        this.code.comment('Final-Incremento-For');
        this.code.popObject(r.T0);
        this.code.j(InicioForLabel);

        this.code.addLabel(FinalForLabel);

        const BytesEliminados = this.code.endScope();
        if (BytesEliminados > 0) {
            this.code.addi(r.SP, r.SP, BytesEliminados);
        }

        this.ContinueLabel = ContinueLabelPrevio;
        this.BreakLabel = BreakLabelPrevio;

        this.code.comment('Fin-del-For');
    }

    /**
    * @type {BaseVisitor['visitBreak']}
    */
    visitBreak(node) {
        this.code.comment('Break');
        this.code.j(this.BreakLabel);
        this.code.comment('Fin-Break');
    }
    
    /**
    * @type {BaseVisitor['visitContinue']}
    */
    visitContinue(node) {
        this.code.comment('Continue');
        this.code.j(this.ContinueLabel);
        this.code.comment('Fin-Continue');
    }
    
    /**
    * @type {BaseVisitor['visitReturn']}
    */
    visitReturn(node) {
    }

    /**
     * @type {BaseVisitor['visitLlamada']}
     */
    visitLlamada(node) {
    
    }

    /**
     * @type {BaseVisitor['visitParseInt']}
     */ 
    visitParseInt(node) {
        node.Argumento.accept(this);
        this.code.popObject(r.A0);
        this.code.callBuiltin('parseInt');
        this.code.push(r.A0); 
        this.code.pushObject({ type: 'int', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitParseInt']}
     */ 
    visitParseFloat(node) {
        node.Argumento.accept(this);
        this.code.popObject(r.A0);
        this.code.callBuiltin('parseFloat');
        this.code.pushFloat(f.FT0)
        this.code.pushObject({ type: 'float', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitToString']}
     */ 
    visitToString(node) {
        node.Argumento.accept(this);
        const esFlotante = this.code.getTopObject().type === 'float';
        const valor = this.code.popObject(esFlotante ? f.FA0 : r.A0);
        if (valor.type === 'float') {
            console.log('To String Con Float')
        } else {
            if (valor.type === 'int') {
                this.code.li(r.A1, 1);
            } else if (valor.type === 'boolean') {
                this.code.li(r.A1, 2);
            } else if (valor.type === 'char') {
                this.code.li(r.A1, 3);
            } else if (valor.type === 'string') {
                this.code.li(r.A1, 4);
            }
            this.code.callBuiltin('toString');
        }
        this.code.pushObject({ type: 'string', length: 4})
    }

    /**
     * @type {BaseVisitor['visitToLowerCase']}
     */ 
    visitToLowerCase(node) {
        node.Argumento.accept(this);
        this.code.callBuiltin('toLowerCase');
    }

    /**
     * @type {BaseVisitor['visitToUpperCase']}
     */ 
    visitToUpperCase(node) {
        node.Argumento.accept(this);
        this.code.callBuiltin('toUpperCase');
    }

    /**
     * @type {BaseVisitor['visitTypeOf']}
     */ 
    visitTypeOf(node) {
        node.Argumento.accept(this);
        const EsFlotante = this.code.getTopObject().type === 'float';
        const valor = this.code.popObject(EsFlotante ? f.FT0 : r.T0);
        if (valor.type === 'int') {
            this.code.pushConstant({ type: 'string', valor: 'int' });
        } else if (valor.type === 'float') {
            this.code.pushConstant({ type: 'string', valor: 'float' });
        } else if (valor.type === 'char') {
            this.code.pushConstant({ type: 'string', valor: 'char' });
        } else if (valor.type === 'boolean') {
            this.code.pushConstant({ type: 'string', valor: 'boolean' });
        } else if (valor.type === 'string') {
            this.code.pushConstant({ type: 'string', valor: 'string' });
        }
        this.code.pushObject({ type: 'string', length: 4 });
        return
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo1']}
     */ 
    visitDeclaracionArreglo1(node) {
        this.code.comment('Inicio-Declaracion-Arreglo');
        this.code.la(r.T5, node.id);

        const valores = node.valores;

        valores.forEach((valor, index) => {
            valor.accept(this);
            this.code.popObject(r.T0);
            this.code.sw(r.T0, r.T5, index * 4);
        });

        this.code.NuevoArreglo(node.id, node.tipo, valores.length);
        this.code.pushObject({ type: node.tipo, length: valores.length*4});
        this.code.tagObject(node.id);
        
        this.code.comment('Fin-Declaracion-Arreglo');
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo2']}
     */ 
    visitDeclaracionArreglo2(node) {
        this.code.comment('Inicio-Declaracion-Arreglo-Valor-Por-Defecto');

        const NombreArreglo = node.id;
        const TipoArreglo = node.tipo1;
        const TamanioArreglo = node.numero.accept(this);

        this.code.NuevoArreglo(NombreArreglo, TipoArreglo, TamanioArreglo);

        this.code.la(r.T5, NombreArreglo);

        let ValorPorDefecto;

        switch (TipoArreglo) {
            case 'int':
                ValorPorDefecto = 0;
                break;
            case 'float':
                ValorPorDefecto = 0.0;
                break;
            case 'boolean':
                ValorPorDefecto = false;
                break;
            case 'string':
                ValorPorDefecto = "";
                break;
            case 'char':
                ValorPorDefecto = '';
                break;
        }

        this.code.li(r.T0, ValorPorDefecto);
        for (let i = 0; i < TamanioArreglo; i++) {
            this.code.sw(r.T0, r.T5, i * 4);
        }

        this.code.pushObject({ type: TipoArreglo, length: TamanioArreglo * 4 });
        this.code.tagObject(NombreArreglo);

        this.code.comment('Fin-Declaracion-Arreglo-Valor-Por-Defecto');
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo3']}
     */ 
    visitDeclaracionArreglo3(node) {
        this.code.comment('Inicio-Declaracion-Arreglo-Copia');
        const NombreArreglo1 = node.id1;
        const TipoArreglo = node.tipo;
        const NombreArreglo2 = node.id2;
        const [offset, VariableObjeto] = this.code.getObject(node.id2);

        this.code.li(r.T1, VariableObjeto.length);
        this.code.la(r.T0, NombreArreglo2);

        this.code.NuevoArreglo(NombreArreglo1, TipoArreglo, VariableObjeto.length);
        this.code.la(r.T2, NombreArreglo1);
        this.code.li(r.T3, 0);  
        
        const BucleLabel = this.code.getLabel();
        const FinalLabel = this.code.getLabel();

        this.code.addLabel(BucleLabel);
        this.code.beq(r.T3, r.T1, FinalLabel);

        this.code.lw(r.T4, r.T0, 0);
        this.code.sw(r.T4, r.T2, 0);

        this.code.addi(r.T3, r.T3, 1);
        this.code.addi(r.T0, r.T0, 4);
        this.code.addi(r.T2, r.T2, 4);

        this.code.j(BucleLabel);
        this.code.addLabel(FinalLabel);

        this.code.pushObject({ type: TipoArreglo, length: VariableObjeto.length * 4 });
        this.code.tagObject(NombreArreglo1);

        this.code.comment('Fin-Declaracion-Arreglo-Copia');
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitIndexArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitJoinArreglo(node) {
    
    }

    /**
     * @type {BaseVisitor['visitLengthArreglo']}
     */
    visitLengthArreglo(node) {
    
    }
    
    /**
     * @type {BaseVisitor['visitAccesoArreglo']}
     */
    visitAccesoArreglo(node) {
        this.code.comment('Inicio-Acceso-Arreglo');
        node.index.accept(this);
        this.code.popObject(r.T0);

        const [offset, ArregloObjeto] = this.code.getObject(node.id);

        this.code.la(r.T5, node.id);
        this.code.li(r.T1,4);   

        this.code.mul(r.T0, r.T0, r.T1);

        this.code.add(r.T2, r.T5, r.T0);

        this.code.lw(r.T3,r.T2,0);

        this.code.push(r.T3);

        this.code.pushObject({ ...ArregloObjeto, id: undefined });
        this.code.comment('Fin-Acceso-Arreglo');
    
    }

    /**
     * @type {BaseVisitor['visitAsignacionArreglo']}
     */
    visitAsignacionArreglo(node) {
        this.code.comment('Inicio-Asignacion-Arreglo');

        node.valor.accept(this);
        node.index.accept(this);

        const ValorObjeto = this.code.popObject(r.T0)
        const IndiceObjeto = this.code.popObject(r.T1)
        const [offset, Variable] = this.code.getObject(node.id)

        this.code.la(r.T5, node.id)
        this.code.li(r.T2, 4)
        this.code.mul(r.T0, r.T0, r.T2)
        this.code.add(r.T3, r.T5, r.T0)
        this.code.sw(r.T1, r.T3)
        this.code.push(r.T1)
        this.code.pushObject(ValorObjeto)
        
        this.code.comment('Fin-Asignacion-Variable');
    
    }

    /**
     * @type {BaseVisitor['visitForEach']}
     */
    visitForEach(node) {
    
    }

    /**
     * @type {BaseVisitor['visitFuncionForanea']}
     */
    visitFuncionForanea(node) {
    
    }
} 