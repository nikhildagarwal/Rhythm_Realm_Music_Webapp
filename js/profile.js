
window.onload = function(){
    document.getElementById("loading-display").className = "loading_display";
    if(localStorage.getItem("username")==null){
        window.location.href="/api/login";
    }
    document.getElementById("email-field").value = localStorage.getItem("email");
    document.getElementById("username-field").value = localStorage.getItem("username");
    let count = parseInt(localStorage.getItem("password_length"));
    let ans = "";
    for(let i =0;i<count;i++){
        ans+="* ";
    }
    document.getElementById("password1").value = ans;
    document.getElementById("loading-display").className = "loading_display off";
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

document.querySelector(".back").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

document.getElementById("change-email").addEventListener(("click"),()=>{
    resetEmailErrors();
    resetNewEmail();
})

document.getElementById("change-username").addEventListener(("click"),()=>{
    resetUsernameErrors();
    resetNewUsername();
})

document.getElementById("new-email-button").addEventListener(("click"),()=>{
    resetEmailErrors();
    if(document.getElementById("email-field").value == localStorage.getItem("email")){
        resetNewEmail();
        return;
    }
    let email = document.getElementById("email-field").value;
    if(checkEmpty(email)){
        document.getElementById("email-empty").className = "error";
        return;
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.match(emailPattern)){
        document.getElementById("email-invalid").className = "error";
        return;
    }
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/checkEmailMatchFound/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        if(response.status==200){
            document.getElementById("loading-display").className = "loading_display";
            fetch(`/api/changeEmail/${email}/${localStorage.getItem("username")}/`,{
                method:"POST",
                cache:"no-cache"
            }).then((response)=>{
                document.getElementById("loading-display").className = "loading_display off";
                if(response.status==200){
                    localStorage.setItem("email",email);
                    resetEmailErrors();
                    resetNewEmail();
                    document.getElementById("email-updated").className = "success";
                    setTimeout(function(){
                        document.getElementById("email-updated").className = "success1";
                    },5000);
                }
            })
        }else{
            document.getElementById("email-taken").className = "error";
        }
    })
})

document.getElementById("new-username-button").addEventListener(("click"),()=>{
    resetUsernameErrors();
    let username = document.getElementById("username-field").value;
    if(username == localStorage.getItem("username")){
        resetNewUsername();
        return;
    }
    if(checkEmpty(username)){
        document.getElementById("username-empty").className = "error";
        return;
    }
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/checkUsernameMatchFound/${username}`,{
        method:"GET",
        chache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        if(response.status == 200){
            document.getElementById("loading-display").className = "loading_display";
            fetch(`/api/changeUsername/${username}/${localStorage.getItem("username")}`,{
                method:"POST",
                cache:"no-cache"
            }).then((response)=>{
                document.getElementById("loading-display").className = "loading_display off";
                if(response.status==200){
                    localStorage.setItem("username",username);
                    resetNewUsername();
                    resetUsernameErrors();
                    document.getElementById("username-updated").className = "success";
                    setTimeout(function(){
                        document.getElementById("username-updated").className = "success1";
                    },5000);
                }
            })
        }else{
            document.getElementById("username-taken").className = "error";
        }
    })
})

function resetUsernameErrors(){
    document.getElementById("username-empty").className = "error1";
    document.getElementById("username-taken").className = "error1";
}

function resetEmailErrors(){
    document.getElementById("email-empty").className = "error1";
    document.getElementById("email-invalid").className ="error1";
    document.getElementById("email-taken").className = "error1";
}

function resetNewEmail(){
    document.getElementById("new-email-button").classList.toggle("clicked");
        document.getElementById("email-left-arrow").classList.toggle("fa-rotate-270");
        if(document.getElementById("email-field").disabled==true){
            document.getElementById("email-field").disabled = false;
            document.getElementById("email-field").focus();
        }else{
            document.getElementById("email-field").value = localStorage.getItem("email");
            document.getElementById("email-field").disabled = true;
        }
}

function resetNewUsername(){
    document.getElementById("new-username-button").classList.toggle("clicked");
    document.getElementById("username-left-arrow").classList.toggle("fa-rotate-270");
    if(document.getElementById("username-field").disabled==true){
        document.getElementById("username-field").disabled = false;
        document.getElementById("username-field").focus();
    }else{
        document.getElementById("username-field").value = localStorage.getItem("username");
        document.getElementById("username-field").disabled = true;
    }
}

function checkEmpty(value){
    let array = value.split(" ");
    for(let i =0;i<array.length;i++){
        if(array[i]!=""){
            return false;
        }
    }
    return true;
}

document.getElementById("reset-password").addEventListener(("click"),()=>{
    window.location.href = "/api/confirm/password";
})