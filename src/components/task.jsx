import styles from '../styles.module.css';

import { useState } from 'react';
import { useTodoList } from '../provider/TodoListProvider';

export const Task = ({
	id,
	isDelete,
	handleDelete,
	completed,
	handleCompleted,
}) => {
	const { handleEditId } = useTodoList();
	return (
		<>
			<div className={styles.checkbox}>
				<button
					onClick={() => handleEditId(id)}
					className={styles.todoButton}
				>
					Редактировать
				</button>

				<button
					disabled={isDelete}
					onClick={() => handleDelete(id)}
					className={styles.todoButton}
				>
					Удалить
				</button>

				<input
					type="checkbox"
					checked={completed}
					onChange={() => handleCompleted(id, completed)}
				/>
			</div>
		</>
	);
};
