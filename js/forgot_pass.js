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

document.querySelector(".button").addEventListener('click',()=>{
    document.getElementById("email-error-empty").className = "error1";
    document.getElementById("email-error-invalid").className = "error1";
    document.getElementById("email-error-not-associated").className = "error1";
    let email = document.getElementById("email-field").value;
    if(email==""){
        document.getElementById("email-error-empty").className = "error";
        return;
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.match(emailPattern)){
        document.getElementById("email-error-invalid").className = "error";
        return;
    }
    fetch(`/api/check_valid_email/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        if(response.status == 200){
            response.json().then((username)=>{
                console.log(username[0]+"    "+username[1]);
            })
        }else{
            document.getElementById("email-error-not-associated").className = "error";
        }
    })
})