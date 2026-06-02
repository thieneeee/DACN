const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categories');
const supplierRoutes = require('./suppliers');
const productRoutes = require('./products');
const transactionRoutes = require('./transactions');
const dashboardRoutes = require('./dashboard');
const userRoutes = require('./users');
const warehouseRoutes = require('./warehouses');
const transferRoutes = require('./transfers');
const reportRoutes = require('./reports');

router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/transfers', transferRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
