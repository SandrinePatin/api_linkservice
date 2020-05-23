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
                    const data = refactorResultToJson(result);
                    res.send();
                }

            });
            return con.result;
        });

    },

};

function refactorResultToJson(result) {
    let jsonData;
    if(result.length > 1){
        jsonData = "{";
        for(let i = 0 ; i < result.length ; i++){
            jsonData += '"'+i+'" : '+JSON.stringify(result[i]);
            if(i < result.length-1){
                jsonData +=',';
            }
        }
        jsonData += '}';
    } else if (result.length === 1){
        jsonData = JSON.stringify(result[0]);
    } else {
        jsonData = "null";
    }
    return jsonData;
}

