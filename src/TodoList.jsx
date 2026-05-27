import { useEffect, useState, useMemo } from 'react';
import styles from './styles.module.css';

import {
	useRequestAddTodo,
	useRequestDeleteTodo,
	useRequestUpdateTodo,
} from './hooks';

import { TodoListProvider } from './provider/TodoListProvider';

export const TodoList = () => {
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [isSave, setIsSave] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [editingId, setEditingId] = useState(null);
	const [editedTitle, setEditedTitle] = useState('');

	const { isCreating, requestAddTodo, handleIsCreating } = useRequestAddTodo(
		searchPhrase,
		refreshTodoList,
	);

	const { isDelete, requestDeleteTodo } =
		useRequestDeleteTodo(refreshTodoList);

	const { isUpdating, requestUpdateTodo } = useRequestUpdateTodo(
		refreshTodoList,
		todoList,
	);

	const processTodoList = useMemo(() => {
		//его заменяем на useEffect c запросами к серверу тоесть только который ниже с нашей добавкой
		//useMemo проверить здесь useMemo или useEffect был
		let result = [...todoList];

		if (result.length !== 0) {
			result = result.filter((todo) =>
				todo.title.toLowerCase().includes(searchPhrase.toLowerCase()),
			);
		}

		const sortedResult = [...result];

		if (sortByTitle === 'asc') {
			return sortedResult.sort((a, b) => a.title.localeCompare(b.title));
		} else {
			return sortedResult;
		}
	}, [searchPhrase, todoList, sortByTitle]);

	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3003/todoList')
			.then((loadedData) => loadedData.json())
			.then((loadedTodoList) => {
				setTodoList(loadedTodoList);
			})
			.catch((error) => {
				console.log('Ошибка загрузки списка задач:', error);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTodoListFlag]);

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

	const handleSave = (id) => {
		const originalTodo = todoList.find((todo) => todo.id === id);

		if (!originalTodo) {
			setEditingId(null);
			setEditedTitle('');
			return;
		}
		if (editedTitle.trim() === '') {
			console.log('Нельзя сохранить пустую задачу');
			setIsSave(true);
			return;
		}

		if (originalTodo.title === editedTitle) {
			console.log('Текст не изменился, выход из режима редактирования');
			setEditingId(null);
			return;
		}

		requestUpdateTodo(id, { title: editedTitle });
		setEditingId(null);
		setEditedTitle('');
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

	const handleDelete = (id) => {
		requestDeleteTodo(id);
	};

	const handleAdd = () => {
		requestAddTodo();
		setSearchPhrase('');
	};

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
					processTodoList?.map(({ id, title, completed }) => (
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
										<button
											disabled={isSave}
											onClick={() => handleSave(id)}
											className={styles.todoButton}
										>
											Сохранить
										</button>
									) : (
										// <ButtonSave />
										<button
											disabled={isUpdating}
											onClick={() => handleEdit(id)}
											className={styles.todoButton}
										>
											Редактировать
										</button>
										// <ButtonEdit />
									)}

									<button
										disabled={isDelete}
										onClick={() => handleDelete(id)}
										className={styles.todoButton}
									>
										Удалить
									</button>
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
				<button
					onClick={() =>
						handleTitle(sortByTitle === 'asc' ? 'desc' : 'asc')
					}
					className={
						sortByTitle === 'asc'
							? styles.sortIdOn
							: styles.sortIdOff
					}
				>
					Сортировка ↓
				</button>
			</div>
		</TodoListProvider>
	);
};
