# 🚀 Quick Setup Guide

Follow these steps to get the movie streaming platform running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start MongoDB

Make sure MongoDB is running on your system.

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Or check if it's already running:**
```bash
brew services list
```

## Step 3: Process the Dataset

Transform the TMDB CSV into usable JSON files:

```bash
npm run process-data
```

**Expected output:**
- ✅ Processed 800 movies
- ✅ Generated 30 users
- ✅ Generated 300 watch history entries
- ✅ Generated 250 reviews

This creates JSON files in `data/processed/` folder.

## Step 4: Seed the Database

Populate MongoDB with the processed data:

```bash
npm run seed
```

**Expected output:**
- ✅ MongoDB Connected
- ✅ Inserted 800 movies
- ✅ Inserted 30 users
- ✅ Inserted 300 watch history entries
- ✅ Inserted 250 reviews

## Step 5: Start the Server

```bash
npm run dev
```

**You should see:**
```
═══════════════════════════════════════
🚀 Server running on port 5000
🌐 API: http://localhost:5000/api
🎬 Frontend: http://localhost:5000
═══════════════════════════════════════
```

## Step 6: Access the Application

Open your browser and visit:

**http://localhost:5000**

---

## ✅ Verification Checklist

- [ ] Dependencies installed (node_modules folder exists)
- [ ] MongoDB is running
- [ ] Processed data files exist in `data/processed/`
- [ ] Database is seeded (check MongoDB Compass or shell)
- [ ] Server is running on port 5000
- [ ] Frontend loads in browser
- [ ] Can search for movies
- [ ] Can view trending movies
- [ ] Can select a user and see history

---

## 🐛 Common Issues

### Issue: MongoDB connection error

**Solution:**
```bash
# Check MongoDB status
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Issue: Port 5000 already in use

**Solution:**
Edit `.env` file and change PORT to another number:
```
PORT=3000
```

### Issue: CSV file not found

**Solution:**
Make sure `TMDB_movie_dataset_v11.csv` is in the root directory:
```bash
ls -la TMDB_movie_dataset_v11.csv
```

### Issue: No movies showing in frontend

**Solution:**
Re-run the seed script:
```bash
npm run seed
```

---

## 📝 Quick Commands Reference

```bash
# Install dependencies
npm install

# Process CSV dataset
npm run process-data

# Seed database
npm run seed

# Run development server
npm run dev

# Run production server
npm start
```

---

## 🎯 Next Steps

1. Explore the search functionality
2. Check trending movies
3. Select a user and view their watch history
4. Click on a movie to see details and reviews
5. Submit a review for a movie

---

## 📞 Need Help?

Refer to the main README.md for:
- Complete API documentation
- Database schema details
- Search algorithm explanation
- Troubleshooting guide

---

**Happy coding! 🎬**

