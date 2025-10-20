# 🎬 Movie Streaming Platform

A full-stack movie streaming platform backend with MongoDB, featuring advanced search functionality, user watch history tracking, and movie reviews.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Search Algorithm](#search-algorithm)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

- **Hybrid Search System**: Advanced movie search with fuzzy matching and weighted ranking
- **Trending Movies**: MongoDB aggregation pipeline showing top 5 most-watched movies (last 30 days)
- **User Watch History**: Track user viewing patterns with detailed statistics
- **Movie Reviews**: User-generated ratings and reviews with statistics
- **Clean UI**: Modern, responsive frontend with dark theme
- **RESTful API**: Well-structured API endpoints with proper error handling
- **Data Validation**: Input validation and sanitization using express-validator
- **Pagination**: Efficient data loading with pagination support

---

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose ODM
- String-similarity (for fuzzy matching)
- Express-validator (input validation)

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for HTTP requests
- Responsive grid layout

**Data Processing:**
- CSV Parser for TMDB dataset
- Custom data processing scripts

---

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher) - Running locally or MongoDB Atlas
- **npm** (Node Package Manager)
- **TMDB Dataset** (CSV file already included in project)

---

## 🚀 Installation

### Step 1: Clone or Navigate to Project

```bash
cd /Users/saadanjum/Desktop/Projects/ali-project2
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- dotenv
- cors
- express-validator
- string-similarity
- csv-parser

### Step 3: Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/movie-streaming-platform

# Server Configuration
PORT=5000
NODE_ENV=development

# TMDB Configuration
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

**Note:** If using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

---

## 💾 Database Setup

### Step 1: Start MongoDB

If using local MongoDB:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Step 2: Process TMDB Dataset

The TMDB CSV file (`TMDB_movie_dataset_v11.csv`) is already in the project. Process it to generate JSON files:

```bash
npm run process-data
```

This script will:
- Read the TMDB CSV file
- Filter and transform movie data (800 movies)
- Generate sample users (30 users)
- Create watch history entries (300 entries)
- Generate movie reviews (250 reviews)
- Save processed data to `data/processed/` folder

**Output:**
```
📊 Starting dataset processing...
✅ Processed 800 movies
✅ Generated 30 users
✅ Generated 300 watch history entries
✅ Generated 250 reviews
🎉 Dataset processing complete!
```

### Step 3: Seed Database

Populate MongoDB with processed data:

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing collections
- Insert movies, users, watch history, and reviews
- Create all necessary indexes
- Display summary statistics

**Expected Output:**
```
🌱 Starting database seeding...
✅ MongoDB Connected
✅ Collections cleared
✅ Inserted 800 movies
✅ Inserted 30 users
✅ Inserted 300 watch history entries
✅ Inserted 250 reviews
🎉 Database seeding completed successfully!
```

---

## ▶️ Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on port 5000 (or your configured PORT).

**You should see:**
```
═══════════════════════════════════════
🚀 Server running on port 5000
🌐 API: http://localhost:5000/api
🎬 Frontend: http://localhost:5000
═══════════════════════════════════════
```

### Access the Application

- **Frontend**: http://localhost:5000
- **API Base**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📚 API Documentation

### Movies Endpoints

#### 1. Search Movies
```
GET /api/movies/search
```

**Query Parameters:**
- `query` (required): Search term
- `genre` (optional): Filter by genre
- `minRating` (optional): Minimum rating (0-10)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Results per page

**Example:**
```bash
GET /api/movies/search?query=inception&genre=Action&minRating=8&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "_id": "...",
        "title": "Inception",
        "releaseYear": 2010,
        "genres": ["Action", "Sci-Fi"],
        "rating": 8.8,
        "hybridScore": 0.87,
        "scoreBreakdown": {
          "text": "0.95",
          "rating": "0.88",
          "popularity": "0.75"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

#### 2. Get Trending Movies
```
GET /api/movies/trending
```

Returns top 5 most-watched movies in the last 30 days.

**Response:**
```json
{
  "success": true,
  "data": {
    "trending": [
      {
        "_id": "...",
        "title": "Movie Title",
        "watchCount": 145,
        "uniqueViewers": 98,
        "avgWatchTime": 125
      }
    ],
    "period": "Last 30 days"
  }
}
```

#### 3. Get All Movies
```
GET /api/movies
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `genre` (optional): Filter by genre
- `minRating` (optional): Minimum rating

#### 4. Get Movie by ID
```
GET /api/movies/:id
```

Returns detailed movie information including review statistics.

---

### Users Endpoints

#### 1. Get All Users
```
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john.doe@email.com",
        "subscriptionType": "premium"
      }
    ]
  }
}
```

#### 2. Get User by ID
```
GET /api/users/:id
```

#### 3. Get User Watch History
```
GET /api/users/:id/history
```

**Query Parameters:**
- `startDate` (optional): Filter from date (ISO format)
- `endDate` (optional): Filter to date (ISO format)
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "subscriptionType": "premium"
    },
    "history": [
      {
        "movie": {
          "title": "Movie Title",
          "rating": 8.5
        },
        "watchedAt": "2025-10-15T14:30:00Z",
        "duration": 120,
        "completionPercentage": 85
      }
    ],
    "stats": {
      "totalMoviesWatched": 45,
      "totalWatchTime": 5400,
      "favoriteGenre": "Action"
    }
  }
}
```

#### 4. Create New User
```
POST /api/users
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@email.com",
  "subscriptionType": "premium"
}
```

---

### Reviews Endpoints

#### 1. Get Movie Reviews
```
GET /api/movies/:id/reviews
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

#### 2. Create Review
```
POST /api/movies/:id/reviews
```

**Body:**
```json
{
  "userId": "user_id_here",
  "rating": 9,
  "reviewText": "Amazing movie! Highly recommend."
}
```

#### 3. Get Review Statistics
```
GET /api/movies/:id/reviews/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": "8.5",
    "totalReviews": 234,
    "ratingDistribution": {
      "10": 45,
      "9": 78,
      "8": 56,
      "7": 32,
      "6": 15,
      "5": 5,
      "4": 2,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

#### 4. Mark Review as Helpful
```
PATCH /api/reviews/:id/helpful
```

---

## 🔍 Search Algorithm

The platform uses a **Hybrid Ranking System** that combines multiple factors:

### Formula

```
finalScore = (textScore × 0.5) + (ratingScore × 0.3) + (popularityScore × 0.2)
```

### Components

1. **Text Similarity (50% weight)**
   - Uses string-similarity library for fuzzy matching
   - Compares search query against: title, director, cast names
   - Handles typos and partial matches
   - Threshold: 0.6 similarity score

2. **Rating Score (30% weight)**
   - Normalized movie rating (0-1 range)
   - Based on TMDB vote average
   - Higher-rated movies rank better

3. **Popularity Score (20% weight)**
   - Based on watch count
   - Normalized to 0-1 range (max: 1000 views)
   - Trending movies rank higher

### Implementation

The search performs:
1. MongoDB text search on indexed fields
2. Fallback regex search if few results
3. Apply genre and rating filters
4. Calculate hybrid score for each result
5. Sort by final score descending
6. Return paginated results

### Example

Search query: "nolan" with minRating: 8

```javascript
Movie: "The Dark Knight"
- Text Score: 0.85 (director match)
- Rating Score: 0.90 (rating: 9.0/10)
- Popularity Score: 0.75 (750 views)
- Final Score: 0.835 (83.5%)
```

---

## 🗄️ Database Schema

### Collections Overview

```
movie-streaming-platform/
├── movies
├── users
├── watchhistories
└── reviews
```

### 1. Movies Collection

```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  releaseYear: Number,
  genres: [String],
  cast: [{
    name: String,
    role: String
  }],
  director: String (indexed),
  rating: Number (0-10),
  posterUrl: String,
  description: String,
  watchCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index: `{title: 'text', director: 'text', 'cast.name': 'text'}`
- Compound index: `{rating: -1, watchCount: -1}`

### 2. Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  subscriptionType: Enum ['free', 'premium', 'vip'],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index: `{email: 1}`

### 3. WatchHistory Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  movieId: ObjectId (ref: Movie),
  timestamp: Date,
  watchDuration: Number (minutes),
  completionPercentage: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Compound index: `{userId: 1, timestamp: -1}`
- Compound index: `{movieId: 1, timestamp: -1}`

### 4. Reviews Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  movieId: ObjectId (ref: Movie),
  rating: Number (1-10, required),
  reviewText: String (max: 1000 chars),
  helpful: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Compound index: `{movieId: 1, createdAt: -1}`
- Unique compound index: `{userId: 1, movieId: 1}`

### Relationships

```
User 1---* WatchHistory *---1 Movie
User 1---* Review *---1 Movie
```

---

## 📁 Project Structure

```
movie-streaming-platform/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── seed.js              # Database seeding script
│   ├── models/
│   │   ├── Movie.js             # Movie schema
│   │   ├── User.js              # User schema
│   │   ├── WatchHistory.js      # Watch history schema
│   │   └── Review.js            # Review schema
│   ├── routes/
│   │   ├── movies.js            # Movie routes
│   │   ├── users.js             # User routes
│   │   └── reviews.js           # Review routes
│   ├── controllers/
│   │   ├── movieController.js   # Movie business logic
│   │   ├── userController.js    # User business logic
│   │   └── reviewController.js  # Review business logic
│   ├── services/
│   │   └── searchService.js     # Search algorithm
│   ├── utils/
│   │   ├── errorHandler.js      # Error handling
│   │   └── validators.js        # Input validation
│   ├── scripts/
│   │   └── processDataset.js    # CSV processing
│   └── app.js                   # Express app setup
├── data/
│   ├── processed/               # Processed JSON files
│   │   ├── movies.json
│   │   ├── users.json
│   │   ├── watchHistory.json
│   │   └── reviews.json
│   └── TMDB_movie_dataset_v11.csv
├── public/
│   ├── index.html               # Frontend HTML
│   ├── styles.css               # Frontend styles
│   └── script.js                # Frontend JavaScript
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 📸 Screenshots

### 1. Search Interface
The main search page with filters for genre and rating.

### 2. Search Results
Grid display of movies with hybrid ranking scores.

### 3. Trending Movies
Top 5 most-watched movies with view statistics.

### 4. User Watch History
Detailed viewing history with statistics.

### 5. Movie Details Modal
Complete movie information with cast and reviews.

### 6. Reviews Section
User reviews with ratings and helpful counts.

---

## 🚀 Future Enhancements

### Planned Features

1. **User Authentication**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Session management

2. **Watchlist Functionality**
   - Save movies to watch later
   - Organize into custom lists

3. **Advanced Recommendations**
   - Machine learning-based suggestions
   - Collaborative filtering
   - Genre-based recommendations

4. **Social Features**
   - Follow other users
   - Share reviews
   - Comment on reviews

5. **Admin Dashboard**
   - Manage movies and users
   - Analytics and insights
   - Content moderation

6. **Video Streaming**
   - Integrate video player
   - Support for multiple quality levels
   - Resume playback feature

7. **Advanced Search**
   - Filter by year range
   - Sort by multiple criteria
   - Advanced text search operators

8. **Export Features**
   - Export watch history as CSV
   - Download user data (GDPR compliance)

9. **Mobile App**
   - React Native or Flutter app
   - Native mobile experience

10. **Performance Optimizations**
    - Redis caching for trending movies
    - CDN for static assets
    - Database query optimization

---

## 📝 Notes

- The dataset contains 800 movies from TMDB
- All timestamps are in UTC
- Image URLs are from TMDB (requires internet connection)
- Search is case-insensitive
- One user can only review a movie once
- Reviews cannot be edited (only created)

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you see `MongoNetworkError`:
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use

If port 5000 is busy:
```bash
# Change PORT in .env file
PORT=3000
```

### CSV Processing Fails

Ensure the CSV file exists:
```bash
ls -la TMDB_movie_dataset_v11.csv
```

### No Movies Appearing

Re-run the seed script:
```bash
npm run seed
```

---

## 👨‍💻 Development

### Running Tests

```bash
npm test
```

### Code Quality

The codebase follows these principles:
- Clear, descriptive naming
- Modular architecture
- Error handling on all async operations
- Input validation
- RESTful API design
- DRY (Don't Repeat Yourself)

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- TMDB for the movie dataset
- MongoDB documentation
- Express.js community
- String-similarity library

---

**Built with ❤️ for learning MongoDB and full-stack development**

