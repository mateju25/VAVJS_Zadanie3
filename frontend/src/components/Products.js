import React, {useRef} from 'react';
import loadJson from "../help";

function Products(props) {
    const inputRef = useRef(null);

    async function addToCart(id) {
        let params = {};
        params["productId"] = id;
        params["orderId"] = props.orderId;
        params["quantity"] = document.getElementById("input_"+id).value;
        document.getElementById("input_"+id).value = 1;
        await loadJson('http://localhost:8080/add_product', params, "POST");
    }

    function showProducts() {
        return props.data.map((element) => {
            return (
                <div key={element.id} style={{margin: "20px 20px 20px 20px", border: "2px solid black"}}>
                    <h1>{element.name}</h1>
                    <img src={element.img_src} alt={element.name} width='200' height='200'/>
                    <h2>{element.cost} €</h2>
                    <input id={"input_" + element.id} type="number" min="1" defaultValue="1" ref={inputRef}/>
                    <button id={"btn_" + element.id} onClick={() => {addToCart(element.id)}}>Add to cart</button>
                </div>
            );
        });
    }

    return (
        <div style={{display: "flex"}}>
            {
                showProducts()
            }
        </div>
    );
}

export default Products;