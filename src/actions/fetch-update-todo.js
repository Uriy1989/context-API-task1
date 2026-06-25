import { serverAPI } from '../API/server-api';
export const updateTodo = (id, payload) => async (dispatch) => {
	dispatch({ type: 'UPDATE_TODO_REQUEST' });
	try {
		const data = await serverAPI('SAVE', id, payload);
		dispatch({
			type: 'UPDATE_TODO_SUCCESS',
			payload: data, // сервер обычно возвращает обновлённую задачу
		});
	} catch (error) {
		dispatch({
			type: 'UPDATE_TODO_FAILURE',
			payload: error.message,
		});
	}
};
