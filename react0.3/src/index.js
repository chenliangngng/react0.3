import React from './react'

const sayHello = () => {
  console.log('hello')
}
const element = React.createElement('button', {
  id: 'sayHello',
  style: {color: 'red',  backgroundColor: 'green'},
  onClick: sayHello,
  },
  'say',
  React.createElement('b', {}, 'hello')
)
React.render(element, document.getElementById('root'))