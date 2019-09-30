
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./db/products.json', 'utf8'));

router.get('/checkout', function (req, res, next) {
  var totalPrice = 0; 
  var cartProducts=[];
  res.render('checkout', 
  { 
    title: 'Check out',
    cartProducts : cartProducts,
    totalPrice : totalPrice,
    sectionType : "address"
  }
  );
});

router.post('/checkout', function(req, res, next) {
  console.log('done');
  var totalPrice = 0; 
  var cartProducts=[];
  console.log(req.body.cardNumber);
  res.render('checkout', { 
    title: 'Check out',
    cartProducts : cartProducts,
    totalPrice : totalPrice,
    sectionType : "payment"
  });
});

router.get('/cartItems', function (req, res, next) {
  var totalPrice = 0; 
  var cartProducts=[];
  if (req.session.cart) {
    var cart = new Cart(req.session.cart);
    cartProducts = cart.getItems();
    totalPrice = cart.totalPrice;
  }
  res.render('cartItems', 
  { 
    title: 'Cart Items',
    products: products,
    cartProducts : cartProducts,
    totalPrice : totalPrice
  }
  );
});

router.get('/poojaItems', function (req, res, next) {
  var totalPrice = 0; 
  var cartProducts=[];
  if (req.session.cart) {
    var cart = new Cart(req.session.cart);
    cartProducts = cart.getItems();
    totalPrice = cart.totalPrice;
  }
  
  res.render('poojaItems', 
  { 
    title: 'Pooja Items',
    products: products,
    cartProducts : cartProducts,
    totalPrice : totalPrice
  }
  );
});

router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  
  var totalPrice = 0; 
  var cartProducts;
  if (req.session.cart) {
    var cart = new Cart(req.session.cart);
    cartProducts = cart.getItems();
    totalPrice = cart.totalPrice;
  }
  res.redirect('/poojaItems');
});



router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/poojaItems');
});

router.get('/removeitem/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cartItems');
});

module.exports = router;
