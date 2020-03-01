'use strict'
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux'; 
import reducers from './reducers'
import Map from './components/Map.jsx'
import Points from './components/Points.jsx'
const store = createStore(reducers);
ReactDOM.render(
	<Provider store={store}>
		<Points />
		<Map />
	</Provider>
	, document.querySelector("#container"));
import '../css/main.css'; 
import '../css/reset.css';