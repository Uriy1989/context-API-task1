import styles from '../styles.module.css';

export const SearchAndAdd = ({
	searchPhrase,
	handleAdd,
	isCreating,
	handleIsCreating,
	handleSearchPhrase,
}) => {
	const onSearchChange = ({ target }) => {
		if (target.value.length < 1) {
			handleIsCreating(true);
		} else {
			handleIsCreating(false);
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
				disabled={isCreating}
				onClick={handleAdd}
				className={styles.todoButton}
			>
				{isCreating ? 'Добавление...' : 'Добавить+'}
			</button>

			{/* индикатор загрузки */}
		</div>
	);
};
