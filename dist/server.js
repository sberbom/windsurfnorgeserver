const express = require('express');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const app = express();
const port = 3000;
var jsonParser = bodyParser.json();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'windsurfNorge',
    password: 'Stjernen1',
    port: 5432,
});
// app.get('/spots', (req, res) => {
//     const query = 'SELECT * FROM spots'
//   })
app.listen(port, () => {
    console.log(`Windsurf Norge Server is listening at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map