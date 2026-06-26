import styles from './styles.module.css';

import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { EditTask, Task, ButtonSort, SearchAndAdd } from './components';

import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './actions';

export const TodoList = () => {
	const dispatch = useDispatch();
	const { todoList, isLoading, error } = useSelector(
		(state) => state.serverState,
	);

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
		getTodos();
	}, [getTodos]);

	const handleSearchPhrase = (value) => {
		setSearchPhrase(value);
	};

	// const handleIsCreating = (value) => {
	// 	setIsCreating(value);
	// };

	const handleTitle = (order) => {
		//проверить потом
		setSortByTitle(order);
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
										// isDelete={isDelete}
										// handleDelete={handleDelete}
										completed={completed}
										// handleCompleted={handleCompleted}
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
