import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App.jsx';
import { TodoListProvider } from './provider/TodoListProvider.jsx';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<TodoListProvider>
			<App />
		</TodoListProvider>
	</React.StrictMode>,
);
