import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';

import { useDebounce } from '@uidotdev/usehooks';
import { useRequestAddTodo } from './hooks';
import { ButtonSave, ButtonEdit, ButtonDelete, ButtonSort } from './buttons';
import { EditTask } from './components';
import { TodoListProvider } from './provider/TodoListProvider';

export const TodoList = () => {
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [isLoading, setIsLoading] = useState(true); //true

	//const [isEdit, setIsEdit] = useState(false); //null editingId editingId
	const [editingId, setEditingId] = useState(false);
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
		} catch (error) {
			setError(error.message);
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

	const handleCancel = () => {
		setEditingId(null);
	};

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleEdit = (id) => {
		setEditingId(id); //подумать как будет называться setIsEdit
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
				<span>Ошибка: {error}</span>
			</div>
		);
	}
	//{ id, title, completed }
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
									<EditTask
										id={id}
										title={title}
										handleSave={handleSave}
										handleCancel={handleCancel}
									/>
								) : (
									<>
										{title}
										<div className={styles.checkbox}>
											<ButtonEdit
												id={id}
												handleEdit={handleEdit}
											/>
											<ButtonDelete
												id={id}
												isDelete={isDelete}
												handleDelete={handleDelete}
											/>
											<input
												type="checkbox"
												checked={completed}
												onChange={() =>
													handleCompleted(
														id,
														completed,
													)
												}
											/>
										</div>
									</>
								)}
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
