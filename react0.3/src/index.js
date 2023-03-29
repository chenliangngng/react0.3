import React from "./react"

class Todos extends React.Component {
  constructor(props) {
    super(props)
    this.state = { list: [], text: "" }
  }
  onChange = (e) => {
    this.setState({ text: e.target.value })
  }
  handleClick = () => {
    this.setState({ list: [...this.state.list, this.state.text], text: "" })
  }
  onDel = (index) => {
    this.setState({
      list: [
        ...this.state.list.slice(0, index),
        ...this.state.list.slice(index + 1),
      ],
    })
  }
  render() {
    const input = React.createElement("input", {
      onKeyup: this.onChange,
      value: this.state.text,
    })
    const button = React.createElement(
      "button",
      { onClick: this.handleClick },
      "+"
    )
    const lists = this.state.list.map((item, index) =>
      React.createElement(
        "div",
        {},
        item,
        React.createElement("button", { onClick: () => this.onDel(index) }, "x")
      )
    )
    return React.createElement("div", {}, input, button, ...lists)
  }
}

const element = React.createElement(Todos, {})

React.render(element, document.getElementById("root"))
