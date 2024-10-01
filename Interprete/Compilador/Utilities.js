// Esta función convierte una cadena de texto (str) en un arreglo de enteros de 32 bits.
export const stringTo32BitsArray = (str) => {
    // Inicializa un arreglo vacío donde se almacenarán los enteros de 32 bits.
    const resultado = []
    let elementIndex = 0 // Índice para recorrer cada carácter de la cadena.
    let intRepresentation = 0; // Representa el valor de 32 bits que se va construyendo.
    let shift = 0; // Variable para realizar el desplazamiento de bits en cada iteración.
    // Recorre cada carácter de la cadena.
    while (elementIndex < str.length) {
        // Convierte el carácter actual en su código ASCII y lo desplaza según el valor de shift.
        // Luego, lo combina con el valor actual de intRepresentation usando una operación OR.
        intRepresentation = intRepresentation | (str.charCodeAt(elementIndex) << shift)
        shift += 8 // Incrementa el desplazamiento en 8 bits (1 byte) después de cada carácter.
        
        // Si el desplazamiento alcanza 32 bits, se almacena el valor en el arreglo `resultado`.
        if (shift >= 32) {
            resultado.push(intRepresentation) // Añade el entero de 32 bits al arreglo.
            intRepresentation = 0 // Reinicia la representación para el siguiente grupo de caracteres.
            shift = 0 // Reinicia el desplazamiento para procesar el siguiente conjunto de bits.
        }
        elementIndex++ // Avanza al siguiente carácter en la cadena.
    }
    // Si todavía quedan bits sin procesar después del bucle, añade el valor restante.
    if (shift > 0) {
        resultado.push(intRepresentation); // Guarda los bits restantes.
    } else {
        // Si no quedaron bits pendientes, añade un 0 para completar los 32 bits.
        resultado.push(0);
    }
    // Devuelve el arreglo que contiene la representación en enteros de 32 bits de la cadena.
    return resultado;
}
