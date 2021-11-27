import Product from "./components/Products";
// import Header from "./components/Header";
import ShoppingCart from "./components/ShoppingCart";
import React, {useEffect, useState} from 'react';
import Ad from "./components/Ad";
import loadJson from "./help";
import Admin from "./components/Admin";


function App(props) {
    const [product, setProduct] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState(null);
    const [state, setState] = useState("homepage");

    function getProducts() {
        return loadJson('http://localhost:8080/product_data')
            .then(res => res.json())
            .then(data => {
                setProduct(data.products)
            });
    }

    function getOrderId() {
        return loadJson('http://localhost:8080/create_order')
            .then(res => res.json())
            .then(data => {
                setOrderId(data.order)
            });
    }

    function getOrders() {
        return loadJson('http://localhost:8080/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders)
            });
    }



    useEffect( () => {
        async function fetchData()
        {
            await getProducts();
            if (props.orderId === undefined)
                await getOrderId();
            else
                setOrderId(props.orderId)
            await getOrders();
        }
        fetchData();
    }, [props]);

    function chooseShoppingCart() {
        setState("cart");
    }

    function chooseAdmin() {
        getOrders().then(() => {
            setState("admin");
        });

    }
    if (state === "homepage") {
        return (
            <div>
                <button onClick={() => {chooseShoppingCart()}}>Kosik</button>
                <button onClick={() => {chooseAdmin()}}>Admin</button>
                <div>
                    <Ad />
                </div>
                <div>
                    <Product data={product} orderId={orderId}/>
                </div>
            </div>
        );
    }
    if (state === "cart") {
        return (
            <div>
                <ShoppingCart orderId={orderId}/>
            </div>
        );
    }
    if (state === "admin") {
        return (
            <div>
                <Admin data={orders} orderId={orderId} products={product}/>
            </div>
        );
    }
}


export default App;