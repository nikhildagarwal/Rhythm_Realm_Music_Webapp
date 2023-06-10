
document.querySelector(".login").addEventListener(("click"),()=>{
    window.location.href = '../html/login.html';
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
})

document.getElementById("submit-btn").addEventListener(("click"),()=>{
    reset();
    let anyEmpty = false;
    let email = document.getElementById("email-field").value;
    if(checkEmpty(email)){
        document.getElementById("email-error-empty").className = "error";
        anyEmpty = true;
    }
    let username = document.getElementById("username-field").value;
    if(checkEmpty(username)){
        document.getElementById("username-error-empty").className="error";
        anyEmpty = true;
    }
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    if(checkEmpty(password1) || checkEmpty(password2)){
        document.getElementById("password-error-empty").className = "error";
        anyEmpty = true;
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.match(emailPattern)){
        anyEmpty = true;
        document.getElementById("email-error-invalid").className = "error";
    }
    if(password1.length<6 || password2.length<6){
        anyEmpty = true;
        document.getElementById("password-error-short").className = "error";
    }
    if(password1!=password2){
        anyEmpty = true;
        document.getElementById("password-error-mismatch").className = "error";
    }
    if(anyEmpty){
        return;
    }
    fetch(`/api/getUserList/${username}/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            console.log(result);
            let answer = result.split(",");
            let beenError = false;
            if(answer[0] == "1"){
                document.getElementById("username-error-taken").className = "error";
                beenError = true;
            }
            if(answer[1] == "1"){
                document.getElementById("email-error-inuse").className = "error";
                beenError = true;
            }
            if(beenError){
                return;
            }
            fetch(`/api/createUser/${email}/${username}/${password1}`,{
                method:"POST",
                cache:"no-cache"
            }).then((response)=>{
                if(response.status == 200){
                    localStorage.setItem("username",username);
                    localStorage.setItem("email",email);
                    localStorage.setItem("password_length",password1.length.toString());
                    window.location.href = "../html/home.html";
                }
            })
        })
    })
})

function reset(){
    document.getElementById("email-error-inuse").className = "error1";
    document.getElementById("email-error-invalid").className = "error1";
    document.getElementById("email-error-empty").className = "error1";
    document.getElementById("username-error-taken").className = "error1";
    document.getElementById("username-error-empty").className = "error1";
    document.getElementById("password-error-short").className = "error1";
    document.getElementById("password-error-mismatch").className = "error1";
    document.getElementById("password-error-empty").className = "error1";
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