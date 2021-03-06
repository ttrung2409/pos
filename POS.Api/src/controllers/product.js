import ProductService from '../services/productService'

var express = require('express');
var router = express.Router();

let productService = new ProductService();

router.get('/allCategories', function (req, res) {
  productService.allCategories().then(categories => {
    res.send(categories);
  });
});

router.get('/allUoms', function (req, res) {
  productService.allUoms().then(uoms => res.send(uoms));
});

router.get('/:id', function (req, res) {
  productService.get(req.params.id).then(product => {
    if (!product) {
      res.status(404);
      res.send('Product not found');
    }
    else {
      res.send(product);
    }
  });
});

router.post('/lookup', function (req, res) {
  productService.lookup(req.body.query, { priceType: req.body.priceType }).then(products => res.send(products));
});

router.post('/search', function (req, res) {
  productService.search(req.body).then(result => {
    res.send({ total: result.count, items: result.rows });
  });
});

router.post('/', function (req, res) {
  productService.save(req.body).then(product => {
    res.send(product);
  });  
});

router.put('/', function (req, res) {
  productService.save(req.body).then(product => {
    res.send(product);
  });
});

router.delete('/:id', function (req, res) {
  productService.delete(req.params.id);
  res.end();
});

module.exports = router;
