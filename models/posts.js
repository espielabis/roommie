module.exports = function(sequelize, DataTypes) {
    var Posts = sequelize.define('Posts', {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        // ownerId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    });
    Posts.associate = function(models) {
        Posts.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Posts;
};
