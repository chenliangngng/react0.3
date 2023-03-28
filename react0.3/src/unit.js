import { Element, createElement } from "./element"
import $ from "jquery"

class Unit {
  constructor(element) {
    this._currentElement = element
  }
  getMarkUp() {
    throw Error("此方法不能被调用")
  }
}

class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    return `<span data-reactid=${reactid}>${this._currentElement}</span>`
  }
}

class NativeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    const { type, props } = this._currentElement
    let tagStart = `<${type} data-reactid=${this._reactid}`
    let childString = ""
    const tagEnd = `</${type}`
    Object.keys(props).forEach((propName) => {
      if (/^on[A-Z]/.test(propName)) {
        const eventName = propName.slice(2).toLocaleLowerCase()
        $(document).delegate(
          `[data-reactid="${this._reactid}"]`,
          `${eventName}.${this._reactid}`,
          props[propName]
        )
      } else if (propName === "style") {
        const styleObj = props[propName]
        const styleStr = Object.entries(styleObj)
          .map(([attr, value]) => {
            return `${attr.replace(
              /[A-Z]/g,
              (m) => `-${m.toLocaleLowerCase()}`
            )}:${value}`
          })
          .join(";")
        tagStart += ` style="${styleStr}"`
      } else if (propName === "className") {
        tagStart += ` class=="${props[propName]}"`
      } else if (propName === "children") {
        const { children } = props
        children.forEach((child, index) => {
          const childUnit = createUnit(child)
          const childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`)
          childString += childMarkUp
        })
      } else {
        tagStart += ` ${propName}="${props[propName]}"`
      }
    })
    return tagStart + ">" + childString + tagEnd
  }
}

class CompositeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    const { type: Component, props } = this._currentElement
    const componentInstance = (this._componentInstance = new Component(props))
    componentInstance.currentUnit = this
    componentInstance?.componentWillMount?.()
    const renderElement = componentInstance.render()
    const renderUnitInstance = (this._renderUnitInstance =
      createUnit(renderElement))
    const renderedMarkUp = renderUnitInstance.getMarkUp(reactid)
    $(document).on("mounted", () => {
      componentInstance?.componentDidMount?.()
    })
    return renderedMarkUp
  }
}

function createUnit(element) {
  if (typeof element === "string" || typeof element === "number") {
    return new TextUnit(element)
  }
  if (element instanceof Element && typeof element.type === "string") {
    return new NativeUnit(element)
  }
  if (element instanceof Element && typeof element.type === "function") {
    return new CompositeUnit(element)
  }
}

export { createUnit }
