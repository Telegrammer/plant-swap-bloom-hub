
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
  }
];
