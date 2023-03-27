import {Element, createElement} from './element'

class Unit {
  constructor(element) {
    this._currentElement = element
  }
  getMarkUp() {
    throw Error('此方法不能被调用')
  }
}

class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    return `<span data-reactid=${reactid}>${this._currentElement}</span>`
  }
}

class NativeUnit extends Unit{
  getMarkUp(reactid) {
    this._reactid = reactid
    const {type, props} = this._currentElement
    let tagStart = `<${type}`
    let childString = ''
    const tagEnd = `</${type}`
    Object.keys(props).forEach((propName) => {
      if (/^on[A-Z]/.test(propName)) {

      } else if (propName === 'style') {

      }else if (propName === 'className') {

      }else if (propName === 'children') {

      }else {
        tagStart += ` ${propName}="${props[propName]}"`
      }
    })
    return tagStart + ">" + childString + tagEnd
  }
}

function createUnit(element) {
  if (typeof element === 'string' || typeof element === 'number'){
    return new TextUnit(element)
  }
  if (element instanceof Element && typeof element.type === 'string') {
    return new NativeUnit(element)
  }
}

export {
  createUnit
}