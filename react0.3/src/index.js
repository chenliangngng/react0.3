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
    setInterval(() => {
      this.increment()
    }, 1000)

    console.log("Counter componentDidMount")
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentDidUpdate() {
    console.log("Counter componentDidUpdate")
  }

  increment = () => {
    this.setState({
      number: this.state.number + 1,
    })
  }

  render() {
    // let p = React.createElement(
    //   "p",
    //   {
    //     style: { color: "red" },
    //   },
    //   this.props.name,
    //   this.state.number
    // )
    // let button = React.createElement("button", { onClick: this.increment }, "+")
    // return React.createElement("div", { id: "counter" }, p, button)
    return this.state.number
  }
}

const element = React.createElement(Counter, { name: "计数器" })

React.render(element, document.getElementById("root"))
