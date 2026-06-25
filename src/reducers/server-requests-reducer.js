export const initialServerState = {
	todoList: [],
	isLoading: false,
	error: null,
};

export const serverRequestsReducer = (state = initialServerState, action) => {
	switch (action.type) {
		case 'GET_TODOS_REQUEST':
			return { ...state, isLoading: true, error: null }; //начала загрузки и обнуление ошибок
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

		case 'DELETE_TODO_REQUEST':
			return { ...state, isLoading: true, error: null };
		case 'DELETE_TODO_SUCCESS':
			// action.payload — это id удалённой задачи
			return {
				...state,
				isLoading: false,
				todoList: state.todoList.filter(
					(todo) => todo.id !== action.payload,
				),
			};
		case 'DELETE_TODO_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};

		case 'UPDATE_TODO_REQUEST':
			return { ...state, isLoading: true, error: null };
		case 'UPDATE_TODO_SUCCESS':
			// заменяем элемент на тот, что вернул сервер
			return {
				...state,
				isLoading: false,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.id ? action.payload : todo,
				),
			};
		case 'UPDATE_TODO_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};

		case 'ADD_TODO_REQUEST':
			return { ...state, isLoading: true, error: null };
		case 'ADD_TODO_SUCCESS':
			return {
				...state,
				isLoading: false,
				todoList: [...state.todoList, action.payload],
			};
		case 'ADD_TODO_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};
