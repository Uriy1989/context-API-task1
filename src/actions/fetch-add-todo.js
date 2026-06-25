import { serverAPI } from '../API/server-api';

export const addTodo = (title) => async (dispatch) => {
	dispatch({ type: 'ADD_TODO_REQUEST' });
	try {
		const data = await serverAPI('ADD', '', { title });
		dispatch({
			type: 'ADD_TODO_SUCCESS',
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: 'ADD_TODO_FAILURE',
			payload: error.message,
		});
	}
};
