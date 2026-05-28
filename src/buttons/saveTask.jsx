import styles from '../styles.module.css';
export const ButtonSave = ({ id, isSave, handleSave, editedTitle }) => {
	return (
		<button
			disabled={isSave}
			onClick={() => handleSave(id, { title: editedTitle })}
			className={styles.todoButton}
		>
			Сохранить
		</button>
	);
};
