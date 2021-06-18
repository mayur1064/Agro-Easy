const mongoose = require('mongoose');
const Product = require('../models/product');
const Review = require('../models/review');
const User = require('../models/user');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/agro-app'


mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



let text = [
    {
        body:"Great Product Helped me a lot to increase productivity",
        rating : 4
    },
    {
        body:"Product Quality is descent but the delivery is late.Please give attention to it",
        rating : 3
    },
    {
        body:"Excellent Product, fast delivery. Satisfied with the service",
        rating : 5
    },
    {
        body:"Product quality was bad, and delivery was late",
        rating : 2
    },
    {
        body:"Good Product, but the delivery was too late.Please work on that",
        rating : 3
    },
    {
        body:"Good quality, but it is expensive as compared to the quantity",
        rating : 4
    },
    {
        body:"Excellent Quality at a low cost.Thanks a lot , this was not available at my local store",
        rating : 5
    },
    {
        body:"Bad quality product, looks like it is old stock.Late Delivery",
        rating : 2
    }

    ]


const seedDB = async () => {
    //await Review.deleteMany({});

    const products = await Product.find({});
    const users = await User.find({});
    let i = 0;
    console.log(products.length);
    console.log(users.length);
    

    for(let product of products)
    {
        for(let user of users)
        {
            if(product.type === "product")
            {
                const review = new Review(text[i]);
                review.author = user._id;
                product.ratingSum = product.ratingSum + review.rating;
                product.reviewCount++;
                product.reviews.push(review);
                await review.save();
                await product.save();

                i++;

                if(i === 8)
                {
                    i = 0;
                }
 

            }
            
        }
    }
    
    
}

seedDB().then(() => {
    mongoose.connection.close();
})