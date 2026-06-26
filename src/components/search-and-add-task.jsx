import styles from '../styles.module.css';

import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addTodo } from '../actions';

export const SearchAndAdd = ({ searchPhrase, handleSearchPhrase }) => {
	const dispatch = useDispatch();

	const { isLoading } = useSelector((state) => state.serverState);

	const onAdd = () => {
		if (!searchPhrase.trim()) return; //добавить это в thunk или dispatch addTodo
		dispatch(addTodo(searchPhrase));
		handleSearchPhrase(''); // сброс поля ввода
	};

	const onSearchChange = ({ target }) => {
		if (target.value.length < 1) {
			//	setIsCreating(true); //isLoading если поле пустое searchPhrase пуст то ошибку вызываем???
		} else {
			//	setIsCreating(false); //isLoading
		}

		handleSearchPhrase(target.value);
	};

	const onSearchBlur = ({ target }) => {
		handleSearchPhrase(target.value);
	};

	return (
		<div className={styles.containerTodoList}>
			<input
				className={styles.input}
				name="search"
				type="text"
				placeholder="Поиск и добавление новой задачи"
				value={searchPhrase}
				onChange={onSearchChange}
				onBlur={onSearchBlur}
			/>

			<button
				disabled={isLoading}
				onClick={onAdd}
				className={styles.todoButton}
			>
				{isLoading ? 'Добавление...' : 'Добавить+'}
			</button>

			{/* индикатор загрузки */}
		</div>
	);
};
