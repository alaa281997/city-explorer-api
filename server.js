'use strict';
require('dotenv').config();
const exp = require('express');
const server = exp();
const weatherData = require('./data/weatherData.json');
const cors = require('cors');
server.use(cors());


// const PORT = 3001;
const PORT = process.env.PORT;

// http://localhost:8000/getLoc?city_name=Amman
// http://localhost:8000/getLoc?city_name=Seattle&lon=-122.33207&lat=47.60621
server.get('/getLoc', (req, res) => {
    console.log(req.query);
    let  forecast1;
    let locNameData= req.query.city_name;
    let lat=req.query.lat;
    let lon=req.query.lon;
    let locationItem = weatherData.find(item => {
        if (item.city_name == locNameData &&item.lat==lat && item.lon==lon){
         forecast1 = new Forecast(item);
            return item
        }
    });
    res.send(forecast1)
  
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
    return { "descrbtion":low+high+' with  '+item.weather.description,"data":item.datetime};});
}
}