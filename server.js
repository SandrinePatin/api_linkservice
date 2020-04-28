const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const database = require('./db_connection');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;

// Algorithme des fonctions de l'API
// vérifier que le token est bon
// faire une requête
// retourner le résultat
//
// Implique
// faire une fonction d'authentification

app.use(express.json());

(async () => {
    app.listen(PORT, function () {
        console.log('App is listening...');
    });
    // await client.close() // should be done when the server is going down
})();


app.post('/create', async function (req, res) {
    const table = req.body.table;

    console.log(req.body.values.name);
    res.send("gateau");
});

app.post('/readAll', function (req, res) {
    const table = req.body.table;
    const textQuery = "SELECT * FROM " + table;
    console.log(textQuery);
    //TODO vérification du token
    database.queryDB(textQuery, res);
});
