const express = require('express')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const cors = require('cors');
const firebase = require('firebase/app');
require("firebase/auth");
const admin = require('firebase-admin')

const firebaseConfig = {
    apiKey: process.env.firebasekey,
    authDomain: "windsurfnorge.firebaseapp.com",
    databaseURL: "https://windsurfnorge.firebaseio.com",
    projectId: "windsurfnorge",
    storageBucket: "windsurfnorge.appspot.com",
    messagingSenderId: "40570796100",
    appId: "1:40570796100:web:1fef46f02638fc9264a411",
    measurementId: "G-2398SRG5XT"
};

const app = express()
app.use(cors());
const port = process.env.PORT || 3001
var jsonParser = bodyParser.json()


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/addSpot', jsonParser, async (request, response) => {
  try{
    const {name, about, approach, facebook, created_by, main_image, lat, lng, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized) {
      const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
      const query = `INSERT INTO spots 
        (name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views) 
        VALUES ($1, $2, $3, $4, NULL, $5, $6, $7, $8, $9, 0);`
      const values = [name, about, approach, facebook, time, created_by, main_image, lat, lng]
      pool.query(query, values);
      response.status(200).send({'status':'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error);
    response.status(500).send({'status': 'error'})
  }
});


app.post('/editSpot', jsonParser, async (request, response) => {
  try{
    const {name, about, approach, facebook, main_image, lat, lng, id, current_user_id, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');

      let query = `INSERT INTO spotedits(spot_id, user_id, time) VALUES ($1, $2, $3)`
      let values = [id, current_user_id, time]
      pool.query(query, values);

      query = `UPDATE spots 
        SET name = $1, about = $2, approach = $3, facebook = $4, main_image = $5, lat = $6, lng = $7
        WHERE id = $8;`
      values = [name, about, approach, facebook, main_image, lat, lng, id]
      pool.query(query, values);
      
      response.status(200).send({'status':'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
});

app.post('/rating', jsonParser, async (request, response) => {
  try{
    const {rating, user_id, spot_id, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      let newRating = 0;
      let query = `SELECT * FROM ratings WHERE spot_id = $1 `
      let values = [spot_id]
      const {rows} = await pool.query(query, values);

      if(rows.some(ratingRow => ratingRow.user_id === user_id)){
        query = `UPDATE ratings SET rating = $1 WHERE user_id = $2 AND spot_id = $3`
        rows.forEach(ratingRow => {
          if(ratingRow.user_id === user_id) {
            newRating += rating
          }
          else{
            newRating += ratingRow.rating
          }
        });
        newRating = newRating/rows.length    
      }
      else{
        query = `INSERT INTO ratings (rating, user_id, spot_id) VALUES($1, $2, $3)`
        if(rows.length != 0){
          rows.forEach(ratingRow => newRating += ratingRow)
          newRating += rating;
          newRating = newRating/(rows.length+1)
        }
        else{
          newRating = rating
        }
      }
      values = [rating, user_id, spot_id]
      pool.query(query,values);

      query = `UPDATE spots SET rating = $1 WHERE id = $2;`;
      values = [newRating, spot_id];
      pool.query(query,values);

      response.send({'status':'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
});

app.post('/addImage', jsonParser, async (request, response) => {
  try{
    const {spot_id, small_image, big_image, user_id, token} = request.body
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      let query = 'INSERT INTO images(spot_id, big_image, small_image, user_id) VALUES($1, $2, $3, $4)'
      const values = [spot_id, small_image, big_image, user_id]
      pool.query(query, values);

      response.send({'status':'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.post('/getImage', jsonParser, (request, response) => {
  try{
    const {id} = request.body
    let query = 'SELECT * FROM images WHERE id=$1'
    const values = [id]
    pool.query(query, values, (error, result) => {
      response.status(200).send(result.rows[0]);
    });
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
 
})

app.post('/updateMainImage', jsonParser, async (request, response) => {
  try{
    const {spot_id, main_image, token} = request.body
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      let query = 'UPDATE spots SET main_image = $1 WHERE id = $2'
      const values = [main_image, spot_id]
      pool.query(query, values, (error, result) => {
        response.status(200)
      });
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.delete('/deleteImage', jsonParser, async (request, response) => {
  try{
    const {id, token} = request.body
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      let query = 'DELETE FROM images WHERE id = $1'
      const values = [id]
      pool.query(query, values);
      response.send({'status':'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})


app.post('/spot', jsonParser, (request, response) => {
  try{
    const {name} = request.body
    let query = 'UPDATE spots SET views = views + 1 WHERE name = $1'
    const values = [name]
    pool.query(query, values)

    query = `SELECT 
      spots.id, name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views, big_image, small_image 
      FROM spots 
      LEFT JOIN images 
      ON spots.main_image = images.id
      WHERE spots.name = $1;`
    pool.query(query, values, (error, result) => {
      response.status(200).json(result.rows)
    })
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})



app.post('/images', jsonParser, (request, response) => {
  try{
    const {spot_id} = request.body
    const query = 'SELECT * FROM images WHERE spot_id = $1;'
    const values = [spot_id]
    pool.query(query, values, (error, result) => {
      response.status(200).json(result.rows)
    })
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.get('/spots', (request, response) => {
  try{
    const query = `SELECT 
      spots.id, name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views, deleted, big_image, small_image 
      FROM spots LEFT JOIN images 
      ON spots.main_image = images.id 
      WHERE spots.deleted = false
      ORDER BY views DESC;`
    pool.query(query, (error, result) => {
      response.status(200).json(result.rows)
    })
  }
  catch(error){
    console.error(error);
    response.status(500).send({'status': 'error'})

  }
})

app.delete('/spot', jsonParser, async (request, response) => {
  try {
    const {id,token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `UPDATE spots SET deleted = true WHERE id = $1`
      const values = [id]
      pool.query(query, values)
      response.send({'status': 'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.post('/restoreSpot', jsonParser, async (request, response) => {
  try {
    const {id, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `UPDATE spots SET deleted = false WHERE id = $1`
      const values = [id]
      pool.query(query, values)
      response.send({'status': 'ok'})
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.post('/getUser', jsonParser, async (request, response) => {
  try {
    const {user_email, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `SELECT * FROM users WHERE identifier=$1;`
      const values = [user_email]
      pool.query(query, values, (error, results) => {
        response.status(200).send(results.rows)
      })
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})

  }
})

app.post('/addUser', jsonParser, async (request, response) => {
  try{
    const {user_email, token} = request.body
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `INSERT INTO users(identifier) VALUES($1);`
      const values = [user_email]
      pool.query(query, values)
      response.send({'status':'ok'});
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})

  }
})

app.post('/getUsers', async (request, response) => {
  try{
    const {token} = request.body
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `SELECT * FROM users;`
      pool.query(query, (error, result) => {
        response.status(200).json(result.rows)
      })
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
  }
})

app.post('/getUserSpots', jsonParser, async (request, response) => {
  try {
    const {user_id, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `SELECT * FROM spots WHERE createdby=$1;`
      const values = [user_id]
      pool.query(query, values, (error, results) => {
        response.status(200).send(results.rows)
      })
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})  
  }
})

app.post('/getUserImages', jsonParser, async (request, response) => {
  try {
    const {user_id, token} = request.body;
    const authorized = await admin.auth().verifyIdToken(token)
    if(authorized){
      const query = `SELECT * FROM images WHERE user_id=$1;`
      const values = [user_id]
      pool.query(query, values, (error, results) => {
          response.status(200).send(results.rows)
      })
    }
    else{
      response.status(401).send({'status': 'unauthorized'})
    }
  }
  catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})  }
})


app.listen(port, () => {
  admin.initializeApp(firebaseConfig);
  console.log(`Example app listening at http://localhost:${port}`)
})




