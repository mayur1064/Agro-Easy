const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const products = require('../controllers/farmer/products');
const equipments = require('../controllers/farmer/equipments');
const jobs = require('../controllers/farmer/jobs');
const { isLoggedIn,gaveInfo,isBuyer,isJobOwner} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });




// router.route('/addInfo')
//     .get(isLoggedIn,products.renderInfoPage)
//     .post(isLoggedIn,products.addInfo)
    




router.route('/products/:id/order')
    .get(isLoggedIn,products.renderOrderPage)
    .post(isLoggedIn,[parseUrl, parseJson], catchAsync(products.orderProduct))

// router.route('/products/order')
//     .post(isLoggedIn, catchAsync(farmers.orderProduct))


router.route('/products/:id')
    .get(isLoggedIn,products.showProduct)

router.route('/products')
    .get(isLoggedIn,products.index)


 
router.route('/orders/:orderId/:productId/cancel')
    .get(isLoggedIn, products.failureOrder)   

router.route('/orders/:orderId/:productId')
    .get(isLoggedIn, products.successOrder)


router.route('/orders/:id/cancel')
    .post(isLoggedIn,isBuyer,catchAsync(products.cancelOrder))

router.route('/orders/:id')
    .get(isLoggedIn,isBuyer, products.showOrder)

router.route('/orders')
    .get(isLoggedIn, products.showAllOrders)


router.route('/equipments/:id/order')
    .get(isLoggedIn,equipments.renderEquipmentOrderPage)
    .post(isLoggedIn, catchAsync(equipments.rentEquipment))

router.route('/equipments/:id')
    .get(isLoggedIn,equipments.showEquipment)

router.route('/equipments')
    .get(isLoggedIn,equipments.index)

// router.route('/jobs/:id/hire/:workerId')
//     .get(isLoggedIn,gaveInfo,jobs.hireWorker)





router.route('/jobs/new')
    .get(isLoggedIn,jobs.renderNewJobPage)

    
router.get('/jobs/:id/edit', isLoggedIn, isJobOwner, catchAsync(jobs.renderEditJobForm))


router.route('/jobs/:id/hire')
    .get(isLoggedIn,jobs.hireWorker)


router.route('/jobs/:id/decline')
    .get(isLoggedIn,jobs.declineWorker)


router.route('/jobs/:id/profile/:workerId')
    .get(isLoggedIn,jobs.showWorkerProfile)







router.route('/jobs/:id')
    .get(isLoggedIn,isJobOwner,jobs.showJob)
    .put(isLoggedIn ,isJobOwner, catchAsync(jobs.updateJob))
    .delete(isLoggedIn,isJobOwner,catchAsync(jobs.deleteJob));




router.route('/jobs')
    .get(isLoggedIn,jobs.index)
    .post(isLoggedIn,jobs.createJob)







router.route('/')
    .get(isLoggedIn, products.renderFarmerPage)
    //.post(catchAsync(suppliers.register));



    





module.exports = router;