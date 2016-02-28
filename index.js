import React from 'react'
import ReactDOM from 'react-dom'
import App from './src/app'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer, { initialState } from './src/reducer'

let local = false
if (window.localStorage.getItem('local') !== null) {
  local = JSON.parse(window.localStorage.getItem('local'))
}

const store = createStore(reducer, Object.assign(initialState, {local}))

ReactDOM.render(<Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'))
