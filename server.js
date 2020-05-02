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
    const values = req.body.values;

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

app.post('/readOne', function (req, res) {
    const table = req.body.table;
    const values = req.body.values;
    let where = createWhere(table, values);

    const textQuery = "SELECT * FROM " + table + where;
    console.log(textQuery);
    //TODO vérification du token
    database.queryDB(textQuery, res);
});

app.post('/deleteOne', function (req, res) {
    const table = req.body.table;
    const values = req.body.values;
    let where = createWhere(table, values);

    const textQuery = "DELETE FROM " + table + where;
    console.log(textQuery);
    //TODO vérification du token
    database.queryDB(textQuery, res);
});

function createWhere(table, values) {
    if(table.localeCompare('win', 'en', {sensitivity: 'base'}) === 0 || table.localeCompare('apply', 'en', {sensitivity: 'base'}) === 0){ // faire un strcompare
        let primaryKeys = [];
        let prop='';
        let counter = 0;
        for (prop in values){
            if(prop.indexOf('id') >= 0){
                primaryKeys[counter] = prop + "=" + values[prop];
                counter++;
            }
        }
        return " WHERE " + primaryKeys[0] + " AND " + primaryKeys[1];
    } else {
        return " WHERE id=" + values.id;
    }
}


