
// Mock data for plant swap application

export const mockPlants = [
  {
    id: 1,
    name: "Монстера Делициоза",
    type: "Комнатное",
    description: "Монстера Делициоза, яркое крупнолистное растение с очень эффектным расщеплением листа, отлично подходит для украшения гостиной или офиса. Неприхотлива в уходе.",
    size: "Большой",
    waterDemand: "Умеренный полив",
    sunDemand: "Полутень",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Анна Петрова",
    ownerProfileLink: "/profile/1",
    ownerEmail: "anna@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=5"
  },
  {
    id: 2,
    name: "Фикус Лирата",
    type: "Комнатное",
    description: "Фикус лирата, или фикус лировидный — неприхотливое растение для дома или офиса. Его крупные глянцевые листья в форме скрипки выделяют среди других фикусов.",
    size: "Средний",
    waterDemand: "Редкий полив",
    sunDemand: "Яркий свет",
    imageUrl: "https://images.unsplash.com/photo-1668078795524-a70a009c3fee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Иван Смирнов",
    ownerProfileLink: "/profile/2",
    ownerEmail: "ivan@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=12"
  },
  {
    id: 3,
    name: "Пilea Peperomioides",
    type: "Комнатное",
    description: "Пилея, известная также как китайское денежное дерево, очаровывает своими округлыми листьями на длинных черешках. Неприхотливое и компактное растение.",
    size: "Маленький",
    waterDemand: "Умеренный полив",
    sunDemand: "Рассеянный свет",
    imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Мария Кузнецова",
    ownerProfileLink: "/profile/3",
    ownerEmail: "maria@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=25"
  },
  {
    id: 4,
    name: "Сансевиерия",
    type: "Комнатное",
    description: "Сансевиерия или щучий хвост — суккулент с вертикально растущими жесткими листьями. Очень неприхотливое растение, отлично очищает воздух.",
    size: "Средний",
    waterDemand: "Редкий полив",
    sunDemand: "Любой свет",
    imageUrl: "https://images.unsplash.com/photo-1620803366004-c52775ddf239?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Алексей Новиков",
    ownerProfileLink: "/profile/4",
    ownerEmail: "alexey@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=30"
  },
  {
    id: 5,
    name: "Калатея Орбифолия",
    type: "Комнатное",
    description: "Калатея орбифолия отличается крупными круглыми листьями с серебристыми полосами. Требует повышенной влажности и защиты от прямых солнечных лучей.",
    size: "Средний",
    waterDemand: "Частый полив",
    sunDemand: "Полутень",
    imageUrl: "https://images.unsplash.com/photo-1632207181024-a7e5879aa2d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Екатерина Волкова",
    ownerProfileLink: "/profile/5",
    ownerEmail: "ekaterina@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=20"
  },
  {
    id: 6,
    name: "Замиокулькас",
    type: "Комнатное",
    description: "Замиокулькас или долларовое дерево — очень неприхотливое растение с глянцевыми темно-зелеными листьями. Прекрасно выживает при минимальном уходе.",
    size: "Средний",
    waterDemand: "Редкий полив",
    sunDemand: "Любой свет",
    imageUrl: "https://images.unsplash.com/photo-1632207270034-86a1723a6569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    owner: "Дмитрий Козлов",
    ownerProfileLink: "/profile/6",
    ownerEmail: "dmitry@example.com",
    ownerProfileImageUrl: "https://i.pravatar.cc/300?img=55"
  }
];

export const mockUsers = [
  {
    id: 1,
    name: "Анна Петрова",
    email: "anna@example.com",
    dateCreated: "2023-01-15",
    profileImageUrl: "https://i.pravatar.cc/300?img=5",
    location: "Москва",
    bio: "Люблю комнатные растения и делиться черенками с друзьями и единомышленниками.",
    plants: [1]
  },
  {
    id: 2,
    name: "Иван Смирнов",
    email: "ivan@example.com",
    dateCreated: "2023-02-20",
    profileImageUrl: "https://i.pravatar.cc/300?img=12",
    location: "Санкт-Петербург",
    bio: "Коллекционер редких видов суккулентов и кактусов.",
    plants: [2]
  },
  {
    id: 3,
    name: "Мария Кузнецова",
    email: "maria@example.com",
    dateCreated: "2023-03-10",
    profileImageUrl: "https://i.pravatar.cc/300?img=25",
    location: "Казань",
    bio: "Садовод-любитель с 5-летним опытом. Особенно интересуюсь тропическими растениями.",
    plants: [3]
  },
  {
    id: 4,
    name: "Алексей Новиков",
    email: "alexey@example.com",
    dateCreated: "2023-01-05",
    profileImageUrl: "https://i.pravatar.cc/300?img=30",
    location: "Новосибирск",
    bio: "Специалист по комнатным растениям. Могу помочь с советом по уходу.",
    plants: [4]
  },
  {
    id: 5,
    name: "Екатерина Волкова",
    email: "ekaterina@example.com",
    dateCreated: "2023-04-18",
    profileImageUrl: "https://i.pravatar.cc/300?img=20",
    location: "Екатеринбург",
    bio: "Выращиваю фикусы и филодендроны. Люблю пестролистные сорта.",
    plants: [5]
  }
];

export const mockExchanges = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    status: "Запрошен",
    startDate: "2023-05-10",
    endDate: null,
    plants: [
      { plantId: 1, direction: "от отправителя" }
    ],
    messages: [
      {
        id: 1,
        senderId: 1,
        text: "Привет! Мне очень нравится твой фикус. Хотел бы предложить обмен на мою монстеру.",
        date: "2023-05-10T10:30:00"
      }
    ]
  },
  {
    id: 2,
    senderId: 3,
    receiverId: 5,
    status: "Завершен",
    startDate: "2023-04-15",
    endDate: "2023-04-25",
    plants: [
      { plantId: 3, direction: "от отправителя" },
      { plantId: 5, direction: "от получателя" }
    ],
    messages: [
      {
        id: 2,
        senderId: 3,
        text: "Привет! Давай обменяемся растениями?",
        date: "2023-04-15T14:20:00"
      },
      {
        id: 3,
        senderId: 5,
        text: "Привет! Да, я согласна. Где и когда удобно встретиться?",
        date: "2023-04-15T16:45:00"
      },
      {
        id: 4,
        senderId: 3,
        text: "Отлично! Давай в субботу в центральном парке?",
        date: "2023-04-16T09:10:00"
      }
    ]
  }
];
