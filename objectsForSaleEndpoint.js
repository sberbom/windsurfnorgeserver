import { pool } from './utils.js';
import { isAuthenticated } from './utils.js'

export const getObjectsForSale = (request, response) => {
    try {
        const query = `SELECT * FROM objectsforsale`
        pool.query(query, (error, results) => {
            response.status(200).send(results.rows)
        })
    }
    catch (error) {
        console.error(error)
        response.status(500).send({ 'status': 'error' })
    }
}

export const getObjectForSale = (request, response) => {
    try {
        const { id } = request.body
        let query = `UPDATE objectsforsale SET views = views+1 WHERE id = $1`
        const values = [id]
        pool.query(query, values)

        query = `SELECT * FROM objectsforsale WHERE id=$1`
        pool.query(query, values, (error, results) => {
            response.status(200).send(results.rows)
        })
    }
    catch (error) {
        console.error(error)
        response.status(500).send({ 'status': 'error' })
    }
}

export const addObjectForSale = (request, response) => {
    try {
        const { name, description, price, createdby, mainimage, lat, lng } = request.body;
        if (isAuthenticated(token)) {
            const time = new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', '');
            const query = `INSERT INTO objectsforsale(name, description, price, createdby, mainimage, created, lat, lng, sold, deleted, views);`
            const values = [name, description, price, createdby, mainimage, time, lat, lng, false, false, 0]
            pool.query(query, values, (error, results) => {
                response.status(200).send(results.rows)
            })
        }
        else {
            response.status(401).send({ 'status': 'unauthorized' })
        }
    }
    catch (error) {
        console.error(error)
        response.status(500).send({ 'status': 'error' })
    }
}

//should check if is owner
export const editObjectForSale = (request, response) => {
    try {
        const { name, description, price, mainimage, lat, lng, sold, deleted, id } = request.body;
        if (isAuthenticated(token)) {
            const query = `UPDATE objectsforsale SET name = $1, description = $2, price = $3, mainimage = $4, lat = $5, lng = $6, sold=$7, deleted=$8 WHERE id=$9;`
            const values = [name, description, price, mainimage, lat, lng, sold, deleted, id]
            pool.query(query, values, (error, results) => {
                response.status(200).send(results.rows)
            })
        }
        else {
            response.status(401).send({ 'status': 'unauthorized' })
        }
    }
    catch (error) {
        console.error(error)
        response.status(500).send({ 'status': 'error' })
    }
}

