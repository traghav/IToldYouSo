import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/main.css';
import './assets/js/main.js';
//import { Web3Provider } from 'react-web3';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	
	<App />
	
	, document.getElementById('root'));
registerServiceWorker();
