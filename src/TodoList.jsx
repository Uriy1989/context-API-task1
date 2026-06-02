import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles.module.css';

//import { useDebounce } from '@uidotdev/usehooks';
import { EditTask, Task, ButtonSort, SearchAndAdd } from './components';
import { TodoListProvider } from './provider/TodoListProvider';
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
		editingId,

		getTodos,
		handleDelete,

		handleAdd,
		handleSearchPhrase,
		handleIsCreating,

		handleTitle,
		handleEdit,
		handleCompleted,
		handleEditId,
	} = useTodoList();
	//handleSave,
	//handleCancel,

	if (error) {
		return (
			<div>
				<span>Ошибка: {error}</span>
			</div>
		);
	}

	return (
		<TodoListProvider>
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
									<EditTask id={id} title={title} />
								) : (
									<>
										{title}
										<Task
											id={id}
											handleEdit={handleEdit}
											isDelete={isDelete}
											handleDelete={handleDelete}
											completed={completed}
											handleCompleted={handleCompleted}
										/>
									</>
								)}
							</div>
						</div>
					))
				)}
				<ButtonSort
					handleTitle={handleTitle}
					sortByTitle={sortByTitle}
				/>
			</div>
		</TodoListProvider>
	);
};
