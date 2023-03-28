import React from "./react"

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }

  componentWillMount() {
    console.log("Counter componentWillMount")
  }

  componentDidMount() {
    console.log("Counter componentDidMount")
  }

  increment = () => {
    this.setState({
      number: this.number + 1,
    })
  }

  render() {
    let p = React.createElement(
      "p",
      {
        style: { color: "red" },
      },
      this.props.name,
      this.state.number
    )
    let button = React.createElement("button", { onClick: this.increment }, "+")
    return React.createElement("div", { id: "counter" }, p, button)
  }
}

const element = React.createElement(Counter, { name: "计数器" })

React.render(element, document.getElementById("root"))
