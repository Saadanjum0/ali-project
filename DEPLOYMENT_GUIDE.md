# 🚀 Deploy Movie Streaming Platform to Railway

## Quick Deployment (Terminal Commands)

### Option 1: Automated Script
```bash
./deploy-to-railway.sh
```

### Option 2: Manual Commands

#### Step 1: Login to Railway
```bash
npx @railway/cli login
```
*This opens browser for GitHub login*

#### Step 2: Initialize Project
```bash
npx @railway/cli init
```

#### Step 3: Set Environment Variables
```bash
npx @railway/cli variables set MONGODB_URI="mongodb+srv://xaadanjum36:DLMrhMKx3CbGXYv5@cluster0.rwhnrwv.mongodb.net/movie-streaming-platform?retryWrites=true&w=majority"
```

#### Step 4: Deploy
```bash
npx @railway/cli up
```

#### Step 5: Get Your Live URL
```bash
npx @railway/cli domain
```

#### Step 6: Seed Database
```bash
npx @railway/cli run npm run seed
```

## 🎯 What Gets Deployed

✅ **Complete Movie Streaming Platform:**
- Frontend UI (HTML, CSS, JavaScript)
- Backend API (Express.js, Node.js)
- Search functionality
- User management
- Watch history
- Movie reviews
- Trending movies
- Personalized recommendations

✅ **Database:**
- MongoDB Atlas (cloud database)
- 10,000 movies from TMDB dataset
- User data and watch history
- All data stays in cloud

## 🔗 Your Live App Will Have:

- **Movie Search** with hybrid ranking
- **User Profiles** and watch history
- **Personalized Trending** movies
- **Movie Reviews** and ratings
- **Responsive UI** that works on all devices

## 📊 Data Storage:

- **No CSV files needed** - all data in MongoDB Atlas
- **10,000 movies** already processed and stored
- **Real user data** and watch patterns
- **Cloud database** - accessible from anywhere

## 🎉 After Deployment:

Your app will be live at: `https://your-app-name.railway.app`

The platform will have all 10,000 movies and full functionality!
