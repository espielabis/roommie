var models = require('../models');

module.exports = function(app){
    //Get all friendships
    app.get('/api/friendships', function(req, res){
        models.Friendships.findAll().then(function(dbFriendship){
            res.json(dbFriendship);
        });
    });

    //Get friends of a certain pet
    app.get('/api/friendships/:id', function(req, res){
        models.Friendships.findAll({
            where: {myId: req.params.id}
        }).then(function(dbFriendship){
            res.json(dbFriendship);
        });
    });

    //Create friendship
    app.post('/api/friendships', function(req, res){
        models.Friendships.findOne({
            where: {
                myRoommateId: req.body.myRoommateId,
                friendRoommateId: req.body.friendRoommateId
            }
        }).then(data => {
            if(!data){
                models.Friendships.create({
                    myRoommateId: req.body.myRoommateId,
                    friendPetId: req.body.friendRoommateId
                }).then(function(dbFriendship){
                    models.Roommates.findAll({
                        where:
                        {
                            $or: [
                                { id: req.body.myRoommateId },
                                { id: req.body.friendRoommateId }
                              ]
                        }

                    }).then(function(petsData){
                        //res.json(petsData);
                        res.send('Friend Added!');
                    });
                });
            }
            else{
                console.log("friendship already exists");
                res.send("friendship already exists");
            }
        });
    });

}
