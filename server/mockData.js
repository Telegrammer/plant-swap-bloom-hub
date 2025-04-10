
// Mock data for initial server setup
const mockPlants = [
  {
    id: 1,
    name: "Фикус Бенджамина",
    description: "Популярное комнатное растение с глянцевыми листьями и элегантным внешним видом.",
    imageUrl: "/plants/ficus.jpg",
    waterDemand: "Умеренный полив",
    sunDemand: "Яркий непрямой свет",
    size: "Средний",
    owner: "Анна Ковалева",
    location: "Москва"
  },
  {
    id: 2,
    name: "Монстера Деликатесная",
    description: "Тропическое растение с большими, красивыми листьями с естественными отверстиями.",
    imageUrl: "/plants/monstera.jpg",
    waterDemand: "Умеренный полив",
    sunDemand: "Средний свет",
    size: "Большой",
    owner: "Иван Петров",
    location: "Санкт-Петербург"
  },
  {
    id: 3,
    name: "Спатифиллум",
    description: "Красивое растение с белыми цветами и темно-зелеными листьями.",
    imageUrl: "/plants/spathiphyllum.jpg",
    waterDemand: "Регулярный полив",
    sunDemand: "Низкий свет",
    size: "Маленький",
    owner: "Мария Сидорова",
    location: "Екатеринбург"
  },
  {
    id: 4,
    name: "Калатея Орбифолия",
    description: "Красивое растение с круглыми полосатыми листьями.",
    imageUrl: "/plants/calathea.jpg",
    waterDemand: "Высокий полив",
    sunDemand: "Низкий свет",
    size: "Средний",
    owner: "Анна Ковалева",
    location: "Москва"
  },
  {
    id: 5,
    name: "Суккулент Эхеверия",
    description: "Засухоустойчивое растение с розеткой мясистых листьев.",
    imageUrl: "/plants/succulent.jpg",
    waterDemand: "Минимальный полив",
    sunDemand: "Яркий свет",
    size: "Маленький",
    owner: "Дмитрий Иванов",
    location: "Новосибирск"
  }
];

const mockUsers = [
  {
    id: 1,
    name: "Анна Ковалева",
    email: "anna@example.com",
    location: "Москва",
    bio: "Люблю выращивать комнатные растения и делиться ими с другими.",
    dateCreated: "2023-03-15T10:30:00Z",
    profileImageUrl: "/users/anna.jpg"
  },
  {
    id: 2,
    name: "Иван Петров",
    email: "ivan@example.com",
    location: "Санкт-Петербург",
    bio: "Коллекционирую редкие виды растений.",
    dateCreated: "2023-02-10T14:20:00Z",
    profileImageUrl: "/users/ivan.jpg"
  },
  {
    id: 3,
    name: "Мария Сидорова",
    email: "maria@example.com",
    location: "Екатеринбург",
    bio: "Начинающий любитель растений, изучаю все тонкости ухода.",
    dateCreated: "2023-04-05T09:15:00Z",
    profileImageUrl: "/users/maria.jpg"
  },
  {
    id: 4,
    name: "Дмитрий Иванов",
    email: "dmitry@example.com",
    location: "Новосибирск",
    bio: "Специализируюсь на суккулентах и кактусах.",
    dateCreated: "2023-01-20T16:45:00Z",
    profileImageUrl: "/users/dmitry.jpg"
  }
];

module.exports = {
  mockPlants,
  mockUsers
};
