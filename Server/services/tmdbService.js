const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_KEY;
    this.accessToken = process.env.TMDB_TOKEN;
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return this.formatMovieResponse(response.data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getPopularTVShows(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return this.formatTVResponse(response.data);
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          append_to_response: 'videos,credits,similar'
        }
      });
      return this.formatMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getTVShowDetails(tvId) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          append_to_response: 'videos,credits,similar'
        }
      });
      return this.formatTVDetails(response.data);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }

  async getNewestContent() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page: 1
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page: 1
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));

      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching newest content:', error);
      throw error;
    }
  }

  async getMostViewedInIsrael() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL',
            page: 1
          }
        }),
        axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL',
            page: 1
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ];

      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching most viewed in Israel:', error);
      throw error;
    }
  }

  async getTopRated() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page: 1
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page: 1
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => b.vote_average - a.vote_average);

      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      throw error;
    }
  }

  async getAnimatedContent() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            with_genres: '16', // Animation genre ID
            sort_by: 'popularity.desc',
            page: 1
          }
        }),
        axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            with_genres: '16', // Animation genre ID
            sort_by: 'popularity.desc',
            page: 1
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => b.popularity - a.popularity);

      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching animated content:', error);
      throw error;
    }
  }

  async getActionContent() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            with_genres: '28', // Action genre ID
            sort_by: 'popularity.desc',
            page: 1
          }
        }),
        axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            with_genres: '10759', // Action & Adventure genre ID for TV
            sort_by: 'popularity.desc',
            page: 1
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => b.popularity - a.popularity);

      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching action content:', error);
      throw error;
    }
  }

  async getNewestMovies() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          page: 1
        }
      });
      return this.formatResponse(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
    } catch (error) {
      console.error('Error fetching newest movies:', error);
      throw error;
    }
  }

  async getNewestTVShows(page = 1) {
    try {
      const [onAir, airingToday, popular, topRated] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/airing_today`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        })
      ]);

      const combinedResults = [
        ...onAir.data.results,
        ...airingToday.data.results,
        ...popular.data.results,
        ...topRated.data.results
      ].map(show => ({ ...show, media_type: 'tv' }));

      // Remove duplicates and sort by popularity
      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ).sort((a, b) => b.popularity - a.popularity);

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching newest TV shows:', error);
      throw error;
    }
  }

  async getMostViewedMovies() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL'
        }
      });
      return this.formatResponse(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
    } catch (error) {
      console.error('Error fetching most viewed movies:', error);
      throw error;
    }
  }

  async getMostViewedTVShows() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL'
        }
      });
      return this.formatResponse(response.data.results.map(show => ({ ...show, media_type: 'tv' })));
    } catch (error) {
      console.error('Error fetching most viewed TV shows:', error);
      throw error;
    }
  }

  async getTopRatedMovies() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          page: 1
        }
      });
      return this.formatResponse(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  async getTopRatedTVShows(page = 1) {
    try {
      const [topRated, popular, trending] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US',
            sort_by: 'vote_average.desc'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        })
      ]);

      const combinedResults = [
        ...topRated.data.results,
        ...popular.data.results,
        ...trending.data.results
      ].map(show => ({ ...show, media_type: 'tv' }));

      // Remove duplicates and sort by vote average
      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ).sort((a, b) => b.vote_average - a.vote_average);

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  }

  async getAnimatedMovies() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          with_genres: '16', // Animation genre ID
          sort_by: 'popularity.desc',
          page: 1
        }
      });
      return this.formatResponse(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
    } catch (error) {
      console.error('Error fetching animated movies:', error);
      throw error;
    }
  }

  async getActionMovies() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          with_genres: '28', // Action genre ID
          sort_by: 'popularity.desc',
          page: 1
        }
      });
      return this.formatResponse(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
    } catch (error) {
      console.error('Error fetching action movies:', error);
      throw error;
    }
  }

  async getAnimatedTVShows(page = 1) {
    try {
      const [animated, popular, trending] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US',
            with_genres: '16', // Animation genre ID
            sort_by: 'popularity.desc',
            'vote_count.gte': 50 // Lowered threshold to get more content
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        })
      ]);

      const combinedResults = [
        ...animated.data.results,
        ...popular.data.results.filter(show => 
          show.genre_ids.includes(16) // Animation genre ID
        ),
        ...trending.data.results.filter(show => 
          show.genre_ids.includes(16) // Animation genre ID
        )
      ].map(show => ({ ...show, media_type: 'tv' }));

      // Remove duplicates and sort by popularity
      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ).sort((a, b) => b.popularity - a.popularity);

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching animated TV shows:', error);
      throw error;
    }
  }

  async getActionTVShows(page = 1) {
    try {
      const [action, popular, trending] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US',
            with_genres: '10759', // Action & Adventure genre ID
            sort_by: 'popularity.desc',
            'vote_count.gte': 50 // Lowered threshold to get more content
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        })
      ]);

      const combinedResults = [
        ...action.data.results,
        ...popular.data.results.filter(show => 
          show.genre_ids.includes(10759) // Action & Adventure genre ID
        ),
        ...trending.data.results.filter(show => 
          show.genre_ids.includes(10759) // Action & Adventure genre ID
        )
      ].map(show => ({ ...show, media_type: 'tv' }));

      // Remove duplicates and sort by popularity
      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ).sort((a, b) => b.popularity - a.popularity);

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching action TV shows:', error);
      throw error;
    }
  }

  async getTrendingTVShows(page = 1) {
    try {
      const [trending, popular, topRated, onAir] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page,
            region: 'US'
          }
        })
      ]);

      const combinedResults = [
        ...trending.data.results,
        ...popular.data.results,
        ...topRated.data.results,
        ...onAir.data.results
      ].map(show => ({ ...show, media_type: 'tv' }));

      // Remove duplicates and sort by popularity
      const uniqueResults = combinedResults.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ).sort((a, b) => b.popularity - a.popularity);

      return this.formatResponse(uniqueResults);
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  }

  formatMovieResponse(data) {
    return {
      ...data,
      results: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`,
        backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        media_type: 'movie'
      }))
    };
  }

  formatTVResponse(data) {
    return {
      ...data,
      results: data.results.map(tv => ({
        id: tv.id,
        name: tv.name,
        overview: tv.overview,
        poster_path: `${TMDB_IMAGE_BASE_URL}/w500${tv.poster_path}`,
        backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${tv.backdrop_path}`,
        first_air_date: tv.first_air_date,
        vote_average: tv.vote_average,
        media_type: 'tv'
      }))
    };
  }

  formatMovieDetails(data) {
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}`,
      release_date: data.release_date,
      vote_average: data.vote_average,
      runtime: data.runtime,
      genres: data.genres,
      videos: data.videos?.results || [],
      credits: {
        cast: data.credits?.cast.slice(0, 10) || [],
        crew: data.credits?.crew.slice(0, 5) || []
      },
      similar: this.formatMovieResponse({ results: data.similar?.results || [] }).results,
      media_type: 'movie'
    };
  }

  formatTVDetails(data) {
    return {
      id: data.id,
      name: data.name,
      overview: data.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}`,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
      genres: data.genres,
      videos: data.videos?.results || [],
      credits: {
        cast: data.credits?.cast.slice(0, 10) || [],
        crew: data.credits?.crew.slice(0, 5) || []
      },
      similar: this.formatTVResponse({ results: data.similar?.results || [] }).results,
      media_type: 'tv'
    };
  }

  formatResponse(items) {
    return items.map(item => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${item.backdrop_path}`,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
      media_type: item.media_type
    }));
  }
}

module.exports = new TMDBService(); 