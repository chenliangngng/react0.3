import { Element, createElement } from "./element"
import $ from "jquery"

class Unit {
  constructor(element) {
    this._currentElement = element
  }

  update(nextElement, partialState) {
    this._currentElement = nextElement || this._currentElement
    const nextState = (this._componentInstance.state = {
      ...this._componentInstance.state,
      ...partialState,
    })
    const nextProps = this._currentElement.props
    if (
      this._componentInstance.shouldComponentUpdata &&
      !this._componentInstance.shouldComponentUpdata(nextProps, nextState)
    ) {
      return
    }
    const preRenderedUnitInstance = this._renderUnitInstance
    const preRenderedElement = preRenderedUnitInstance._currentElement
    const nextRenderElement = this._componentInstance.render()
    if (shouldDeepCompare(preRenderedElement, nextRenderElement)) {
      preRenderedUnitInstance.update(nextRenderElement)
      this._componentInstance?.componentDidUpdate?.()
    } else {
      this._renderedUnitInstance = createUnit(nextProps)
      const nextMarkUp = this._renderedUnitInstance.getMarkUp(this._reactid)
      $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp)
    }
  }

  getMarkUp() {
    throw Error("此方法不能被调用")
  }
}

function shouldDeepCompare(oldElement, newElement) {
  if (oldElement != null && newElement != null) {
    const oldType = typeof oldElement
    const newType = typeof newElement
    if (
      (oldType === "string" || oldType === "number") &&
      (newType === "string" || newType === "number")
    ) {
      return true
    }
    if (oldElement instanceof Element && newElement instanceof Element) {
      return oldElement.type === newElement.type
    }
  }
  return false
}

class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    return `<span data-reactid=${reactid}>${this._currentElement}</span>`
  }
  update(nextElement) {
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement
      $(`[data-reactid="${this._reactid}"]`).html(nextElement)
    }
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
    componentInstance._currentUnit = this
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
