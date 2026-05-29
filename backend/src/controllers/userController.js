const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');

// GET /api/users  (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const users = await User.findAll({
      where,
      order: [[safeSort, safeOrder]],
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id  (admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include:
        req.params.id &&
        (
          await User.findByPk(req.params.id, { attributes: ['role'] })
        )?.role === 'owner'
          ? [{ model: Store, as: 'ownedStores', include: [{ model: Rating, as: 'ratings' }] }]
          : [],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    let avgRating = null;
    if (user.role === 'owner') {
      const owned = await Store.findAll({
        where: { ownerId: user.id },
        include: [{ model: Rating, as: 'ratings', attributes: ['value'] }],
      });
      const allRatings = owned.flatMap((s) => s.ratings.map((r) => r.value));
      avgRating = allRatings.length
        ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
        : null;
    }

    res.json({ user, avgRating });
  } catch (error) {
    next(error);
  }
};

// POST /api/users  (admin creates user/admin)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const allowedRoles = ['user', 'admin', 'owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({ name, email, password, address, role: userRole });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/dashboard-stats  (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, createUser, getDashboardStats };
