export const DecimalComoF32 = (Decimal) => {
    const Buffer = new ArrayBuffer(4);
    const ArregloFloat32 = new Float32Array(Buffer);
    const ArregloInt32 = new Uint32Array(Buffer);
    ArregloFloat32[0] = Decimal;

    const ParteEntera = ArregloInt32[0];
    const RepresentacionHexadecimal  = ParteEntera.toString(16);
    return '0x' + RepresentacionHexadecimal ;
}