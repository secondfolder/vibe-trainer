export function expandHex(hex: string) {
    return hex.replace(/^#([\da-fA-Z])([\da-fA-Z])([\da-fA-Z])$/, '#$1$1$2$2$3$3')
}