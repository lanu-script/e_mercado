let userInfo = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!('user' in window.localStorage)) { // validar que usuario exista
        window.location.href = "index.html";
    }
    let userId = window.localStorage.getItem("user");
    document.getElementById("userId").innerText = userId;
    userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}");
    for (let elemento in userInfo) {
        console.log(elemento);
        document.getElementById(elemento).value = userInfo[elemento];
    }
    let userImg = window.localStorage.getItem("usuarioImagen",null);
    if(userImg !== null) {
        document.getElementById("userImg").src = userImg;
    }
});

async function save() {
    let form = document.getElementById("formulario-datos");
    let valid = form.checkValidity();
    form.classList.add('was-validated');
    if (valid) {
        Array.from(document.getElementsByClassName("form-control")).forEach(input => {
            if (input.value.length > 0 && input.type != 'file') {
                userInfo[input.id] = input.value;
            }
        });
        let imageInput = document.getElementById("image-input");
        if(imageInput.files.length > 0) {
            let file = imageInput.files[0];
            let reader = new FileReader();
            let promise = new Promise((resolve, reject) => {
                reader.addEventListener("load", () => {
                    resolve(reader.result);
                }, false);
                reader.readAsDataURL(file);
            });
            let imageDataUrl = await promise;
            window.localStorage.setItem("usuarioImagen", imageDataUrl);
        }
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
        document.getElementsByClassName("alert-success")[0].classList.remove("d-none");
        setTimeout(() => window.location.href = 'my-profile.html', 5000)
    }
}