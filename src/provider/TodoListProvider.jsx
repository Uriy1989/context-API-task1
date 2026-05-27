import { createContext } from 'react';

export const TodoListProvider = ({ children }) => {
	return <TodoListContext value={{{}}>{children}</TodoListContext>;
};
