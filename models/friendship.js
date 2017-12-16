module.exports = function(sequelize, DataTypes){
    var Friendships = sequelize.define('Friendships',{
        myRoommateId: DataTypes.INTEGER,
        friendRoommateId: DataTypes.INTEGER
    });

    Friendships.associate = function(models){

            Friendships.belongsTo(models.Roommates, {
                as: 'myRoommate',
                foreignKey: 'myRoommateId'
            },
            {

            });

            Friendships.belongsTo(models.Roommates, {
                as: 'friendRoommate',
                foreignKey: 'friendRoommateId'
            },
            {

            });

    };
    return Friendships;
}
