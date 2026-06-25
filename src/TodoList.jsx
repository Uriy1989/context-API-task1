import styles from './styles.module.css';

import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { EditTask, Task, ButtonSort, SearchAndAdd } from './components';

import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos } from './actions/fetch-todos';

export const TodoList = () => {
	// 	const {
	// 		todoList,
	// 		isDelete,
	// 		isLoading,
	// 		isCreating,
	// 		error,
	// 		searchPhrase,
	// 		sortByTitle,
	// 		getTodos,
	// 		handleDelete,
	// 		handleAdd,
	// 		handleSearchPhrase,
	// 		handleIsCreating,
	// 		handleTitle,
	// 		handleCompleted,
	// 	} = useTodoList();

	const dispatch = useDispatch();
	const { todoList, isLoading, error } = useSelector(
		(state) => state.serverState,
	);

	//const [error, setError] = useState(null);
	//const [todoList, setTodoList] = useState([]);
	const [isDelete, setIsDelete] = useState(false);
	//const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);

	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const debouncedSearchTerm = useDebounce(searchPhrase, 900);

	// Этот useCallback теперь только формирует параметры и вызывает dispatch
	const getTodos = useCallback(() => {
		const params = new URLSearchParams();

		if (debouncedSearchTerm) {
			params.set('q', debouncedSearchTerm);
		}

		if (sortByTitle) {
			params.set('_sort', 'title');
			params.set('_order', sortByTitle);
		}

		const queryString = params.toString() ? '?' + params.toString() : '';

		dispatch(fetchTodos(queryString));
	}, [debouncedSearchTerm, sortByTitle, dispatch]);

	useEffect(() => {
		// При монтировании загружаем начальные данные
		getTodos();
	}, [getTodos]);

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

			console.log('сохранил');
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

			setTodoList((prevState) => [...prevState, data]);
			setIsCreating(false);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleSearchPhrase = (value) => {
		setSearchPhrase(value);
	};

	const handleIsCreating = (value) => {
		setIsCreating(value);
	};

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleCompleted = async (id, currentCompleted) => {
		await handleSave(id, { completed: !currentCompleted });
	};

	//old
	const [editingId, setEditingId] = useState(null);

	const handleEditId = (value) => {
		setEditingId(value);
	};

	if (error) {
		return (
			<div>
				<span>Ошибка: {error}</span>
			</div>
		);
	}

	return (
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
									handleEditId={handleEditId}
								/>
							) : (
								<>
									{title}
									<Task
										id={id}
										isDelete={isDelete}
										handleDelete={handleDelete}
										completed={completed}
										handleCompleted={handleCompleted}
										handleEditId={handleEditId}
									/>
								</>
							)}
						</div>
					</div>
				))
			)}
			<ButtonSort handleTitle={handleTitle} sortByTitle={sortByTitle} />
		</div>
	);
};
