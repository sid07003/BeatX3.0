const { getArtistDataById } = require("../models/Artist_model");

const getArtistData = async (req, res) => {
  try {
    const artistId = req.params.id;
    const data = await getArtistDataById(artistId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getArtistData:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getArtistData
};
