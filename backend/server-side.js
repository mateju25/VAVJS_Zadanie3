// Matej Delincak

const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const seq = require('./utils/database')
const cors = require('cors');

const Ad = require('./models/Ad');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');
const ProductGroup = require('./models/ProductGroup');
let router = express.Router();


const oneDay = 1000 * 60 * 60 * 24;
let app = express();
app.use(sessions({
    secret: "secretKey",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));


function sendJson(res, json) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.end(JSON.stringify(json));
}

router.get('/product_data', function (req, res) {
    Product.findAll().then(products => {
        sendJson(res, {"products": products});
    });
});
router.get('/ad', function (req, res) {
    Ad.findOne().then(ad => {
        sendJson(res, {"ad": ad});
    });
});
router.post('/change_ad', function (req, res) {
    let link = req.query.link;
    let img_src = req.query.img_src;
    Ad.findOne().then(async ad => {
        if (img_src !== undefined)
            ad.setDataValue('img_src', img_src);
        if (link !== undefined)
            ad.setDataValue('link', link);
        await ad.save();
        sendJson(res, {"ok": true});
    });
});
router.post('/update_counter', function (req, res) {
    Ad.findOne().then(async ad => {
        ad.counter += 1;
        await ad.save();
        sendJson(res, {"ok": true});
    });
});
router.get('/create_order', async function (req, res) {
    let order = Order.build({state: "showing"});
    await order.save();
    sendJson(res, {"order": order.getDataValue('id')});
});
router.get('/product_groups', function (req, res) {
    let orderId = req.query.orderId;
    ProductGroup.findAll({ where: {orderId: orderId}, include: [Order, Product] }).then(order => {
        sendJson(res, {"productGroups": order});
    });
});
router.get('/orders', function (req, res) {
    Order.findAll({where: {state: ['adding products', 'paid', 'delivered', 'accepted by customer']}, include: [Customer, ProductGroup]}).then(orders => {
        sendJson(res, {"orders": orders});
    });
});
router.get('/customers', function (req, res) {
   Customer.findAll().then(customer => {
        sendJson(res, {"customers": customer});
    });
});
router.post('/add_product', function (req, res) {
    let orderId = req.query.orderId;
    let productId = req.query.productId;
    let quantity = req.query.quantity;
    Order.findByPk(orderId).then(async order => {

        if (order == null) {
            order = Order.build({state: "showing"});
        }
        order.setDataValue('state', 'adding products');
        await order.save();
        req.session.orderId = order.getDataValue('id');

        ProductGroup.findOne({where: {orderId: order.getDataValue('id'), productId: productId}}).then(async (productGroup) => {
            if (productGroup == null) {
                productGroup = ProductGroup.build({
                    orderId: order.getDataValue('id'),
                    productId: productId,
                    quantity: quantity
                }, {
                    include: [ Product ]
                });
            } else {
                productGroup.setDataValue('quantity', quantity);
            }
            await productGroup.save();
        });
        sendJson(res, {"ok": true});
    });
});
router.post('/add_customer', function (req, res) {
    let orderId = req.query.orderId;
    let name = req.query.name;
    let email = req.query.email;
    let street = req.query.street;
    let number = req.query.number;
    let postal_code = req.query.postalCode;
    let city = req.query.city;
    Order.findByPk(orderId).then(async order => {
        if (order == null) {
            return;
        }
        let customer = Customer.build({
            name: name,
            email: email,
            street: street,
            number: number,
            postal_code: postal_code,
            city: city,
        });
        await customer.save();

        order.setDataValue('customerId',  customer.getDataValue('id'));
        order.setDataValue('state',  "paid");
        await order.save();
        sendJson(res, {"ok": true});
    });
});
router.post('/change_order_state', function (req, res) {
    let orderId = req.session.orderId;
    let state = req.query.state;
    Order.findByPk(orderId).then(async order => {
        if (order == null) {
            sendJson(res, {"ok": false});
        }
        order.setDataValue('state', state);
        await order.save();
        sendJson(res, {"ok": true});
    });
});

app.use('/', router);

//sequelize


async function makeAssociations() {
    Product.ProductGroup = Product.hasOne(ProductGroup);
    ProductGroup.Product = ProductGroup.belongsTo(Product);
    ProductGroup.Order = ProductGroup.belongsTo(Order);
    Order.Customer = Order.belongsTo(Customer);
    Order.ProductGroup = Order.hasMany(ProductGroup);
    Customer.Order = Customer.hasOne(Order);

    await seq.sync({force: true})
}

async function productSeeder() {
    const product1 = Product.build({
        name: "Sluchatka",
        img_src: "https://unsplash.com/photos/PDX_a_82obo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM3NDc2NDI5&force=true",
        cost: 30
    });
    await product1.save();
    const product2 = Product.build({
        name: "Mikrofon",
        img_src: "https://unsplash.com/photos/OKLqGsCT8qs/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTZ8fG11c2ljfHwwfHx8fDE2Mzc0NDA3NjM&force=true",
        cost: 40.50
    });
    await product2.save();
    const product3 = Product.build({
        name: "Gitara",
        img_src: "https://unsplash.com/photos/YCQFgqOzLmU/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mzd8fG11c2ljfGVufDB8fHx8MTYzNzQ3NzA0MA&force=true",
        cost: 89.99
    });
    await product3.save();
}

async function adSeeder() {
    const ad = Ad.build({
        link: "https://www.fiit.stuba.sk",
        img_src: "https://unsplash.com/photos/PC91Jm1DlWA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM3Njc1MjQx&force=true",
        counter: 0
    });
    await ad.save();
}

makeAssociations().then(() => {
    productSeeder().then(() => {
        adSeeder().then(() => {
            console.log("DB seeding completed");
        });
    });
});

module.exports = app;
