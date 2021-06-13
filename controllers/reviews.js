const Product = require('../models/product');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    product.ratingSum = product.ratingSum + review.rating;
    product.reviewCount++;
    
    product.reviews.push(review);
    await review.save();
    await product.save();

    req.flash('success', 'New Review Created!');

    if(product.type === "product")
    {
        res.redirect(`/farmer/products/${product._id}`);
    }
    else
    {
        res.redirect(`/farmer/equipments/${product._id}`);
    }
    
    
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);
    const review = await Review.findById(reviewId);
   
    product.ratingSum = product.ratingSum  - review.rating;
    product.reviewCount--;
    await product.save();
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted Successfully!');

    if(product.type === "product")
    {
        res.redirect(`/farmer/products/${product._id}`);
    }
    else
    {
        res.redirect(`/farmer/equipments/${product._id}`);
    }
}
