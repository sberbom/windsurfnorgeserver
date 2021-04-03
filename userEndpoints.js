import {pool} from './utils.js';
import {isAuthenticated} from './utils.js'

export const getUser = (request, response) => {
    try {
        const {user_email, token} = request.body;
        if(isAuthenticated(token)){
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
}

export const addUser = (request, response) => {
    try{
        const {user_email} = request.body
        const query = `INSERT INTO users(identifier) VALUES($1);`
        const values = [user_email]
        pool.query(query, values)
        response.send({'status':'ok'});
      }
      catch(error){
        console.error(error)
        response.status(500).send({'status': 'error'})
      }
}

export const getUsers = (request, response) => {
    try{
        const query = `SELECT * FROM users;`
        pool.query(query, (error, result) => {
          response.status(200).json(result.rows)
        })
      }
      catch(error){
        console.error(error)
        response.status(500).send({'status': 'error'})
      }
}

export const getUserSpots = (request, response) => {
    try {
        const {user_id, token} = request.body;
        if(isAuthenticated(token)){
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
}

export const getUserImages = (request, response) => {
    try {
        const {user_id, token} = request.body;
        if(isAuthenticated(token)){
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
        response.status(500).send({'status': 'error'})  
      }
}