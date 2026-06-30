import styles from '../styles.module.css';

import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addTodo } from '../actions';

export const SearchAndAdd = ({ searchPhrase, handleSearchPhrase }) => {
	const dispatch = useDispatch();

	const { isLoading } = useSelector((state) => state.serverState);

	const onAdd = () => {
		if (!searchPhrase.trim()) return;
		dispatch(addTodo(searchPhrase));
		handleSearchPhrase('');
	};

	const onSearchChange = ({ target }) => {
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
