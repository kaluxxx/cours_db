module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        TagID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        TagName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'tags',
        timestamps: false,
    });

    return Tag;
};
