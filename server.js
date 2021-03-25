import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import {firebaseConfig} from './utils.js'
import admin from'firebase-admin'
import {addSpot, deleteSpot, editSpot, getAllSpots, getSpot, restoreSpot, updateMainImage, updateRating} from './spotEndpoints.js'
import {addImage, deleteImage, getImage, getImages} from './spotImageEndpoints.js'
import {getUser, getUserImages, getUsers, getUserSpots} from './userEndpoints.js'

const app = express()
app.use(cors());
const port = process.env.PORT || 3001
var jsonParser = bodyParser.json()

// Spots
app.post('/spot', jsonParser, (request, response) => getSpot(request, response));
app.delete('/spot', jsonParser, (request, response) => deleteSpot(request, response));
app.get('/spots', (request, response) => getAllSpots(response));
app.post('/editSpot', jsonParser, (request, response) => editSpot(request, response));
app.post('/addSpot', jsonParser, (request, response) => addSpot(request, response));
app.post('/rating', jsonParser, (request, response) => updateRating(request, response));
app.post('/restoreSpot', jsonParser, (request, response) => restoreSpot(request, response));
app.post('/updateMainImage', jsonParser, (request, response) => updateMainImage(request, response))

//Spot images
app.post('/addImage', jsonParser, (request, response) => addImage(request, response));
app.post('/getImage', jsonParser, (request, response) => getImage(request, response));
app.delete('/deleteImage', jsonParser, (request, response) => deleteImage(request, response));
app.post('/images', jsonParser, (request, response) => getImages(request, response));

//Users
app.post('/getUser', jsonParser, (request, response) => getUser(request, response));
app.post('/addUser', jsonParser, (request, response) => addUser(request, response));
app.post('/getUsers', (request, response) => getUsers(request, response));
app.post('/getUserSpots', jsonParser, (request, response) => getUserSpots(request, response));
app.post('/getUserImages', jsonParser, (request, response) => getUserImages(request, response));

app.listen(port, () => {
  admin.initializeApp(firebaseConfig);
  console.log(`Example app listening at http://localhost:${port}`)
})




