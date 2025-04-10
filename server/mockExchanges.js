
// Mock data for plant exchanges
const mockExchanges = [
  {
    id: 1,
    offeringUserId: 1,
    receivingUserId: 2,
    offeringPlantId: 1,
    receivingPlantId: 2,
    status: "completed",
    startDate: "2023-06-10T14:30:00Z",
    endDate: "2023-06-15T09:20:00Z",
    offeringUserName: "Анна Ковалева",
    receivingUserName: "Иван Петров",
    offeringPlantName: "Фикус Бенджамина",
    receivingPlantName: "Монстера Деликатесная"
  },
  {
    id: 2,
    offeringUserId: 3,
    receivingUserId: 1,
    offeringPlantId: 3,
    receivingPlantId: 4,
    status: "completed",
    startDate: "2023-07-05T10:15:00Z",
    endDate: "2023-07-10T16:40:00Z",
    offeringUserName: "Мария Сидорова",
    receivingUserName: "Анна Ковалева",
    offeringPlantName: "Спатифиллум",
    receivingPlantName: "Калатея Орбифолия"
  },
  {
    id: 3,
    offeringUserId: 2,
    receivingUserId: 4,
    offeringPlantId: 2,
    receivingPlantId: 5,
    status: "pending",
    startDate: "2023-08-20T11:30:00Z",
    offeringUserName: "Иван Петров",
    receivingUserName: "Дмитрий Иванов",
    offeringPlantName: "Монстера Деликатесная",
    receivingPlantName: "Суккулент Эхеверия"
  },
  {
    id: 4,
    offeringUserId: 4,
    receivingUserId: 3,
    offeringPlantId: 5,
    receivingPlantId: 3,
    status: "canceled",
    startDate: "2023-09-01T15:45:00Z",
    endDate: "2023-09-03T08:30:00Z",
    offeringUserName: "Дмитрий Иванов",
    receivingUserName: "Мария Сидорова",
    offeringPlantName: "Суккулент Эхеверия",
    receivingPlantName: "Спатифиллум"
  },
  {
    id: 5,
    offeringUserId: 1,
    receivingUserId: 3,
    offeringPlantId: 4,
    receivingPlantId: 3,
    status: "pending",
    startDate: "2023-10-12T13:20:00Z",
    offeringUserName: "Анна Ковалева",
    receivingUserName: "Мария Сидорова",
    offeringPlantName: "Калатея Орбифолия",
    receivingPlantName: "Спатифиллум"
  },
  {
    id: 6,
    offeringUserId: 2,
    receivingUserId: 1,
    offeringPlantId: 2,
    receivingPlantId: 1,
    status: "pending",
    startDate: "2023-11-05T09:50:00Z",
    offeringUserName: "Иван Петров",
    receivingUserName: "Анна Ковалева",
    offeringPlantName: "Монстера Деликатесная",
    receivingPlantName: "Фикус Бенджамина"
  },
  {
    id: 7,
    offeringUserId: 3,
    receivingUserId: 4,
    offeringPlantId: 3,
    receivingPlantId: 5,
    status: "completed",
    startDate: "2023-12-10T14:15:00Z",
    endDate: "2023-12-15T11:30:00Z",
    offeringUserName: "Мария Сидорова",
    receivingUserName: "Дмитрий Иванов",
    offeringPlantName: "Спатифиллум",
    receivingPlantName: "Суккулент Эхеверия"
  },
  {
    id: 8,
    offeringUserId: 4,
    receivingUserId: 2,
    offeringPlantId: 5,
    receivingPlantId: 2,
    status: "canceled",
    startDate: "2024-01-20T10:45:00Z",
    endDate: "2024-01-21T16:20:00Z",
    offeringUserName: "Дмитрий Иванов",
    receivingUserName: "Иван Петров",
    offeringPlantName: "Суккулент Эхеверия",
    receivingPlantName: "Монстера Деликатесная"
  }
];

module.exports = mockExchanges;
