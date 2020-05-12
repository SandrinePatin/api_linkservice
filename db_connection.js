const mysql = require('mysql');

module.exports = {

    queryDB: function (query, res) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "linkservice"
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query(query, function (err, result, fields) {
                if (err) {
                    if (err.sqlState === "42S02") {
                        res.send("Error : Unknown table or database");
                    } else {
                        res.send(err);
                    }
                } else {
                    res.send(result);
                }

            });
            return con.result;
        });

    },

};



