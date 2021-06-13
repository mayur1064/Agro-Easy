const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');

const https = require("https");
const qs = require("querystring");

const checksum_lib = require("../../Paytm/checksum");
const config = require("../../Paytm/config");


module.exports.renderFarmerPage = (req, res) => {
    res.render('farmers/farmerPage');
}

module.exports.renderInfoPage = (req, res) => {
    res.render('farmers/addInfo');
}

module.exports.addInfo = async (req, res)  => {
    const{farmArea} = req.body;
    const id = req.user._id;
    const user= await User.findByIdAndUpdate(id, {farmArea});
    await user.save();
    req.flash('success', 'Information Added Successfully!');
    res.redirect(`/farmer`)
}

module.exports.index = async (req, res) => {
    const products = await Product.find({quantity:{$gt:0},type:"product"});
    res.render('farmers/allproducts', { products })
}

module.exports.showProduct = async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('supplier');
    if (!product) {
        req.flash('error', 'Cannot find the Product!');
        return res.redirect('/farmer/products');
    }
    res.render('farmers/showProduct', { product });
}

module.exports.renderOrderPage = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate('supplier');
    res.render('farmers/orderPage',{product});
}

module.exports.orderProduct = async (req, res,next) => {
    const id = req.params.id;
    console.log(req.body.order);
    if(req.body.order.payment === 'cash')
    {
        const order = new Order(req.body.order);
        const product = await Product.findById(id);
        product.quantity = product.quantity - order.quantity;
        await product.save();
        order.supplier = product.supplier;
        order.product = product._id
        order.farmer = req.user._id;
        order.status = "not out for delivery";
        await order.save();

        req.flash('success', 'Order Placed Successfully!');
        res.redirect('/farmer/products');

    }
    else
    {
        const order = new Order(req.body.order);
        order.save();

        res.redirect(`/payment/${order._id}/${id}`);
    }
    
}


module.exports.payOrder =  async (req, res) => {
    // Route for making payment

    const order = await Order.findById(req.params.orderId);
    const product = await Product.findById(req.params.productId);
    const user = await User.findById(req.user._id);
    
    var paymentDetails = {
      amount: order.quantity * product.price,
      customerId: user.username.split(" ").join(""),
      customerEmail: user.email,
      customerPhone: order.contact
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = `https://agroeaasy.herokuapp.com/payment/callback/${order._id}/${product._id}`;
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        //    var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
      });
  }
}
  


module.exports.payCallback = (req, res) => {
    // Route for verifiying payment

    console.log("callback")
    var body = '';
  
    req.on('data', function (data) {
       body += data;
       
    });
  
     req.on('end', function () {
       var html = "";
       var post_data = qs.parse(body);
       const orderId = req.params.orderId;
       const productId = req.params.productId;
       console.log(orderId)
       console.log(productId)
  
       // received params in callback
       console.log('Callback Response: ', post_data, "\n");
  
  
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
       console.log("Checksum Result => ", result, "\n");
  
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
           // hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', async () => {
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') 
               {
                    
                    res.redirect(`/farmer/orders/${orderId}/${productId}`);


                    // res.status(200).send('payment sucess')
               }
               else 
               {
                    res.redirect(`/farmer/orders/${orderId}/${productId}/cancel`);

               }
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       });
  }
   


  module.exports.successOrder = async(req,res) => {
        const order = await Order.findById(req.params.orderId);
        const product = await Product.findById(req.params.productId);

        product.quantity = product.quantity - order.quantity;
        await product.save();
        order.supplier = product.supplier;
        order.product = product._id
        order.farmer = req.user._id;
        order.status = "not out for delivery";
        await order.save();

        req.flash('success', 'Online Payment Successfull, Order Placed Successfully!');
        res.redirect(`/farmer/products/${req.params.productId}`);


      
  }

  module.exports.failureOrder = async(req,res) => {
    const order = await Order.findByIdAndDelete(req.params.orderId);
   
    req.flash('error', 'Online Payment Failed,Please Try Again');
    res.redirect(`/farmer/products/${req.params.productId}`);


  
}

module.exports.showAllOrders = async (req, res) => {
    const id = req.user._id;
    const orders = await Order.find({farmer:id , status : {$in: ['not out for delivery', 'out for delivery','cancelled by supplier','not accepted','accepted']}}).populate('supplier').populate('product');

    res.render('farmers/allorders', { orders })

}


module.exports.showOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate('supplier').populate('product').populate('farmer');
    if(order.product.type === "product")
    {
        res.render('farmers/showOrder', { order });
    }
    else
    {
        res.render('farmers/showEquipmentOrder', { order })
    }

}

module.exports.cancelOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    const product = await Product.findById(order.product);
    product.quantity = product.quantity + order.quantity;

    order.status = "cancelled by farmer";
    order.save();
    product.save();
    req.flash('success', 'Order Cancelled Successfully!');
    res.redirect(`/farmer/orders`);
    
    

}


module.exports.renderSkillPage = (req, res) => {
    res.render('worker/addInfo');
}


