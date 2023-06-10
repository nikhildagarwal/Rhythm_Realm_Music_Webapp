document.querySelector(".back").addEventListener(("click"),()=>{
    if(localStorage.getItem("username") == null){
        window.location.href = "../html/login.html";
    }else{
        window.location.href = "../html/confirm_password.html";
    }
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
})