import * as spotImage from './spotImageEndpoints.js'

import {addSpot, deleteSpot, editSpot, getAllSpots, getSpot, restoreSpot, updateMainImage, updateRating} from './spotEndpoints.js'
// import * as forSaleImage from './objectForSaleImageEndpoints.js'
import {addUser, getUser, getUserImages, getUserSpots, getUsers} from './userEndpoints.js'

import admin from'firebase-admin'
import bodyParser from 'body-parser'
import cors from 'cors';
import express from 'express'
import {firebaseConfig} from './utils.js'

// import {getObjectsForSale, getObjectForSale, addObjectForSale, editObjectForSale} from './objectsForSaleEndpoint.js'

const app = express()
app.use(cors({
  origin: '*'
}));
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
app.post('/addImage', jsonParser, (request, response) => spotImage.addImage(request, response));
app.post('/getImage', jsonParser, (request, response) => spotImage.getImage(request, response));
app.delete('/deleteImage', jsonParser, (request, response) => spotImage.deleteImage(request, response));
app.post('/images', jsonParser, (request, response) => spotImage.getImages(request, response));

//Users
app.post('/getUser', jsonParser, (request, response) => getUser(request, response));
app.post('/addUser', jsonParser, (request, response) => addUser(request, response));
app.post('/getUsers', (request, response) => getUsers(request, response));
app.post('/getUserSpots', jsonParser, (request, response) => getUserSpots(request, response));
app.post('/getUserImages', jsonParser, (request, response) => getUserImages(request, response));

// //Forsale images
// app.post('/addForSaleImage', jsonParser, (request, response) => forSaleImage.addImage(request, response));
// app.post('/getForSaleImage', jsonParser, (request, response) => forSaleImage.getImage(request, response));
// app.delete('/deleteForSaleImage', jsonParser, (request, response) => forSaleImage.deleteImage(request, response));
// app.post('/forSaleImages', jsonParser, (request, response) => forSaleImage.getImages(request, response));

// //For sale objects
// app.post('/addForSaleObject', jsonParser, (request, response) => addObjectForSale(request, response));
// app.post('/getForSaleObject', jsonParser, (request, response) => getObjectForSale(request, response));
// app.post('/getForSaleObjects', jsonParser, (request, response) => getObjectsForSale(request, response));
// app.post('/editForSaleObject', jsonParser, (request, response) => editObjectForSale(request, response));

app.listen(port, () => {
  admin.initializeApp(firebaseConfig);
  console.log(`Windsurfnorge server listening at ${port}`)
})




