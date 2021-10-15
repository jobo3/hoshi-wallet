import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import "bootstrap-icons/font/bootstrap-icons.css";
import store from './app/store'
import { Provider } from 'react-redux'
import { startMirage } from './mirage';

// start mirage mock API
const server = startMirage()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    < App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
