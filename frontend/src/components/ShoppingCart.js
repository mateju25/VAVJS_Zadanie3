import React, {useEffect, useState} from 'react';
import App from "../App";
import Items from "./Items";
import Ad from "./Ad";
import loadJson from "../help";

function ShoppingCart(props) {
    const [items, setItems] = useState([]);
    const [ad, setAd] = useState({});
    const [state, setState] = useState("cart");
    const [total, setTotal] = useState("");
    const [info, setInfo] = useState({
        name: undefined,
        street: undefined,
        email: undefined,
        postalCode: undefined,
        city: undefined,
        number: undefined
    });


    function getItems() {
        let params = {};
        params["orderId"] = props.orderId;
        return loadJson('http://localhost:8080/product_groups', params)
            .then(res => res.json())
            .then(data => {
                setItems(data.productGroups);
                let totalCost = 0;
                for (let i = 0; i < data.productGroups.length; i++) {
                    totalCost += data.productGroups[i].quantity * data.productGroups[i].product.cost;
                }
                setTotal(totalCost + " €");
            });
    }

    function getAd() {
        return loadJson('http://localhost:8080/ad')
            .then(res => res.json())
            .then(data => {
                setAd(data.ad);
            });
    }

    useEffect(() => {
        async function fetchData() {
            await getItems();
            await getAd();
        }

        fetchData();
    }, []);

    function chooseShoppingCart() {
        setState("homepage");
    }

    function chooseCustomerInfo() {
        setState("customerInfo");
    }

    async function choosePayment() {
        await loadJson('http://localhost:8080/customers')
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.customers.length; i++) {
                    if (data.customers[i].email === info.email) {
                        alert("This email already exists!");
                        return;
                    }
                }
                let params = info;
                params["orderId"] = props.orderId;
                loadJson('http://localhost:8080/add_customer', params, "POST");
                setState("payment")
            });
    }

    function changeEmail(event) {
        let oldInfo = info;
        oldInfo["email"] = event.target.value;
        setInfo(oldInfo);
    }

    function changeName(event) {
        let oldInfo = info;
        oldInfo["name"] = event.target.value;
        setInfo(oldInfo);
    }

    function changeStreet(event) {
        let oldInfo = info;
        oldInfo["street"] = event.target.value;
        setInfo(oldInfo);
    }

    function changePostalCode(event) {
        let oldInfo = info;
        oldInfo["postalCode"] = event.target.value;
        setInfo(oldInfo);
    }

    function changeNumber(event) {
        let oldInfo = info;
        oldInfo["number"] = event.target.value;
        setInfo(oldInfo);
    }

    function changeCity(event) {
        let oldInfo = info;
        oldInfo["city"] = event.target.value;
        setInfo(oldInfo);
    }

    if (state === "payment") {
        return (
            <div>
                <button onClick={() => {
                    chooseShoppingCart()
                }}>Spat
                </button>
                <h1>Thanks for your order</h1>
                <div>
                    <Ad />
                </div>
            </div>
        );
    }
    if (state === "homepage") {
        return (
            <div>
                <App orderId={props.orderId}/>
            </div>
        );
    }
    if (state === "cart") {
        return (
            <div>
                <button onClick={() => {
                    chooseShoppingCart()
                }}>Spat
                </button>
                <h1>Košík</h1>
                <div>
                    <Items data={items} orderId={props.orderId}/>
                </div>
                <h1>{total}</h1>
                <button onClick={() => {
                    chooseCustomerInfo()
                }}>Dodacie udaje
                </button>
            </div>
        );
    }

    if (state === "customerInfo") {
        return (
            <div>
                <button onClick={() => {
                    chooseShoppingCart()
                }}>Spat
                </button>
                <h1>Info o dodávke</h1>
                <div>
                    <label>
                        Email:
                        <input type={"email"} pattern={".*@.*[.].*"} value={info.email} onChange={changeEmail}
                               required={true}/>
                    </label>
                    <br/>
                    <label>
                        Name:
                        <input type={"text"} value={info.name} onChange={changeName} required={true}/>
                    </label>
                    <br/>
                    <label>
                        Street:
                        <input type={"text"} value={info.street} onChange={changeStreet} required={true}/>
                    </label>
                    <br/>
                    <label>
                        Number:
                        <input type={"text"} value={info.number} onChange={changeNumber} required={true}/>
                    </label>
                    <br/>
                    <label>
                        Postal code:
                        <input type={"text"} value={info.postalCode} onChange={changePostalCode} required={true}/>
                    </label>
                    <br/>
                    <label>
                        City:
                        <input type={"text"} value={info.city} onChange={changeCity} required={true}/>
                    </label>
                    <br/>
                    <button onClick={() => {
                        choosePayment()
                    }}>Platba
                    </button>
                </div>
            </div>
        );
    }
}

export default ShoppingCart;