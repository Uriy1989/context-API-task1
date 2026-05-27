import { useState } from 'react';

export const useRequestAddTodo = (searchPhrase, refreshTodoList) => {
	const [isCreating, setIsCreating] = useState(true);

	const handleIsCreating = (value) => {
		setIsCreating(value);
	};

	const requestAddTodo = () => {
		setIsCreating(true);

		fetch('http://localhost:3003/todoList', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: searchPhrase,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('задача добавлена, ответ сервера:', response);
				refreshTodoList();
			})
			.finally();
	};

	return { isCreating, requestAddTodo, handleIsCreating };
};
