const assert = require('assert');
const nodeFetch = require('node-fetch')
const fetch = require('fetch-cookie')(nodeFetch)

function loadJson(url, queryParam = {}, method="GET") {
    let query = Object.keys(queryParam)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParam[k]))
        .join('&');
    url = url + "?" + query;
    let options = {method: method};
    return fetch(url, options);
}

const urlBackend = 'http://localhost:8080';

describe('Backend tests', function() {
    describe('Database seeding complete', function () {
        it('Sluchatka - product', async function () {
            await loadJson(urlBackend + '/product_data')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.products[0].name, 'Sluchatka');
                    assert.strictEqual(data.products[0].cost, 30);
                });
        });
        it('Mikrofon - product', async function () {
            await loadJson(urlBackend + '/product_data')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.products[1].name, 'Mikrofon');
                    assert.strictEqual(data.products[1].cost, 40.50);
                });
        });
        it('Gitara - product', async function () {
            await loadJson(urlBackend + '/product_data')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.products[2].name, 'Gitara');
                    assert.strictEqual(data.products[2].cost, 89.99);
                });
        });
        it('Ad', async function () {
            await loadJson(urlBackend + '/ad')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ad.link, 'https://www.fiit.stuba.sk');
                    assert.strictEqual(data.ad.counter, 0);
                });
        });
    });
    describe('Changing ad data', function () {
        it('Change link', async function () {
            let params = {};
            params["link"] = "https://www.google.sk";
            await loadJson(urlBackend + '/change_ad', params, "POST")
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ok, true);
                });
        });
        it('Increment counter', async function () {
            await loadJson(urlBackend + '/update_counter', {}, "POST")
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ok, true);
                });
        });
        it('Is link and counter changed?', async function () {
            await loadJson(urlBackend + '/ad')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ad.link, "https://www.google.sk");
                    assert.strictEqual(data.ad.counter, 1);
                });
        });
    });
    describe('Creating order', function () {
        let orderId;
        it('Retrieving order id', async function () {
            await loadJson(urlBackend + '/create_order')
                .then(res => res.json())
                .then(data => {
                    orderId = data.order;
                    let truth = orderId > 0;
                    assert.strictEqual(truth, true);
                });
        });
        it('Add product with id 1 with amount of 3', async function () {
            let params = {};
            params["productId"] = 1;
            params["orderId"] = orderId;
            params["quantity"] = 3;
            await loadJson(urlBackend + '/add_product', params, "POST")
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ok, true);
                });
        });
        it('Retrieving product groups of this order', async function () {
            let params = {};
            params["orderId"] = orderId;
            await loadJson(urlBackend + '/product_groups', params)
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.productGroups.length, 1);
                });
        });
        it('Adding customer data', async function () {
            let params = {};
            params["orderId"] = orderId;
            params["name"] = "Skuska";
            params["email"] = "skuska@skuska.sk";
            params["street"] = "ulica";
            params["number"] = "cislo";
            params["postalCode"] = "02015";
            params["city"] = "BA";
            await loadJson(urlBackend + '/add_customer', params, "POST")
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ok, true);
                });
        });
        it('Retrieving customer infos', async function () {
            await loadJson(urlBackend + '/customers')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.customers.length, 1);
                });
        });
        it('Changing order state to delivered', async function () {
            let params = {};
            params["orderId"] = orderId;
            params["state"] = "delivered";
            await loadJson(urlBackend + '/change_order_state', params, "POST")
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.ok, true);
                });
        });
        it('Retrieving all orders - should be only one', async function () {
            await loadJson(urlBackend + '/orders')
                .then(res => res.json())
                .then(data => {
                    assert.strictEqual(data.orders.length, 1);
                });
        });
    });
});