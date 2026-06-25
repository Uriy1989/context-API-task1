export const initialServerState = {
	todoList: [], // Изначально пустой массив
	isLoading: false, // Флаг загрузки
	error: null, // Текст ошибки
};

export const serverRequestsReducer = (state = initialServerState, action) => {
	switch (action.type) {
		case 'GET_TODOS_REQUEST':
			return { ...state, isLoading: true, error: null };
		case 'GET_TODOS_SUCCESS':
			return {
				...state,
				isLoading: false,
				todoList: Array.isArray(action.payload) ? action.payload : [],
			};
		case 'GET_TODOS_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
