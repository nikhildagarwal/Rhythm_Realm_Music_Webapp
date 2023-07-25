window.onload=function(){
    document.getElementById("loading-display").className = "loading_display off";
}

document.querySelector(".back").addEventListener(("click"),()=>{
    if(localStorage.getItem("username") == null){
        window.location.href = "/api/login";
    }else{
        window.location.href = "/api/confirm/password";
    }
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "/api/home";
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
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/check_valid_email/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        if(response.status == 200){
            response.json().then((username)=>{
                document.getElementById("loading-display").className = "loading_display";
                fetch(`/api/send_forgot_password_email/${username[1]}/${email}`,{
                    method:"POST",
                    cache:"no-cache"
                }).then((sent)=>{
                    document.getElementById("loading-display").className = "loading_display off";
                    if(sent.status==200){
                        window.location.href="/api/email/sent";
                    }
                })
            })
        }else{
            document.getElementById("email-error-not-associated").className = "error";
        }
    })
})