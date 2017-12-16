var models = require('../models');

module.exports = function(app){
    // Get all posts
    app.get('/api/posts', function(req, res){
        models.Posts.findAll().then(function(data){
            res.json(data);
        });
    });

    // Get posts of a certain user
    app.get('/api/posts/:userId', function(req, res){
        models.Posts.findAll({
            where: {UserId: req.params.userId},
            include: [models.Users]
        }).then(function(data){
            res.json(data);
        });
    });

    //create new post
    app.post('/api/posts', function(req, res){
        models.Posts.create({
            body: req.body.body,
            UserId: req.user.id
        }).then(function(data){
            res.send('success');
        })
    });

    //delete current user's post
    app.delete('/api/posts', function(req, res){
        models.Posts.destroy({
            where: {
                userId: req.user.id
            }
        }).then(function(data){
            res.json(data);
        });
    });
}
