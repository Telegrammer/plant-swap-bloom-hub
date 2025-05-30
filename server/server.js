
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://YOUR_IP_ADDRESS:8080', // Замените YOUR_IP_ADDRESS на ваш реальный IP
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Настройка базы данных SQLite
const dbPath = path.join(__dirname, 'plant_exchange.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка при подключении к базе данных:', err.message);
  } else {
    console.log('Успешное подключение к базе данных SQLite');
    initializeDatabase();
  }
});

// Инициализация базы данных
function initializeDatabase() {
  const mockData = require('./mockData');
  const mockExchanges = require('./mockExchanges');

  // Создаем таблицы
  db.serialize(() => {
    // Таблица пользователей
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        location TEXT,
        bio TEXT,
        dateCreated TEXT NOT NULL,
        profileImageUrl TEXT
      )
    `);

    // Таблица растений
    db.run(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        waterDemand TEXT,
        sunDemand TEXT,
        size TEXT,
        isIndoor INTEGER,
        owner TEXT NOT NULL,
        FOREIGN KEY (owner) REFERENCES users(name)
      )
    `);

    // Таблица типов растений
    db.run(`
      CREATE TABLE IF NOT EXISTS plant_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER,
        type TEXT,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
      )
    `);

    // Таблица обменов
    db.run(`
      CREATE TABLE IF NOT EXISTS exchanges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderId INTEGER,
        senderName TEXT,
        receiverId INTEGER,
        receiverName TEXT,
        status TEXT,
        startDate TEXT,
        endDate TEXT,
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (receiverId) REFERENCES users(id)
      )
    `);

    // Таблица растений в обмене
    db.run(`
      CREATE TABLE IF NOT EXISTS exchange_plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exchange_id INTEGER,
        plant_id INTEGER,
        name TEXT,
        imageUrl TEXT,
        direction TEXT,
        FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE CASCADE,
        FOREIGN KEY (plant_id) REFERENCES plants(id)
      )
    `);
    
    // Проверяем наличие данных в базе и загружаем начальные данные если нужно
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err || row.count === 0) {
        console.log("Загружаем начальные данные пользователей...");
        const insertUser = db.prepare("INSERT INTO users (id, name, email, location, bio, dateCreated, profileImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)");
        mockData.mockUsers.forEach(user => {
          insertUser.run(user.id, user.name, user.email || `user${user.id}@example.com`, user.location, user.bio, user.dateCreated, user.profileImageUrl);
        });
        insertUser.finalize();
      }
    });
    
    db.get("SELECT COUNT(*) as count FROM plants", (err, row) => {
      if (err || row.count === 0) {
        console.log("Загружаем начальные данные растений...");
        const insertPlant = db.prepare("INSERT INTO plants (id, name, description, imageUrl, waterDemand, sunDemand, size, isIndoor, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        const insertType = db.prepare("INSERT INTO plant_types (plant_id, type) VALUES (?, ?)");
        
        mockData.mockPlants.forEach(plant => {
          insertPlant.run(
            plant.id, 
            plant.name, 
            plant.description || null, 
            plant.imageUrl, 
            plant.waterDemand, 
            plant.sunDemand, 
            plant.size, 
            plant.isIndoor ? 1 : 0, 
            plant.owner
          );
          
          if (plant.types && Array.isArray(plant.types)) {
            plant.types.forEach(type => {
              insertType.run(plant.id, type);
            });
          }
        });
        
        insertPlant.finalize();
        insertType.finalize();
      }
    });
    
    db.get("SELECT COUNT(*) as count FROM exchanges", (err, row) => {
      if (err || row.count === 0) {
        console.log("Загружаем начальные данные обменов...");
        const insertExchange = db.prepare("INSERT INTO exchanges (id, senderId, senderName, receiverId, receiverName, status, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        const insertExchangePlant = db.prepare("INSERT INTO exchange_plants (exchange_id, plant_id, name, imageUrl, direction) VALUES (?, ?, ?, ?, ?)");
        
        mockExchanges.forEach(exchange => {
          insertExchange.run(
            exchange.id, 
            exchange.senderId, 
            exchange.senderName, 
            exchange.receiverId, 
            exchange.receiverName, 
            exchange.status, 
            exchange.startDate, 
            exchange.endDate || null
          );
          
          // Добавляем растения отправителя
          if (exchange.senderPlants && Array.isArray(exchange.senderPlants)) {
            exchange.senderPlants.forEach(plant => {
              insertExchangePlant.run(
                exchange.id,
                plant.id,
                plant.name,
                plant.imageUrl,
                'sent'
              );
            });
          }
          
          // Добавляем растения получателя
          if (exchange.receiverPlants && Array.isArray(exchange.receiverPlants)) {
            exchange.receiverPlants.forEach(plant => {
              insertExchangePlant.run(
                exchange.id,
                plant.id,
                plant.name,
                plant.imageUrl,
                'received'
              );
            });
          }
        });
        
        insertExchange.finalize();
        insertExchangePlant.finalize();
      }
    });
  });
}

// EXCHANGES API ROUTES

// Получить все обмены
app.get('/api/exchanges', (req, res) => {
  db.all(`
    SELECT * FROM exchanges
  `, [], (err, exchanges) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении обменов' });
    }
    
    // Для каждого обмена получаем связанные растения
    const promises = exchanges.map(exchange => {
      return new Promise((resolve, reject) => {
        db.all(`
          SELECT * FROM exchange_plants WHERE exchange_id = ?
        `, [exchange.id], (err, plants) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Группируем растения по направлению (sent/received)
          const senderPlants = plants.filter(p => p.direction === 'sent');
          const receiverPlants = plants.filter(p => p.direction === 'received');
          
          resolve({
            ...exchange,
            senderPlants,
            receiverPlants
          });
        });
      });
    });
    
    Promise.all(promises)
      .then(exchangesWithPlants => {
        res.json(exchangesWithPlants);
      })
      .catch(error => {
        res.status(500).json({ message: 'Ошибка при получении данных растений для обменов' });
      });
  });
});

// Получить конкретный обмен по ID
app.get('/api/exchanges/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.get('SELECT * FROM exchanges WHERE id = ?', [id], (err, exchange) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении обмена' });
    }
    
    if (!exchange) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    // Получаем растения для обмена
    db.all('SELECT * FROM exchange_plants WHERE exchange_id = ?', [id], (err, plants) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении растений обмена' });
      }
      
      // Группируем растения по направлению
      const senderPlants = plants.filter(p => p.direction === 'sent');
      const receiverPlants = plants.filter(p => p.direction === 'received');
      
      res.json({
        ...exchange,
        senderPlants,
        receiverPlants
      });
    });
  });
});

// Создать новый обмен
app.post('/api/exchanges', (req, res) => {
  const { senderId, senderName, receiverId, receiverName, senderPlants, receiverPlants } = req.body;
  const startDate = new Date().toISOString();
  const status = 'pending';
  
  db.run(`
    INSERT INTO exchanges (senderId, senderName, receiverId, receiverName, status, startDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [senderId, senderName, receiverId, receiverName, status, startDate], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при создании обмена' });
    }
    
    const exchangeId = this.lastID;
    const insertPlant = db.prepare(`
      INSERT INTO exchange_plants (exchange_id, plant_id, name, imageUrl, direction)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    // Добавляем растения отправителя
    if (senderPlants && Array.isArray(senderPlants)) {
      senderPlants.forEach(plant => {
        insertPlant.run(exchangeId, plant.id, plant.name, plant.imageUrl, 'sent');
      });
    }
    
    // Добавляем растения получателя
    if (receiverPlants && Array.isArray(receiverPlants)) {
      receiverPlants.forEach(plant => {
        insertPlant.run(exchangeId, plant.id, plant.name, plant.imageUrl, 'received');
      });
    }
    
    insertPlant.finalize();
    
    // Получаем полную информацию о созданном обмене
    db.get('SELECT * FROM exchanges WHERE id = ?', [exchangeId], (err, exchange) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении созданного обмена' });
      }
      
      // Получаем растения для обмена
      db.all('SELECT * FROM exchange_plants WHERE exchange_id = ?', [exchangeId], (err, plants) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при получении растений обмена' });
        }
        
        // Группируем растения по направлению
        const senderPlants = plants.filter(p => p.direction === 'sent');
        const receiverPlants = plants.filter(p => p.direction === 'received');
        
        res.status(201).json({
          ...exchange,
          senderPlants,
          receiverPlants
        });
      });
    });
  });
});

// Обновить существующий обмен
app.put('/api/exchanges/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { senderId, senderName, receiverId, receiverName, status, senderPlants, receiverPlants } = req.body;
  
  db.run(`
    UPDATE exchanges
    SET senderId = COALESCE(?, senderId),
        senderName = COALESCE(?, senderName),
        receiverId = COALESCE(?, receiverId),
        receiverName = COALESCE(?, receiverName),
        status = COALESCE(?, status)
    WHERE id = ?
  `, [senderId, senderName, receiverId, receiverName, status, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при обновлении обмена' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    // Если переданы новые списки растений, обновляем их
    if (senderPlants || receiverPlants) {
      // Удаляем существующие растения
      db.run('DELETE FROM exchange_plants WHERE exchange_id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при обновлении растений обмена' });
        }
        
        const insertPlant = db.prepare(`
          INSERT INTO exchange_plants (exchange_id, plant_id, name, imageUrl, direction)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        // Добавляем новые растения отправителя
        if (senderPlants && Array.isArray(senderPlants)) {
          senderPlants.forEach(plant => {
            insertPlant.run(id, plant.id, plant.name, plant.imageUrl, 'sent');
          });
        }
        
        // Добавляем новые растения получателя
        if (receiverPlants && Array.isArray(receiverPlants)) {
          receiverPlants.forEach(plant => {
            insertPlant.run(id, plant.id, plant.name, plant.imageUrl, 'received');
          });
        }
        
        insertPlant.finalize();
      });
    }
    
    // Возвращаем обновленный обмен
    db.get('SELECT * FROM exchanges WHERE id = ?', [id], (err, exchange) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении обновленного обмена' });
      }
      
      // Получаем растения для обмена
      db.all('SELECT * FROM exchange_plants WHERE exchange_id = ?', [id], (err, plants) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при получении растений обмена' });
        }
        
        // Группируем растения по направлению
        const senderPlants = plants.filter(p => p.direction === 'sent');
        const receiverPlants = plants.filter(p => p.direction === 'received');
        
        res.json({
          ...exchange,
          senderPlants,
          receiverPlants
        });
      });
    });
  });
});

// Обновить статус обмена
app.put('/api/exchanges/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!['pending', 'completed', 'canceled'].includes(status)) {
    return res.status(400).json({ message: 'Неверный статус' });
  }
  
  let endDate = null;
  if (status === 'completed' || status === 'canceled') {
    endDate = new Date().toISOString();
  }
  
  db.run(`
    UPDATE exchanges
    SET status = ?,
        endDate = ?
    WHERE id = ?
  `, [status, endDate, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при обновлении статуса обмена' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    // Возвращаем обновленный обмен
    db.get('SELECT * FROM exchanges WHERE id = ?', [id], (err, exchange) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении обновленного обмена' });
      }
      
      // Получаем растения для обмена
      db.all('SELECT * FROM exchange_plants WHERE exchange_id = ?', [id], (err, plants) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при получении растений обмена' });
        }
        
        // Группируем растения по направлению
        const senderPlants = plants.filter(p => p.direction === 'sent');
        const receiverPlants = plants.filter(p => p.direction === 'received');
        
        res.json({
          ...exchange,
          senderPlants,
          receiverPlants
        });
      });
    });
  });
});

// Удалить обмен
app.delete('/api/exchanges/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.run('DELETE FROM exchanges WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при удалении обмена' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Обмен не найден' });
    }
    
    // Удаляем связанные растения (каскадное удаление настроено в базе данных)
    db.run('DELETE FROM exchange_plants WHERE exchange_id = ?', [id], (err) => {
      if (err) {
        console.error('Ошибка при удалении растений обмена:', err);
      }
      
      res.status(204).send();
    });
  });
});

// PLANTS API ROUTES

// Получить все растения
app.get('/api/plants', (req, res) => {
  db.all(`
    SELECT p.*, GROUP_CONCAT(pt.type) as typesList
    FROM plants p
    LEFT JOIN plant_types pt ON p.id = pt.plant_id
    GROUP BY p.id
  `, [], (err, plants) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении растений' });
    }
    
    // Преобразуем строку типов обратно в массив
    const plantsWithTypes = plants.map(plant => {
      const types = plant.typesList ? plant.typesList.split(',') : [];
      delete plant.typesList;
      
      return {
        ...plant,
        isIndoor: Boolean(plant.isIndoor), // SQLite хранит boolean как 0/1
        types
      };
    });
    
    res.json(plantsWithTypes);
  });
});

// Получить растение по ID
app.get('/api/plants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.get(`
    SELECT p.*, GROUP_CONCAT(pt.type) as typesList
    FROM plants p
    LEFT JOIN plant_types pt ON p.id = pt.plant_id
    WHERE p.id = ?
    GROUP BY p.id
  `, [id], (err, plant) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении растения' });
    }
    
    if (!plant) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    // Преобразуем строку типов обратно в массив
    const types = plant.typesList ? plant.typesList.split(',') : [];
    delete plant.typesList;
    
    res.json({
      ...plant,
      isIndoor: Boolean(plant.isIndoor),
      types
    });
  });
});

// Получить растения пользователя
app.get('/api/users/:userId/plants', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении пользователя' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    db.all(`
      SELECT p.*, GROUP_CONCAT(pt.type) as typesList
      FROM plants p
      LEFT JOIN plant_types pt ON p.id = pt.plant_id
      WHERE p.owner = ?
      GROUP BY p.id
    `, [user.name], (err, plants) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении растений пользователя' });
      }
      
      // Преобразуем строку типов обратно в массив для каждого растения
      const plantsWithTypes = plants.map(plant => {
        const types = plant.typesList ? plant.typesList.split(',') : [];
        delete plant.typesList;
        
        return {
          ...plant,
          isIndoor: Boolean(plant.isIndoor),
          types
        };
      });
      
      res.json(plantsWithTypes);
    });
  });
});

// Создать новое растение
app.post('/api/plants', (req, res) => {
  const { name, description, imageUrl, waterDemand, sunDemand, size, isIndoor, types, owner } = req.body;
  
  db.run(`
    INSERT INTO plants (name, description, imageUrl, waterDemand, sunDemand, size, isIndoor, owner)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, description, imageUrl, waterDemand, sunDemand, size, isIndoor ? 1 : 0, owner], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при создании растения' });
    }
    
    const plantId = this.lastID;
    
    // Добавляем типы растения, если они есть
    if (types && Array.isArray(types) && types.length > 0) {
      const insertType = db.prepare('INSERT INTO plant_types (plant_id, type) VALUES (?, ?)');
      
      types.forEach(type => {
        insertType.run(plantId, type);
      });
      
      insertType.finalize();
    }
    
    // Возвращаем созданное растение
    db.get(`
      SELECT p.*, GROUP_CONCAT(pt.type) as typesList
      FROM plants p
      LEFT JOIN plant_types pt ON p.id = pt.plant_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [plantId], (err, plant) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении созданного растения' });
      }
      
      // Преобразуем строку типов обратно в массив
      const types = plant.typesList ? plant.typesList.split(',') : [];
      delete plant.typesList;
      
      res.status(201).json({
        ...plant,
        isIndoor: Boolean(plant.isIndoor),
        types
      });
    });
  });
});

// Обновить растение
app.put('/api/plants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, imageUrl, waterDemand, sunDemand, size, isIndoor, types, owner } = req.body;
  
  db.run(`
    UPDATE plants
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        imageUrl = COALESCE(?, imageUrl),
        waterDemand = COALESCE(?, waterDemand),
        sunDemand = COALESCE(?, sunDemand),
        size = COALESCE(?, size),
        isIndoor = COALESCE(?, isIndoor),
        owner = COALESCE(?, owner)
    WHERE id = ?
  `, [name, description, imageUrl, waterDemand, sunDemand, size, isIndoor !== undefined ? (isIndoor ? 1 : 0) : undefined, owner, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при обновлении растения' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    // Если переданы типы, обновляем их
    if (types) {
      // Удаляем существующие типы
      db.run('DELETE FROM plant_types WHERE plant_id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при обновлении типов растения' });
        }
        
        // Добавляем новые типы
        if (Array.isArray(types) && types.length > 0) {
          const insertType = db.prepare('INSERT INTO plant_types (plant_id, type) VALUES (?, ?)');
          
          types.forEach(type => {
            insertType.run(id, type);
          });
          
          insertType.finalize();
        }
      });
    }
    
    // Возвращаем обновленное растение
    db.get(`
      SELECT p.*, GROUP_CONCAT(pt.type) as typesList
      FROM plants p
      LEFT JOIN plant_types pt ON p.id = pt.plant_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id], (err, plant) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении обновленного растения' });
      }
      
      // Преобразуем строку типов обратно в массив
      const types = plant.typesList ? plant.typesList.split(',') : [];
      delete plant.typesList;
      
      res.json({
        ...plant,
        isIndoor: Boolean(plant.isIndoor),
        types
      });
    });
  });
});

// Удалить растение
app.delete('/api/plants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.run('DELETE FROM plants WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при удалении растения' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Растение не найдено' });
    }
    
    // Удаляем связанные типы (каскадное удаление настроено в базе данных)
    db.run('DELETE FROM plant_types WHERE plant_id = ?', [id], (err) => {
      if (err) {
        console.error('Ошибка при удалении типов растения:', err);
      }
      
      res.status(204).send();
    });
  });
});

// USERS API ROUTES

// Получить всех пользователей
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении пользователей' });
    }
    
    res.json(users);
  });
});

// Получить пользователя по ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении пользователя' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  });
});

// Получить текущего пользователя (для демонстрации возвращает первого пользователя)
app.get('/api/users/me', (req, res) => {
  db.get('SELECT * FROM users ORDER BY id LIMIT 1', [], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении пользователя' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  });
});

// Обновить пользователя
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, location, bio, profileImageUrl } = req.body;
  
  db.run(`
    UPDATE users
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        profileImageUrl = COALESCE(?, profileImageUrl)
    WHERE id = ?
  `, [name, email, location, bio, profileImageUrl, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении обновленного пользователя' });
      }
      
      res.json(user);
    });
  });
});

// CHAT API ROUTES

// Generate bot response
app.post('/api/chat/generate', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Simple response logic - in a real app, this would connect to an AI service
    let response = "Извините, я не могу ответить на этот вопрос.";
    
    // Basic pattern matching for demo purposes
    if (message.toLowerCase().includes('монстер')) {
      response = "Монстера любит яркий непрямой свет и умеренный полив. Поливайте, когда верхний слой почвы подсохнет.";
    } else if (message.toLowerCase().includes('темн')) {
      response = "Для темных помещений хорошо подходят замиокулькас, аспидистра и многие виды папоротников.";
    } else if (message.toLowerCase().includes('суккулент')) {
      response = "Суккуленты нужно поливать редко, только когда почва полностью просохнет. Обычно это раз в 1-2 недели.";
    } else if (message.toLowerCase().includes('жёлт') || message.toLowerCase().includes('желт')) {
      response = "Пожелтение листьев может быть вызвано переливом, недостатком света или питательных веществ. Проверьте режим полива и освещение.";
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ message: 'Ошибка при генерации ответа' });
  }
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
});
