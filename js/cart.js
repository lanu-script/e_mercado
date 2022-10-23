function calculateSubtotal(subtotalElement, article, countElement) {
    let count = countElement.valueAsNumber;
    subtotalElement.innerText = article.currency + " " + count*article.unitCost;
}

document.addEventListener("DOMContentLoaded", async function() {
    const data = await getJSONData(CART_INFO_URL + "25801.json");
    for(let article of data.data.articles) {
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
        countInput.min = "0";
        countInput.classList.add("form-control");
        count.appendChild(countInput);
        row.appendChild(count);
        // crear input de unidades
        let subtotal = document.createElement("td");
        calculateSubtotal(subtotal, article, countInput);
        row.appendChild(subtotal);
        // crear y calcular subtotal
        countInput.addEventListener("click", () => calculateSubtotal(subtotal, article, countInput));
        // agregar evento para recalcular subtotal cuando cambia conteo
        document.getElementById("article-table").appendChild(row);
    }
});