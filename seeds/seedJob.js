const mongoose = require('mongoose');
const Job = require('../models/job');

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
    await Job.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const wage = Math.floor(Math.random() * 20) + 300;
        const job = new Job({
            farmer: '60c08199c129e82c989ccc76',
            name: `Onion Cultivation`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            wage,
            quantity:wage+3,
            applicants : 0,
            landmark : "Kondhwa",
            city : "Pune",
            skills : "Plant Grafting,Onion Cultivation,Sowing,Ploughing,",
            gender : "Male",
            "geometry" : { "type" : "Point", "coordinates" : [ -74.0059413,40.7127837] }

            
        })
        await job.save();
    }

    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const wage = Math.floor(Math.random() * 20) + 300;
        const job = new Job({
            farmer: '60c08199c129e82c989ccc76',
            name: `Rice Cultivation`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            wage,
            quantity:wage+3,
            applicants : 0,
            landmark : "Kondhwa",
            city : "Pune",
            skills : "Plant Grafting,Onion Cultivation,Sowing,Ploughing,",
            gender : "Male",
            "geometry" : { "type" : "Point", "coordinates" : [ -74.0059413,40.7127837] }

            
        })
        await job.save();
    }

    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const wage = Math.floor(Math.random() * 20) + 200;
        const job = new Job({
            farmer: '60c08199c129e82c989ccc76',
            name: `Wheat Harvesting`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            wage,
            quantity:wage+3,
            applicants : 0,
            landmark : "Kondhwa",
            city : "Pune",
            skills : "Plant Grafting,Onion Cultivation,Sowing,Ploughing,",
            gender : "Male",
            "geometry" : { "type" : "Point", "coordinates" : [ -74.0059413,40.7127837] }

            
        })
        await job.save();
    }






    
}

seedDB().then(() => {
    mongoose.connection.close();
})