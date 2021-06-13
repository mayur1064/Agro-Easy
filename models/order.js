const mongoose = require('mongoose');
const Product = require('./product')
const User = require('./user')
const Schema = mongoose.Schema;



const OrderSchema = new Schema({
    quantity: Number,
    address: String,
    city: String,
    country: String,
    pincode: String,
    contact: Number,
    status: String,
    payment: String,
    time : Number,
    landmark:String,
    
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    farmer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
    
});



// ProductSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

module.exports = mongoose.model('Order', OrderSchema);