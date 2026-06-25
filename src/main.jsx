import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App.jsx';
//import { TodoListProvider } from './provider/TodoListProvider.jsx';//удалить после

import { Provider } from 'react-redux'; //TodoListProvider вместо Provider
import { store } from './store';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
);
