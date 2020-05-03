const mysql = require('mysql');

module.exports = {

    queryDB: function (query, res) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "linkservice"
        });

        con.connect(function(err) {
            if (err) throw err;
            con.query(query, function (err, result, fields) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result[0]);
                    if(result ===  undefined){
                        res.send("Aucune valeur");
                    } else{
                        res.send(result);
                    }
                }

            });
        });

    },

};



