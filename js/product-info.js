function createComment(comment) {
    const item = document.createElement("div");
    item.className = "list-group-item";
    const header = document.createElement("p");
    header.innerHTML = "<b>"+comment.user+"</b> - "+comment.dateTime;
    for(let i = 0; i < 5; i++) {
        const star = document.createElement("i");
        star.className = "bi";
        if(i < comment.score) {
            star.classList.add("bi-star-fill");
        } else if (i > comment.score && comment.score > (i-1)) {
            star.classList.add("bi-star-half");
        } else {
            star.classList.add("bi-star");
        }
        header.appendChild(star);
    }
    item.append(header);
    const desc = document.createElement("p");
    desc.innerText = comment.description;
    item.append(desc);
    document.getElementById("comments").appendChild(item);
}

function makeImgDiv(img) {
    let imgCol = document.createElement("div");
    imgCol.className = "col";
    let imgElem = document.createElement("img");
    imgElem.src = img;
    imgElem.classList.add("w-100");
    imgElem.classList.add("d-block");
    imgCol.appendChild(imgElem);
    return imgCol;
}

async function reload(productId) {
    const productInfo = await (await fetch(PRODUCT_INFO_URL + productId + ".json")).json();
    console.log(productInfo);
    document.getElementById("price").innerText = productInfo.currency + " " + productInfo.cost;
    document.getElementById("description").innerText = productInfo.description;
    document.getElementById("category").innerText = productInfo.category;
    document.getElementById("sold").innerText = productInfo.soldCount;
    document.getElementById("name").innerText = productInfo.name;
    document.getElementById("previewImages").innerHTML = '';
    // crear imagenes del carousel
    for(let img of productInfo.images) {
        let imgEl = makeImgDiv(img);
        imgEl.classList.add("carousel-item");
        imgEl.classList.remove("col");
        document.getElementById("previewImages").appendChild(imgEl);
    }
    let imgs = Array.from(document.getElementById("previewImages").children);
    // marcar la primera como activa sino no se ven
    if(imgs.length > 0) {
        imgs[0].classList.add("active");
    }
    document.getElementById("related-products").innerHTML = "";
    for(let prod of productInfo.relatedProducts) {
        let relProd = document.createElement("div");
        relProd.classList.add("col");
        relProd.classList.add("border");
        let prodName = document.createElement("a");
        prodName.innerText = prod.name;
        prodName.addEventListener("click", function() {
            reload(prod.id);
        });
        prodName.href = "#";
        let prodImg = document.createElement("td");
        prodImg.appendChild(makeImgDiv(prod.image));
        relProd.appendChild(prodName);
        relProd.appendChild(prodImg);
        document.getElementById("related-products").appendChild(relProd);
    }
    const productComments = await (await fetch(PRODUCT_INFO_COMMENTS_URL + productId + ".json")).json();
    document.getElementById("comments").innerHTML = "";
    console.log(productComments);
    for(let comment of productComments) {
        createComment(comment);
    }
}

function addComment() {
    let opinion = document.getElementById("opinion").value;
    let puntaje = Number.parseInt(document.getElementById("puntaje").value);
    let username = window.localStorage.getItem("user");
    let date=new Date();
    let dateTime = date.getFullYear()+"-"+(date.getMonth()+1+"").padStart(2,"0")+"-"+(date.getDate()+1+"").padStart(2,"0")+" "+date.toLocaleTimeString();
    createComment({"user":username, "score":puntaje,"description":opinion,"dateTime":dateTime});
}

document.addEventListener("DOMContentLoaded", function() {
    const productId = window.localStorage.getItem("prodId");
    reload(productId);
});