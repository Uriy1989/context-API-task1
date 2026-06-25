import { serverAPI } from '../API/server-api';

export const fetchTodos =
	(query = '') =>
	async (dispatch) => {
		dispatch({ type: 'GET_TODOS_REQUEST' });
		try {
			const data = await serverAPI('GET', '', null, query); //если сервер api с ошибкой то выполняется catch
			dispatch({
				type: 'GET_TODOS_SUCCESS',
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: 'GET_TODOS_FAILURE',
				payload: error.message,
			});
		}
	};
