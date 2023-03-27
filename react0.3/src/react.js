const React ={
  render,
  rootIndex :0
} 

function render (element, container) {
  container.innerHTML = `<span data-reactid=${React.rootIndex}>${element}</span>`
}

export default React