export const ButtonEdit = () => {
	<button
		disabled={isUpdating}
		onClick={() => handleEdit(id)}
		className={styles.todoButton}
	>
		Редактировать
	</button>;
};
