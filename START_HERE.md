# 🎬 Movie Streaming Platform - START HERE

Welcome! Follow these simple steps to run the project.

---

## 🚀 Quick Start (4 Commands)

```bash
# 1. Install packages
npm install

# 2. Process the CSV dataset
npm run process-data

# 3. Seed the database
npm run seed

# 4. Start the server
npm run dev
```

Then open: **http://localhost:5000**

---

## ⚠️ Before You Start

Make sure MongoDB is running:

```bash
# Check if MongoDB is running
brew services list

# If not running, start it
brew services start mongodb-community
```

---

## 📝 What Each Command Does

### `npm install`
Installs all dependencies (Express, Mongoose, etc.)

### `npm run process-data`
Transforms the TMDB CSV into JSON files:
- 800 movies
- 30 users
- 300 watch history entries
- 250 reviews

### `npm run seed`
Loads the JSON data into MongoDB collections

### `npm run dev`
Starts the Express server with auto-reload

---

## ✅ Verification

After running all commands, you should see:

```
═══════════════════════════════════════
🚀 Server running on port 5000
🌐 API: http://localhost:5000/api
🎬 Frontend: http://localhost:5000
═══════════════════════════════════════
```

---

## 🎯 Features to Try

1. **Search Movies**: Type "action" in the search box
2. **Trending Tab**: View top 5 movies this month
3. **History Tab**: Select a user to see their watch history
4. **Movie Details**: Click any movie card to see details and reviews
5. **Add Review**: Submit your own movie review

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **EXECUTION_CHECKLIST.md** - Complete testing checklist
- **README.md** - Full project documentation
- **tests/api.test.js** - API testing guide

---

## 🐛 Common Issues

**Problem: MongoDB connection error**
```bash
brew services restart mongodb-community
```

**Problem: Port 5000 busy**
Edit `.env` file, change `PORT=5000` to `PORT=3000`

**Problem: No movies showing**
```bash
npm run seed
```

---

## 🎓 For Your Viva

Key points to explain:
- **Hybrid search** combines text matching, ratings, and popularity
- **Aggregation pipeline** calculates trending movies
- **MongoDB indexes** optimize search performance
- **RESTful API** follows best practices
- **Error handling** on all endpoints

---

## 📞 Need Help?

Check the complete documentation in **README.md**

---

**Ready? Run the 4 commands above and enjoy! 🚀**

