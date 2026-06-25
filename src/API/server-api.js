export const serverAPI = async (
	type,
	id = '',
	payload = null,
	urlSearch = null,
) => {
	const baseURL = 'http://localhost:3003/todoList';
	const urlById = id ? `${baseURL}/${id}` : baseURL;
	const url = urlSearch ? baseURL + urlSearch : urlById;

	const methods = {
		GET: 'GET',
		DELETE: 'DELETE',
		SAVE: 'PATCH',
		ADD: 'POST',
	};

	if (!methods[type]) {
		throw new Error(`Неподдерживаемый тип запроса: ${type}`);
	}

	const options = {
		method: methods[type],
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	};

	if (payload !== null && payload !== undefined) {
		options.body = JSON.stringify(payload);
	}

	try {
		const response = await fetch(url, options);
		// Сначала проверяем ok, потом парсим JSON
		if (!response.ok) {
			let errorText = `Ошибка ${type} запроса: статус ${response.status}`;
			try {
				const errData = await response.json();
				errorText +=
					': ' + (errData.message || JSON.stringify(errData));
			} catch (e) {
				// Если ответ не JSON — оставляем базовый текст
			}
			throw new Error(errorText);
		}

		// Для методов, которые могут не возвращать тело (например, DELETE), проверяем наличие данных
		const text = await response.text();
		return text ? JSON.parse(text) : null;
	} catch (error) {
		// Тут лучше не использовать setError напрямую: в Redux/контексте это делают снаружи
		console.error('serverAPI error:', error);
		throw error; // Пробрасываем дальше, чтобы вызывающий код мог обработать
	}
};
