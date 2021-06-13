const User = require('../../models/user');
const Product = require('../../models/product');
const Job = require('../../models/job');
const Application = require('../../models/application');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN


const geoCoder = mbxGeocoding({accessToken : mapboxToken})

module.exports.index = async (req, res) => {
    const id = req.user._id;
    const jobs = await Job.find({quantity:{$gt:0},farmer:id});
    res.render('farmers/allJobs', { jobs})
}





module.exports.showJob = async (req, res,) => {
    const job = await Job.findById(req.params.id).populate('farmer');
    
    if (!job) {
        req.flash('error', 'Cannot find the job!');
        return res.redirect('/farmer/jobs');
    }
    const applications = await Application.find({job:req.params.id,status:{$in:["not accepted","accepted","applied"]}}).populate('worker');
    res.render('farmers/showJob', { job,applications });
}

module.exports.renderNewJobPage = async (req, res) => {
    const farmer = await User.findById(req.user._id);
    res.render('farmers/newJob',{farmer});
}



module.exports.createJob = async (req, res, next) => {
    const job = new Job(req.body.job);
    console.log(job);
    const farmer = await User.findById(req.user._id);
    const geoData = await geoCoder.forwardGeocode({
        query : job.address + ', ' + job.city,
        limit : 1
    }).send();
    console.log(geoData);
    //console.log(product);
    job.geometry = geoData.body.features[0].geometry;
    job.farmer = req.user._id;
    job.applicants = 0; 
    await job.save();
    //console.log(job);
    req.flash('success', 'Job Created Successfully!');
    res.redirect(`/farmer/jobs/${job._id}`)
}



module.exports.renderEditJobForm = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id)
    if (!job) {
        req.flash('error', 'Cannot find the Job!');
        return res.redirect('/farmer/jobs');
    }
    res.render('farmers/editJob', { job });
}



module.exports.updateJob = async (req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const job = await Job.findByIdAndUpdate(id,  {...req.body.job},{new:true} );
    const geoData = await geoCoder.forwardGeocode({
        query : job.address + ', ' + job.city,
        limit : 1
    }).send();
    
    job.geometry = geoData.body.features[0].geometry;

    
    await job.save();
    
    req.flash('success', 'Job Updated Successfully!');
    res.redirect(`/farmer/jobs/${job._id}`)
}

module.exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id)
    
    await Job.findByIdAndDelete(id);
    await Application.deleteMany({job:id});

    req.flash('success', 'Job Closed Successfully!')
    res.redirect('/farmer/jobs');
}



module.exports.hireWorker = async (req, res,next) => {
    const id = req.params.id;
    const application = await Application.findById(id);

    //console.log(application.job.quantity);
    const job = await Job.findById(application.job);
    job.quantity = job.quantity - 1;
    await job.save()

    application.status = "accepted"
    await application.save();
    
    req.flash('success', 'Application accepted!');
    res.redirect(`/farmer/jobs/${application.job}`);
}

module.exports.declineWorker = async (req, res,next) => {
    const id = req.params.id;
    const application = await (await Application.findById(id)).populate('job');
    application.status = "declined"
    await application.save();
    
    req.flash('success', 'Application declined successfully!');
    res.redirect('/farmer/jobs');
}

module.exports.showWorkerProfile = async (req, res) => {
    const worker = await User.findById(req.params.workerId);
    const jobId = req.params.id;
    
    res.render('workers/showProfile', { worker,jobId})
}

