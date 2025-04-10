
import { Exchange } from "../types/exchange";

export const mockExchanges: Exchange[] = [
  {
    id: 1,
    senderId: 1,
    senderName: "Анна Петрова",
    receiverId: 2,
    receiverName: "Иван Смирнов",
    status: "pending",
    startDate: "2025-03-15T10:30:00",
    endDate: null,
    senderPlants: [
      {
        id: 1,
        name: "Монстера Деликатесная",
        imageUrl: "/images/plants/monstera.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 2,
    senderId: 3,
    senderName: "Екатерина Иванова",
    receiverId: 1,
    receiverName: "Анна Петрова",
    status: "completed",
    startDate: "2025-02-10T14:15:00",
    endDate: "2025-02-20T09:45:00",
    senderPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 2,
        name: "Сансевиерия",
        imageUrl: "/images/plants/sansevieria.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 3,
    senderId: 1,
    senderName: "Анна Петрова",
    receiverId: 4,
    receiverName: "Алексей Козлов",
    status: "canceled",
    startDate: "2025-01-05T11:20:00",
    endDate: "2025-01-12T16:30:00",
    senderPlants: [
      {
        id: 7,
        name: "Алоэ Вера",
        imageUrl: "/images/plants/aloe.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: []
  },
  {
    id: 4,
    senderId: 2,
    senderName: "Иван Смирнов",
    receiverId: 5,
    receiverName: "Мария Соколова",
    status: "completed",
    startDate: "2025-03-01T09:45:00",
    endDate: "2025-03-10T15:20:00",
    senderPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 8,
        name: "Пеперомия",
        imageUrl: "/images/plants/peperomia.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 5,
    senderId: 5,
    senderName: "Мария Соколова",
    receiverId: 3,
    receiverName: "Екатерина Иванова",
    status: "completed",
    startDate: "2025-01-20T16:30:00",
    endDate: "2025-01-28T11:15:00",
    senderPlants: [
      {
        id: 10,
        name: "Суккулент Эхеверия",
        imageUrl: "/images/plants/echeveria.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 6,
    senderId: 4,
    senderName: "Алексей Козлов",
    receiverId: 1,
    receiverName: "Анна Петрова",
    status: "pending",
    startDate: "2025-03-05T14:20:00",
    endDate: null,
    senderPlants: [
      {
        id: 12,
        name: "Строманта Триостар",
        imageUrl: "/images/plants/stromanthe.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 1,
        name: "Монстера Деликатесная",
        imageUrl: "/images/plants/monstera.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 7,
    senderId: 6,
    senderName: "Дмитрий Новиков",
    receiverId: 2,
    receiverName: "Иван Смирнов",
    status: "canceled",
    startDate: "2024-12-10T10:15:00",
    endDate: "2024-12-15T09:30:00",
    senderPlants: [
      {
        id: 14,
        name: "Бегония Макулата",
        imageUrl: "/images/plants/begonia.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 8,
    senderId: 3,
    senderName: "Екатерина Иванова",
    receiverId: 6,
    receiverName: "Дмитрий Новиков",
    status: "completed",
    startDate: "2024-11-25T13:40:00",
    endDate: "2024-12-05T16:10:00",
    senderPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 15,
        name: "Замиокулькас",
        imageUrl: "/images/plants/zamioculcas.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 9,
    senderId: 5,
    senderName: "Мария Соколова",
    receiverId: 4,
    receiverName: "Алексей Козлов",
    status: "pending",
    startDate: "2025-02-20T11:05:00",
    endDate: null,
    senderPlants: [
      {
        id: 8,
        name: "Пеперомия",
        imageUrl: "/images/plants/peperomia.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 12,
        name: "Строманта Триостар",
        imageUrl: "/images/plants/stromanthe.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 10,
    senderId: 2,
    senderName: "Иван Смирнов",
    receiverId: 3,
    receiverName: "Екатерина Иванова",
    status: "completed",
    startDate: "2024-10-15T09:30:00",
    endDate: "2024-10-25T14:45:00",
    senderPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "sent"
      },
      {
        id: 19,
        name: "Спатифиллум",
        imageUrl: "/images/plants/spathiphyllum.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 11,
    senderId: 1,
    senderName: "Анна Петрова",
    receiverId: 5,
    receiverName: "Мария Соколова",
    status: "canceled",
    startDate: "2025-02-25T15:30:00",
    endDate: "2025-03-02T10:20:00",
    senderPlants: [
      {
        id: 1,
        name: "Монстера Деликатесная",
        imageUrl: "/images/plants/monstera.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 8,
        name: "Пеперомия",
        imageUrl: "/images/plants/peperomia.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 12,
    senderId: 6,
    senderName: "Дмитрий Новиков",
    receiverId: 1,
    receiverName: "Анна Петрова",
    status: "completed",
    startDate: "2024-11-05T10:15:00",
    endDate: "2024-11-15T14:30:00",
    senderPlants: [
      {
        id: 15,
        name: "Замиокулькас",
        imageUrl: "/images/plants/zamioculcas.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 1,
        name: "Монстера Деликатесная",
        imageUrl: "/images/plants/monstera.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 13,
    senderId: 2,
    senderName: "Иван Смирнов",
    receiverId: 4,
    receiverName: "Алексей Козлов",
    status: "completed",
    startDate: "2024-12-18T13:20:00",
    endDate: "2024-12-28T09:15:00",
    senderPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 7,
        name: "Алоэ Вера",
        imageUrl: "/images/plants/aloe.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 14,
    senderId: 5,
    senderName: "Мария Соколова",
    receiverId: 6,
    receiverName: "Дмитрий Новиков",
    status: "pending",
    startDate: "2025-03-10T09:00:00",
    endDate: null,
    senderPlants: [
      {
        id: 8,
        name: "Пеперомия",
        imageUrl: "/images/plants/peperomia.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 14,
        name: "Бегония Макулата",
        imageUrl: "/images/plants/begonia.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 15,
    senderId: 3,
    senderName: "Екатерина Иванова",
    receiverId: 2,
    receiverName: "Иван Смирнов",
    status: "completed",
    startDate: "2025-01-08T11:45:00",
    endDate: "2025-01-20T16:30:00",
    senderPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 3,
        name: "Фикус Лирата",
        imageUrl: "/images/plants/ficus.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 16,
    senderId: 4,
    senderName: "Алексей Козлов",
    receiverId: 3,
    receiverName: "Екатерина Иванова",
    status: "canceled",
    startDate: "2025-01-15T14:30:00",
    endDate: "2025-01-18T10:20:00",
    senderPlants: [
      {
        id: 12,
        name: "Строманта Триостар",
        imageUrl: "/images/plants/stromanthe.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 5,
        name: "Калатея Орбифолия",
        imageUrl: "/images/plants/calathea.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 17,
    senderId: 1,
    senderName: "Анна Петрова",
    receiverId: 6,
    receiverName: "Дмитрий Новиков",
    status: "completed",
    startDate: "2024-11-15T10:00:00",
    endDate: "2024-11-25T14:15:00",
    senderPlants: [
      {
        id: 1,
        name: "Монстера Деликатесная",
        imageUrl: "/images/plants/monstera.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 14,
        name: "Бегония Макулата",
        imageUrl: "/images/plants/begonia.jpg",
        direction: "received"
      }
    ]
  },
  {
    id: 18,
    senderId: 6,
    senderName: "Дмитрий Новиков",
    receiverId: 5,
    receiverName: "Мария Соколова",
    status: "completed",
    startDate: "2025-02-05T13:30:00",
    endDate: "2025-02-15T09:45:00",
    senderPlants: [
      {
        id: 14,
        name: "Бегония Макулата",
        imageUrl: "/images/plants/begonia.jpg",
        direction: "sent"
      }
    ],
    receiverPlants: [
      {
        id: 10,
        name: "Суккулент Эхеверия",
        imageUrl: "/images/plants/echeveria.jpg",
        direction: "received"
      }
    ]
  }
];
