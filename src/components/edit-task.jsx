import styles from '../styles.module.css';

import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { updateTodo } from '../actions';

export const EditTask = ({ id, title, handleEditId }) => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.serverState);
	const [editedTitle, setEditedTitle] = useState(title);

	const onChangeInput = (e) => setEditedTitle(e.target.value);

	const onSave = () => {
		if (!editedTitle.trim()) return;
		dispatch(updateTodo(id, { title: editedTitle }));
		handleEditId(null);
	};

	const onBlurInput = ({ target }) => {
		const newTitle = target.value;
	};
	const onCancel = () => {
		handleEditId(null);
	};

	return (
		<>
			<input
				className={styles.input}
				name="edit"
				type="text"
				placeholder="Внесите новую задачу"
				value={editedTitle}
				onChange={onChangeInput}
				onBlur={onBlurInput}
				autoFocus
			/>
			<div>
				<button
					onClick={onSave}
					disabled={isLoading || !editedTitle.trim()}
					className={styles.todoButton}
				>
					Сохранить
				</button>
				<button onClick={onCancel} className={styles.todoButton}>
					Отмена
				</button>
			</div>
		</>
	);
};
