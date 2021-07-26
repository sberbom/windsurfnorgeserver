import {isAuthenticated} from './utils.js'
import {pool} from './utils.js';


export const getAllPosts = (request, response) => {
    try{
        const query = `SELECT forumposts.id, user_id, date, post, post_title, displayname FROM forumposts LEFT JOIN users ON forumposts.user_id = users.id;`
        pool.query(query, (error, result) => {
          response.status(200).json(result.rows)
        })
      }
      catch(error){
        console.error(error);
        response.status(500).send({'status': 'error'})

      }
}

export const addPost = (request, response) => {
    try{
        const {post, post_title, user_id, token} = request.body;
        if(isAuthenticated(token)) {
          const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
          const query = `INSERT INTO forumposts 
            (user_id, date, post, post_title) 
            VALUES ($1, $2, $3, $4);`
          const values = [user_id, time, post, post_title]
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



export const getPostComments= (request, response) => {
    try{
        const {postId} = request.body
        const query = `SELECT * FROM forumcomments LEFT JOIN users ON forumcomments.user_id = users.id WHERE forumpost_id = $1;`
        const values = [postId]
        pool.query(query, values, (error, result) => {
          response.status(200).json(result.rows)
        })
      }
      catch(error){
        console.error(error);
        response.status(500).send({'status': 'error'})

      }
}

export const addPostComment = (request, response) => {
    try{
        const {post, forumpost_id, user_id, token} = request.body;
        if(isAuthenticated(token)) {
          const time = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
          const query = `INSERT INTO forumcomments 
            (user_id, date, post, forumpost_id) 
            VALUES ($1, $2, $3, $4);`
          const values = [user_id, time, post, forumpost_id]
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