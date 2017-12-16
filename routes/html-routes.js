var models = require('../models');
var loggedIn;

module.exports = function (app) {
    //Get an owner by id
    app.get('/users/:id', function (req, res) {
        if(req.isAuthenticated()) {
            models.Users.findOne({
                where: {
                    id: req.params.id
                },
                include: [models.Roommates]
            }).then(data => {
                models.Posts.findAll({
                    where: {
                        UserId: req.params.id
                    },
                    order: [['createdAt', 'DESC']]
                }).then(posts => {
                    var Posts = [];
                    for(post in posts) {
                        Posts.push(posts[post].dataValues);
                    }
                    res.render('user', {
                        name: data.name,
                        picture: data.picture,
                        age: data.age,
                        location: data.location,
                        email: data.email,
                        roommates: data.Roommates,
                        bio: data.bio,
                        posts: Posts,
                        isUser: req.isAuthenticated()
                    });
                });
            });
        }else{
            res.redirect('/');
        }
    });

    //Get all users
    app.get('/users', function (req, res) {
        if(req.isAuthenticated()) {
            models.Users.findAll({}).then(data => {
              var Users = [];

                for (user in data) {
                    Users.push(data[user]);
                }

                res.render('users', {
                    users: Users,
                    isUser: req.isAuthenticated()
                });
            });
        }else{
            res.redirect('/');
        }
    });

    app.get('/roommates/:id', function (req, res) {
        if(req.isAuthenticated()) {
            models.Roommates.findOne({
                where: {
                    id: req.params.id
                },
                include: [models.Users]
            }).then(data => {
                models.Users.findOne({
                    where: {
                        id: data.UserId
                    }
                }).then(userData => {
                    models.Friendships.findAll({
                        attributes: ['friendRoommateId'],
                        where: {
                            myRoommateId: req.params.id
                        },
                        include: ['friendRoommate']
                    }).then(roommatesFriendsData => {
                        console.log(userData.name);

                        var Roommates = [];

                        for (roommate in roommatesFriendsData) {
                            console.log(roommatesFriendsData[roommate].friendRoommate.name);
                            console.log("============================");
                            Roommates.push(roommatesFriendsData[roommate].friendRoommate);
                        }

                        res.render('roommate', {
                            id: req.params.id,
                            name: data.name,
                            picture: data.picture,
                            age: data.age,
                            withRoom: data.withRoom,
                            rlocation: data.location,
                            bio: data.bio,
                            location: userData.location,
                            userName: userData.name,
                            userAge: userData.age,
                            userPicture: userData.picture,
                            userId: userData.id,
                            isUser: req.isAuthenticated(),
                            userId: req.user.id,
                            friendRoommates: Roommates
                        });
                    });
                });
            });
        }else{
            res.redirect('/');
        }
    });

    app.post('/roommates/:id', function (req, res) {

        models.Roommates.findOne({
            where: {
                id: req.params.id
            },
            include: [models.Users]
        }).then(data => {
            models.Users.findOne({
                where: {
                    id: data.UserId
                }
            }).then(userData => {

                res.render('roomate', {
                    id: req.params.id,
                    name: data.name,
                    picture: data.picture,
                    age: data.age,
                    withRoom: data.withRoom,
                    rlocation: data.location,
                    bio: data.bio,
                    location: userData.location,
                    userName: userData.name,
                    userAge: userData.age,
                    userPicture: userData.picture,
                    userId: userData.id,
                    friendRoommateId: req.body.friendRoommateId,
                    isUser: req.isAuthenticated()
                });

            });
        });
    });

    //Get all roommates
    app.get('/roommates', function (req, res) {
        if(req.isAuthenticated()) {
            models.Roommates.findAll({
                where: {
                    UserId: {$ne: req.user.id}
                }
            }).then(data => {
                var Roommates = [];


                for (roommate in data) {
                    Roommates.push(data[roommate]);

                    if (!WithRooms.includes(data[roommate].withRoom)) {
                        WithRooms.push(data[roommate].withRoom);
                    }

                    if (!Locations.includes(data[roommate].location)) {
                        if (data[roommate].location !== '') {
                            Locations.push(data[roommate].location);
                        }
                    }
                }

                res.render('roommates', {
                    roommates: Roommates,
                    rlocations: Rlocations,
                    withRooms: WithRooms,
                    isUser: req.isAuthenticated()
                });
            });
        }else{
            res.redirect('/');
        }
    });

    app.post('/roommates', function (req, res) {
        console.log('\n======\n' + req.body.rlocation + '\n======\n' + req.body.withRoom + '\n======\n' + req.body.age + '\n======\n' + req.body.gender);

        var query = {};

        var age = 0;

        if (req.body.rlocation != '') {
            query.rlocation = req.body.rlocation
        }

        if (req.body.withRoom != '') {
            query.withRoom = req.body.withRoom
        }

        if (req.body.age != '') {
            query.age = req.body.age

            if (req.body.age === '20-30') {
                query.age = {
                    lte: 30
                }
            } else if (req.body.age === '40-70') {
                query.age = {
                    between: [40, 70]
                }
            } else {
                query.age = {
                    gte: 80
                }
            }
        }

        if (req.body.gender != '') {
            query.gender = req.body.gender

        }

        models.Pets.findAll({
            where: query
        }).then(data => {
            var Roommates = [];
            var Rlocations = [];
            var WithRooms = [];

            for (roommate in data) {
                Roommates.push(data[roommate]);

                if (!Rlocations.includes(data[roommate].rlocation)) {
                    Rlocations.push(data[roommate].rlocation);
                }

                if (!WithRooms.includes(data[roommate].withRoom)) {
                    if (data[pet].withRoom !== '') {
                        WithRooms.push(data[roommate].withRoom);
                    }
                }
            }

            res.render('roommates', {
                roommates: Roommates,
                rlocations: Rlocations,
                withRooms: WithRooms,
                isUser: req.isAuthenticated()
            })
        })
    });

    //logged in view
    app.get('/home', function (req, res) {
        if (req.isAuthenticated()) {
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
                    res.render('home', {
                        userPicture: data.picture,
                        userName: data.name,
                        posts: Posts,
                        userId: req.user.id,
                        isUser: req.isAuthenticated()
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });

    //Get the current owner pets to choose from for the friendship
    app.post('/myRoommates', function (req, res) {
        var friendRoommateId = req.body.friendRoommateId * 1;
        models.Roommates.findAll({
            where: {
                UserId: req.user.id * 1
            },
        }).then(data => {

            var Roommates = [];

            for (roommate in data) {
                Roommates.push(data[roommate]);
            }

            res.render('roommate', {
                friendRoommateId: friendRoommateId,
                myroommates: Roommates,
                isUser: req.isAuthenticated()
            });
        });
    });
}
