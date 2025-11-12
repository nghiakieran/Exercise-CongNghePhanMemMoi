# BT03 - Express TypeScript CRUD Application

Dự án này là phiên bản **TypeScript** của BT02, sử dụng Express.js, MongoDB và Mongoose.

## 📋 Features

- ✅ Express.js 5.x with TypeScript
- ✅ MongoDB + Mongoose ODM
- ✅ Type-safe development
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Password encryption with bcryptjs
- ✅ EJS templating with Bootstrap 5
- ✅ Express EJS Layouts for template inheritance
- ✅ Environment configuration with dotenv

## 🚀 Installation

```bash
npm install
```

## 📝 Environment Variables

Tạo file `.env` trong thư mục gốc với nội dung:

```
PORT=6969
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/node_fulltask_mongo
DB=mongo
```

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

### Start Mode

```bash
npm start
```

### Build

```bash
npm run build
```

## 📂 Project Structure

```
src/
├── config/
│   ├── configdb.ts         # MongoDB connection
│   └── viewEngine.ts       # EJS configuration
├── controllers/
│   └── homeController.ts   # Route handlers
├── models/
│   ├── User.ts             # User schema
│   └── index.ts            # Model exports
├── routes/
│   └── web.ts              # Route definitions
├── services/
│   └── CRUDService.ts      # Business logic
├── views/
│   ├── layout.ejs          # Master layout
│   ├── crud.ejs            # Create user form
│   ├── users/
│   │   ├── findAllUser.ejs # List users
│   │   └── updateUser.ejs  # Edit user
│   └── test/
│       └── about.ejs       # About page
├── public/
│   └── css/                # Static CSS
└── server.ts               # Entry point
```

## 🔄 API Routes

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | /                | Test route                         |
| GET    | /home            | Home page (redirects to /get-crud) |
| GET    | /about           | About page                         |
| GET    | /crud            | Create user form                   |
| POST   | /post-crud       | Create new user                    |
| GET    | /get-crud        | View all users                     |
| GET    | /edit-crud?id=   | Edit user form                     |
| POST   | /put-crud        | Update user                        |
| GET    | /delete-crud?id= | Delete user                        |

## 🛠️ Technology Stack

### Backend

- **Express.js 5.x** - Web framework
- **TypeScript 5.x** - Type-safe JavaScript
- **MongoDB + Mongoose** - Database and ODM
- **bcryptjs** - Password encryption
- **body-parser** - Request parsing
- **dotenv** - Environment variables

### Frontend

- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Express EJS Layouts** - Template inheritance

## 📖 Usage

### Creating a User

1. Navigate to `/crud`
2. Fill in the form with user details
3. Click "Create User"

### Viewing All Users

- Go to `/get-crud` to see the list of all users

### Editing a User

1. On the user list page, click the "Edit" button for a user
2. Modify the information
3. Click "Save Changes"

### Deleting a User

1. On the user list page, click the "Delete" button
2. Confirm the deletion

## 🔐 Security

- Passwords are hashed using bcryptjs with salt rounds of 10
- MongoDB validates unique email addresses
- Express body-parser prevents large payloads

## 📝 Notes

- This project uses TypeScript for type safety and better development experience
- The project structure follows Express.js best practices
- All routes are protected with error handling
- EJS layouts provide consistent UI across all pages

## 👤 Author

le chi nghia

## 📄 License

ISC
