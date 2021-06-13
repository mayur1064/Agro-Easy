//const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product');
const User = require('./models/user');
const Review = require('./models/review');
const Order = require('./models/order');
const Job = require('./models/job');

//const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.gaveInfo = async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id);
    if(!user.farmArea)
    {
        req.flash('error', 'Please provide the Below Information');
        return res.redirect('/farmer/addInfo'); 
    }
    next();
}

module.exports.isBuyer = async (req, res, next) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    
    if(order.farmer.equals(req.user._id))
    {
        return next();
    }
    req.flash('error', 'Order doesnot belong to you');
    return res.redirect('/farmer/orders'); 
    
}


module.exports.isJobOwner = async (req, res, next) => {
    const id = req.params.id;
    const job = await Job.findById(id);
    //console.log(job);
    if(job.farmer.equals(req.user._id))
    {
        return next();
       
    }
    req.flash('error', 'You donot have permission to access the job');
    return res.redirect('/farmer/jobs'); 
    
  
    
}

module.exports.gaveInfoWorker = async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id);
    if(!user.skills)
    {
        req.flash('error', 'Please provide the Below Information');
        return res.redirect('/worker/addInfo'); 
    }
    next();
}


module.exports.isSupplier = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product.supplier.equals(req.user._id)) 
    {
        return next();   
    }

    req.flash('error', 'You do not have permission to do that!');
    if(product.type === "product")
    {
        return res.redirect(`/supplier/products`);
    }
    else
    {
        return res.redirect(`/supplier/equipments`);
    }
   
   
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/farmer/products/${id}`);
    }
    return next();
}

// module.exports.validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     console.log(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }