module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Users.associate = function(models) {
        Users.hasMany(models.Roommates, {
          onDelete: "cascade"
        });
    };
    // Users.associate = function(models) {
    //     Users.hasMany(models.Posts, {
    //       onDelete: "cascade"
    //     });
    // };
    return Users;
};
