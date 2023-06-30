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
    
    loadSongs();
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
})

function loadSongs(){
    fetch(`/api/load_songs`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            var masterArray = [];
            for(let i = 0;i<result.length;i++){
                let filename = result[i];
                let array = filename.split("-");
                let song = array[0].replace(/_/g,' ');
                let image = "dfs";
                let artist = array[1].substring(0,array[1].length-4).replace(/_/g,' ');
                const sub = [song,artist,filename,image];
                masterArray.push(sub);
            }
            let message = ``;
            masterArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[0]} - ${item[1]}</option>`;
                message+=subMessage;
            })
            document.getElementById("mySelect").innerHTML += message;
        })
    })
}

function filterOptions() {
    const input = document.getElementById('myInput').value.toLowerCase();
    const select = document.getElementById('mySelect');

    // Show/hide options based on the typed input
    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      const optionText = option.text.toLowerCase();

      if (optionText.includes(input)) {
        option.style.display = '';
      } else {
        option.style.display = 'none';
      }
    }
  }