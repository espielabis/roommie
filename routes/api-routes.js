var models = require('../models');
var path = require('path');

module.exports = function (app) {

    //Get all users
    app.get('/api/users', function (req, res) {
        models.Users.findAll().then(function (data) {
            res.json(data);
        });
    });

    //Find a certain user
    app.get('/api/users/:id', function (req, res) {
        models.Users.findOne({
            where: {
                id: req.params.id
            },
            include: [model.Roommates]
        }).then(function (userData) {
            res.json(userData);
        });
    })

    //Create new user
    app.post('/api/users', function (req, res) {
        models.Users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            picture: req.body.picture,
            location: req.body.location,
            gender: req.body.gender,
            age: req.body.age,
            bio: req.body.bio
        }).then(function (dbUsers) {
            console.log("==================" + dbUsers);
            res.json(dbUsers);
        });
    });

    //Upload user picture
    app.post("/api/upload", function (req, res) {

        if (!req.files.userPicture)
            return res.status(400).send('No files were uploaded.');
        var userPicture = req.files.userPicture;
        var userId = req.user.id;
        var imgPath = "/UserImages/" + userId + "_" + req.user.name + ".jpg";

        // Use the mv() method to place the file somewhere on your server
        userPicture.mv(path.join(__dirname, "../public" + imgPath), function (err) {

            if (err) {
                return res.status(500).send(err);
            }

            models.Users.update({
                picture: imgPath
            }, {
                where: {
                    id: userId
                }

            });

            res.redirect('/profile/edit-profile');
        });

    });

    //Updating User's info
    app.post('/api/edit-profile', function (req, res) {
        models.Users.update({
            name: req.body.name,
            email: req.body.email,
            location: req.body.location,
            gender: req.body.gender,
            age: req.body.age,
            bio: req.body.bio
        }, {
            where: {
                id: req.user.id
            }
        }).then(function (dbUsers) {
            res.redirect('/profile/edit-profile');
        });
    });

    //Deleting a certain user
    app.delete('/api/users/:id', function (req, res) {
        models.Users.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbUsers) {
            res.json(dbUsers);
        })
    });

    //Get logged in
    app.get('/api/user-roommates/:id', function (req, res) {
        models.Roommates.findAll({
            where: {
                OwnerId: req.params.id * 1
            }
        }).then(data => {
            res.json(data);
        });
    });

}
