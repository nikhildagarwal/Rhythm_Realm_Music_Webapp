window.onload = function(){
    
}

document.querySelector(".signup").addEventListener(("click"),()=>{
    window.location.href = '../html/signup.html';
})

document.querySelector(".forgot").addEventListener(("click"),()=>{
    window.location.href = '../html/forgot_username.html';
})

document.querySelector(".forgotpass").addEventListener(("click"),()=>{
    window.location.href = '../html/forgot_password.html';
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
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
    fetch(`/api/checkLogIn/${username}/${password}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
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
                    localStorage.setItem("email",result);
                })
                localStorage.setItem("password_length",password.length.toString());
                window.location.href = "../html/home.html";
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