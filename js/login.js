window.onload = function(){
    console.log("hi");
    document.getElementById("loading-display").className = "loading_display off";
}

document.querySelector(".signup").addEventListener(("click"),()=>{
    window.location.href = '/api/signup';
})

document.querySelector(".forgot").addEventListener(("click"),()=>{
    window.location.href = '/api/forgot/username';
})

document.querySelector(".forgotpass").addEventListener(("click"),()=>{
    window.location.href = '/api/forgot/password';
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "/api/home";
})

document.querySelector(".button").addEventListener(("click"),()=>{
    reset();
    let username = document.getElementById("username-field").value;
    let password = document.getElementById("password-field").value;
    let errOcc = false;
    if(checkEmpty(username)){
        errOcc = true;
        document.getElementById("username-empty").className = "error";
    }
    if(checkEmpty(password)){
        errOcc = true;
        document.getElementById("password-empty").className = "error";
    }
    if(errOcc){
        return;
    }
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/checkLogIn/${username}/${password}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        switch(response.status){
            case 400:
                document.getElementById("username-error").className = "error";
                break;
            case 401:
                document.getElementById("password-error").className = "error";
                break;
            case 200:
                localStorage.setItem("username",username);
                response.json().then((result)=>{
                    let twoParts = result.split(",");
                    localStorage.setItem("email",twoParts[0]);
                    localStorage.setItem("userid",twoParts[1]);
                })
                localStorage.setItem("password_length",password.length.toString());
                window.location.href = "/api/home";
        }
    })
})

function reset(){
    document.getElementById("username-error").className = "error1";
    document.getElementById("password-error").className = "error1";
    document.getElementById("username-empty").className = "error1";
    document.getElementById("password-empty").className = "error1";
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