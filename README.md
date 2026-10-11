# Health Hub – MongoDB setup

## 1. Install MongoDB
Either:
- **Local:** install MongoDB Community Server and make sure `mongod` is running, or
- **Cloud:** create a free cluster on MongoDB Atlas and copy its connection string.

## 2. Configure
```
cd backend
copy .env.example .env      (Windows)   |   cp .env.example .env   (Mac/Linux)
```
Edit `MONGODB_URI` in `.env` if you use Atlas or a different local address.
Default: `mongodb://127.0.0.1:27017/healthhub`

## 3. Run
```
cd backend
npm install
npm start
```
Open http://localhost:3000

## What is stored in MongoDB (database `healthhub`)
| Collection | Filled by            | Fields                                   |
|------------|----------------------|------------------------------------------|
| `users`    | signup.html          | name, email (unique), phone, password (bcrypt hash), timestamps |
| `contacts` | contact.html         | name, email, message, timestamps         |

Login (login.html) now checks email + password against the `users` collection.
`users.csv` is no longer used.

## Front-end design
All pages share `frontend/assets/style.css` (design tokens, layout, components) and
`frontend/assets/site.js` (dropdown menus, date pickers). Headings use Young Serif and body
text uses Public Sans, loaded from Google Fonts. To change the look site-wide, edit the
colour and font variables at the top of `style.css`.
