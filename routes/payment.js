const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const products = require('../controllers/farmer/products');

const { isLoggedIn,gaveInfo,isBuyer,isJobOwner} = require('../middleware');



const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });



router.route('/:orderId/:productId')
    .get(products.payOrder)

router.route('/callback/:orderId/:productId')
    .post(products.payCallback)

module.exports = router;


