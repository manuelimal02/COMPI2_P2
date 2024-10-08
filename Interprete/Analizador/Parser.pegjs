{
    const NuevoNodo = (TipoNodo, props) =>{
    const tipos = {
        'entero': Nodos.Entero,
        'decimal': Nodos.Decimal,
        'cadena': Nodos.Cadena,
        'caracter': Nodos.Caracter,	
        'booleano': Nodos.Booleano,
        'Agrupacion': Nodos.Agrupacion,
        'DeclaracionVar': Nodos.DeclaracionVar,
        'ReferenciaVariable': Nodos.ReferenciaVariable,
        'OperacionBinaria': Nodos.OperacionBinaria,
        'OperacionAND': Nodos.OperacionAND,
        'OperacionOR': Nodos.OperacionOR,
        'OperacionUnaria': Nodos.OperacionUnaria,
        'Print': Nodos.Print,
        'asignacion': Nodos.Asignacion,
        'Bloque': Nodos.Bloque,
        'If': Nodos.If,
        'While': Nodos.While,
        'Switch': Nodos.Switch,
        'For': Nodos.For,
        'Break': Nodos.Break,
        'Continue': Nodos.Continue,
        'Return': Nodos.Return,
        'Llamada': Nodos.Llamada, 
        'ParseInt': Nodos.ParseInt,
        'ParseFloat': Nodos.ParseFloat,
        'ToString': Nodos.ToString,
        'ToLowerCase': Nodos.ToLowerCase,
        'ToUpperCase': Nodos.ToUpperCase,
        'TypeOf': Nodos.TypeOf,
        'DeclaracionArreglo1': Nodos.DeclaracionArreglo1,
        'DeclaracionArreglo2': Nodos.DeclaracionArreglo2,
        'DeclaracionArreglo3': Nodos.DeclaracionArreglo3,
        'IndexArreglo': Nodos.IndexArreglo,
        'JoinArreglo': Nodos.JoinArreglo,
        'LengthArreglo': Nodos.LengthArreglo,
        'AccesoArreglo': Nodos.AccesoArreglo,
        'AsignacionArreglo': Nodos.AsignacionArreglo,
        'ForEach': Nodos.ForEach,
        'FuncionForanea': Nodos.FuncionForanea,
        'SentenciaExpresion': Nodos.SentenciaExpresion
    }
    const nodo = new tipos[TipoNodo](props)
    nodo.location = location()
    return nodo
    }
}

PROGRAMA = _ instrucciones:DECLARACIONES* _ 
            {return instrucciones}

DECLARACIONES = declaracion:DECLARACIONVARIABLE _
            {return declaracion}
            /sentencia:SENTENCIA _
            {return sentencia}
            /funcion:DECLARACIONFUNCION _
            {return funcion}

// Declaración De Variables
DECLARACIONVARIABLE = arreglo:ARREGLO _
            {return arreglo}
            /tipo:TIPO _ id:IDENTIFICADOR _ "=" _ expresion:EXPRESION _ ";" _
            {return NuevoNodo('DeclaracionVar', {tipo, id, expresion })}
            / tipo:TIPO _ id:IDENTIFICADOR _ ";" _
            {return NuevoNodo('DeclaracionVar', {tipo, id })}

// Declaración De Funciones
DECLARACIONFUNCION = tipo:(TIPO/ "void") _ id:IDENTIFICADOR _ "(" _ parametros:PARAMETROS? _ ")" _ bloque:BLOQUE
            { return NuevoNodo('FuncionForanea', { tipo, id, parametros: parametros || [], bloque }) }

PARAMETROS = primerParametro:PARAMETRO restoParametros:("," _ parametro:PARAMETRO { return parametro; })* 
            { return [primerParametro, ...restoParametros]; }

PARAMETRO = tipo:(TIPO/IDENTIFICADOR) dimensiones:ARREGLODIMENSION? _ id:IDENTIFICADOR
            { return { tipo, id, dim: dimensiones || "" }; }

ARREGLODIMENSION = ("[" _ "]")*  { return text(); }

// Declaración De Arreglos
ARREGLO = tipo:TIPO _ "[]" _ id:IDENTIFICADOR _ "=" _ valores:VALORES _ ";" 
            {return NuevoNodo('DeclaracionArreglo1', {tipo, id, valores})}
        /tipo1:TIPO _ "[]" _ id:IDENTIFICADOR _ "=" _ "new" _ tipo2:TIPO _ "[" _ numero:EXPRESION _ "]" _ ";" 
            {return NuevoNodo('DeclaracionArreglo2', {tipo1, id, tipo2, numero})}
        /tipo:TIPO _ "[]" _ id1:IDENTIFICADOR _ "=" _ id2:IDENTIFICADOR _ ";" 
            {return NuevoNodo('DeclaracionArreglo3', {tipo, id1, id2})}

// Asignación De Arreglos
ASIGNACIONARREGLO = id:IDENTIFICADOR _ "[" _ index:EXPRESION _ "]" _ "=" _ valor:EXPRESION _ ";" _ 
            {return NuevoNodo('AsignacionArreglo', { id, index, valor })}

VALORES = "{" _ valores:LISTAVALORES _ "}" 
            {return valores}

LISTAVALORES = expresion1:EXPRESION _ valores:("," _ expresion:EXPRESION {return expresion})* 
            {return [expresion1, ...valores]}

SENTENCIA =  
            bloque:BLOQUE
            {return bloque}
            /print_s:PRINT
            {return print_s}
            / if_1:IF
            {return if_1}
            /while_s:WHILE
            {return while_s}
            /for_s:FOR
            {return for_s}
            /switch_s:SWITCH
            {return switch_s}
            /foreach:FOREACH
            {return foreach}
            /break_s:BREAK
            {return break_s}
            /continue_s:CONTUNUE
            {return continue_s}
            /return_s:RETURN
            {return return_s}
            /expresion:EXPRESION _ ";" _
            {return NuevoNodo('SentenciaExpresion', {expresion})}

PRINT = _ ("System.out.println("/"print(") _ expresion:EXPRESIONES _ ")" _ ";" _
        {return NuevoNodo('Print', { expresion })}

EXPRESIONES = primera:EXPRESION resto:(_ "," _ EXPRESION)* 
        {
            const expresiones = [primera];
            resto.forEach(([ , , , exp]) => expresiones.push(exp));
            return expresiones;
        }

BLOQUE = "{" _ sentencias:DECLARACIONES* _ "}" 
            {return NuevoNodo('Bloque', { sentencias }) }

IF = _ "if" _ "(" _ condicion:EXPRESION _ ")" _ sentenciasVerdadero:SENTENCIA 
            sentenciasFalso:(
            _ "else" _ sentenciasFalso:SENTENCIA 
            { return sentenciasFalso } )? 
            { return NuevoNodo('If', { condicion, sentenciasVerdadero, sentenciasFalso }) }

WHILE = _ "while" _ "(" _ condicion:EXPRESION _ ")" _ sentencias:SENTENCIA 
            {return NuevoNodo('While', { condicion, sentencias }) }

FOR = _ "for" _ "("_ declaracion:FORINIT _ condicion:EXPRESION _ ";" _ incremento:EXPRESION _ ")" _ sentencia:SENTENCIA 
            {return NuevoNodo('For', { declaracion, condicion, incremento, sentencia }) }

FORINIT = declaracion:DECLARACIONVARIABLE 
            {return declaracion}
            / expresion:EXPRESION _ ";"
            {return expresion}

FOREACH = _ "for" _ "(" _ tipo: TIPO _ id:IDENTIFICADOR _ ":" _ arreglo: IDENTIFICADOR _ ")" _ sentencias:SENTENCIA 
            {return NuevoNodo('ForEach', {tipo, id, arreglo, sentencias})}

SWITCH = _"switch" _ "(" _ condicion:EXPRESION _ ")" _ "{" _ cases:SWITCHCASE* default1:DEFAULTCASE? _ "}" 
            {return NuevoNodo('Switch', { condicion, cases, default1 }) }

SWITCHCASE = _ "case" _ valor:EXPRESION _ ":" _ bloquecase:DECLARACIONES* 
            {return { valor, bloquecase } }

DEFAULTCASE = _ "default" _ ":" _ sentencias:SENTENCIA* 
            {return { sentencias } }

BREAK = _ "break" _ ";" _ 
            {return NuevoNodo('Break')}

CONTUNUE = _ "continue" _ ";" _ 
            {return NuevoNodo('Continue')}

RETURN = _ "return" _ expresion:EXPRESION? _ ";" _ 
            {return NuevoNodo('Return', {expresion})}

EXPRESION = ASIGNACION

ASIGNACION = asignado:LLAMADA _ "=" _ asignacion:ASIGNACION _ 
            { return NuevoNodo('asignacion', { id: asignado.id, asignacion }) }

            /id:IDENTIFICADOR _ operador:("+="/"-=")_ expresion:EXPRESION _ 
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionBinaria', 
            { operador, izquierda: NuevoNodo('ReferenciaVariable', { id }) , derecha: expresion }) }) }

            / id:IDENTIFICADOR _ operador:("++" / "--")  _
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionUnaria', 
            { operador, expresion: NuevoNodo('ReferenciaVariable', { id }) }) }) }
            / LOGICO


LOGICO = OR

OR = izquierda:AND expansion:(_ operador:("||") _ derecha:AND 
{return { tipo: operador, derecha }})* { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, derecha } = operacionActual
        return NuevoNodo('OperacionBinaria', { operador:tipo, izquierda: operacionAnterior, derecha })
        },
        izquierda
    )
}

AND = izquierda:IGUALDAD expansion:(_ operador:("&&") _ derecha:IGUALDAD 
{return { tipo: operador, derecha}})* { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            const { tipo, derecha } = operacionActual
            return NuevoNodo('OperacionBinaria', { operador:tipo, izquierda: operacionAnterior, derecha })
            },
            izquierda
        )
}

IGUALDAD = izquierda:RELACIONAL expansion:(_ operador:("=="/"!=") _ derecha:RELACIONAL 
{return { tipo: operador, derecha } })* { 
return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, derecha } = operacionActual
        return NuevoNodo('OperacionBinaria', { operador:tipo, izquierda: operacionAnterior, derecha })
        },
        izquierda
    )
}

RELACIONAL = izquierda:ARITMETICA expansion:(_ operador:("<="/">="/"<"/">") _ derecha:ARITMETICA 
{ return { tipo: operador, derecha } })* { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, derecha } = operacionActual
        return NuevoNodo('OperacionBinaria', { operador:tipo, izquierda: operacionAnterior, derecha })
        },
        izquierda
    )
}

ARITMETICA = SUMA

SUMA = izquierda:MULTIPLICACION expansion:( _ operador:("+" / "-") _ derecha:MULTIPLICACION {return {tipo: operador, derecha}})* {
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            const {tipo, derecha} = operacionActual
            return NuevoNodo('OperacionBinaria', {operador: tipo, izquierda: operacionAnterior, derecha})
        },
        izquierda
    )
}

MULTIPLICACION = izquierda:UNARIA expansion:( _ operador:("*" / "/" / "%") _ derecha:UNARIA {return {tipo: operador, derecha}})* {
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            const {tipo, derecha} = operacionActual
            return NuevoNodo('OperacionBinaria', {operador: tipo, izquierda: operacionAnterior, derecha})
        },
        izquierda
    )
}

UNARIA = "-" _ expresion:UNARIA 
            {return NuevoNodo('OperacionUnaria', {operador: '-', expresion: expresion})}
        / "!" _ expresion:UNARIA 
            {return NuevoNodo('OperacionUnaria', {operador: '!', expresion: expresion})}
        / "parseInt" _ "(" _ Argumento:OTRAEXPRESION _ ")" 
            {return NuevoNodo('ParseInt', {Argumento})}
        / "parsefloat" _ "(" _ Argumento:OTRAEXPRESION _ ")" 
            {return NuevoNodo('ParseFloat', {Argumento})}
        / "toString" _ "(" _ Argumento:OTRAEXPRESION _ ")" 
            {return NuevoNodo('ToString', {Argumento})}
        / "toLowerCase" _ "(" _ Argumento:OTRAEXPRESION _ ")" 
            {return NuevoNodo('ToLowerCase', {Argumento})}
        / "toUpperCase" _ "(" _ Argumento:OTRAEXPRESION _ ")"
            {return NuevoNodo('ToUpperCase', {Argumento})}
        / "typeof"_ Argumento:OTRAEXPRESION 
            {return NuevoNodo('TypeOf', {Argumento})}
        / id:IDENTIFICADOR _ ".indexOf" _ "(" _ index:OTRAEXPRESION _ ")"
            {return NuevoNodo('IndexArreglo', {id, index})}
        / id:IDENTIFICADOR _ ".join()"
            {return NuevoNodo('JoinArreglo', {id})}
        / id:IDENTIFICADOR _".length"
            {return NuevoNodo('LengthArreglo', {id, posicion})}
        / id:IDENTIFICADOR _ "[" _ index:OTRAEXPRESION _ "]"
            {return NuevoNodo('AccesoArreglo', {id, index})}
        / OTRAEXPRESION


OTRAEXPRESION = booleano:BOOLEANO
            {return booleano}
            / caracter:CARACTER
            {return caracter}
            / cadena:CADENA
            {return cadena}
            / LLAMADA
            
LLAMADA = callee:DATOS _ parametros:("(" argumentos:ARGUMENTOS? ")" { return argumentos })* {
    return parametros.reduce(
        (callee, argumentos) => {
            return NuevoNodo('Llamada', { callee, argumentos: argumentos || [] })
            },
    callee
    )
}

ARGUMENTOS = argumento:EXPRESION _ argumentos:("," _ expresion:EXPRESION 
            { return expresion })* 
            { return [argumento, ...argumentos] }

DATOS = entero:ENTERO
            {return entero}
            / decimal:DECIMAL
            {return decimal}
            /agrupacion:AGRUPACION
            {return agrupacion}
            /referencia:REFERENCIAVARIABLE

TIPO = "int" 
            {return text()}
            / "float" 
            {return text()}    
            / "string" 
            {return text()}
            / "boolean" 
            {return text()}
            / "char" 
            {return text()}
            / "var"
            {return text()}
            
IDENTIFICADOR = [a-zA-Z_][a-zA-Z0-9_]* 
            { return text(); }

DECIMAL = [0-9]+ "." [0-9]+
            {return NuevoNodo('decimal', {valor: parseFloat(text()), tipo: "float"})}

ENTERO = [0-9]+
            {return NuevoNodo('entero', {valor: parseInt(text()), tipo: "int"})}

CADENA = "\"" contenido:[^"]* "\""
            {   
                var text = contenido.join('');
                text = text.replace(/\\n/g, "\n");
                text = text.replace(/\\\\/g, "\\");
                text = text.replace(/\\\"/g,"\"");
                text = text.replace(/\\r/g, "\r");
                text = text.replace(/\\t/g, "\t");
                text = text.replace(/\\\'/g, "'");
                return NuevoNodo('cadena', {valor: text, tipo: "string"});
            }

CARACTER = "'" caracter:[\x00-\x7F] "'" 
            { 
                return NuevoNodo('caracter', { valor: caracter, tipo: "char" });
            }

BOOLEANO = "true" 
            {return NuevoNodo('booleano', {valor: true, tipo: "boolean"})}
            / "false" 
            {return NuevoNodo('booleano', {valor: false, tipo: "boolean"})}

AGRUPACION = _ "(" _ expresion:EXPRESION _ ")"_ 
            {return NuevoNodo('Agrupacion', {expresion})}

REFERENCIAVARIABLE = id:IDENTIFICADOR 
            {return NuevoNodo('ReferenciaVariable', {id})}


_ = (ESPACIOBLANCO / COMENTARIO)*

ESPACIOBLANCO = [ \t\n\r]+

COMENTARIO = COMENTARIOL / COMENTARIOLN

COMENTARIOL = "//" (![\n\r].)*

COMENTARIOLN = "/*" (!"*/".)* "*/"