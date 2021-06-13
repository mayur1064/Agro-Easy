const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const products = require('../controllers/supplier/products');
const equipments = require('../controllers/supplier/equipments');
const { isLoggedIn,isSupplier} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(isLoggedIn,products.renderSupplierPage)
    


router.route('/products/new')
    .get(isLoggedIn,products.renderNewProductForm)

router.get('/products/:id/edit', isLoggedIn, isSupplier, catchAsync(products.renderEditForm))

router.route('/products/:id')
    .get(isLoggedIn,isSupplier,products.showProduct)
    .put(isLoggedIn, isSupplier, upload.array('image'), /*validateCampground,*/ catchAsync(products.updateProduct))
    .delete(isLoggedIn, isSupplier,catchAsync(products.deleteProduct));

router.route('/products')
    .get(isLoggedIn,products.index)
    .post(isLoggedIn, upload.array('image'), catchAsync(products.createProduct))

router.route('/orders/equipments/:id/accept')
    .post(isLoggedIn,equipments.acceptOrder)

router.route('/orders/equipments/:id/cancel')
    .post(isLoggedIn,equipments.cancelOrder)


router.route('/orders/:id/:status')
    .post(isLoggedIn,products.updateStatus)

router.route('/orders/:id')
    .get(isLoggedIn,products.showOrder)
    
router.route('/orders')
    .get(isLoggedIn,products.showAllOrders)




router.route('/equipments/new')
    .get(isLoggedIn,equipments.renderNewEquipmentForm)


router.get('/equipments/:id/edit', isLoggedIn,isSupplier, catchAsync(equipments.renderEditEquipmentForm))



router.route('/equipments/:id')
    .get(isLoggedIn,isSupplier,equipments.showEquipment)
    .put(isLoggedIn, isSupplier, upload.array('image'), /*validateCampground,*/ catchAsync(equipments.updateEquipment))
    .delete(isLoggedIn,isSupplier,catchAsync(equipments.deleteEquipment));


    
    
router.route('/equipments')
.get(isLoggedIn,equipments.index)
.post(isLoggedIn, upload.array('image'), catchAsync(equipments.createEquipment))



module.exports = router;