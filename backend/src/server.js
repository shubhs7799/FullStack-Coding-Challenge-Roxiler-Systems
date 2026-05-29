require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/sequelize');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true }); // use migrations in production
    console.log('✅ Models synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

start();
