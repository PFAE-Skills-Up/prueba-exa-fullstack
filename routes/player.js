const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: "Welcome to Socka| Add a new player",
            message: ''
        });
    },
    //Me quede aquí y tengo algo malo :( 
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }
        let message = '';
        let first_name = req.body.first_name; // Error escribiendo en el valor req.body.first_name.
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name; // Linea mal escrita, cruzada con la de abajo
        let fileExtension = uploadedFile.mimetype.split('/')[1]; //línea no incluida, error al usar fileExtension.
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'"; // Error escribiendo el SELECT.
        /**
         * {
         *        "code": "ER_PARSE_ERROR",
         *        "errno": 1064,
         *        "sqlMessage": "You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'SELESCT * FROM `players` WHERE user_name = 'Lada'' at line 1",
         *        "sqlState": "42000",
         *        "index": 0,
         *        "sql": "SELESCT * FROM `players` WHERE user_name = 'Lada'"⚠️
            }
         */
        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Welcome to soka | Add a new player"
                });
            } else {
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') { //Error obviando el formato jpeg.
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) Values ('" + first_name + "', '" + last_name + "', '" + position + "', '" + number + "','" + image_name + "','" + username + "')"; // Error escribiendo el campo "user_name" y el campo first_name de la variable en values.
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif, 'jpeg' and 'png'images are allowed."
                    res.render('add-player.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new player"
                    });

                }

            }
        });

    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id ='" + playerId +"' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('edit-player.ejs', {

                title: "edit Player"
                , player: result[0]
                , message: ""
            });
        });

    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => { //Olvidado la variable err y parte del código.
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"'; //Comillas de players erroneas ´´.
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }


};









