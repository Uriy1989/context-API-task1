import styles from '../styles.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { addTodo, updateTodo, deleteTodo } from '../actions';

export const Task = ({
	id,
	// isDelete,
	// handleDelete,
	completed,
	// handleCompleted,
	handleEditId,
}) => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.serverState);

	const onDelete = (id) => {
		dispatch(deleteTodo(id));
	};

	const onCompleted = (id, completed) => {
		dispatch(updateTodo(id, { completed: !completed }));
	};

	return (
		<>
			<div className={styles.checkbox}>
				<button
					disabled={isLoading}
					onClick={() => handleEditId(id)}
					className={styles.todoButton}
				>
					Редактировать
				</button>

				<button
					disabled={isLoading}
					onClick={() => onDelete(id)}
					className={styles.todoButton}
				>
					Удалить
				</button>

				<input
					type="checkbox"
					checked={completed}
					onChange={() => onCompleted(id, completed)}
				/>
			</div>
		</>
	);
};
