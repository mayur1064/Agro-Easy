const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({accessToken : mapboxToken})


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password,contact,address, city} = req.body;
        const user = new User({ email, username, contact, address, city});
        const geoData = await geoCoder.forwardGeocode({
            query : user.address + ', ' + user.city,
            limit : 1
        }).send();
        console.log(geoData);
        user.geometry = geoData.body.features[0].geometry;
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Agro App!');
            const redirectUrl = req.session.returnTo || '/home';
            res.redirect(redirectUrl);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/home';
    
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/home');
}


module.exports.renderInfoPage = (req, res) => {
    res.render('users/infopage');
}


