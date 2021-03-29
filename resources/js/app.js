
import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'

window.addEventListener('DOMContentLoaded', function() {

    let addToCart = document.querySelectorAll(".add-to-cart");
    let cartCounter = document.querySelector("#cartCounter")

    function updateCart(pizza) {

        axios.post('/update-cart', pizza).then(res => {
            cartCounter.innerText = res.data.totalQty
            new Noty({
                text: "Item added to cart",
                type: 'success',
                timeout: 1000,
                progressBar: false
            }).show();
        }).catch(err => {
            new Noty({
                text: "Something went wrong",
                type: 'error',
                timeout: 1000,
                progressBar: false
            }).show();
        })
    }

    addToCart.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let pizza = JSON.parse(btn.dataset.pizza)
            updateCart(pizza)
        })
    })

    // Remove alert message after X seconds 
    const alertMsg = document.querySelector('#success-alert')
    if(alertMsg) {
        setTimeout(() => {
            alertMsg.remove()
        }, 2000)
    }

    initAdmin()
})
