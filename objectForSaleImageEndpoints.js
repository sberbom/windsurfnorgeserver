import {pool} from './utils.js';
import {isAuthenticated} from './utils.js'

export const addImage = (request, response) => {
    try{
        const {object_id, small_image, big_image, user_id, token} = request.body
        if(isAuthenticated(token)){
          let query = 'INSERT INTO forsaleimages(object_id, big_image, small_image, user_id) VALUES($1, $2, $3, $4)'
          const values = [object_id, big_image, small_image, user_id]
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
}

export const getImage = (request, response) => {
    try{
        const {id} = request.body
        let query = 'SELECT * FROM forsaleimages WHERE id=$1'
        const values = [id]
        pool.query(query, values, (error, result) => {
          response.status(200).send(result.rows[0]);
        });
      }
      catch(error){
        console.error(error)
        response.status(500).send({'status': 'error'})
      }
}

export const deleteImage = (request, response) => {
    try{
        const {id, token} = request.body
        if(isAuthenticated(token)){
          let query = 'DELETE FROM forsaleimages WHERE id = $1'
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
}

export const getImages = (request, response) => {
    try{
        const {object_id} = request.body
        const query = 'SELECT * FROM forsaleimages WHERE object_id = $1;'
        const values = [object_id]
        pool.query(query, values, (error, result) => {
          response.status(200).json(result.rows)
        })
      }
    catch(error){
    console.error(error)
    response.status(500).send({'status': 'error'})
    }
}