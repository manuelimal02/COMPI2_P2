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
        'Struct': Nodos.Struct,
        'DeclaracionStruct': Nodos.DeclaracionStruct,
        'AsignacionStruct': Nodos.AsignacionStruct,
        'AccesoAtributo': Nodos.AccesoAtributo, 
        'AsignacionAtributo': Nodos.AsignacionAtributo
    }
    const nodo = new tipos[TipoNodo](props)
    nodo.location = location()
    return nodo
    }
}

PROGRAMA = _ instrucciones:INSTRUCCIONES* _ 
            {return instrucciones}

INSTRUCCIONES = sentencia:SENTENCIA _
            {return sentencia}
            /declaracion:DECLARACION 
            {return declaracion}

SENTENCIA =  bloque:BLOQUE
            {return bloque}
            /funcionForanea:FUNCIONFORRANEA
            {return funcionForanea}
            / print_s:PRINT
            {return print_s}
            / if_1:IF
            {return if_1}
            /break_s:BREAK
            {return break_s}
            /continue_s:CONTUNUE
            {return continue_s}
            /return_s:RETURN
            {return return_s}
            / llamada:LLAMADA _ ";" _
            {return llamada}
            /asignacion:ASIGNACION
            {return asignacion}
            /asignacionArreglo:ASIGNACIONARREGLO
            {return asignacionArreglo}
            /switch_s:SWITCH
            {return switch_s}
            /while_s:WHILE
            {return while_s}
            /for_s:FOR
            {return for_s}
            /foreach:FOREACH
            {return foreach}

BLOQUE = "{" _ sentencias:INSTRUCCIONES* _ "}" 
            {return NuevoNodo('Bloque', { sentencias }) }

DECLARACION = tipo:TIPO _ id:IDENTIFICADOR _ "=" _ expresion:EXPRESION _ ";" _
            {return NuevoNodo('DeclaracionVar', {tipo, id, expresion })}
            / tipo:TIPO _ id:IDENTIFICADOR _ ";" _
            {return NuevoNodo('DeclaracionVar', {tipo, id })}
            /arreglo:ARREGLO _
            {return arreglo}

FUNCIONFORRANEA = tipo:(TIPO/ "void") _ id:IDENTIFICADOR _ "(" _ parametros:PARAMETROS? _ ")" _ bloque:BLOQUE
            { return NuevoNodo('FuncionForanea', { tipo, id, parametros: parametros || [], bloque }) }

PARAMETROS = primerParametro:PARAMETRO restoParametros:("," _ parametro:PARAMETRO { return parametro; })* 
            { return [primerParametro, ...restoParametros]; }

PARAMETRO = tipo:(TIPO/IDENTIFICADOR) dimensiones:ARREGLODIMENSION? _ id:IDENTIFICADOR
            { return { tipo, id, dim: dimensiones || "" }; }

ARREGLODIMENSION = ("[" _ "]")*  { return text(); }

ARREGLO = tipo:TIPO _ "[]" _ id:IDENTIFICADOR _ "=" _ valores:VALORES _ ";" 
            {return NuevoNodo('DeclaracionArreglo1', {tipo, id, valores})}
        /tipo1:TIPO _ "[]" _ id:IDENTIFICADOR _ "=" _ "new" _ tipo2:TIPO _ "[" _ numero:EXPRESION _ "]" _ ";" 
            {return NuevoNodo('DeclaracionArreglo2', {tipo1, id, tipo2, numero})}
        /tipo:TIPO _ "[]" _ id1:IDENTIFICADOR _ "=" _ id2:IDENTIFICADOR _ ";" 
            {return NuevoNodo('DeclaracionArreglo3', {tipo, id1, id2})}

VALORES = "{" _ valores:LISTAVALORES _ "}" 
            {return valores}

LISTAVALORES = expresion1:EXPRESION _ valores:("," _ expresion:EXPRESION {return expresion})* 
            {return [expresion1, ...valores]}

IF = _ "if" _ "(" _ condicion:EXPRESION _ ")" _ sentenciasVerdadero:SENTENCIA 
            sentenciasFalso:(
            _ "else" _ sentenciasFalso:SENTENCIA 
            { return sentenciasFalso } )? 
            { return NuevoNodo('If', { condicion, sentenciasVerdadero, sentenciasFalso }) }

PRINT = _ ("System.out.println("/"print(") _ expresion:EXPRESIONES _ ")" _ ";" _
        {return NuevoNodo('Print', { expresion })}

EXPRESIONES = primera:EXPRESION resto:(_ "," _ EXPRESION)* 
        {
            const expresiones = [primera];
            resto.forEach(([ , , , exp]) => expresiones.push(exp));
            return expresiones;
        }

SWITCH = _"switch" _ "(" _ condicion:EXPRESION _ ")" _ "{" _ cases:SWITCHCASE* default1:DEFAULTCASE? _ "}" 
            {return NuevoNodo('Switch', { condicion, cases, default1 }) }

SWITCHCASE = _ "case" _ valor:EXPRESION _ ":" _ bloquecase:INSTRUCCIONES* 
            {return { valor, bloquecase } }

DEFAULTCASE = _ "default" _ ":" _ sentencias:SENTENCIA* 
            {return { sentencias } }

WHILE = _ "while" _ "(" _ condicion:EXPRESION _ ")" _ sentencias:BLOQUE 
            {return NuevoNodo('While', { condicion, sentencias }) }

FOR = _ "for" _ "("_ declaracion:FORINIT _ condicion:EXPRESION _ ";" _ incremento:ASIGNACION _ ")" _ sentencia:SENTENCIA 
            {return NuevoNodo('For', { declaracion, condicion, incremento, sentencia }) }

FOREACH = _ "for" _ "(" _ tipo: TIPO _ id:IDENTIFICADOR _ ":" _ arreglo: IDENTIFICADOR _ ")" _ sentencias:SENTENCIA 
            {return NuevoNodo('ForEach', {tipo, id, arreglo, sentencias})}

FORINIT = asignacion:ASIGNACION
            {return asignacion}
            /declaracion:DECLARACION 
            {return declaracion}

BREAK = _ "break" _ ";" _ 
            {return NuevoNodo('Break')}

CONTUNUE = _ "continue" _ ";" _ 
            {return NuevoNodo('Continue')}

RETURN = _ "return" _ expresion:EXPRESION? _ ";" _ 
            {return NuevoNodo('Return', {expresion})}

ASIGNACION = id:IDENTIFICADOR _ "=" _ asignacion:EXPRESION _ ";" _ 
            { return NuevoNodo('asignacion', { id, asignacion }) }

            /id:IDENTIFICADOR _ "=" _ asignacion:EXPRESION _
            { return NuevoNodo('asignacion', { id, asignacion }) }

            /id:IDENTIFICADOR _ operador:("+="/"-=")_ expresion:EXPRESION _ ";" _ 
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionBinaria', 
            { operador, izquierda: NuevoNodo('ReferenciaVariable', { id }) , derecha: expresion }) }) }

            /id:IDENTIFICADOR _ operador:("+="/"-=")_ expresion:EXPRESION _ 
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionBinaria', 
            { operador, izquierda: NuevoNodo('ReferenciaVariable', { id }) , derecha: expresion }) }) }
            
            / id:IDENTIFICADOR _ operador:("++" / "--") _  ";" _
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionUnaria', 
            { operador, expresion: NuevoNodo('ReferenciaVariable', { id }) }) }) }

            / id:IDENTIFICADOR _ operador:("++" / "--") _ 
            { return NuevoNodo('asignacion', 
            { id, asignacion: NuevoNodo('OperacionUnaria', 
            { operador, expresion: NuevoNodo('ReferenciaVariable', { id }) }) }) }

ASIGNACIONARREGLO = id:IDENTIFICADOR _ "[" _ index:EXPRESION _ "]" _ "=" _ valor:EXPRESION _ ";" _ 
            {return NuevoNodo('AsignacionArreglo', { id, index, valor })}

EXPRESION = logico:LOGICO
            {return logico}
            /booleano:BOOLEANO
            {return booleano}
            / agrupacion:AGRUPACION
            {return agrupacion}
            / referenciaVariable:REFERENCIAVARIABLE
            {return referenciaVariable}
            / caracter:CARACTER
            {return caracter}
            / cadena:CADENA
            {return cadena}

LOGICO = OR

OR = izquierda:AND expansion:(_ operador:("||") _ derecha:AND 
{return { tipo: operador, derecha }})* { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, derecha } = operacionActual
        return NuevoNodo('OperacionOR', {izquierda: operacionAnterior, derecha })
        },
        izquierda
    )
}

AND = izquierda:IGUALDAD expansion:(_ operador:("&&") _ derecha:IGUALDAD 
{return { tipo: operador, derecha}})* { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            const { tipo, derecha } = operacionActual
            return NuevoNodo('OperacionAND', { izquierda: operacionAnterior, derecha })
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
        / id:IDENTIFICADOR _ posicion:VALORESLENGTH _".length"
            {return NuevoNodo('LengthArreglo', {id, posicion})}
        / id:IDENTIFICADOR _ "[" _ index:OTRAEXPRESION _ "]"
            {return NuevoNodo('AccesoArreglo', {id, index})}
        / LLAMADA
        / OTRAEXPRESION

VALORESLENGTH = ("[" _ posicion:EXPRESION _ "]" 
            {return posicion})* 

LLAMADA = callee:OTRAEXPRESION _ parametros:("(" argumentos:ARGUMENTOS? ")" { return argumentos })* {
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

OTRAEXPRESION = decimal:DECIMAL
            {return decimal}
            / entero:ENTERO
            {return entero}
            / booleano:BOOLEANO
            {return booleano}
            / agrupacion:AGRUPACION
            {return agrupacion}
            / referenciaVariable:REFERENCIAVARIABLE
            {return referenciaVariable}
            / caracter:CARACTER
            {return caracter}
            / cadena:CADENA
            {return cadena}
            


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