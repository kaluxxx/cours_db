module.exports = (sequelize, DataTypes) => {
    const SoundFileTag = sequelize.define('SoundFileTag', {
        SoundFileID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'SoundFiles',
                key: 'SoundFileID',
            },
        },
        TagID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Tags',
                key: 'TagID',
            },
        },
    }, {
        tableName: 'soundfiles_tag',
        timestamps: false,
    });

    return SoundFileTag;
};
