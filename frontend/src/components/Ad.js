import React, {useEffect, useState} from 'react';
import loadJson from "../help";

function Ad(props) {
    const [ad, setAd] = useState({});

    function loadPage() {
        loadJson('http://localhost:8080/update_counter', {}, "POST").then(() => {
            ad.counter += 1;
            window.location.href = ad.link;
        });
    }


    function getAd() {
        return loadJson('http://localhost:8080/ad')
            .then(res => res.json())
            .then(data => {
                setAd(data.ad);
            });
    }

    useEffect( () => {
        async function fetchData()
        {
            await getAd();
        }
        fetchData();
        return () => {
            setAd({}); // This worked for me
        };
    }, [props]);

    return (
        <div style={{border: "3px red solid", width: "300px", display: "flex", flexDirection: "column", alignItems:" center"}}>
            <h3>Ad</h3>
            <div key={ad.id}>
                <img src={ad.img_src} width='200' height='200' onClick={loadPage}/>
                <p style={{textAlign: "center"}}>Views: {ad.counter}</p>
            </div>
        </div>
    );
}

export default Ad;