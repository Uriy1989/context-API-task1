import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';

import { useDebounce } from '@uidotdev/usehooks';
import { EditTask, Task, ButtonSort } from './components';
import { TodoListProvider } from './provider/TodoListProvider';

export const TodoList = () => {
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [editingId, setEditingId] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isDelete, setIsDelete] = useState(false);

	const [error, setError] = useState(null);

	const [isCreating, setIsCreating] = useState(true);

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

	const handleIsCreating = (value) => {
		//??
		setIsCreating(value);
	};

	const handleAdd = async () => {
		//refreshTodoList не сработал
		setSearchPhrase('');
		setIsCreating(true); //??
		setError(null);

		try {
			const response = await fetch('http://localhost:3003/todoList', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					title: searchPhrase,
				}),
			});

			if (!response.ok) {
				throw new Error('Ошибка задачи');
			}

			const data = await response.json();
			console.log('Задача добавлена, ответ сервера:', data);
			refreshTodoList();
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
		setEditingId(id);
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

	if (error) {
		return (
			<div>
				<span>Ошибка: {error}</span>
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
									<EditTask
										id={id}
										title={title}
										handleSave={handleSave}
										handleCancel={handleCancel}
									/>
								) : (
									<>
										{title}
										<Task
											id={id}
											handleEdit={handleEdit}
											isDelete={isDelete}
											handleDelete={handleDelete}
											checked={completed}
											handleCompleted={handleCompleted}
										/>
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
