//import * as forum from './forumEndpoints.js'
import * as spotImage from './spotImageEndpoints.js'
import * as windDirections from './windDirectionsEndpoints.js';

import {addSpot, deleteSpot, editSpot, getAllSpots, getSpot, restoreSpot, updateMainImage, updateRating} from './spotEndpoints.js'
// import * as forSaleImage from './objectForSaleImageEndpoints.js'
import {addUser, getUser, getUserImages, getUserSpots, getUsers, updateUser} from './userEndpoints.js'
import express, { request, response } from 'express'

import admin from'firebase-admin'
import cors from 'cors';
import {firebaseConfig} from './utils.js'

// import {getObjectsForSale, getObjectForSale, addObjectForSale, editObjectForSale} from './objectsForSaleEndpoint.js'

const app = express()
app.use(cors());
app.options('*', cors());  // enable pre-flight
app.use(express.json());
const port = process.env.PORT || 3001

// Spots
app.post('/spot', (request, response) => getSpot(request, response));
app.delete('/spot', (request, response) => deleteSpot(request, response));
app.get('/spots', (request, response) => getAllSpots(response));
app.post('/editSpot', (request, response) => editSpot(request, response));
app.post('/addSpot', (request, response) => addSpot(request, response));
app.post('/rating', (request, response) => updateRating(request, response));
app.post('/restoreSpot', (request, response) => restoreSpot(request, response));
app.post('/updateMainImage', (request, response) => updateMainImage(request, response))

//Spot images
app.post('/addImage', (request, response) => spotImage.addImage(request, response));
app.post('/getImage', (request, response) => spotImage.getImage(request, response));
app.delete('/deleteImage', (request, response) => spotImage.deleteImage(request, response));
app.post('/images', (request, response) => spotImage.getImages(request, response));
app.post('/allImages', (request, response) => spotImage.getAllImages(request, response));

//Users
app.post('/getUser', (request, response) => getUser(request, response));
app.post('/addUser', (request, response) => addUser(request, response));
app.post('/updateUser', (request, response) => updateUser(request, response));
app.post('/getUsers', (request, response) => getUsers(request, response));
app.post('/getUserSpots', (request, response) => getUserSpots(request, response));
app.post('/getUserImages', (request, response) => getUserImages(request, response));

//WindDirections
app.post('/getWindDirections', (request, response) => windDirections.getWindDirections(request, response));
app.post('/addWindDirections', (request, response) => windDirections.addWindDirections(request, response));
app.post('/updateWindDirections', (request, response) => windDirections.updateWindDirections(request, response));

//Forum
//app.post('/getPosts', (request, response) => forum.getPosts(request, response));
//app.post('/createPost', (request, response) => forum.createPost(request, response));
//app.post('/createResponse', (request, response) => forum.createResponse(request, response));

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




