declare module "array-to-sentence" {
  type Options = {
    separator: string,
    lastSeparator: string
  }
  export default function arrayToSentence(items: Array<string | number>, options?: Options): string
}