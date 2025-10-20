const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const WatchHistory = require('../models/WatchHistory');
const Review = require('../models/Review');
const { AppError, catchAsync } = require('../utils/errorHandler');
const { calculateHybridScore, filterByGenre, filterByRating, paginate } = require('../services/searchService');

/**
 * Search movies with hybrid ranking
 * GET /api/movies/search
 */
exports.searchMovies = catchAsync(async (req, res) => {
  const { query, genre, minRating, page = 1, limit = 10 } = req.query;

  if (!query) {
    throw new AppError('Search query is required', 400);
  }

  // Build search query with filters integrated - STRICT matching
  const searchQuery = {
    $and: [
      // Text search - STRICT substring matching only
      {
        $or: [
          { title: new RegExp(query, 'i') },
          { director: new RegExp(query, 'i') },
          { 'cast.name': new RegExp(query, 'i') }
        ]
      }
    ]
  };

  // Add genre filter if specified
  if (genre) {
    searchQuery.$and.push({
      genres: { $in: [new RegExp(genre, 'i')] }
    });
  }

  // Add rating filter if specified
  if (minRating) {
    searchQuery.$and.push({
      rating: { $gte: parseFloat(minRating) }
    });
  }

  // Perform search with all filters
  let movies = await Movie.find(searchQuery).lean();

  // Post-process to ensure strict substring matching
  const queryLower = query.toLowerCase();
  movies = movies.filter(movie => {
    // Check if query appears in title, director, or cast names
    const titleMatch = movie.title.toLowerCase().includes(queryLower);
    const directorMatch = movie.director && movie.director.toLowerCase().includes(queryLower);
    const castMatch = movie.cast && movie.cast.some(cast => 
      cast.name && cast.name.toLowerCase().includes(queryLower)
    );
    
    return titleMatch || directorMatch || castMatch;
  });

  // Calculate hybrid scores for each movie first
  const weights = {
    similarity: 0.5,
    rating: 0.3,
    popularity: 0.2
  };

  const moviesWithScores = movies.map(movie => {
    const scores = calculateHybridScore(movie, query, weights);
    return {
      ...movie,
      hybridScore: scores.finalScore,
      scoreBreakdown: {
        text: scores.textScore.toFixed(2),
        rating: scores.ratingScore.toFixed(2),
        popularity: scores.popularityScore.toFixed(2)
      }
    };
  });

  // Sort by relevance: title matches first, then director, then cast, then by hybrid score
  moviesWithScores.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(queryLower);
    const bTitleMatch = b.title.toLowerCase().includes(queryLower);
    const aDirectorMatch = a.director && a.director.toLowerCase().includes(queryLower);
    const bDirectorMatch = b.director && b.director.toLowerCase().includes(queryLower);
    
    // Title matches get highest priority
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    
    // Then director matches
    if (aDirectorMatch && !bDirectorMatch) return -1;
    if (!aDirectorMatch && bDirectorMatch) return 1;
    
    // Then by hybrid score
    return b.hybridScore - a.hybridScore;
  });

  // Add highlighting to show what matched
  const moviesWithHighlights = moviesWithScores.map(movie => {
    const highlightedMovie = { ...movie };
    
    // Highlight title matches
    if (movie.title.toLowerCase().includes(queryLower)) {
      highlightedMovie.titleHighlighted = highlightText(movie.title, query);
    }
    
    // Highlight director matches
    if (movie.director && movie.director.toLowerCase().includes(queryLower)) {
      highlightedMovie.directorHighlighted = highlightText(movie.director, query);
    }
    
    // Highlight cast matches
    if (movie.cast && movie.cast.length > 0) {
      highlightedMovie.castHighlighted = movie.cast.map(cast => {
        if (cast.name && cast.name.toLowerCase().includes(queryLower)) {
          return {
            ...cast,
            nameHighlighted: highlightText(cast.name, query)
          };
        }
        return cast;
      });
    }
    
    return highlightedMovie;
  });

  // Apply pagination
  const result = paginate(moviesWithHighlights, page, limit);

  res.status(200).json({
    success: true,
    data: {
      movies: result.data,
      pagination: result.pagination
    }
  });
});

/**
 * Get personalized trending movies based on user's favorite genre
 * GET /api/movies/trending?userId=...
 */
exports.getTrendingMovies = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get user's favorite genre if userId is provided
  let userFavoriteGenre = null;
  let userWatchedMovies = [];
  
  if (userId) {
    // Get user's favorite genre
    const userStats = await WatchHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      { $unwind: '$movie.genres' },
      {
        $group: {
          _id: '$movie.genres',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    if (userStats.length > 0) {
      userFavoriteGenre = userStats[0]._id;
    }

    // Get movies already watched by user
    const watchedMovies = await WatchHistory.find({ userId: new mongoose.Types.ObjectId(userId) })
      .select('movieId')
      .lean();
    
    userWatchedMovies = watchedMovies.map(w => w.movieId.toString());
  }

  const trending = await WatchHistory.aggregate([
    // Stage 1: Filter last 30 days
    {
      $match: {
        timestamp: { $gte: thirtyDaysAgo }
      }
    },
    // Stage 2: Group by movie and calculate stats
    {
      $group: {
        _id: '$movieId',
        watchCount: { $sum: 1 },
        totalDuration: { $sum: '$watchDuration' },
        uniqueViewers: { $addToSet: '$userId' }
      }
    },
    // Stage 3: Lookup movie details
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: '_id',
        as: 'movie'
      }
    },
    // Stage 4: Unwind movie array
    { $unwind: '$movie' },
    // Stage 5: Add genre match score and filter out watched movies
    {
      $addFields: {
        genreMatch: {
          $cond: {
            if: { $and: [userFavoriteGenre, { $in: [userFavoriteGenre, '$movie.genres'] }] },
            then: 1,
            else: 0
          }
        },
        isWatchedByUser: {
          $cond: {
            if: { $in: [{ $toString: '$_id' }, userWatchedMovies] },
            then: 1,
            else: 0
          }
        }
      }
    },
    // Stage 6: Filter out movies already watched by user
    {
      $match: {
        isWatchedByUser: 0
      }
    },
    // Stage 7: Project fields
    {
      $project: {
        _id: '$movie._id',
        title: '$movie.title',
        posterUrl: '$movie.posterUrl',
        rating: '$movie.rating',
        genres: '$movie.genres',
        releaseYear: '$movie.releaseYear',
        watchCount: 1,
        uniqueViewers: { $size: '$uniqueViewers' },
        avgWatchTime: { 
          $round: [{ $divide: ['$totalDuration', '$watchCount'] }, 0] 
        },
        genreMatch: 1
      }
    },
    // Stage 8: Sort by genre match first, then watch count
    { 
      $sort: { 
        genreMatch: -1,
        watchCount: -1 
      } 
    },
    // Stage 9: Limit to top 5
    { $limit: 5 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      trending,
      period: 'Last 30 days',
      personalized: userId ? true : false,
      userFavoriteGenre: userFavoriteGenre,
      filteredOutWatched: userWatchedMovies.length
    }
  });
});

/**
 * Get movie by ID with reviews
 * GET /api/movies/:id
 */
exports.getMovieById = catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id).lean();

  if (!movie) {
    throw new AppError('Movie not found', 404);
  }

  // Get average rating from reviews
  const reviewStats = await Review.aggregate([
    { $match: { movieId: movie._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  movie.reviewStats = reviewStats[0] || { averageRating: 0, totalReviews: 0 };

  res.status(200).json({
    success: true,
    data: { movie }
  });
});

/**
 * Get all movies (with pagination)
 * GET /api/movies
 */
exports.getAllMovies = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, genre, minRating } = req.query;

  const filter = {};
  
  if (genre) {
    filter.genres = new RegExp(genre, 'i');
  }
  
  if (minRating) {
    filter.rating = { $gte: parseFloat(minRating) };
  }

  const skip = (page - 1) * limit;

  const movies = await Movie.find(filter)
    .sort({ rating: -1, watchCount: -1 })
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  const total = await Movie.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      movies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Helper function to highlight matching text
function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
}

module.exports = exports;