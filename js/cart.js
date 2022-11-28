function enable_disable() {
    if (!document.getElementById("bank").checked) {
        document.getElementById("bank-num").setAttribute("disabled", "1");
        document.getElementById("bank-num").removeAttribute("required");
    } else {
        document.getElementById("bank-num").removeAttribute("disabled");
        document.getElementById("bank-num").setAttribute("required", "1");
    }
    if (!document.getElementById("card").checked) {
        document.getElementById("card-num").setAttribute("disabled", "1");
        document.getElementById("card-num").removeAttribute("required");
        document.getElementById("card-sec").setAttribute("disabled", "1");
        document.getElementById("card-sec").removeAttribute("required");
        document.getElementById("card-ven").setAttribute("disabled", "1");
        document.getElementById("card-ven").removeAttribute("required");
    } else {
        document.getElementById("card-num").removeAttribute("disabled");
        document.getElementById("card-num").setAttribute("required", "1");
        document.getElementById("card-sec").removeAttribute("disabled");
        document.getElementById("card-sec").setAttribute("required", "1");
        document.getElementById("card-ven").removeAttribute("disabled");
        document.getElementById("card-ven").setAttribute("required", "1");
    }
}
enable_disable();

function tryPurchase() {
    Array.from(document.getElementsByTagName("form")).forEach(form => {
        const isValid = form.checkValidity();
        const havePaytype = Array.from(document.getElementsByName("paytype")).some(p => p.checked);
        const haveAllPayData = havePaytype && Array.from(document.getElementById("paymentMethod").getElementsByTagName("input")).filter(i => i.hasAttribute("required")).every(p => p.checkValidity());
        if (!havePaytype || !haveAllPayData) {
            document.getElementById("method-feedback").classList.add('d-block');
        } else {
            document.getElementById("method-feedback").classList.remove('d-block');
        }
        if (isValid && havePaytype) {
            let products = Array.from(document.getElementById("article-table").children).slice(1).map(p => {
                return {
                    'name': p.children[1].innerText,
                    'cost': p.children[2].innerText,
                    'qty': p.children[3].value
                };
            });
            let postage = document.getElementById("postage-type").value;
            let address = {
                'street': document.getElementById("street").value,
                'door': document.getElementById("door").value,
                'corner': document.getElementById("corner").value
            };
            let active_option = ["bank", "card"].find(p => document.getElementById(p).checked);
            let payment_data = {};
            switch (active_option) {
                case 'bank':
                    payment_data.bank_account = document.getElementById("bank-num").value;
                    break;
                case 'card':
                    payment_data.card_number = document.getElementById("card-num").value;
                    payment_data.card_security = document.getElementById("card-sec").value;
                    payment_data.card_validity = document.getElementById('card-ven').value;
                    break;
            }
            fetch(CART_PURCHASE_URL, {
                'method': "POST", "body": JSON.stringify(
                    { products, postage, address, active_option, payment_data }
                ),
                'headers': { 'Content-Type': 'application/json' }
            }).then(r => r.json()).then(r => {
                document.getElementById("cart-id").innerText = r.orderId;
                new bootstrap.Toast(document.getElementById("liveToast")).show();
            });
        }
        form.classList.add("was-validated");
    });
}

function close_modal() {
    let active_option = ["bank", "card"].find(p => document.getElementById(p).checked);
    let option = { 'bank': "Transferencia bancaria", "card": "Tarjeta de crédito" }[active_option];
    document.getElementById("pay-type").innerText = option;
}

function calculateSubtotalPerArticle(subtotalElement, article, countElement) {
    let count = countElement.valueAsNumber;
    subtotalElement.innerText = article.currency + " " + count * article.unitCost;
    calculateSubtotalCart();
}

function calculateSubtotalCart() {
    const subtotal = (Array.from(document.getElementsByClassName("cost-article"))
        .map(p => p.innerText.split(" "))
        .map(p => p[0] == "USD" ? Number.parseInt(p[1]) : Number.parseInt(p[1]) / 41) // convertimos a dolares los articulos que vengan en pesos
        .reduce((p, c) => p + c, 0));
    document.getElementById("cart-subtotal").innerText = "USD " + subtotal;

    const postage = (Number.parseInt(document.getElementById("postage-type").value) / 100) * subtotal;
    document.getElementById("cart-postage").innerText = "USD " + postage;

    const total = subtotal + postage;
    document.getElementById("cart-total").innerText = "USD " + total;
}

document.addEventListener("DOMContentLoaded", async function () {
    const data = await getJSONData(CART_INFO_URL + "25801.json");
    for (let article of data.data.articles) {
        let row = document.createElement("tr");
        // crear fila
        let img = document.createElement("td");
        let imgElem = document.createElement("img");
        imgElem.classList.add("w-100");
        imgElem.classList.add("d-block");
        imgElem.src = article.image;
        img.classList.add("w-25");
        img.appendChild(imgElem);
        row.appendChild(img);
        // crear imagen
        let name = document.createElement("td");
        name.innerText = article.name;
        row.appendChild(name);
        // crear nombre
        let cost = document.createElement("td");
        cost.innerText = article.currency + " " + article.unitCost;
        row.appendChild(cost);
        // crear costo
        let count = document.createElement("td");
        let countInput = document.createElement("input");
        countInput.type = "number";
        countInput.value = article.count;
        countInput.min = "1";
        countInput.classList.add("form-control");
        count.appendChild(countInput);
        row.appendChild(count);
        // crear input de unidades
        let subtotal = document.createElement("td");
        calculateSubtotalPerArticle(subtotal, article, countInput);
        row.appendChild(subtotal);
        subtotal.classList.add("cost-article");
        // crear y calcular subtotal
        countInput.addEventListener("click", () => calculateSubtotalPerArticle(subtotal, article, countInput));
        // agregar evento para recalcular subtotal cuando cambia conteo
        document.getElementById("article-table").appendChild(row);
    }
    calculateSubtotalCart();
});