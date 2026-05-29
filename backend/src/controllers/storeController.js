const { Op, fn, col, literal } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/stores
const getAllStores = async (req, res, next) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSort = ['name', 'email', 'address', 'createdAt'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'value', 'userId'],
        },
      ],
      order: [[safeSort, safeOrder]],
    });

    // Attach computed avgRating and requester's rating
    const userId = req.user?.id;
    const enriched = stores.map((store) => {
      const s = store.toJSON();
      const vals = s.ratings.map((r) => r.value);
      s.avgRating = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : null;
      s.userRating = userId
        ? (s.ratings.find((r) => r.userId === userId)?.value ?? null)
        : null;
      return s;
    });

    res.json({ stores: enriched });
  } catch (error) {
    next(error);
  }
};

// POST /api/stores  (admin)
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Store email already in use' });

    if (ownerId) {
      const owner = await User.findOne({ where: { id: ownerId, role: 'owner' } });
      if (!owner) return res.status(400).json({ message: 'Owner not found or not a store owner' });
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ store });
  } catch (error) {
    next(error);
  }
};

// GET /api/stores/owner-dashboard  (owner)
const getOwnerDashboard = async (req, res, next) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    const result = stores.map((store) => {
      const s = store.toJSON();
      const vals = s.ratings.map((r) => r.value);
      s.avgRating = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : null;
      return s;
    });

    res.json({ stores: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStores, createStore, getOwnerDashboard };
