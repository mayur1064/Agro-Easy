const User = require('../../models/user');
const Job = require('../../models/job');
const Application = require('../../models/application');

module.exports.renderInfoPage = (req, res) => {
    res.render('workers/addInfo');
}

module.exports.renderWorkerPage = (req, res) => {
    res.render('workers/workerPage');
}

module.exports.addInfo = async (req, res)  => {
    const worker = req.body;
    console.log(worker);
    const id = req.user._id;
    const user= await User.findByIdAndUpdate(id,worker);
    await user.save();
    req.flash('success', 'Information Added Successfully!');
    res.redirect(`/worker`)
}

module.exports.index = async (req, res) => {
    const jobs = await Job.find({quantity:{$gt:0}});
    res.render('workers/allJobs', { jobs })
}


module.exports.showJob = async (req, res,) => {
    const job = await Job.findById(req.params.id).populate('farmer');
    const application = await Application.findOne({job:req.params.id,worker:req.user._id});
    console.log(application)
    if (!job) {
        req.flash('error', 'Job not available!');
        return res.redirect('/worker/jobs');
    }

    let status = "";

    if(!application)
    {
        status = "not applied";
    }
    else
    {
        status = application.status;
    }
    console.log(status);

    res.render('workers/showJob', { job,status});
}

module.exports.applyJob = async (req, res) => {
    // const job = await Job.findById(req.params.id);
    const id = req.params.id;
    const application = await new Application({worker:req.user._id,job:id});
    application.status = "applied";
    
    
    await application.save();
    

    req.flash('success', 'Applied Successfully!');

    res.redirect(`/worker/jobs/${id}`);
    
}

module.exports.cancelApplication = async (req, res) => {
    const { id } = req.params;
    
    await Application.deleteMany({job:id,worker:req.user_id});

    req.flash('success', 'Application Deleted Successfully!')
    res.redirect('/worker/jobs');
}

module.exports.showApplications = async (req, res) => {
    const applications = await Application.find({worker:req.user._id}).populate('job');
    console.log(applications);
    res.render('workers/allApplications', { applications })
}

module.exports.renderEditProfilePage = async (req, res) => {
    const worker = await User.findById(req.user._id);
    res.render('workers/editProfile',{worker});
}



module.exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const worker = await User.findByIdAndUpdate(id, { ...req.body });
    await worker.save();
    
    
    req.flash('success', 'Profile updated Successfully!');
    res.redirect(`/worker`)
}

module.exports.showProfile = async (req, res) => {
    const worker = await User.findById(req.params.id);
    res.render('workers/showProfile', { worker })
}

