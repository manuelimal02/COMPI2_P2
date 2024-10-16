import { Entorno } from "../Entorno/Entorno.js";
import { BaseVisitor } from "../Visitor/Visitor.js";
import { DeclaracionVariableHandler } from "../Instruccion/Declaracion.js";
import { OperacionBinariaHandler } from "../Instruccion/OperacionBinaria.js";
import { OperacionUnariaHandler } from "../Instruccion/OperacionUnaria.js";
import { TernarioHandler } from "../Instruccion/Ternario.js";
import { IfHandler } from "../Instruccion/SentenciaIF.js";
import { Invocable } from "../Instruccion/Invocable.js";
import { BreakException, ContinueException, ReturnException } from "../Instruccion/Transferencia.js";
import Nodos from "../Nodo/Nodos.js";
import { Foranea } from "../Instruccion/Foranea.js";

export class Interprete extends BaseVisitor {

    static Reservadas = [
        'int', 'float', 'string', 'boolean', 'char', 'var', 'null', 'true', 
        'false', 'struct', 'if', 'else', 'switch', 'case', 'break', 
        'default', 'while', 'for', 'continue', 'return', 'typeof', 'toString', 
        'Object', 'indexOf', 'length', 'toUpperCase', 'toLowerCase', 'join', 'Object',
        'paseInt', 'parsefloat'
    ];

    constructor() {
        super();
        this.entornoActual = new Entorno();
        this.salida = '';
        /**
         * @type {Expresion | null}
         */
        this.PrevContinue = null;
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitSentenciaExpresion(node) {
        node.expresion.accept(this);
    }

    
    /**
    * @type {BaseVisitor['visitOperacionBinaria']}
    */
    visitOperacionBinaria(node) {
        const izquierda = node.izquierda.accept(this);
        const derecha = node.derecha.accept(this);
        const handler = new OperacionBinariaHandler(node.operador, izquierda, derecha);
        return handler.EjecutarHandler();
    }

    /**
    * @type {BaseVisitor['visitOperacionUnaria']}
    */
    visitOperacionUnaria(node) {
        const izquierda = node.expresion.accept(this);
        const handler = new OperacionUnariaHandler(node.operador, izquierda);
        return handler.EjecutarHandler();
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
        return {valor: node.valor, tipo: node.tipo};
    }

    /**
    * @type {BaseVisitor['visitDecimal']}
    */
    visitDecimal(node) {
        return {valor: node.valor, tipo: node.tipo};
    }

    /**
    * @type {BaseVisitor['visitCadena']}
    */
    visitCadena(node) {
        return {valor: node.valor, tipo: node.tipo};
    }

    /**
    * @type {BaseVisitor['visitCaracter']}
    */
    visitCaracter(node) {
        return {valor: node.valor, tipo: node.tipo};
    }

    /**
    * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        return {valor: node.valor, tipo: node.tipo};
    }

    /**
    * @type {BaseVisitor['visitDeclaracionVar']}
    */
    visitDeclaracionVar(node) {
        const nombre = node.id;
        if (Interprete.Reservadas.includes(nombre)) {
            throw new Error(`El ID: "${nombre}" Es Una Palabra Reservada. No Puede Ser Utilizada Como Nombre De Variable.`);
        }
        const DeclaracionHandler = new DeclaracionVariableHandler(node.tipo, node.id, node.expresion, this.entornoActual, 
            node.location.start.line, node.location.start.column, this);
        DeclaracionHandler.EjecutarHandler();
    }
    

    /**
    * @type {BaseVisitor['visitReferenciaVariable']}
    */
    visitReferenciaVariable(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (variable == undefined) {
            throw new Error(`La Variable: "${node.id}" No Está Definida.`);
        }
        
        return variable.valor;
    }

    /**
    * @type {BaseVisitor['visitPrint']}
    */
    visitPrint(node) {
        const valores = node.expresion.map(expresion => {
            const simbolo = expresion.accept(this);
            if (simbolo.tipo === 'float') {
                if (Number.isInteger(simbolo.valor)) {
                    simbolo.valor = simbolo.valor.toFixed(1);
                }
            }
            return simbolo.valor;
        });
        this.salida += valores.join(' ') + '\n';
    }

    /**
    * @type {BaseVisitor['visitTernario']}
    */
    visitTernario(node) {
        const TernarioHandler1 = new TernarioHandler(node.Condicion, node.Verdadero, node.Falso, this);
        return TernarioHandler1.EjecutarHandler();
    }
    
    /**
    * @type {BaseVisitor['visitAsignacion']}
    */
    visitAsignacion(node) {
        const valor = node.asignacion.accept(this);
        this.entornoActual.assignVariable(node.id, valor);
        return  valor;
    }

    /**
    * @type {BaseVisitor['visitBloque']}
    */
    visitBloque(node) {
        const EntornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(EntornoAnterior);
        node.sentencias.forEach(sentencias => sentencias.accept(this));
        this.entornoActual = EntornoAnterior;
    }

    /**
    * @type {BaseVisitor['visitIf']}
    */
    visitIf(node) {
        const IfHandler1 = new IfHandler(node.condicion, node.sentenciasVerdadero, node.sentenciasFalso, this);
        IfHandler1.EjecutarHandler();
    }

    /**
    * @type {BaseVisitor['visitWhile']}
    */
    visitWhile(node) {
        const EntornoInicial = this.entornoActual;
        const condicion = node.condicion.accept(this);
        if (condicion.tipo !== 'boolean') {
            throw new Error('Error: La Condición En Una Estructura While Debe Ser De Tipo Boolean.');
        }
        try {
            while (node.condicion.accept(this).valor) {
                node.sentencias.accept(this);
            }
        } catch (error) {
            this.entornoActual = EntornoInicial;
            if (error instanceof BreakException) {
                return
            }
            if (error instanceof ContinueException) {
                return this.visitWhile(node);
            }
            throw error;
        }
    }
    /**
    * @type {BaseVisitor['visitSwitch']}
    */
    visitSwitch(node) {
        const EntoronoInicial = this.entornoActual;
        let CasoEncontrado = false;
        let CasoEjecutado = false;
        let BreakEncontrado = false;
        try {
            for (const caso of node.cases) {
                if (!CasoEncontrado && caso.valor.accept(this).valor === node.condicion.accept(this).valor) {
                    CasoEncontrado = true;
                }
                if (CasoEncontrado) {
                    this.entornoActual = new Entorno(EntoronoInicial);
                    CasoEjecutado = true;
                    for (const SentenciasBloque of caso.bloquecase) {
                        try {
                            SentenciasBloque.accept(this);
                        } catch (error) {
                            if (error instanceof BreakException) {
                                BreakEncontrado = true;
                                return;
                            } else if (error instanceof ContinueException) {
                                break;
                            } else {
                                throw error;
                            }
                        }
                    }
                }
            }
            if (CasoEjecutado && !BreakEncontrado && node.default1) {
                this.entornoActual = new Entorno(EntoronoInicial);
                for (const SentenciasBloque of node.default1.sentencias) {
                    try {
                        SentenciasBloque.accept(this);
                    } catch (error) {
                        if (error instanceof BreakException) {
                            return;
                        } else if (error instanceof ContinueException) {
                            break;
                        } else {
                            throw error;
                        }
                    }
                }
            }
            if (!CasoEjecutado && node.default1) {
                this.entornoActual = new Entorno(EntoronoInicial);
                for (const SentenciasBloque of node.default1.sentencias) {
                    try {
                        SentenciasBloque.accept(this);
                    } catch (error) {
                        if (error instanceof BreakException) {
                            return;
                        } else if (error instanceof ContinueException) {
                            break;
                        } else {
                            throw error;
                        }
                    }
                }
            }
        } finally {
        this.entornoActual = EntoronoInicial;
        }
    }

    /**
    * @type {BaseVisitor['visitFor']}
    */
    visitFor(node) {
        const PrevIncremento = this.PrevContinue;
        this.PrevContinue = node.incremento;
        const ImplementacionFor = new Nodos.Bloque({
            sentencias: [
                node.declaracion,
                new Nodos.While({
                    condicion: node.condicion,
                    sentencias: new Nodos.Bloque({
                        sentencias: [
                            node.sentencia,
                            node.incremento
                        ]
                    })
                })
            ]
        })
        ImplementacionFor.accept(this);
        this.PrevContinue = PrevIncremento;
    }

    /**
    * @type {BaseVisitor['visitBreak']}
    */
    visitBreak(node) {
        throw new BreakException();
    }
    
    /**
    * @type {BaseVisitor['visitContinue']}
    */
    visitContinue(node) {
        if (this.PrevContinue) {
            this.PrevContinue.accept(this);
        }
        throw new ContinueException();
    }
    
    /**
    * @type {BaseVisitor['visitReturn']}
    */
    visitReturn(node) {
        let Valor = null;
        if(node.expresion){
            Valor = node.expresion.accept(this);
        }
        throw new ReturnException(Valor);
    }

    /**
     * @type {BaseVisitor['visitLlamada']}
     */
    visitLlamada(node) {
        const funcion = node.callee.accept(this);
        const argumentos = node.argumentos.map(arg => arg.accept(this));
        if (!(funcion instanceof Invocable)) {
            throw new Error(`La variable: "${node.callee.id}" no es invocable.`);
        }
        if (funcion.aridad() !== argumentos.length) {
            throw new Error(`La función: "${node.callee.id}" espera ${funcion.aridad()} argumentos, pero se recibieron ${argumentos.length}.`);
        }
        if (funcion.aridad() > 0 && funcion.node) {
            funcion.node.parametros.forEach((param, i) => {
                const argumento = argumentos[i];
                if (param.tipo !== argumento.tipo) {
                    throw new Error(`El argumento en la posición ${i + 1} debe ser de tipo "${param.tipo}", pero se recibió "${argumento.tipo}".`);
                }
            });
        }
        return funcion.invocar(this, argumentos);
    }

    /**
     * @type {BaseVisitor['visitParseInt']}
     */ 
    visitParseInt(node) {
        const expresion = node.Argumento.accept(this);
        if (expresion.tipo !== "string") {
            throw new Error(`El Argumento De parseInt Debe Ser De Tipo String, Pero Se Recibió Un "${expresion.tipo}".`);
        }
        const valor = parseInt(expresion.valor);
        if (isNaN(valor)) {
            throw new Error(`El Valor "${expresion.valor}" No Puede Convertirse A Un Número Entero.`);
        }
        return { valor: valor, tipo: "int" };
    }

    
    /**
     * @type {BaseVisitor['visitParseFloat']}
     */
    visitParseFloat(node) {
        const arg = node.Argumento.accept(this);
        if (arg.tipo !== "string") {
            throw new Error(`El Argumento De parseFloat Debe Ser De Tipo String, Pero Se Recibió Un "${arg.tipo}".`);
        }
        const valor = parseFloat(arg.valor);
        if (isNaN(valor)) {
            throw new Error(`El Valor "${arg.valor}" No Puede Convertirse A Un Número Decimal.`);
        }
        return { valor: valor, tipo: "float" };
    }
    

    /**
     * @type {BaseVisitor['visitToString']}
     */
    visitToString(node) {
        const arg = node.Argumento.accept(this);
        switch (arg.tipo) {
            case "int":
                return {valor: arg.valor.toString(), tipo: "string"};
            case "float":
                return {valor: arg.valor.toString(), tipo: "string"};
            case "string":
                return {valor: arg.valor, tipo: "string"};
            case "char":
                return {valor: arg.valor, tipo: "string"};
            case "boolean":
                return {valor: arg.valor.toString(), tipo: "string"};
            default:
                throw new Error(`El Tipo De Dato "${arg.tipo}" No Es Válido.`);
        }
    }
    
    /**
     * @type {BaseVisitor['visitToLowerCase']}
     */
    visitToLowerCase(node) {
        const arg = node.Argumento.accept(this);
        if (arg.tipo !== "string") {
            throw new Error(`El Argumento De toLowerCase Debe Ser De Tipo String, Pero Se Recibió Un "${arg.tipo}".`);
        }
        return { valor: arg.valor.toLowerCase(), tipo: "string" };
    }
    

    /**
     * @type {BaseVisitor['visitToUpperCase']}
     */
    visitToUpperCase(node) {
        const arg = node.Argumento.accept(this);
        if (arg.tipo !== "string") {
            throw new Error(`El Argumento De toLowerCase Debe Ser De Tipo String, Pero Se Recibió Un "${arg.tipo}".`);
        }
        return { valor: arg.valor.toUpperCase(), tipo: "string" };
    }
    

    /**
     * @type {BaseVisitor['visitTypeOf']}
     */ 
    visitTypeOf(node) {
        const expresion = node.Argumento.accept(this);
        switch (expresion.tipo) {
            case "int":
                return {valor: expresion.tipo, tipo: "string" };
            case "float":
                return {valor: expresion.tipo, tipo: "string" };
            case "string": 
                return {valor: expresion.tipo, tipo: "string" };
            case "char":
                return {valor: expresion.tipo, tipo: "string" };
            case "boolean": 
                return {valor: expresion.tipo, tipo: "string" };    
            default:
                throw new Error(`El Tipo De Dato "${expresion.tipo}" No Es Válido.`);
        }
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo1']}
     */ 
    visitDeclaracionArreglo1(node) {
        const nombre = node.id;
        if (Interprete.Reservadas.includes(nombre)) {
            throw new Error(`El ID: "${nombre}" Es Una Palabra Reservada. No Puede Ser Utilizada Como Nombre De Variable.`);
        }
        let arreglo = [];
        const valoresEvaluados = node.valores.map(valor => valor.accept(this));
        for (let valor of valoresEvaluados) {
            if (valor.tipo !== node.tipo) {
                throw new Error(`El Tipo Del Valor "${valor.valor}" No Coincide Con El Tipo Del Arreglo "${node.tipo}".`);
            }
            arreglo.push(valor.valor);
        }
        this.entornoActual.setVariable(node.tipo, node.id, {valor: arreglo, tipo: node.tipo}, node.location.start.line, node.location.start.column);
        
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo2']}
     */ 
    visitDeclaracionArreglo2(node) {
        const nombre = node.id;
        if (Interprete.Reservadas.includes(nombre)) {
            throw new Error(`El ID: "${nombre}" Es Una Palabra Reservada. No Puede Ser Utilizada Como Nombre De Variable.`);
        }
        const numero = node.numero.accept(this);
        let arreglo = [];
        if (node.tipo1 !== node.tipo2) {
            throw new Error(`El Tipo Del Arreglo "${node.tipo1}" No Coincide Con El Tipo Del Arreglo "${node.tipo2}".`);
        }
        
        if (numero.tipo !== 'int') {
            throw new Error(`El Tamaño Del Arreglo Debe Ser De Tipo Int: "${numero.tipo}".`);
        }
        if (numero.valor < 0) {
            throw new Error(`El Tamaño Del Arreglo No Puede Ser Negativo: "${numero.valor}".`);
        }
        switch (node.tipo1) {
            case 'int':
                arreglo = Array(numero.valor).fill(0);
                break;
            case 'float':
                arreglo = Array(numero.valor).fill(0.0);
                break;
            case 'string':
                arreglo = Array(numero.valor).fill('');
                break;
            case 'char':
                arreglo = Array(numero.valor).fill('\0');
                break;
            case 'boolean':
                arreglo = Array(numero.valor).fill(false);
                break;
            default:
                throw new Error(`Tipo De Arreglo No Válido: "${node.tipo1}".`);
        }
        this.entornoActual.setVariable(node.tipo1, node.id, {valor: arreglo, tipo: node.tipo1}, node.location.start.line, node.location.start.column);
        
    }

    /**
     * @type {BaseVisitor['visitDeclaracionArreglo3']}
     */ 
    visitDeclaracionArreglo3(node) {
        const nombre = node.id1;
        if (Interprete.Reservadas.includes(nombre)) {
            throw new Error(`El ID: "${nombre}" Es Una Palabra Reservada. No Puede Ser Utilizada Como Nombre De Variable.`);
        }
        const valores = this.entornoActual.getVariable(node.id2).valor;
        if (!valores) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        if (!Array.isArray(valores.valor)) {
            throw new Error(`La Variable "${node.id2}" No Es Un Arreglo.`);
        }
        if (valores.tipo !== node.tipo) {
            throw new Error(`El Tipo Del Arreglo "${valores.tipo}" No Coincide Con El Tipo Del Arreglo "${node.tipo}".`);
        }
        this.entornoActual.setVariable(node.tipo, node.id1, {valor: valores.valor.slice(), tipo: node.tipo}, node.location.start.line, node.location.start.column);
        
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitIndexArreglo(node) {
        const arreglo = this.entornoActual.getVariable(node.id).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        const index = node.index.accept(this)
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.id}" No Es Un Arreglo.`);
        }
        if (index.tipo!== arreglo.tipo){
            throw new Error(`El Tipo Del Indice "${index.tipo}" No Coincide Con El Tipo Del Arreglo "${arreglo.tipo}".`);
        }
        for (let i = 0; i < arreglo.valor.length; i++) {
            if (arreglo.valor[i] === index.valor) {
                return {valor: i, tipo: "int"};
            }
        }
        return {valor: -1, tipo:"int"};
    }

    /**
     * @type {BaseVisitor['visitIndexArreglo']}
     */
    visitJoinArreglo(node) {
        let cadena ="";
        const arreglo = this.entornoActual.getVariable(node.id).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.id}" No Es Un Arreglo.`);
        }
        for (let i = 0; i < arreglo.valor.length; i++) {
            cadena += arreglo.valor[i].toString();
            if (i < arreglo.valor.length - 1) {
                cadena += ",";
            }
        }
        return {valor: cadena, tipo: "string"};
    }

    /**
     * @type {BaseVisitor['visitLengthArreglo']}
     */
    visitLengthArreglo(node) {
        const arreglo = this.entornoActual.getVariable(node.id).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.id}" No Es Un Arreglo.`);
        }
        return {valor: arreglo.valor.length, tipo: "int"};
        
    }
    
    
    /**
     * @type {BaseVisitor['visitAccesoArreglo']}
     */
    visitAccesoArreglo(node) {
        const arreglo = this.entornoActual.getVariable(node.id).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        const index = node.index.accept(this)
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.id}" No Es Un Arreglo.`);
        }
        if (index.tipo !== 'int') {
            throw new Error(`El Indice De Acceso Al Arreglo Debe Ser De Tipo Int: "${index.tipo}".`);
        }
        for (let i = 0; i < arreglo.valor.length; i++) {
            if (i === index.valor) {
                return {valor: arreglo.valor[i], tipo: arreglo.tipo};
            }
        }
        throw new Error(`Indice Fuera De Rango: "${index.valor}".`);
    }

    /**
     * @type {BaseVisitor['visitAsignacionArreglo']}
     */
    visitAsignacionArreglo(node) {
        const arreglo = this.entornoActual.getVariable(node.id).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.id2}" No Está Definido.`);
        }
        const index = node.index.accept(this);
        const valor = node.valor.accept(this);
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.id}" No Es Un Arreglo.`);
        }
        if (index.tipo !== 'int') {
            throw new Error(`El Indice De Acceso Al Arreglo Debe Ser De Tipo Int: "${index.tipo}".`);
        }
        if (valor.tipo !== arreglo.tipo) {
            throw new Error(`El Tipo Del Valor "${valor.valor}" No Coincide Con El Tipo Del Arreglo "${arreglo.tipo}".`);
        }
        if (index.valor < 0 || index.valor >= arreglo.valor.length) {
            throw new Error(`Indice Fuera De Rango: "${index.valor}".`);
        }
        arreglo.valor[index.valor] = valor.valor;
        return;
    }

    /**
     * @type {BaseVisitor['visitForEach']}
     */
    visitForEach(node) {
        const arreglo = this.entornoActual.getVariable(node.arreglo).valor;
        if (!arreglo) {
            throw new Error(`El Arreglo "${node.arreglo}" No Está Definido.`);
        }
        if (!Array.isArray(arreglo.valor)) {
            throw new Error(`La Variable: "${node.arreglo}" No Es Un Arreglo.`);
        }
        if (node.tipo !== arreglo.tipo) {
            throw new Error(`El Tipo Del Arreglo "${arreglo.tipo}" No Coincide Con El Tipo De La Variable "${node.tipo}".`);
        }
        for (let elemento of arreglo.valor) {
            const entornoNuevo = new Entorno(this.entornoActual);
            entornoNuevo.setTemporal(node.tipo, node.id, { valor: elemento, tipo: node.tipo });
            entornoNuevo.assignVariable = function(nombre, valor) {
                if (nombre === node.id) {
                    throw new Error(`La Variable "${nombre}" No Puede Ser Reasignada Dentro De Un Foreach.`);
                }
                Entorno.prototype.assignVariable.call(this, nombre, valor);
            };
            const entornoAnterior = this.entornoActual;
            this.entornoActual = entornoNuevo;
            try {
                node.sentencias.accept(this);
            } catch (error) {
                this.entornoActual = entornoAnterior;
                throw error;
            }
            this.entornoActual = entornoAnterior;
        }
    }

    /**
     * @type {BaseVisitor['visitFuncionForanea']}
     */
    visitFuncionForanea(node) {
        const nombre = node.parametros.map(param => param.id);
        const nombresUnicos = new Set(nombre);
        if (nombre.length !== nombresUnicos.size) {
            throw new Error(`Los parámetros de la función "${node.id}" no deben tener el mismo nombre.`);
        }
        const funcion = new Foranea(node, this.entornoActual);
        this.entornoActual.setVariable(node.tipo, node.id, funcion, node.location.start.line, node.location.start.column);
        
    }
} 