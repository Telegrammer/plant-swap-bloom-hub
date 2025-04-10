
# Plant Exchange API Server

This is the backend API server for the Plant Exchange application.

## Setup

1. Install dependencies:
```
cd server
npm install
```

2. Start the server:
```
npm run dev
```

The server will start on port 3001 and will be accessible at http://localhost:3001/api

## API Endpoints

### Plants
- GET `/api/plants` - Get all plants
- GET `/api/plants/:id` - Get a plant by ID
- POST `/api/plants` - Create a new plant
- PUT `/api/plants/:id` - Update a plant
- DELETE `/api/plants/:id` - Delete a plant
- GET `/api/users/:userId/plants` - Get plants by user ID

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get a user by ID
- GET `/api/users/me` - Get the current user
- PUT `/api/users/:id` - Update a user

### Exchanges
- GET `/api/exchanges` - Get all exchanges
- GET `/api/exchanges/:id` - Get an exchange by ID
- POST `/api/exchanges` - Create a new exchange
- PUT `/api/exchanges/:id` - Update an exchange
- PUT `/api/exchanges/:id/status` - Update an exchange status
- DELETE `/api/exchanges/:id` - Delete an exchange

## Data Structure

The server stores data in JSON files in the `data` directory.
- `exchanges.json` - Exchange data
- `plants.json` - Plant data
- `users.json` - User data
