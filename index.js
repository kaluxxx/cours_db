const express = require('express');
const app = express();
app.use(express.json());

const db = require('./models');
const { Op, Sequelize } = require("sequelize");

app.get('/only-tags', async (req, res) => {
    const tagsArray = req.query.tags.split(',').map(Number);

    try {
        const { Op, Sequelize } = require('sequelize');

        const results = await db.soundFiles.findAll({
            attributes: [
                'SoundFileID',
                'SoundFileName'
            ],
            include: [
                {
                    model: db.tags,
                    as: 'Tags',
                    attributes: [],
                    through: { attributes: [] },
                    where: {
                        TagID: {
                            [Op.in]: tagsArray
                        }
                    },
                    required: true
                }
            ],
            group: ['SoundFile.SoundFileID', 'SoundFile.SoundFileName'],
            having: Sequelize.literal(`COUNT(DISTINCT \`Tags\`.\`TagID\`) = ${tagsArray.length}`),
            where: Sequelize.where(
                Sequelize.literal(`(
                SELECT COUNT(*)
                FROM soundfiles_tag AS st
                WHERE st.SoundFileID = SoundFile.SoundFileID
            )`),
                tagsArray.length
            )
        });

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/tags', async (req, res) => {
    const tags = req.query.tags.split(',').map(Number);

    try {
        const results = await db.soundFiles.findAll({
            include: [
                {
                    model: db.tags,
                    attributes: [],
                    through: { attributes: [] },
                    where: {
                        TagID: {
                            [Op.in]: tags
                        }
                    }
                }
            ],
            group: ['SoundFile.SoundFileID'],
            having: Sequelize.literal(`COUNT(DISTINCT Tags.TagID) = ${tags.length}`)
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

db.sequelize.sync({ force: true }).then(async () => {
    console.log("Drop and re-sync db.");
    // Insertion des données de test dans la table soundFiles
    const soundFiles = await db.soundFiles.bulkCreate([
        { SoundFileName: 'SoundFile1' },
        { SoundFileName: 'SoundFile2' },
        { SoundFileName: 'SoundFile3' },
    ]);

    // Insertion des données de test dans la table tags
    const tags = await db.tags.bulkCreate([
        { TagName: 'male' },
        { TagName: 'humanoid' },
        { TagName: 'wound' },
        { TagName: 'female' },
    ]);

    // Insertion des données de test dans la table associative soundfiles_tag
    await db.soundFileTag.bulkCreate([
        // SoundFile1
        { SoundFileID: soundFiles[0].SoundFileID, TagID: tags[0].TagID }, // male
        { SoundFileID: soundFiles[0].SoundFileID, TagID: tags[1].TagID }, // humanoid
        { SoundFileID: soundFiles[0].SoundFileID, TagID: tags[2].TagID }, // wound
        // SoundFile2
        { SoundFileID: soundFiles[1].SoundFileID, TagID: tags[0].TagID }, // male
        { SoundFileID: soundFiles[1].SoundFileID, TagID: tags[1].TagID }, // humanoid
        // SoundFile3
        { SoundFileID: soundFiles[2].SoundFileID, TagID: tags[1].TagID }, // humanoid
        { SoundFileID: soundFiles[2].SoundFileID, TagID: tags[2].TagID }, // wound
    ]);

    console.log('Test data inserted!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Run the following command to start the server:
