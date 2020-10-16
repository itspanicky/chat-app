import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyCy0mOERnqQOAlDFpDLpkHqpSXkeA9Zowk",
  authDomain: "chat-app-459fe.firebaseapp.com",
  databaseURL: "https://chat-app-459fe.firebaseio.com",
  projectId: "chat-app-459fe",
  storageBucket: "chat-app-459fe.appspot.com",
  messagingSenderId: "72441041950",
  appId: "1:72441041950:web:fde910f86b77e25bc08a0f",
  measurementId: "G-5KGKH75W8S"
});

ReactDOM.render(
  <React.StrictMode>
    <div>Hello World</div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
