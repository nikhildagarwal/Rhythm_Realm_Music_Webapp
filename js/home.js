window.onload = function(){
    
    document.querySelector(".search_bar").classList.toggle("off");
    document.querySelector(".select_bar").classList.toggle("off");
    document.querySelector(".filter_bar").classList.toggle("off");
    document.querySelector(".user_add_song").classList.toggle("off");
    document.querySelector(".search_bar").disabled = true;
        document.querySelector(".select_bar").disabled = true;
        document.querySelector(".filter_bar").disabled = true;
    document.querySelector(".user_add_song").disabled = true;
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

let iconMutex =0;
document.getElementById("plus").addEventListener(("click"),()=>{
    let ref = document.getElementById("plus");
    if(iconMutex==0){
        ref.className = "fa-solid fa-xmark fa-fade";
        ref.style = "color: #c63939;";
        ref.title = "Clear";
        iconMutex = 1;
    }else{
        ref.className = "fa-regular fa-square-plus fa-fade";
        ref.style = "color: #1ca8ba;";
        ref.title = "Add Songs";
        iconMutex =0;
    }
})

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href = "../html/home.html";
})

let mutex = 1;
document.getElementById("plus").addEventListener(("click"),()=>{
    document.querySelector(".search_bar").classList.toggle("off");
    document.querySelector(".select_bar").classList.toggle("off");
    document.querySelector(".filter_bar").classList.toggle("off");
    document.querySelector(".user_add_song").classList.toggle("off");
    if(mutex == 0){
        document.querySelector(".search_bar").disabled = true;
        document.querySelector(".select_bar").disabled = true;
        document.querySelector(".filter_bar").disabled = true;
        document.querySelector(".user_add_song").disabled = true;
        document.getElementById("mySelect").value = "Select";
        mutex = 1;
    }else{
        document.querySelector(".search_bar").disabled = false;
        document.querySelector(".select_bar").disabled = false;
        document.querySelector(".filter_bar").disabled = false;
        
        mutex = 0;
    }
})

var masterArray = [];

function loadSongs(){
    fetch(`/api/load_songs`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            fetch(`/api/get_song_list/${localStorage.getItem("username")}`,{
                method:"GET",
                cache:"no-cache"
            }).then((response)=>{
                response.json().then((set)=>{
                    let songSet = new Set(set);
                    for(let i = 0;i<result.length;i++){
                        let filename = result[i];
                        if(!songSet.has(filename)){
                            let array = filename.split("-");
                            let song = array[0].replace(/_/g,' ');
                            let image = "dfs";
                            let artist = array[1].substring(0,array[1].length-4).replace(/_/g,' ');
                            const sub = [song,artist,filename,image];
                            masterArray.push(sub);
                        }
                    }
                    let message = `<option value="Select">Select</option>`;
                    masterArray.forEach((item)=>{
                        let subMessage = `<option value="${item[2]}">${item[0]} - ${item[1]}</option>`;
                        message+=subMessage;
                    })
                    document.getElementById("mySelect").innerHTML = message;
                })
            })
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

function changeList(){
    let val = document.getElementById("filterSelect").value;
    document.querySelector(".user_add_song").disabled = true;
    if(val=="artist"){
        let message = `<option value="Select">Select</option>`;
        masterArray.sort((a,b)=>a[1].localeCompare(b[1]));
            masterArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[1]} - ${item[0]}</option>`;
                message+=subMessage;
            })
            document.getElementById("mySelect").innerHTML = message;
    }else{
        let message = `<option value="Select">Select</option>`;
        masterArray.sort((a,b)=>a[0].localeCompare(b[0]));
            masterArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[0]} - ${item[1]}</option>`;
                message+=subMessage;
            })
            document.getElementById("mySelect").innerHTML = message;
    }
}

function spoof_btn(){
    let val = document.getElementById("mySelect").value;
    if(val=="Select"){
        document.querySelector(".user_add_song").disabled = true;
    }else{
        document.querySelector(".user_add_song").disabled = false;
    }
}

document.querySelector(".user_add_song").addEventListener(("click"),()=>{
    document.getElementById("myInput").value = "";
    fetch(`/api/add_song_to_user/${localStorage.getItem("username")}/${document.getElementById("mySelect").value}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        if(response.status==200){
            document.getElementById("mySelect").value = "Select";
            document.querySelector(".user_add_song").disabled = true;
        }
    })
})