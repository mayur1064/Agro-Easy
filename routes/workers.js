const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const workers = require('../controllers/worker/workers');
const { isLoggedIn,gaveInfoWorker} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/addinfo')
    .get(isLoggedIn, workers.renderInfoPage)
    .post(isLoggedIn,workers.addInfo)



router.route('/jobs/:id/cancel')
    .get(isLoggedIn, gaveInfoWorker, workers.cancelApplication)



router.route('/jobs/:id')
    .get(isLoggedIn, gaveInfoWorker, workers.showJob)
    .post(isLoggedIn, gaveInfoWorker, workers.applyJob)
    

router.route('/jobs')
    .get(isLoggedIn, gaveInfoWorker, workers.index)


router.route('/applications')
    .get(isLoggedIn, gaveInfoWorker, workers.showApplications)




router.route('/profile/edit')
    .get(isLoggedIn, gaveInfoWorker, workers.renderEditProfilePage)
    


router.route('/profile/:id')
    .get(isLoggedIn, gaveInfoWorker, workers.showProfile)
    .put(isLoggedIn,catchAsync(workers.updateProfile))


router.route('/')
    .get(isLoggedIn, gaveInfoWorker, workers.renderWorkerPage)


module.exports = router;