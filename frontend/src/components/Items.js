import React, {useRef} from 'react';
import loadJson from "../help";

function Items(props) {
    const inputRef = useRef(null);

    async function addToCart(id) {
        let params = {};
        params["productId"] = id;
        params["orderId"] = props.orderId;
        params["quantity"] = document.getElementById("input_"+id).value;
        document.getElementById("input_"+id).value = params["quantity"];
        await loadJson('http://localhost:8080/add_product', params, "POST");
    }

    function showProducts() {
        return props.data.map((element) => {
            return (
                <div key={element.product.id} style={{display: "flex", justifyContent: "space-around", alignItems: "center", margin: "20px 20px 20px 20px", border: "2px solid black"}}>
                    <h1>{element.product.name}</h1>
                    <h2>{element.product.cost} €</h2>
                    <input id={"input_" + element.product.id} type="number" min="1" defaultValue={element.quantity} ref={inputRef}/>
                    <button id={"btn_" + element.product.id} onClick={() => {addToCart(element.product.id)}}>Change Amount</button>
                </div>
            );
        });
    }

    return (
        <div>
            <div>
            {
                showProducts()
            }
            </div>
        </div>
    );
}

export default Items;