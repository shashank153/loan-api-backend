const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const e = require('express');
const app = express();
// mongoose.connect('mongodb://localhost:27017/loan-api-db')
mongoose.connect("mongodb+srv://shashank:shashank@cluster0.7nozi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

//To use static html files over the node server
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
})

//Schema of product
const productSchema = {
    productId: Number,
    productName: String,
    productPrice: Number,
    rateOfInterest: Number,
    tenure: Number,
    createdBy: String,
    updatedBy: String,
}

//mongoose model
const Product = mongoose.model('Proudct', productSchema)
const emiCalculator = (product) => {
    return product.productPrice
}


//get request for home route
app.get('/', (req, res) => {
    res.send('index')
})

//common route '/products'
app.route('/products')
    //get reuqest for '/products'
    .get((req, res) => {
        Product.find((err, foundProducts) => {
            if (!err)
                res.send(foundProducts)
            else
                res.send(err)
        })
    })
    //post request for './products'
    .post((req, res) => {
        // console.log(req.body);
        const product = new Product({
            productId: req.body.productId,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            rateOfInterest: req.body.rateOfInterest,
            tenure: req.body.tenure,
            createdBy: req.body.createdBy,
            updatedBy: req.body.updatedBy
        })
        console.log(product);
        product.save()
        res.send(req.body)
    })
    //delete request for '/products'
    .delete((req, res) => {
        Product.deleteMany((err) => {
            if (!err) {
                res.send("All products deleted successfully!")
            } else {
                res.send(err)
            }
        })
    })

app.route('/products/:productId')
    .get((req, res) => {
        Product.findOne({
            productId: req.params.productId
        }, (err, foundProduct) => {
            if (!err) {
                res.send(foundProduct)
            } else {
                console.log(err);
                res.send(err)
            }
        })
    })
    .delete((req, res) => {
        Product.deleteOne({
            productId: req.params.productId
        }, (err, deletedProduct) => {
            if (!err) {
                res.send(deletedProduct)
            } else {
                res.send(err)
            }
        })
    })
    .put((req, res) => {
        const product = new Product({
            productId: req.body.productId,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            rateOfInterest: req.body.rateOfInterest,
            tenure: req.body.tenure,
            createdBy: req.body.createdBy,
            updatedBy: req.body.updatedBy
        })
        Product.updateOne({
            productId: req.params.productId
        }, product, (err, updatedProduct) => {
            if (!err) {
                res.send(updatedProduct)
            } else {
                res.send(CustomElementRegistry)
            }
        })
    })

app.get('/products/calculate-emi/:productId', (req, res) => {
    Product.findOne({
        productId: req.params.productId
    }, (err, foundProduct) => {
        if (!err) {
            let emi = emiCalculator(foundProduct)
            // console.log(emi);
            res.send("The calculated emi for productId:" + req.params.productId + " is -> " + emi)
        }
    })
})

app.listen(port, () => {
    console.log("app is running on localhost:" + port);
})