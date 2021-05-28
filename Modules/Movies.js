const axios = require('axios');
module.exports = movieHandler;
let inMemoryMovie = {};
function movieHandler(req, res) {
    let getMovie = req.query.city;
    let key = process.env.MOVIE_KEY;


    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${getMovie}`;
    
    if (inMemoryMovie[getMovie] !== undefined) {
        response.send(inMemoryMovie[getMovie])
        console.log('New data')
    } else {
        axios
            .get(movieUrl)
            .then(result => {
                const movieArr = result.data.results.map(movieItem => {
                    return new Movie(movieItem);
                })
                res.send(movieArr);
                console.log('Data from the Memory Movie')
            })
            .catch(err => {
                res.status(500).send(`Not found ${err}`);
            })
    }
      
}
class Movie {
    constructor(item) {
        this.title = item.original_title;
        this.overview = item.overview;
        this.average_votes = item.vote_average;
        this.total_votes = item.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        this.popularity = item.popularity;
        this.released_on = item.release_date;
    }
}