window.onload = function(){
    if(localStorage.getItem("username") != null){
        document.querySelector(".container").innerHTML = `<div class = "logItem1" id="profile" title="View Profile">
        <span class="logText"></span><i class="fa-solid fa-user"></i></span><div class="signtext">Profile</div>
    </div>
    <div class="logItem" id="logout" title="Log Out">
        <span class="logText"></span><i class="fa-solid fa-right-from-bracket fa-flip-horizontal"></i></span><div class="signtext1">Log Out</div>
    </div>`;
    document.getElementById("logout").addEventListener(("click"),()=>{
        window.location.href="../html/logout.html";
    })
    document.getElementById("profile").addEventListener(("click"),()=>{
        window.location.href="../html/profile.html";
    })
    }else{
        document.querySelector(".container").innerHTML = `<div class = "logItem" id="signup" title="Sign Up">
        <span class="logText"></span><i class="fa-solid fa-user-plus" ></i></span><div class="signtext2">Sign Up</div>
    </div>
    <div class="logItem" id="login" title="Log In">
        <span class="logText"></span><i class="fa-solid fa-right-to-bracket"></i></span><div class="signtext3">Log In</div>
    </div>`;
    document.getElementById("signup").addEventListener(("click"),()=>{
        window.location.href="../html/signup.html";
    })
    document.getElementById("login").addEventListener(("click"),()=>{
        window.location.href="../html/login.html";
    })
    }
    
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
})

