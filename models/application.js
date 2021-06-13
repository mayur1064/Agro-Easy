const mongoose = require('mongoose');
const Job = require('./job')
const User = require('./user')
const Schema = mongoose.Schema;



const ApplicationSchema = new Schema({
   
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    status: String
    
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

module.exports = mongoose.model('Application', ApplicationSchema);