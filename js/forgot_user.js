document.querySelector(".back").addEventListener(("click"),()=>{
    window.location.href = "/api/login";
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
    fetch(`/api/check_valid_email/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        if(response.status == 200){
            response.json().then((username)=>{
                fetch(`/api/send_email_forgot_username/${username[0]}/${email}`,{
                    method:"POST",
                    cache:"no-cache"
                }).then((sent)=>{
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