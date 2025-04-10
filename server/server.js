const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // URL вашего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Пути для хранения данных
const DATA_DIR = path.join(__dirname, 'data');
const EXCHANGES_FILE = path.join(DATA_DIR, 'exchanges.json');
const PLANTS_FILE = path.join(DATA_DIR, 'plants.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Вспомогательная функция для загрузки данных
async function loadData(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Если файла нет или он повреждён, вернём значение по умолчанию
    return defaultValue;
  }
}

// Вспомогательная функция для сохранения данных
async function saveData(filePath, data) {
  // Создаём директорию, если она не существует
  await fs.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Инициализация API данными по умолчанию при первом запуске
async function initializeDataIfNeeded() {
  try {
    // Создаем директорию для данных, если нужно
    await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});
    
    // Импортируем тестовые данные
    const mockData = require('./mockData');
    const mockExchanges = require('./mockExchanges');
    
    // Проверяем существование файлов и создаем их при необходимости
    try {
      await fs.access(EXCHANGES_FILE);
    } catch {
      await saveData(EXCHANGES_FILE, mockExchanges);
    }
    
    try {
      await fs.access(PLANTS_FILE);
    } catch {
      await saveData(PLANTS_FILE, mockData.mockPlants);
    }
    
    try {
      await fs.access(USERS_FILE);
    } catch {
      await saveData(USERS_FILE, mockData.mockUsers);
    }
    
    console.log('Инициализация данных завершена');
  } catch (error) {
    console.error('Ошибка инициализации данных:', error);
  }
}

// EXCHANGES API ROUTES

// Получить все обмены
app.get('/api/exchanges', async (req, res) => {
  try {
    const exchanges = await loadData(EXCHANGES_FILE);
    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении обменов' });
  }
});

// Получить конкретный обмен по ID
app.get('/api/exchanges/:id', async (req, res) => {
  try {
    const exchanges = await loadData(EXCHANGES_FILE);
    const exchange = exchanges.find(e => e.id === parseInt(req.params.id));
    
    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении обмена' });
  }
});

// Создать новый обмен
app.post('/api/exchanges', async (req, res) => {
  try {
    const exchanges = await loadData(EXCHANGES_FILE);
    
    // Генерируем новый ID
    const newId = exchanges.length > 0 
      ? Math.max(...exchanges.map(e => e.id)) + 1 
      : 1;
    
    const newExchange = {
      id: newId,
      ...req.body,
      startDate: new Date().toISOString()
    };
    
    exchanges.push(newExchange);
    await saveData(EXCHANGES_FILE, exchanges);
    
    res.status(201).json(newExchange);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании обмена' });
  }
});

// Обновить существующий обмен
app.put('/api/exchanges/:id', async (req, res) => {
  try {
    const exchanges = await loadData(EXCHANGES_FILE);
    const id = parseInt(req.params.id);
    const exchangeIndex = exchanges.findIndex(e => e.id === id);
    
    if (exchangeIndex === -1) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    const updatedExchange = {
      ...exchanges[exchangeIndex],
      ...req.body
    };
    
    exchanges[exchangeIndex] = updatedExchange;
    await saveData(EXCHANGES_FILE, exchanges);
    
    res.json(updatedExchange);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении обмена' });
  }
});

// Обновить статус обмена
app.put('/api/exchanges/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус' });
    }
    
    const exchanges = await loadData(EXCHANGES_FILE);
    const id = parseInt(req.params.id);
    const exchangeIndex = exchanges.findIndex(e => e.id === id);
    
    if (exchangeIndex === -1) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    exchanges[exchangeIndex].status = status;
    
    if (status === 'completed' || status === 'canceled') {
      exchanges[exchangeIndex].endDate = new Date().toISOString();
    }
    
    await saveData(EXCHANGES_FILE, exchanges);
    
    res.json(exchanges[exchangeIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении статуса обмена' });
  }
});

// Удалить обмен
app.delete('/api/exchanges/:id', async (req, res) => {
  try {
    const exchanges = await loadData(EXCHANGES_FILE);
    const id = parseInt(req.params.id);
    const filteredExchanges = exchanges.filter(e => e.id !== id);
    
    if (filteredExchanges.length === exchanges.length) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    await saveData(EXCHANGES_FILE, filteredExchanges);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении обмена' });
  }
});

// PLANTS API ROUTES

// Получить все растения
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении растений' });
  }
});

// Получить растение по ID
app.get('/api/plants/:id', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    const plant = plants.find(p => p.id === parseInt(req.params.id));
    
    if (!plant) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении растения' });
  }
});

// Получить растения пользователя
app.get('/api/users/:userId/plants', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    const users = await loadData(USERS_FILE);
    
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    const userPlants = plants.filter(plant => plant.owner === user.name);
    res.json(userPlants);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении растений пользователя' });
  }
});

// Создать новое растение
app.post('/api/plants', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    
    // Генерируем новый ID
    const newId = plants.length > 0 
      ? Math.max(...plants.map(p => p.id)) + 1 
      : 1;
    
    const newPlant = {
      id: newId,
      ...req.body
    };
    
    plants.push(newPlant);
    await saveData(PLANTS_FILE, plants);
    
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании растения' });
  }
});

// Обновить растение
app.put('/api/plants/:id', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    const id = parseInt(req.params.id);
    const plantIndex = plants.findIndex(p => p.id === id);
    
    if (plantIndex === -1) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    const updatedPlant = {
      ...plants[plantIndex],
      ...req.body
    };
    
    plants[plantIndex] = updatedPlant;
    await saveData(PLANTS_FILE, plants);
    
    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении растения' });
  }
});

// Удалить растение
app.delete('/api/plants/:id', async (req, res) => {
  try {
    const plants = await loadData(PLANTS_FILE);
    const id = parseInt(req.params.id);
    const filteredPlants = plants.filter(p => p.id !== id);
    
    if (filteredPlants.length === plants.length) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    await saveData(PLANTS_FILE, filteredPlants);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении растения' });
  }
});

// USERS API ROUTES

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const users = await loadData(USERS_FILE);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

// Получить пользователя по ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await loadData(USERS_FILE);
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователя' });
  }
});

// Получить текущего пользователя (для демонстрации возвращает первого пользователя)
app.get('/api/users/me', async (req, res) => {
  try {
    const users = await loadData(USERS_FILE);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(users[0]); // Возвращаем первого пользователя как текущего
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователя' });
  }
});

// Обновить пользователя
app.put('/api/users/:id', async (req, res) => {
  try {
    const users = await loadData(USERS_FILE);
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...req.body
    };
    
    users[userIndex] = updatedUser;
    await saveData(USERS_FILE, users);
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
  }
});

// Инициализируем данные перед запуском сервера
initializeDataIfNeeded().then(() => {
  // Запускаем сервер
  app.listen(PORT, () => {
    console.log(`API сервер запущен на порту ${PORT}`);
  });
});
