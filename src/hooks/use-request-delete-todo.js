import { useState } from 'react';

export const useRequestDeleteTodo = (refreshTodoList) => {
	const [isDelete, setIsDelete] = useState(false);

	const requestDeleteTodo = (id) => {
		setIsDelete(true);
		fetch(`http://localhost:3003/todoList/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log(
					'Задача удалена c id:' + id + ', ответ сервера:',
					response,
				);
				refreshTodoList();
			})
			.finally(() => setIsDelete(false));
	};
	return { isDelete, requestDeleteTodo };
};
