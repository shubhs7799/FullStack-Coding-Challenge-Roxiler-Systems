const { Rating, Store } = require('../models');

// POST /api/ratings
const submitRating = async (req, res, next) => {
  try {
    const { storeId, value } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [rating, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { value },
    });

    if (!created) {
      rating.value = value;
      await rating.save();
    }

    res.status(created ? 201 : 200).json({
      rating,
      message: created ? 'Rating submitted' : 'Rating updated',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRating };
