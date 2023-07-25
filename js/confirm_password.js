window.onload=function(){
    document.getElementById("loading-display").className = "loading_display on";
    if(localStorage.getItem("username")==null){
        window.location.href="/api/login";
    }
    document.getElementById("loading-display").className = "loading_display off";
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

document.querySelector(".back").addEventListener(("click"),()=>{
    window.location.href="/api/profile";
})

document.querySelector(".signup").addEventListener(("click"),()=>{
    window.location.href="/api/forgot/password";
})

document.getElementById("confirm-button").addEventListener(("click"),()=>{
    resetErrors();
    let password = document.getElementById("password-field").value;
    if(checkEmpty(password)){
        document.getElementById("empty").className = "error";
        return;
    }
    if(parseInt(localStorage.getItem("password_length"))!=password.length){
        document.getElementById("incorrect").className = "error";
        return;
    }
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/checkLogIn/${localStorage.getItem("username")}/${password}/`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        if(response.status==200){
            document.getElementById("confirmed").className = "success";
            setTimeout(function(){
                document.getElementById("confirmed").className = "success1";
                document.getElementById("container-one").className = "container1";
                document.getElementById("container-two").className = "container";
            },1500);
        }else{
            document.getElementById("incorrect").className = "error";
        }
    })
})

function resetErrors(){
    document.getElementById("empty").className = "error1";
    document.getElementById("incorrect").className = "error1";
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

document.getElementById("change-password-button").addEventListener(("click"),()=>{
    resetSecondErrors();
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    if(checkEmpty(password1) || checkEmpty(password2)){
        document.getElementById("empty1").className = "error";
        return;
    }
    if(password1.length<6){
        document.getElementById("length1").className = "error";
        return;
    }
    if(password1 != password2){
        document.getElementById("mismatch1").className = "error";
        return;
    }
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/changePassword/${localStorage.getItem("username")}/${password1}`,{
        method:"POST",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display";
        if(response.status==200){
            localStorage.setItem("password_length",password1.length.toString());
            document.getElementById("changed1").className = "success";
            setTimeout(function(){
                document.getElementById("changed1").className = "success1";
                window.location.href="/api/profile";
            },1500)
        }
    })
})

document.getElementById("to-container-one").addEventListener(("click"),()=>{
    document.getElementById("container-two").className = "container2";
    document.getElementById("container-one").className = "container";
    document.getElementById("password-field").value = "";
})

function resetSecondErrors(){
    document.getElementById("empty1").className = "error1";
    document.getElementById("length1").className = "error1";
    document.getElementById("mismatch1").className = "error1";
}