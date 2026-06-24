import { createContext } from 'react';
import { TodoListContext } from '../context/todoListContext';

import { useContext } from 'react';

import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState, useCallback } from 'react';

export const useTodoList = () => {
	const context = useContext(TodoListContext);
	if (!context) {
		throw new Error('нет контекста');
	}
	return context;
};

export const TodoListProvider = ({ children }) => {
	const [error, setError] = useState(null);
	const [todoList, setTodoList] = useState([]);
	const [isDelete, setIsDelete] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);

	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const debouncedSearchTerm = useDebounce(searchPhrase, 900);

	const getTodos = useCallback(async () => {
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
		//views это поля по которому сорбируется, ?_sort или

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

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleCompleted = async (id, currentCompleted) => {
		await handleSave(id, { completed: !currentCompleted });
	};

	return (
		<TodoListContext
			value={{
				todoList,
				isDelete,
				isLoading,
				isCreating,
				error,
				searchPhrase,
				sortByTitle,
				getTodos,
				handleDelete,
				handleSave,
				handleAdd,
				handleSearchPhrase,
				handleIsCreating,
				handleTitle,
				handleCompleted,
			}}
		>
			{children}
		</TodoListContext>
	);
};
