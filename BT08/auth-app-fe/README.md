# Auth App Frontend

Frontend application for authentication using React.js and Ant Design.

## Features

- User Registration
- User Login
- Forgot Password
- User Logout
- Protected Routes
- JWT Token Management

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update API URL in `src/services/api.js` if needed

3. Run the development server:

```bash
npm run dev
```

4. Open browser at http://localhost:3000

## Tech Stack

- React 18
- Ant Design 5
- React Router 6
- Axios
- Vite

# RUN: 
docker run -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.14.0