'use strict';
require('dotenv').config();
const exp = require('express');
const server = exp();
const weatherData = require('./data/weatherData.json');
const cors = require('cors');
server.use(cors());
const axios = require('axios');


// const PORT = 3001;
const PORT = process.env.PORT;


// http://localhost:9000/getLoc?city_name=Amman
// http://localhost:9000/getLoc?city_name=Seattle&description&lat=47.60621&lon=-122.33207
server.get('/getLoc', (req, res) => {
    console.log(req.query);
    let  forecast1;
    let locNameData= req.query.city_name;
    //let locDescData = req.query.weather.description;
   
    //https://api.weatherbit.io/v2.0/forecast/daily?city=amman&key=383a488f5c714850a43d4cbc679c201d&lat=${lat}&lon=${lon}
    //https://api.weatherbit.io/v2.0/forecast/daily?city=amman&key=383a488f5c714850a43d4cbc679c201d&lat=${lat}&lon=${lon}
   
   
    let key = process.env.WEATHER_DATA;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${locNameData}&key=${key}&lat=${lat}&lon=${lon}`;
    let lat=req.query.lat;
    let lon=req.query.lon;
    let locationItem = weatherData.find(item => {
        if(item.city_name == locNameData &&item.lat==lat && item.lon==lon){
            forecast1 = new Forecast(item);
               return item
           }
    });
    res.send(forecast1)

    try {
        axios.get(url).then(result => {
            console.log('inside promise');
           
           const forecastArr = result.data.data.map(item => {
                return new Forecast(item)
            })
            res.send(forecastArr);
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(`error in getting the photo data ==> ${error}`);
    }
});


server.get('/getmov', (req, res) => {
    console.log(req.query);
    let movieQuery = req.query;
    //let locDescData = req.query.weather.description;
  
   //http://localhost:3005/getmov?city_name=Amman&lon=35.91&lat=31.95
    //https://api.themoviedb.org/3/search/movie?api_key=7ce5a95537ee029f346cb220e2185391&query=Amman
    let key1 = process.env.MOVIE_KEY;
  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${key1}&query=${movieQuery.city_name}`;

    

    axios
    .get(movieUrl)
    .then(result => {
        const movieArr = result.data.results.map(movieS => {
            return new Movie(movieS);
        })
        res.send(movieArr);
    })
    .catch(err => {

        res.status(500).send(`Movie data related to this city is not found ${err}`);
    })
});


server.get('*', (req, res) => {
    res.status(404).send('not found');
})


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

class Forecast {
constructor (arr){
    this.Data=arr.data.map(item=>{
    let low = 'low of '+item.low_temp;
    let high='high of '+item.max_temp;
    return { "description":low+high+' with  '+item.weather.description,"data":item.datetime};});
}
}

class Movie {
    constructor(arrMovie) {
        this.title = arrMovie.original_title;
        this.overview = arrMovie.overview;
        this.average_votes = arrMovie.vote_average;
        this.total_votes = arrMovie.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500`;
        this.popularity = arrMovie.popularity;
        this.released_on = arrMovie.release_date;
        
    }
}

