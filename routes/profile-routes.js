var models = require('../models');
var loggedIn;

module.exports = function (app) {

    //Get profile
    app.get('/profile', function(req, res) {
        if(req.isAuthenticated()) {
            models.Users.findOne({
                where: {
                    id: req.user.id
                }
            }).then(data => {
                models.Posts.findAll({
                    where: {
                        UserId: req.user.id
                    },
                    order: [['createdAt', 'DESC']]
                }).then(posts => {
                  var Posts = [];
                    for(post in posts) {
                        Posts.push(posts[post].dataValues);
                    }
                    console.log('requested');
                    res.render('profile', {
                        userPicture: data.picture,
                        userName: data.name,
                        userEmail: data.email,
                        userId: data.id,
                        userBio: data.bio,
                        posts: Posts,
                        isUser: req.isAuthenticated()
                    });
                });
            });
        }else{
            res.redirect('/');
        }
    });

    //Get View roommates
    app.get('/profile/view-roommates', function (req, res) {
        if(req.isAuthenticated()) {
            models.Users.findOne({
                where: {
                    id: req.user.id
                },
                include: [models.Roommates]
            }).then(data => {
                res.render('profile/view-roommates', {
                    userPicture: data.picture,
                    userName: data.name,
                    userEmail: data.email,
                    userId: data.id,
                    userBio: data.bio,
                    pets: data.Pets,
                    isUser: req.isAuthenticated()
                });
            });
        }else{
            res.redirect('/');
        }
    });

    //Get user's friends (no data)
    app.get('/profile/view-friends', function (req, res) {
        if(req.isAuthenticated()) {
            models.Owners.findOne({
                where: {
                    id: req.user.id
                }
            }).then(data => {
                res.render('profile/view-friends', {
                      userPicture: data.picture,
                      userName: data.name,
                      userEmail: data.email,
                      userAge: data.age,
                      userLocation: data.location,
                      userId: data.id,
                      userBio: data.bio,
                      isUser: req.isAuthenticated()
                });
            });
        }else{
            res.redirect('/');
        }
    });

    //Get owner's info
    app.get('/profile/edit-profile', function (req, res) {
        if(req.isAuthenticated()) {
            models.Users.findOne({
                where: {
                    id: req.user.id
                }
            }).then(data => {
                let isMale = false;
                if(data.gender === 'male') {
                    isMale = true;
                }
                res.render('profile/edit-profile', {
                    userPicture: data.picture,
                    userName: data.name,
                    userEmail: data.email,
                    userAge: data.age,
                    userLocation: data.location,
                    userId: data.id,
                    userBio: data.bio,
                    isMale: isMale,
                    isUser: req.isAuthenticated()

                });
            });
        }else{
            res.redirect('/');
        }
    });


}
