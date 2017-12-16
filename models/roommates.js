module.exports = function(sequelize, DataTypes) {
    var Roommates = sequelize.define('Roommates', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
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
        withRoom: {
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
    Roommates.associate = function(models) {
        Roommates.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return  Roommates;
};
