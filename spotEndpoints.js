import {isAuthenticated} from './utils.js'
import {pool} from './utils.js';

export const getAllSpots = (response) => {
    try{
        const query = `SELECT 
          spots.id, name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views, deleted, big_image, small_image, windsensor 
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
}

export const getSpot = (request, response) => {
    try{
        const {name} = request.body;
        let query = 'UPDATE spots SET views = views + 1 WHERE name = $1'
        const values = [name]
        pool.query(query, values)
    
        query = `SELECT 
          spots.id, name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views, big_image, small_image, windsensor
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
}

export const editSpot = (request, response) => {
    try{
        const {name, about, approach, facebook, main_image, lat, lng, id, current_user_id, windsensor, token} = request.body;
        if(isAuthenticated(token)){
        const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');

        let query = `INSERT INTO spotedits(spot_id, user_id, time) VALUES ($1, $2, $3)`
        let values = [id, current_user_id, time]
        pool.query(query, values);

        query = `UPDATE spots 
            SET name = $1, about = $2, approach = $3, facebook = $4, main_image = $5, lat = $6, lng = $7, windsensor = $8
            WHERE id = $9;`
        values = [name, about, approach, facebook, main_image, lat, lng, windsensor, id]
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
}

export const addSpot = (request, response) => {
    try{
        const {name, about, approach, facebook, created_by, main_image, lat, lng, token, windsensor} = request.body;
        if(isAuthenticated(token)) {
          const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
          const query = `INSERT INTO spots 
            (name, about, approach, facebook, rating, created, createdby, main_image, lat, lng, views, windsensor) 
            VALUES ($1, $2, $3, $4, NULL, $5, $6, $7, $8, $9, 0, $10);`
          const values = [name, about, approach, facebook, time, created_by, main_image, lat, lng, windsensor]
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
}

export const updateRating = async (request, response) => {
    try{
        const {rating, user_id, spot_id, token} = request.body;
        if(isAuthenticated(token)){
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
}

export const deleteSpot = (request, response) => {
    try {
        const {id,token} = request.body;
        if(isAuthenticated(token)){
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
}

export const restoreSpot = (request, response) => {
    try {
        const {id, token} = request.body;
        if(isAuthenticated(token)){
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
}

export const updateMainImage = (request, response) => {
    try{
        const {spot_id, main_image, token} = request.body
        if(isAuthenticated(token)){
          let query = 'UPDATE spots SET main_image = $1 WHERE id = $2'
          const values = [main_image, spot_id]
          pool.query(query, values)
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
}