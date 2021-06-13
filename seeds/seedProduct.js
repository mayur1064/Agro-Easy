const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/agro-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const prod = new Product({
            supplier: '60c08199c129e82c989ccc76',
            name: `Apple Seeds`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            ratingSum : 0,
            reviewCount : 0,
            quantity:price+3,
            type : "product",
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
            
        })
        await prod.save();
    }

    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const prod = new Product({
            supplier: '60c081e7c129e82c989ccc77',
            name: `Mango Seeds`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            ratingSum : 0,
            reviewCount : 0,
            quantity:price+3,
            type : "product",
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
            
        })
        await prod.save();
    }



    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const prod = new Product({
            supplier: '60c08199c129e82c989ccc76',
            name: `Tractor`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            ratingSum : 0,
            reviewCount : 0,
            quantity:price+3,
            type : "equipment",
            city : "Pune",
            images: [
                {
                    url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1622286519/Yelpcamp/tractor1.jpg',
                    filename: 'YelpCamp/tractor1'
                },
                {
                    url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1622286519/Yelpcamp/tractor2.jpg',
                    filename: 'YelpCamp/tractor2'
                }
            ],
            "geometry" : { "type" : "Point", "coordinates" : [ -74.0059413,40.7127837] }
        })
        await prod.save();
    }

    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const prod = new Product({
            supplier: '60c081e7c129e82c989ccc77',
            name: `Harvestor`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            ratingSum : 0,
            reviewCount : 0,
            quantity:price+3,
            type : "equipment",
            city : "Pune",
            images: [
                {
                    url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1622286842/Yelpcamp/harvestor1.jpg',
                    filename: 'YelpCamp/harvestor1'
                },
                {
                    url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1622286842/Yelpcamp/harvestor2.jpg',
                    filename: 'YelpCamp/harvestor2'
                }
            ],
            "geometry" : { "type" : "Point", "coordinates" : [ -74.0059413,40.7127837] }
        })
        await prod.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})