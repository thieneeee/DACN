const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const supplierRoutes = require('./suppliers');
const productRoutes = require('./products');
const transactionRoutes = require('./transactions');
const dashboardRoutes = require('./dashboard');
const userRoutes = require('./users');

router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

module.exports = router;
