export const ButtonSave = () => {
	<button
		disabled={isSave}
		onClick={() => handleSave(id)}
		className={styles.todoButton}
	>
		Сохранить
	</button>;
};
