# Dead-or-Alive 🎯

A full-stack guessing game built with **Express (Node.js)** for the backend and **React (Vite)** for the frontend.  
Players try to guess a 4-digit number with feedback on “dead” (correct digit + position) and “injured” (correct digit, wrong position).

---

## 🚀 Features
- Express backend with MongoDB (Mongoose)
- React (Vite) frontend
- REST API endpoints for submitting guesses and viewing results
- MongoDB Atlas database connection
- CORS enabled for frontend-backend communication

---

## 🛠️ Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/Dot2n/Dead-or-Alive.git
cd deadOrALlive

```
### 2. Backend setup (root folder)
```bash
npm install
```

### Create a .env file in the root folder:
```env
MONGO_URI=your-mongodb-atlas-connection
PORT=3000
```
### Start backend:
```bash
npm run dev
```
### 3. Frontend setup (inside myReactApp)
```bash
cd my-react-app
npm install
```


### Create a .env file in the myReactApp folder:
```env
VITE_API_URL=http://localhost:3000
```

### Start frontend:
```bash
npm run dev

```
-----------

### Rules & Gameplay

Dead → A guessed digit is correct and in the correct position.
Example:

Computer: 1234
You:      7290
Result:   1 dead (the digit "2" is in the correct spot)

Injured → A guessed digit exists but is in the wrong position.
Example:

Computer: 1234
You:      2098
Result:   1 injured (the digit "2" exists but is in the wrong spot)

Reset Button → Resets the game completely, generating a new computer guess.

Submit Button → Only appears when you’ve entered 4 different digits. Submits your guess to the backend.

-----------

### 📊 Results Display

Each guess appears in a table with its corresponding Dead and Injured counts.

Newer guesses are shown on top, while older guesses move down the list.

Layout adapts depending on screen size (side-by-side on desktop, stacked on mobile).

