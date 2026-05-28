import { createContext } from 'react';
import { TodoListContext } from '../context/todoListContext';

export const TodoListProvider = ({ children }) => {
	return <TodoListContext value>{children}</TodoListContext>;
};
