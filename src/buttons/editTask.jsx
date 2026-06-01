import styles from '../styles.module.css';
export const ButtonEdit = ({ id, handleEdit }) => {
	return (
		<button onClick={() => handleEdit(id)} className={styles.todoButton}>
			Редактировать
		</button>
	);
};
