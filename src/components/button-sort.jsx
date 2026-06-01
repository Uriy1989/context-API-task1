import styles from '../styles.module.css';
export const ButtonSort = ({ handleTitle, sortByTitle }) => {
	return (
		<button
			onClick={() => handleTitle(sortByTitle === 'asc' ? 'desc' : 'asc')}
			className={
				sortByTitle === 'asc' ? styles.sortIdOn : styles.sortIdOff
			}
		>
			Сортировка ↓
		</button>
	);
};
