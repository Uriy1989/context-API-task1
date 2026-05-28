import styles from '../styles.module.css';
export const ButtonEdit = ({ id, isUpdating, handleEdit }) => {
	return (
		<button
			disabled={isUpdating}
			onClick={() => handleEdit(id)}
			className={styles.todoButton}
		>
			Редактировать
		</button>
	);
};
