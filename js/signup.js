window.onload = function(){
    document.getElementById("loading-display").className = "loading_display off";
}

function generateUserID() {
    const timestamp = Date.now().toString(); // Get the current timestamp as a string
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
  
    return timestamp + randomNum.toString();
  }
  
const userId = generateUserID();

document.querySelector(".login").addEventListener(("click"),()=>{
    window.location.href = '/api/login';
})



document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "/api/home";
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
    if(password1.length<6){
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
    document.getElementById("loading-display").className = "loading_display";
    fetch(`/api/getUserList/${username}/${email}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        document.getElementById("loading-display").className = "loading_display off";
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
            document.getElementById("loading-display").className = "loading_display";
            fetch(`/api/createUser/${email}/${username}/${password1}/${userId}`,{
                method:"POST",
                cache:"no-cache"
            }).then((response)=>{
                document.getElementById("loading-display").className = "loading_display off";
                if(response.status == 200){
                    localStorage.setItem("username",username);
                    localStorage.setItem("email",email);
                    localStorage.setItem("password_length",password1.length.toString());
                    localStorage.setItem("userid",userId);
                    window.location.href = "/api/home";
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