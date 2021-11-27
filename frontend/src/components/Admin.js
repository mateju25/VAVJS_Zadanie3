import React, {useEffect, useRef, useState} from 'react';
import loadJson from "../help";
import App from "../App";
import Ad from "./Ad";


function Admin(props) {
    const inputRef = useRef(null);
    const [state, setState] = useState("admin");

    async function changeState(id) {
        let params = {};
        params["orderId"] = props.orderId;
        params["state"] = document.getElementById("select_" + id).value;
        document.getElementById("state_" + id).innerText = "Stav: " + document.getElementById("select_" + id).value;
        await loadJson('http://localhost:8080/change_order_state', params, "POST");
    }

    async function getProductGroups(orderId) {
        let params = {};
        params["orderId"] = orderId;
        let totalCost = 0;
        await loadJson('http://localhost:8080/product_groups', params)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.productGroups.length; i++) {
                    totalCost += data.productGroups[i].quantity * data.productGroups[i].product.cost;
                }
            });
        return totalCost;
    }

    function getCustomerInfo(customer) {
        if (customer == null)
            return (<div><p>User did not fill data yet.</p></div>);
        else
            return (
                <div>
                    <label>Name: </label>
                    <p>{customer.name}</p>
                    <label>Email: </label>
                    <p>{customer.email}</p>
                    <label>Street: </label>
                    <p>{customer.street}</p>
                    <label>Number: </label>
                    <p>{customer.number}</p>
                    <label>City: </label>
                    <p>{customer.city}</p>
                    <label>Postal code: </label>
                    <p>{customer.postal_code}</p>
                </div>
            );
    }

    function getCost(productGroups) {
        let quantity = 0;
        let cost = 0;
        for (let i = 0; i < productGroups.length; i++) {
            quantity += productGroups[i].quantity;
            cost +=  productGroups[i].quantity * props.products[productGroups[i].productId - 1].cost;
        }

        return (
            <div>
                <label>Cena dokopy: </label>
                <p>{cost}</p>
                <label>Počet všetkých kusov: </label>
                <p>{quantity}</p>
            </div>
        );
    }

    function showOrders() {
        let number = 0;
        return props.data.map((element) => {
            number++;
            return (
                <div key={element.id} style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "20px 20px 20px 20px",
                    border: "2px solid black"
                }}>
                    <h1>Objednávka číslo: {number}</h1>
                    <h1 id={"state_" + element.id}>Stav: {element.state}</h1>
                    <div>
                        {
                            getCost(element.product_groups)
                        }
                    </div>
                    <div>
                        {
                            getCustomerInfo(element.customer)
                        }
                    </div>
                    <div>
                        <label htmlFor={"select_" + element.id}>New state: </label>
                        <select id={"select_" + element.id} value={""} onChange={() => {
                            changeState(element.id)
                        }} ref={inputRef}>
                            <option disabled={true} value=""></option>
                            <option value="adding products">Adding products</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                            <option value="accepted by customer">Accepted by customer</option>
                        </select>
                    </div>
                </div>
            );
        });
    }

    function changeAd() {
        let params = {};
        if (document.getElementById("input_link_ad").value !== "")
            params["link"] = document.getElementById("input_link_ad").value;
        if (document.getElementById("input_image_ad").value !== "")
            params["img_src"] = document.getElementById("input_image_ad").value;
        loadJson('http://localhost:8080/change_ad', params, "POST");
        setState("homepage");

    }

    function chooseShoppingCart() {
        setState("homepage");
    }

    if (state === "admin") {
        return (
            <div>
                <button onClick={() => {
                    chooseShoppingCart()
                }}>Spat
                </button>
                <div>
                    <Ad/>
                    <label>Ad link: </label>
                    <input id={"input_link_ad"} type="text" defaultValue={""} ref={inputRef}/>
                    <br/>
                    <label>Img link: </label>
                    <input id={"input_image_ad"} type="text" defaultValue={""} ref={inputRef}/>
                    <br/>
                    <button onClick={() => {changeAd()}}>Change Ad</button>
                </div>
                <div>
                    {
                        showOrders()
                    }
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
}

export default Admin;