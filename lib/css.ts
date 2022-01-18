export function getCssVar(variableName: string) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName).trim()
}