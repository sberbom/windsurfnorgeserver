import {isAuthenticated} from './utils.js'
import {pool} from './utils.js';

export const getUser = (request, response) => {
    try {
        const {uid, token} = request.body;
        if(isAuthenticated(token)){
          const query = `SELECT * FROM users WHERE id=$1;`
          const values = [uid]
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
        const {displayName, uid} = request.body
        const query = `INSERT INTO users(id, displayname) VALUES($1, $2);`
        const values = [uid, displayName];
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

export const updateUser= (request, response) => {
    try {
        const {user, token} = request.body;
        if(isAuthenticated(token)){
          const query = `UPDATE users SET displayname = $1 WHERE id=$2;`
          const values = [user.displayname, user.uid]
          pool.query(query, values, (error, results) => { 
              response.status(200).send({"status" : "ok"})
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
