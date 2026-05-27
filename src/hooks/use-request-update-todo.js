import { useState } from 'react';

export const useRequestUpdateTodo = (refreshTodoList, todoList) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const requestUpdateTodo = (id, updates = {}) => {
		setIsUpdating(true);

		const currentTodo = todoList.find((todo) => todo.id === id);

		if (!currentTodo) {
			console.error('Todo не найден');
			setIsUpdating(false);
			return;
		}

		const updatedTodo = {
			...currentTodo,
			...updates,
		};

		const { id: _, ...todoDataForUpdate } = updatedTodo;

		fetch(`http://localhost:3003/todoList/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(todoDataForUpdate),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log(response);
				refreshTodoList();
			})
			.finally(() => setIsUpdating(false));
	};

	return { isUpdating, requestUpdateTodo };
};
