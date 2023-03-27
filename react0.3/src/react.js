import {createUnit} from './unit'

const React ={
  render,
} 

function render (element, container) {
  const unit = createUnit(element)
  const markUp = unit.getMarkUp("0")
  container.innerHTML = markUp
}

export default React