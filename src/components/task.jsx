import styles from '../styles.module.css';

import { useState } from 'react';

export const Task = ({
	id,
	handleEdit,
	isDelete,
	handleDelete,
	completed,
	handleCompleted,
}) => {
	return (
		<>
			<div className={styles.checkbox}>
				<button
					onClick={() => handleEdit(id)}
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
