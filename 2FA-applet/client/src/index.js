import React from 'react';
import ReactDOMClient from 'react-dom/client';

import App from './App';

import reportWebVitals from './reportWebVitals';

import 'intl-tel-input/build/css/intlTelInput.css';
import './index.css';

ReactDOMClient
	.createRoot(document.querySelector('#root'))
	.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
