import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';

import { useDebounce } from '@uidotdev/usehooks';

import { useRequestAddTodo } from './hooks';

import { ButtonSave, ButtonEdit, ButtonDelete, ButtonSort } from './buttons';

import { TodoListProvider } from './provider/TodoListProvider';

export const TodoList = () => {
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [isSave, setIsSave] = useState(false);
	const [isLoading, setIsLoading] = useState(true); //true

	const [editingId, setEditingId] = useState(null);
	const [editedTitle, setEditedTitle] = useState('');

	const [isUpdating, setIsUpdating] = useState(false); //new

	const [isDelete, setIsDelete] = useState(false);

	const [error, setError] = useState(null);

	const { isCreating, requestAddTodo, handleIsCreating } = useRequestAddTodo(
		searchPhrase,
		refreshTodoList,
	);

	//для серверной части

	const debouncedSearchTerm = useDebounce(searchPhrase, 900);

	const getTodos = useCallback(async () => {
		//обновляет функцию если что то изменилось из массива
		setIsLoading(true);
		let url = 'http://localhost:3003/todoList?';

		if (debouncedSearchTerm) {
			console.log('debouncedSearchTerm =', debouncedSearchTerm);
			//можно через хук реакт роутера???
			url += `q=${debouncedSearchTerm}`;
		}

		if (sortByTitle) {
			//сортировка на сервере // сортировка должна работать по условию
			url += `&_sort=title&_order=${sortByTitle}`;
		}
		//views это поля по которому сортируемся, ?_sort или

		try {
			const response = await fetch(url);
			const data = await response.json();

			setTodoList(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	}, [debouncedSearchTerm, sortByTitle]); //похож на useEffect

	const handleDelete = async (id) => {
		//requestDeleteTodo(id);
		setIsDelete(true);
		try {
			const response = await fetch(
				`http://localhost:3003/todoList/${id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json;charset=utf-8',
					},
				},
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			setTodoList((prevState) =>
				prevState.filter((todo) => todo.id !== id),
			);

			refreshTodoList();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDelete(false);
		}
	};

	const handleSave = async (id, payload) => {
		const originalTodo = todoList.find((todo) => todo.id === id);

		if (!originalTodo) {
			setEditingId(null);
			//setEditedTitle('');
			return;
		}
		if (editedTitle.trim() === '') {
			//вместо этого сделать отмену два условия
			console.log('Нельзя сохранить пустую задачу');
			setIsSave(true);
			return;
		}

		if (originalTodo.title === editedTitle) {
			//вместо этого сделать отмену
			console.log('Текст не изменился, выход из режима редактирования');
			setEditingId(null);
			return;
		}

		setIsUpdating(true);

		try {
			const response = await fetch(
				`http://localhost:3003/todoList/${id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json;charset=utf-8',
					},
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				throw new Error('Ошибка обновления');
			}
			const data = await response.json();

			//refreshTodoList
			setTodoList((prevState) =>
				prevState.map((todo) => (todo.id === id ? data : todo)),
			);

			setEditingId(null);
			setEditedTitle('');
		} catch (error) {
			setError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		getTodos();
	}, [getTodos]);

	const onSearchChange = ({ target }) => {
		if (target.value.length < 1) {
			handleIsCreating(true);
		} else {
			handleIsCreating(false);
		}

		setSearchPhrase(target.value);
	};

	const onSearchBlur = ({ target }) => {
		setSearchPhrase(target.value);
	};

	const onEditChange = ({ target }) => {
		const newTitle = target.value;

		if (newTitle.trim() === '') {
			setIsSave(true);
		} else {
			setIsSave(false);
		}
		setEditedTitle(newTitle);
	};

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleEdit = (id) => {
		setEditingId(id);
		const todoToEdit = todoList.find((todo) => todo.id === id);
		if (todoToEdit) {
			setEditedTitle(todoToEdit.title);
			setIsSave(false);
		}
	};

	const handleCompleted = (id, currentCompleted) => {
		setTodoList((newList) =>
			newList.map((todo) =>
				todo.id === id
					? { ...todo, completed: !currentCompleted }
					: todo,
			),
		);

		requestUpdateTodo(id, { completed: !currentCompleted });
	};

	const handleAdd = () => {
		requestAddTodo();
		setSearchPhrase('');
	};

	if (error) {
		return (
			<div>
				<span>{error} что за ошибка</span>
			</div>
		);
	}

	return (
		<TodoListProvider>
			<div className={styles.app}>
				<div className={styles.containerTodoList}>
					<input
						className={styles.input}
						name="search"
						type="text"
						placeholder="Поиск и добавление новой задачи"
						value={searchPhrase}
						onChange={onSearchChange}
						onBlur={onSearchBlur}
					/>
					<button
						disabled={isCreating}
						onClick={handleAdd}
						className={styles.todoButton}
					>
						Добавить+
					</button>
				</div>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					todoList?.map(({ id, title, completed }) => (
						<div className={styles.containerTodoList} key={id}>
							<div className={styles.Todo}>
								{editingId === id ? (
									<input
										className={styles.input}
										name="edit"
										type="text"
										placeholder="Внесите новую задачу"
										value={editedTitle}
										onChange={onEditChange}
										autoFocus
									/>
								) : (
									title
								)}
								<div className={styles.checkbox}>
									{editingId === id ? (
										<ButtonSave
											id={id}
											isSave={isSave}
											handleSave={handleSave}
											editedTitle={editedTitle}
										/>
									) : (
										<ButtonEdit
											id={id}
											isUpdating={isUpdating}
											handleEdit={handleEdit}
										/>
									)}
									<ButtonDelete
										id={id}
										isDelete={isDelete}
										handleDelete={handleDelete}
									/>

									<input
										type="checkbox"
										checked={completed}
										onChange={() =>
											handleCompleted(id, completed)
										}
									/>
								</div>
							</div>
						</div>
					))
				)}

				<ButtonSort
					handleTitle={handleTitle}
					sortByTitle={sortByTitle}
				/>
			</div>
		</TodoListProvider>
	);
};
