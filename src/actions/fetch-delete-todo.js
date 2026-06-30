import { serverAPI } from '../API/server-api';

export const deleteTodo = (id) => async (dispatch) => {
	dispatch({ type: 'DELETE_TODO_REQUEST' });
	try {
		await serverAPI('DELETE', id);
		dispatch({
			type: 'DELETE_TODO_SUCCESS',
			payload: id,
		});
	} catch (error) {
		dispatch({
			type: 'DELETE_TODO_FAILURE',
			payload: error.message,
		});
	}
};
