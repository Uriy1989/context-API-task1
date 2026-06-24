import styles from './styles.module.css';
import { useState } from 'react';
import { EditTask, Task, ButtonSort, SearchAndAdd } from './components';
import { useTodoList } from './provider/TodoListProvider';

export const TodoList = () => {
	const {
		todoList,
		isDelete,
		isLoading,
		isCreating,
		error,
		searchPhrase,
		sortByTitle,
		getTodos,
		handleDelete,
		handleAdd,
		handleSearchPhrase,
		handleIsCreating,
		handleTitle,
		handleCompleted,
	} = useTodoList();

	const [editingId, setEditingId] = useState(null);

	const handleEditId = (value) => {
		setEditingId(value);
	};

	if (error) {
		return (
			<div>
				<span>Ошибка: {error}</span>
			</div>
		);
	}

	return (
		<div className={styles.app}>
			<SearchAndAdd
				searchPhrase={searchPhrase}
				handleAdd={handleAdd}
				isCreating={isCreating}
				handleIsCreating={handleIsCreating}
				handleSearchPhrase={handleSearchPhrase}
			/>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				todoList?.map(({ id, title, completed }) => (
					<div className={styles.containerTodoList} key={id}>
						<div className={styles.Todo}>
							{editingId === id ? (
								<EditTask
									id={id}
									title={title}
									handleEditId={handleEditId}
								/>
							) : (
								<>
									{title}
									<Task
										id={id}
										isDelete={isDelete}
										handleDelete={handleDelete}
										completed={completed}
										handleCompleted={handleCompleted}
										handleEditId={handleEditId}
									/>
								</>
							)}
						</div>
					</div>
				))
			)}
			<ButtonSort handleTitle={handleTitle} sortByTitle={sortByTitle} />
		</div>
	);
};
