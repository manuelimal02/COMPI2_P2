export const CadenaEnBytes = (String) => {
    const Resultado = []
    let IndexElemento = 0

    while (IndexElemento < String.length) {
        Resultado.push(String.charCodeAt(IndexElemento))
        IndexElemento++
    }
    Resultado.push(0)
    return Resultado;
}