import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import '../public/index.css'
ReactDOM.render(
  <Provider store={store}>
    <h1> Hello, it's the React Boilermaker Template. Go Wild!</h1>
  </Provider>,
  document.getElementById('app')
);
