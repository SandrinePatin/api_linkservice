module.exports = {

    createRequest: function (table, values, error){
        let prop = '';
        let columnsName = "(";
        let columnsValues = "(";
        let counter = 0;
        //Déterminer les colonnes indispensables
        const requiredColumns = getRequiredColumns(table);
        console.log(requiredColumns);
        //Déterminer si elles sont présentes
        for(counter = 0 ; counter < requiredColumns.length ; counter++){
            if(values.hasOwnProperty(requiredColumns[counter]) !== true){
                error = "Missing required argument";
            }
        }

        counter = 0;
        if(error === undefined){
            for (prop in values) {
                if (counter > 0) {
                    columnsName += ", ";
                    columnsValues += ", ";
                }
                columnsName += prop;
                columnsValues += '"' + values[prop] + '"';
                counter++;
            }
            columnsName += ")";
            columnsValues += ")";

            return "INSERT INTO " + table + columnsName + " VALUES " + columnsValues;
        }
    }
}

function getRequiredColumns(table){
    let allRequiredColumns = {
        "section" : "name",
        "topic" : "subject, content, creation_date, id_creator, id_section",
        "response" : "content, date, id_user, id_topic",
        "justificatif" : "contenu, type, validite, id_user",
        "badge":"name, pointsLimit, id_type",
        "type_service" : "name",
        "win" : "id_user, id_badge",
        "Service" : "name, description, date, deadline, cost, profit, access, id_creator, id_type",
        "Ticket" : "date, description, statut, id_user_creator",
        "Apply": "id_user, id_service",
        "User" : "Email, Password, Name, Surname, Birthdate, Points, category, type",
        "messsage" : "content, date, id_sender, id_dest"
    }

    return allRequiredColumns[table].split(", ");
}