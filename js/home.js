let scrollable = new Map();
let numberOfSongs = 0;
let indexOfPlay = -1;

let audioArray = [];

window.onload = function(){
    document.querySelector(".search_bar").classList.toggle("off");
    document.querySelector(".select_bar").classList.toggle("off");
    document.querySelector(".filter_bar").classList.toggle("off");
    document.querySelector(".user_add_song").classList.toggle("off");
    document.querySelector(".search_bar").disabled = true;
        document.querySelector(".select_bar").disabled = true;
        document.querySelector(".filter_bar").disabled = true;
    document.querySelector(".user_add_song").disabled = true;
    loadSongs();
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
                fetch(`/api/get_song_list/${localStorage.getItem("username")}`,{
                    method:"GET",
                    cache:"no-cache"
                }).then((response)=>{
                    response.json().then((array)=>{
                        for(let i = 0;i<array.length;i++){
                            let filename = array[i][0];
                            let yo = filename.split("-");
                            let song = yo[0].replace(/_/g,' ');
                            let imgName = filename.split(".")[0];
                            let image = `../img/${imgName+".jpeg"}`;
                            let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                            const sub = [song,artist,filename,image];
                            scrollable.set(filename,sub);
                            audioArray.push(new Audio(`../audio/${filename}`));
                            document.getElementById("song-container").innerHTML += `<div class = "item_in_list" data-file="${filename}">
                                    <img src=${image} class = "list_item_img">
                                    <div class="list_item_title">
                                        ${song}
                                    </div>
                                    <div class ="list_item_artist">
                                        ${artist}
                                    </div>
                                    <i class="fa-regular fa-circle-play" id="play-${i}"></i>
                                    <i class="fa-regular fa-heart" id="heart-${i}"></i>
                                    <i class="fa-solid fa-ellipsis" id="dots-${i}"></i>
                                </div>`;
                            numberOfSongs++;
                        }
                        fetch(`/api/check_liked/${localStorage.getItem("username")}`,{
                            method:"GET",
                            cache:"no-cache"
                        }).then((response)=>{
                            response.json().then((result)=>{
                                let arrayMutex = [];
                                
                                for(let j = 0;j<result.length;j++){
                                    if(result[j]=="true"){
                                        document.getElementById(`heart-${j}`).classList.toggle("hit");
                                        arrayMutex.push(1);
                                    }else{
                                        arrayMutex.push(0);
                                    }
                                }
                                /**Start here */
                                for(let i = 0;i<numberOfSongs;i++){
                                    document.getElementById(`heart-${i}`).addEventListener('click',()=>{
                                        document.getElementById(`heart-${i}`).classList.toggle("hit");
                                        if(arrayMutex[i] ==0){
                                            fetch(`/api/change_liked/${localStorage.getItem("username")}/${i}/${true}`,{
                                                method:"POST",
                                                cache:"no-cache"
                                            })
                                            arrayMutex[i] = 1;
                                        }else{
                                            fetch(`/api/change_liked/${localStorage.getItem("username")}/${i}/${false}`,{
                                                method:"POST",
                                                cache:"no-cache"
                                            })
                                            arrayMutex[i] = 0;
                                        }
                                    });
                                    document.getElementById(`play-${i}`).addEventListener('click',()=>{
                                        document.getElementById(`play-${i}`).classList.toggle("hit");
                                        if(indexOfPlay!=-1){
                                            document.getElementById(`play-${indexOfPlay}`).classList.toggle("hit");
                                            audioArray[indexOfPlay].pause();
                                            audioArray[indexOfPlay].currentTime = 0;
                                        }
                                        indexOfPlay = i;
                                        audioArray[indexOfPlay].play();
                                        let audio = audioArray[indexOfPlay];
                                        const checkAudioStopped = setInterval(function() {
                                            if (audio.currentTime >= audio.duration) {
                                              console.log('Audio has stopped playing');
                                              document.getElementById(`play-${indexOfPlay}`).classList.toggle("off");
                                              clearInterval(checkAudioStopped);
                                            }
                                          }, 1000);
                                    })
                                }
                            })
                        })
                    })
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
        ref.style = "color: #e4e4e4;";
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

var masterArray = new Map();

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
                    let songSet = new Set();
                    set.forEach((item)=>{
                        songSet.add(item[0]);
                    })
                    for(let i = 0;i<result.length;i++){
                        let filename = result[i];
                        if(!songSet.has(filename)){
                            let array = filename.split("-");
                            let song = array[0].replace(/_/g,' ');
                            let imgName = filename.split(".")[0];
                            let image = `../img/${imgName+".jpeg"}`;
                            let artist = array[1].substring(0,array[1].length-4).replace(/_/g,' ');
                            const sub = [song,artist,filename,image];
                            masterArray.set(filename,sub);
                        }
                    }
                    let message = `<option value="Select">Select</option>`;
                    masterArray.forEach((value,key)=>{
                        let subMessage = `<option value="${key}">${value[0]} - ${value[1]}</option>`;
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
    populate(masterArray,val);
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
    let filename = document.getElementById("mySelect").value;
    fetch(`/api/add_song_to_user/${localStorage.getItem("username")}/${filename}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        if(response.status==200){
            document.getElementById("mySelect").value = "Select";
            document.querySelector(".user_add_song").disabled = true;
            masterArray.delete(filename);
            populate(masterArray,document.getElementById("filterSelect").value);
            let yo = filename.split("-");
                            let song = yo[0].replace(/_/g,' ');
                            let imgName = filename.split(".")[0];
                            let image = `../img/${imgName+".jpeg"}`;
                            let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                            const sub = [song,artist,filename,image];
                            scrollable.set(filename,sub);
                            audioArray.push(new Audio(`../audio/${filename}`));
                            document.getElementById("song-container").innerHTML += `<div class = "item_in_list" data-file="${filename}">
                                    <img src=${image} class = "list_item_img">
                                    <div class="list_item_title">
                                        ${song}
                                    </div>
                                    <div class ="list_item_artist">
                                        ${artist}
                                    </div>
                                    <i class="fa-regular fa-circle-play" id="play-${numberOfSongs}"></i>
                                    <i class="fa-regular fa-heart" id="heart-${numberOfSongs}"></i>
                                    <i class="fa-solid fa-ellipsis" id="dots-${numberOfSongs}"></i>
                                </div>`;
                            numberOfSongs++;
                            let arrayMutex = [];
                            for(let i = 0;i<numberOfSongs;i++){
                                arrayMutex.push(0);
                                document.getElementById(`heart-${i}`).addEventListener('click',()=>{
                                    document.getElementById(`heart-${i}`).classList.toggle("hit");
                                    if(arrayMutex[i] ==0){
                                        fetch(`/api/change_liked/${localStorage.getItem("username")}/${i}/${true}`,{
                                            method:"POST",
                                            cache:"no-cache"
                                        })
                                        arrayMutex[i] = 1;
                                    }else{
                                        fetch(`/api/change_liked/${localStorage.getItem("username")}/${i}/${false}`,{
                                            method:"POST",
                                            cache:"no-cache"
                                        })
                                        arrayMutex[i] = 0;
                                    }
                                });
                                document.getElementById(`play-${i}`).addEventListener('click',()=>{
                                        document.getElementById(`play-${i}`).classList.toggle("hit");
                                        if(indexOfPlay!=-1){
                                            document.getElementById(`play-${indexOfPlay}`).classList.toggle("hit");
                                            audioArray[indexOfPlay].pause();
                                            audioArray[indexOfPlay].currentTime = 0;
                                        }
                                        indexOfPlay = i;
                                        audioArray[indexOfPlay].play();
                                        let audio = audioArray[indexOfPlay];
                                        const checkAudioStopped = setInterval(function() {
                                            if (audio.currentTime >= audio.duration) {
                                              console.log('Audio has stopped playing');
                                              document.getElementById(`play-${indexOfPlay}`).classList.toggle("off");
                                              clearInterval(checkAudioStopped);
                                            }
                                          }, 1000);
                                    })
                            }

        }
    })
})

function populate(masterArray,val){
    let sortableArray = [];
    masterArray.forEach((value,key)=>{
        sortableArray.push(value);
    })
    if(val=="artist"){
        let message = `<option value="Select">Select</option>`;
        sortableArray.sort((a,b)=>a[1].localeCompare(b[1]));
        sortableArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[1]} - ${item[0]}</option>`;
                message+=subMessage;
            })
            document.getElementById("mySelect").innerHTML = message;
    }else{
        let message = `<option value="Select">Select</option>`;
        sortableArray.sort((a,b)=>a[0].localeCompare(b[0]));
        sortableArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[0]} - ${item[1]}</option>`;
                message+=subMessage;
            })
            document.getElementById("mySelect").innerHTML = message;
    }
}