export function el<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes: {[key: string]: string|boolean} = {}, ...children: Node[]): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName)
    Object.entries(attributes).forEach(([key, value]) => {
        if (value === false) {
            return
        }
        if (value) {
            element.setAttribute(key, value.toString())
        }
    })
    element.append(...children)
    return element
}

export const t = (text: string) => document.createTextNode(text)