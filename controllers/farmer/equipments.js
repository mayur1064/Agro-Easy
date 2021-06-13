const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');




module.exports.index = async (req, res) => {
    const equipments = await Product.find({quantity:{$gt:0},type:"equipment"});
    
    res.render('farmers/allEquipments', { equipments})
}


module.exports.showEquipment = async (req, res,) => {
    const equipment = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('supplier');
    if (!equipment) {
        req.flash('error', 'Cannot find the Equipment!');
        return res.redirect('/farmer/equipments');
    }


    res.render('farmers/showEquipment', { equipment});
}

module.exports.renderEquipmentOrderPage = async (req, res) => {
    const id = req.params.id;
    const equipment = await Product.findById(id).populate('supplier');
    res.render('farmers/orderEquipmentPage',{equipment});
}


module.exports.rentEquipment = async (req, res,next) => {
    const id = req.params.id;
    //console.log(req.body.order);
    const order = new Order(req.body.order);
    const equipment = await Product.findById(id);
    equipment.quantity = equipment.quantity - order.quantity;
    await equipment.save();
    order.supplier = equipment.supplier;
    order.product = equipment._id
    order.farmer = req.user._id;
    order.status = "not accepted";
    order.type = "equipment";
    await order.save();

    req.flash('success', 'Farm Equipment requested sucessfully!');
    res.redirect('/farmer/equipments');
}

module.exports.showEquipmentOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate('supplier').populate('product');
    res.render('farmers/showEquipmentOrder', { order })

}