import styles from '../styles.module.css';

import { useState } from 'react';
//import { useTodoList } from '../provider/TodoListProvider';

export const EditTask = ({ id, title, handleEditId }) => {
	//const { handleSave } = useTodoList();

	const [editedTitle, setEditedTitle] = useState(title);
	const [isLoading, setIsLoading] = useState(false);

	const onChangeInput = (e) => setEditedTitle(e.target.value);

	const onSave = async () => {
		if (!editedTitle.trim()) return;

		setIsLoading(true);
		try {
			await handleSave(id, { title: editedTitle });

			console.log('handleEditId = ', handleEditId);
			handleEditId(null);
		} catch (error) {
			console.error('Ошибка сохранения', error);
			alert('Не удалось сохранить задачу');
		} finally {
			setIsLoading(false);
		}
	};

	const onBlurInput = ({ target }) => {
		//блок для кнопки сохранить ???
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
