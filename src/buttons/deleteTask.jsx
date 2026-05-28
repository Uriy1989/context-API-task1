import styles from '../styles.module.css';
export const ButtonDelete = ({ id, isDelete, handleDelete }) => {
	return (
		<button
			disabled={isDelete}
			onClick={() => handleDelete(id)}
			className={styles.todoButton}
		>
			Удалить
		</button>
	);
};
