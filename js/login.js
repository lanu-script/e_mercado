function validateLogin() {
    let form = document.getElementById("login-form");
    // validamos el formulario
    let isvalid = form.checkValidity();
    form.classList.add("was-validated");
    return isvalid;
}

function attemptLogin() {
    if(validateLogin()) {
        window.localStorage.setItem("user", document.getElementById("email-input").value);
        window.localStorage.setItem("password", document.getElementById("password-input").value);
        window.location.href = "main.html";
    }
}