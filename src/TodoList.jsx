import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';

import { useDebounce } from '@uidotdev/usehooks';
import { EditTask, Task, ButtonSort, SearchAndAdd } from './components';
import { TodoListProvider } from './provider/TodoListProvider';

export const TodoList = () => {
	const [todoList, setTodoList] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [editingId, setEditingId] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isDelete, setIsDelete] = useState(false);

	const [error, setError] = useState(null);

	const [isCreating, setIsCreating] = useState(false);

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

			setTodoList((prevState) =>
				prevState.map((todo) => (todo.id === id ? data : todo)),
			);

			setEditingId(null);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleAdd = async () => {
		setSearchPhrase('');
		setIsCreating(true);
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

			setTodoList((prevState) => [...prevState, data]); //подумать
			setIsCreating(false);
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		getTodos();
	}, [getTodos]);

	const handleSearchPhrase = (value) => {
		setSearchPhrase(value);
	};

	const handleIsCreating = (value) => {
		setIsCreating(value);
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

	const handleCompleted = async (id, currentCompleted) => {
		try {
			await handleSave(id, { completed: !currentCompleted });
		} catch (error) {
			setError(error.message); //???
		}
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
				<SearchAndAdd
					searchPhrase={searchPhrase}
					handleAdd={handleAdd}
					isCreating={isCreating}
					handleIsCreating={handleIsCreating}
					handleSearchPhrase={handleSearchPhrase}
				/>
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
											completed={completed}
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
