export const numberToF32 = (number) => {
    const buffer = new ArrayBuffer(4);
    const float32arr = new Float32Array(buffer);
    const uint32arr = new Uint32Array(buffer);
    float32arr[0] = number;

    const integer = uint32arr[0];
    const hexRepr = integer.toString(16);
    return '0x' + hexRepr;
}