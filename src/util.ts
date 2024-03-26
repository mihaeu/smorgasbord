export function el<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes: {[key: string]: string} = {}, ...children: Node[]): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName)
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
    element.append(...children)
    return element
}

export const t = (text: string) => document.createTextNode(text)