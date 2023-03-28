import { createUnit } from "./unit"
import { createElement } from "./element"
import { Component } from "./component"

const React = {
  render,
  createElement,
  Component,
}

function render(element, container) {
  const unit = createUnit(element)
  const markUp = unit.getMarkUp("0") // 返回HTML标记
  container.innerHTML = markUp
  $(document).trigger("mounted")
}

export default React
