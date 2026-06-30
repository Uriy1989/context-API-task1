import './App.css';
import styles from './styles.module.css';
import { TodoList } from './TodoList.jsx';
import React from 'react';
//npx json-server --watch --port 3003 db.json

function App() {
	return (
		<>
			<div className={styles.H3}>
				<h3>Список задач:</h3>
			</div>
			<TodoList />
		</>
	);
}

export default App;
