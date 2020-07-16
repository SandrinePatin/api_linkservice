const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const database = require('./db_connection');
const create = require('./create');
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
    const textQuery = create.createRequest(table, values, res);
    console.log(textQuery);
    if (table !== undefined && textQuery !== undefined) {
        //TODO vérification du token
        database.queryDB(textQuery, res);
    }
    if (table === undefined) {
        res.send("Missing Parameters : table");
    }
});

app.post('/update', function (req, res) {
    const table = req.body.table;
    const values = req.body.values;
    const where = createWhereOnPrimaryKeys(table, values);
    let prop = '';
    let counter = 0;
    let newValues = '';

    for (prop in values) {
        if (counter > 0) {
            newValues += ", ";
        }
        newValues += prop + '= "' + values[prop] + '"';
        counter++;
    }
    if (table !== undefined) {
        const textQuery = "UPDATE " + table + " SET " + newValues + where;
        console.log(textQuery);
        //TODO vérification du token
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing Parameters : table");
    }
});

app.post('/readAll', function (req, res) {
    const table = req.body.table;
    if (table !== undefined) {
        const textQuery = "SELECT * FROM " + table;
        console.log(textQuery);
        //TODO vérification du token
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing Parameters : table");
    }

});

app.post('/readOne', function (req, res) {
    const table = req.body.table;
    const values = req.body.values;
    let where = createWhereOnPrimaryKeys(table, values);

    if (where !== null && table !== undefined) {
        const textQuery = "SELECT * FROM " + table + where;
        console.log(textQuery);
        //TODO vérification du token
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }

});

app.post('/deleteOne', function (req, res) {
    console.log(req.body);
    const table = req.body.table;
    const values = req.body.values;
    let where = createWhereOnPrimaryKeys(table, values);
    console.log(where);
    if (where !== null && table !== undefined) {
        const textQuery = "DELETE FROM " + table + where;
        console.log(textQuery);
        database.queryDB(textQuery, res);
    } else {
        res.send('Missing Parameters');
    }

});

app.post('/deleteWithFilter', function (req, res) {
    console.log(req.body);
    const table = req.body.table;
    const where = req.body.values.where;
    if (where !== null && table !== undefined) {
        const textQuery = "DELETE FROM " + table + where;
        console.log(textQuery);
        database.queryDB(textQuery, res);
    } else {
        res.send('Missing Parameters');
    }

});

app.post('/readWithFilter', function (req, res) {
    const table = req.body.table;
    let where = req.body.values.where;
    if (where !== undefined) {
        const textQuery = "SELECT * FROM " + table + where;
        console.log(textQuery);
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
});

app.post('/connection', function (req, res) {
    const table = req.body.table;
    const where = createConnectionWhere(req.body.values);
    if (table !== undefined && where !== undefined) {
        const textQuery = "SELECT id FROM " + table + where;
        console.log(textQuery);
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing parameters: Need table, email and password");
    }

})

app.post('/count', function (req, res) {
    const table = req.body.table;
    let where = req.body.values.where;
    if (where !== undefined) {
        const textQuery = "SELECT COUNT(*) FROM " + table + where;
        database.queryDB(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
})

function createWhereOnPrimaryKeys(table, values) {
    let primaryKeys = [];
    let prop = '';
    let counter = 0;

    // Si la table correspond à la table "win" ou "apply"
    if (table.localeCompare('win', 'en', {sensitivity: 'base'}) === 0 || table.localeCompare('apply', 'en', {sensitivity: 'base'}) === 0) {
        for (prop in values) {
            if (prop.indexOf('id') >= 0) {
                primaryKeys[counter] = prop + '=\"' + values[prop] + '\"';
                counter++;
            }
        }
        if (primaryKeys[0] !== undefined && primaryKeys[1] !== undefined) {
            return ' WHERE ' + primaryKeys[0] + ' AND ' + primaryKeys[1];
        }
    } else {
        if (values.id !== undefined) {
            return ' WHERE id=\"' + values.id + '\"';
        }
    }
    return null;
}

function createConnectionWhere(values) {
    let email;
    let password;
    if (values.email !== undefined) {
        email = values.email;
    }
    if (values.password !== undefined) {
        password = values.password;
    }
    return ' WHERE email="' + email + '" AND password="' + password + '"';
}

app.get('/services/statut/:statutService', function (req, res) {
    let {statutService} = req.params;

    const textQuery = 'SELECT * FROM SERVICE WHERE Statut = '+ statutService;
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.get('/services/creator/:id_creator', function (req, res) {
    let {id_creator} = req.params;

    const textQuery = 'SELECT * FROM SERVICE WHERE id_creator=' + id_creator;
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);
});

app.get('/service/executor/:id_service', function (req, res) {

    let {id_service} = req.params;

    if (id_service !== undefined) {
        const textQuery = 'SELECT * FROM APPLY INNER JOIN USER WHERE execute=2 AND APPLY.id_user=USER.id AND id_service=' + id_service;
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
});

app.patch('/services/:id', function (req, res) {
    let {id} = req.params;
    let {name} = req.body;
    let {description} = req.body;
    let {date} = req.body;
    let {deadline} = req.body;
    let {access} = req.body;
    let {Statut} = req.body;

    if (id !== undefined) {
        const textQuery = {
            sql: 'UPDATE SERVICE SET `name` = ?, `description` = ?, `date` = ?, `deadline` = ?, `access` = ?, `Statut` = ? WHERE id=?',
            values: [name, description, date, deadline, access, Statut,id]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
});

app.post('/services', function (req, res) {
    let {name} = req.body;
    let {description} = req.body;
    let {date} = req.body;
    let {deadline} = req.body;
    let {cost} = req.body;
    let {profit} = req.body;
    let {access} = req.body;
    let {Statut} = req.body;
    let {id_type} = req.body;
    let {id_creator} = req.body;

    const textQuery = {
        sql: 'INSERT INTO SERVICE (`name`, `description`, `date`, `deadline`,`cost`,`profit`, `access`, `Statut`, id_type, id_creator) VALUES (?,?,?,?,?,?,?,?,?,?) ',
        values: [name, description, date, deadline, cost, profit, access, Statut, id_type,id_creator]
    };
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.get('/user/:idUser', function (req, res) {
    let {idUser} = req.params
    if (idUser !== undefined) {
        const textQuery = 'SELECT * FROM USER WHERE id=' + idUser;
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
});

app.get('/user/email/:email', function (req, res) {
    let {email} = req.params
    if (email !== undefined) {
        const textQuery = {
            sql : 'SELECT * FROM USER WHERE email=?',
            values : [email]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing Parameters");
    }
});

app.patch('/user/:id', function (req, res) {
    let {id} = req.params;
    let {name} = req.body;
    let {surname} = req.body;
    let {birthdate} = req.body;
    let {points} = req.body;
    let {type} = req.body;

    if(id){
        const textQuery = {
            sql: 'UPDATE USER SET `name`=?, `surname`=?, `birthdate`=?, `points`=?,`type`=? WHERE id = ?',
            values: [name, surname, birthdate, points, type, id]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    }
});

app.post('/user', function (req, res) {
    let {email} = req.body;
    let {password} = req.body;
    let {name} = req.body;
    let {surname} = req.body;
    let {birthdate} = req.body;
    let {points} = req.body;
    let {type} = req.body;
    let {adress} = req.body;
    let {city} = req.body;
    let {postcode} = req.body;

    const textQuery = {
        sql: 'INSERT INTO USER (`email`,`password`,`name`, `surname`, `birthdate`, `points`,`type`,`adress`,`city`,`postcode`) VALUES (?,?,?,?,?,?,?,?,?,?)',
        values: [email, password, name, surname, birthdate, points, type, adress, city, postcode]
    };
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.post('/connection/user', function (req, res) {
    const {email} = req.body;
    const {password} = req.body;

    if (email !== undefined && password !== undefined) {
        const textQuery = {
            sql: 'SELECT * FROM USER WHERE email=? AND password=?',
            values: [email, password]
        }
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing parameters: Need table, email and password");
    }

});

app.get('/typeService/active', function (req, res) {

    const textQuery = 'SELECT * FROM TYPE_SERVICE WHERE active=1';
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);
});

app.get('/typeService/:idType', function (req, res) {
    let {idType} = req.params
    const textQuery = 'SELECT * FROM TYPE_SERVICE WHERE id=' + idType;
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.post('/apply', function (req, res) {

    const {id_service} = req.body;
    const {id_user} = req.body;
    const {execute} = req.body;

    if (id_service !== undefined && id_user !== undefined) {
        const textQuery = 'INSERT INTO APPLY (`id_service`,`id_user`,`execute`) VALUES (' + id_service + ',' + id_user + ',' + execute + ')';
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing parameters");
    }

});

app.patch('/apply', function (req, res) {
    const {id_service} = req.body;
    const {id_user} = req.body;
    const {execute} = req.body;
    const {note} = req.body;
    const {commentaire} = req.body;

    if (id_service !== undefined && id_user !== undefined) {
        const textQuery = 'UPDATE APPLY SET `id_service`=' + id_service + ',`execute`=' + execute + ',`note`=' + note + ',`commentaire`="' + commentaire + '" WHERE id_service='+id_service+" AND id_user="+id_user;
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing parameters");
    }

});

app.get('/apply/:id_user', function (req, res) {
    let {id_user} = req.params
    const textQuery = 'SELECT * FROM APPLY INNER JOIN service WHERE id_service = id AND Statut>0 AND id_user=' + id_user;
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.get('/apply/service/:id_service', function (req, res) {
    let {id_service} = req.params
    const textQuery = 'SELECT * FROM APPLY INNER JOIN user WHERE id_user = id AND execute=1 AND id_service=' + id_service;
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);

});

app.get('/apply/service/user/:id_service&:id_user', function (req, res) {
    let {id_service} = req.params
    let {id_user} = req.params

    if(id_service && id_user){
        const textQuery = {
            sql : 'SELECT * FROM APPLY WHERE id_user = ? AND id_service=?',
            values : [id_user, id_service]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    } else {
        res.send("Missing parameters")
    }


});

app.get('/apply/note/:id_user&:id_type', function (req, res) {
    let {id_type} = req.params;
    let {id_user} = req.params;

    if(id_type && id_user){
        const textQuery = {
            sql: 'SELECT COALESCE(sum(note), 0) as note from APPLY INNER JOIN SERVICE ON APPLY.id_service = SERVICE.id WHERE APPLY.execute = 2 and APPLY.id_user = ? and SERVICE.id_type = ?',
            values: [id_user, id_type]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    }
});

app.get('/badges', function (req, res) {
    const textQuery = {
        sql: 'SELECT * from BADGE ORDER BY pointsLimit'
    };
    console.log(textQuery);
    database.queryDBReturnArray(textQuery, res);
});

app.get('/badges/user/:id_user', function (req, res) {
    let {id_user} = req.params;

    if(id_user){
        const textQuery = {
            sql: 'SELECT * from WIN WHERE id_user=?',
            values: [id_user]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    }
});

app.post('/win', function (req, res) {
    let {id_user} = req.body
    let {id_badge} = req.body
    console.log(req.body)
    if(id_user){
        const textQuery = {
            sql: 'INSERT INTO WIN(`id_badge`, `id_user`) VALUES (?,?)',
            values: [id_badge,id_user]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    }
});

app.get('/badge/own/:id_user&:id_type', function (req, res) {
    let {id_user} = req.params;
    let {id_type} = req.params;

    if (id_user != null && id_type != null){
        const textQuery = {
            sql: "SELECT badge.id, badge.name, badge.image, badge.pointsLimit, badge.id_type FROM `badge` INNER JOIN win ON badge.id = win.id_badge WHERE win.id_user = ? AND badge.id_type = ? HAVING badge.pointsLimit = MAX(badge.pointsLimit)",
            values: [id_user, id_type]
        };
        console.log(textQuery);
        database.queryDBReturnArray(textQuery, res);
    }
});

///SELECT badge.id, badge.name, badge.image, badge.pointsLimit, badge.id_type FROM `badge` INNER JOIN win ON badge.id = win.id_badge WHERE win.id_user = 1 AND badge.id_type = 6 HAVING badge.pointsLimit = MAX(badge.pointsLimit)