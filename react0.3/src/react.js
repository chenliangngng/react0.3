import {createUnit} from './unit'
import {createElement} from './element'

const React ={
  render,
  createElement
} 

function render (element, container) {
  const unit = createUnit(element)
  const markUp = unit.getMarkUp("0") // 返回HTML标记
  container.innerHTML = markUp
}

export default React