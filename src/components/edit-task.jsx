import styles from '../styles.module.css';

import { useState } from 'react';
import { useTodoList } from '../provider/TodoListProvider';

export const EditTask = ({ id, title }) => {
	const { handleSave, handleCancel, editingId } = useTodoList();

	const [editedTitle, setEditedTitle] = useState(title);
	const [isSave, setIsSave] = useState(false); //зачем

	//const todoToEdit = todoList.find((todo) => todo.id === id);
	//setIsSave(false);//можно её не блокировать после нажатия кнопка исчезает

	const onChangeInput = ({ target }) => {
		const newTitle = target.value;
		setEditedTitle(newTitle);
	};

	const onBlurInput = ({ target }) => {
		//блок для кнопки сохранить
		const newTitle = target.value;

		if (newTitle.trim() === '') {
			//просто не сохраняем
			//setIsSave(true); //
		} else {
			//setIsSave(false);
		}
	};

	console.log('editingId', editingId, 'id', id);

	return (
		<>
			{editingId !== id ? (
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
							disabled={isSave}
							onClick={() =>
								handleSave(id, { title: editedTitle })
							}
							className={styles.todoButton}
						>
							Сохранить
						</button>
						<button
							onClick={() => handleCancel()}
							className={styles.todoButton}
						>
							Отмена
						</button>
					</div>
				</>
			) : (
				'пусто'
			)}
		</>
	);
};
//
// <ButtonSave
// 	id={id}
// 	isSave={isSave}
// 	handleSave={handleSave}
// 	editedTitle={editedTitle}
// />
//<ButtonCancel handleCancel={handleCancel} />

/*             подумать как проверять и не сохранять
    			setEditedTitle(''); очистить после сохранения или нет
                setIsSave переносим сюда или или прокидываем handle


		const originalTodo = todoList.find((todo) => todo.id === id);
		if (!originalTodo) {
			setEditingId(null);
	
			return;
		}

		if (originalTodo.title === editedTitle) {
			//вместо этого сделать отмену
			console.log('Текст не изменился, выход из режима редактирования');
			setEditingId(null);
			return;
		} */
