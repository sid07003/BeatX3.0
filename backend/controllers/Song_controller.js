const { getNextSong, getPrevSong } = require('../models/Song_model.js');

const handleGetNextSong = async (req, res) => {
  try {
    const currentIndex = parseInt(req.params.index);
    if (isNaN(currentIndex)) return res.status(400).json({ error: 'Invalid index' });

    const song = await getNextSong(currentIndex);
    res.json(song);
  } catch (err) {
    console.error('Error fetching next song:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const handleGetPrevSong = async (req, res) => {
  try {
    const currentIndex = parseInt(req.params.index);
    if (isNaN(currentIndex)) return res.status(400).json({ error: 'Invalid index' });

    const song = await getPrevSong(currentIndex);
    res.json(song);
  } catch (err) {
    console.error('Error fetching previous song:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  handleGetNextSong,
  handleGetPrevSong
};
