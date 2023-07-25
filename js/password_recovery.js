let userid = "";

window.onload=function(){
    document.getElementById("loading-display").className = "loading_display";
    let url = window.location.href;
    let array = url.split("/");
    userid = array[array.length-1];
    document.getElementById("loading-display").className = "loading_display off";
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

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
    fetch(`/api/reset_passwords_from_recovery/${userid}/${password1}`,{
        method:"POST",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
        if(response.status==200){
            response.json().then((email)=>{
                document.getElementById("loading-display").className = "loading_display";
                fetch(`/api/changed_password_notif/${email}`,{
                    method:"POST",
                    cache:"no-cache"
                }).then((response)=>{
                    document.getElementById("loading-display").className = "loading_display off";
                })
            })
            document.getElementById("changed1").className = "success";
            setTimeout(function(){
                document.getElementById("changed1").className = "success1";
                window.location.href="/api/login";
            },1500)

        }
    })
})

function resetSecondErrors(){
    document.getElementById("empty1").className = "error1";
    document.getElementById("length1").className = "error1";
    document.getElementById("mismatch1").className = "error1";
}