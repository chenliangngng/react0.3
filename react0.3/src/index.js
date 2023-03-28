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

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentDidUpdate() {
    console.log("Counter componentDidUpdate")
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    })
  }

  render() {
    const p = React.createElement("p", {}, this.props.name, this.state.number)
    const button = React.createElement(
      "button",
      { onClick: this.handleClick },
      "+"
    )
    return React.createElement(
      "div",
      {
        style: {
          color: this.state.number % 2 === 0 ? "green" : "red",
          backgroundColor: this.state.number % 2 === 0 ? "red" : "green",
        },
      },
      p,
      button
    )
  }
}

const element = React.createElement(Counter, { name: "计数器" })

React.render(element, document.getElementById("root"))
