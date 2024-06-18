module.exports = (sequelize, DataTypes) => {
    const SoundFile = sequelize.define('SoundFile', {
        SoundFileID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        SoundFileName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'soundFiles',
        timestamps: false,
    });

    return SoundFile;
};
