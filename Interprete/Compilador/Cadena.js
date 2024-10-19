export const CadenaComoArregloBytes = (str) => {
    const Arreglo = []
    let IndiceCaracter = 0

    while (IndiceCaracter < str.length) {
        Arreglo.push(str.charCodeAt(IndiceCaracter))
        IndiceCaracter++
    }
    Arreglo.push(0)
    return Arreglo;
}