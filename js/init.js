const EMERCADO_HOST = 'http://localhost:3000';
const CATEGORIES_URL =  EMERCADO_HOST + "/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =  EMERCADO_HOST + "/emercado-api/sell/publish.json";
const PRODUCTS_URL =  EMERCADO_HOST + "/emercado-api/cats_products/";
const PRODUCT_INFO_URL =  EMERCADO_HOST + "/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =  EMERCADO_HOST + "/emercado-api/products_comments/";
const CART_INFO_URL =  EMERCADO_HOST + "/emercado-api/user_cart/";
const CART_BUY_URL =  EMERCADO_HOST + "/emercado-api/cart/buy.json";
const CART_PURCHASE_URL = EMERCADO_HOST + "/purchase";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}