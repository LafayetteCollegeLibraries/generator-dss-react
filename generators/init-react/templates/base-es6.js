import React from 'react'
import { render } from 'react-dom'

const App = () => (
  <div>
    <h1>Hey!</h1>
    <p>Welcome to your new React app!</p>
  </div>
)

render(<App />, document.querySelector('#app'))
