import {isAuthenticated} from './utils.js'
import {pool} from './utils.js';
import { response } from 'express';

export const getWindDirections = (request, response) => {
    try{
        const {spot_id} = request.body;
        const query = `SELECT 
          sv, v, nv, n, nø, ø ,sø, s
          FROM winddirections
          WHERE spot = $1`
        const values = [spot_id]
        pool.query(query, values, (error, result) => {
            response.status(200).json(result.rows)        
        })
      }
      catch(error){
        console.error(error);
        response.status(500).send({'status': 'error'})

      }
}

export const addWindDirections = (request, response) => {
    try{
        const {sv, v, nv, n, nø, ø, sø, s, spot_id, token} = request.body;
        if(isAuthenticated(token)) {
            const query = `INSERT INTO winddirections 
            (sv, v, nv, n, nø, ø, sø, s, spot)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`
            const values = [sv, v, nv, n, nø, ø, sø, s, spot_id];
            pool.query(query, values);
            response.status(200).send({'status' : 'ok'});
        }
        else {
            response.send(401).send({'status' : 'unauthorized'});
        }
    }catch(error) {
        console.error(error);
        response.status(500).send({'status': 'error'});
    }
}


export const updateWindDirections = (request, response) => {
    try{
        const {sv, v, nv, n, nø, ø, sø, s, spot_id, token} = request.body;
        if(isAuthenticated(token)) {
            const query = `UPDATE winddirections SET 
            sv = $1, v = $2, nv = $3, n = $4, nø = $5, ø = $6, sø = $7, s = $8
            WHERE spot = $9;`
            const values = [sv, v, nv, n, nø, ø, sø, s, spot_id];
            pool.query(query, values);
            response.status(200).send({'status' : 'ok'});
        }
        else {
            response.send(401).send({'status' : 'unauthorized'});
        }
    }catch(error) {
        console.error(error);
        response.status(500).send({'status': 'error'});
    }
}