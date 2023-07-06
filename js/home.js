let scrollable = new Map();
let numberOfSongs = 0;
let indexOfPlay = -1;
let tabIndex = 0;
let audioArray = [];
let indexOfDots = -1;
let songNumberTracker = 0;
let playListMap = null;

window.onload = function(){
    
    if(localStorage.getItem("username") != null){
        document.querySelector(".search_bar").classList.toggle("off");
    document.getElementById("mySelect").classList.toggle("off");
    document.querySelector(".filter_bar").classList.toggle("off");
    document.querySelector(".user_add_song").classList.toggle("off");
    document.querySelector(".search_bar").disabled = true;
        document.getElementById("mySelect").disabled = true;
        document.querySelector(".filter_bar").disabled = true;
    document.querySelector(".user_add_song").disabled = true;
    loadSongs();
                let tabArray = [document.getElementById("songs"),document.getElementById("playlists"),document.getElementById("listen")];
                let tabContainer = [document.querySelector(".test"),document.querySelector(".playlist_tab"),document.querySelector(".listen_tab")];
                tabArray[0].classList.toggle("hit");
                tabContainer[0].className = "test";
                tabArray[0].addEventListener('click',()=>{
                    if(tabIndex != 0){
                        tabArray[0].classList.toggle("hit");
                        tabArray[tabIndex].classList.toggle("hit");
                        tabContainer[0].className = "test";
                        tabContainer[1].className = "playlist_tab off";
                        tabContainer[2].className = "listen_tab off";
                        tabIndex = 0;
                    }
                })
                tabArray[1].addEventListener('click',()=>{
                    populatePlayListSelect();
                    if(tabIndex != 1){
                        tabArray[1].classList.toggle("hit");
                        tabArray[tabIndex].classList.toggle("hit");
                        tabIndex = 1;
                        if(indexOfPlay!=-1){
                            audioArray[indexOfPlay].pause();
                            audioArray[indexOfPlay].currentTime = 0;
                            indexOfPlay = -1;
                        }
                        tabContainer[0].className = "test off";
                        tabContainer[1].className = "playlist_tab";
                        tabContainer[2].className = "listen_tab off";
                    }
                })
                tabArray[2].addEventListener('click',()=>{
                    if(tabIndex != 2){
                        tabArray[2].classList.toggle("hit");
                        tabArray[tabIndex].classList.toggle("hit");
                        tabIndex = 2;
                        if(indexOfPlay!=-1){
                            audioArray[indexOfPlay].pause();
                            audioArray[indexOfPlay].currentTime = 0;
                            indexOfPlay = -1;
                        }
                        tabContainer[0].className = "test off";
                        tabContainer[1].className = "playlist_tab off";
                        tabContainer[2].className = "listen_tab";
                    }
                })
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
                            document.getElementById("song-container").innerHTML += `<div class = "item_in_list" id="list-item-${i}">
                                    <img src=${image} class = "list_item_img">
                                    <div class="list_item_title">
                                        ${song}
                                    </div>
                                    <div class ="list_item_artist">
                                        ${artist}
                                    </div>
                                    <i class="fa-regular fa-circle-play" id="play-${i}"></i>
                                    <i class="fa-regular fa-heart" id="heart-${i}" data-file="${filename}"></i>
                                    <i class="fa-solid fa-trash" id="dots-${i}" data-file="${filename}"></i>
                                </div>`;
                            numberOfSongs++;
                            songNumberTracker++;
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
                                if(songNumberTracker!=0){
                                    displayNoSongText("remove");
                                }
                                for(let i = 0;i<numberOfSongs;i++){
                                    document.getElementById(`heart-${i}`).addEventListener('click',()=>{
                                        document.getElementById(`heart-${i}`).classList.toggle("hit");
                                        if(arrayMutex[i] ==0){
                                            fetch(`/api/change_liked/${localStorage.getItem("username")}/${document.getElementById(`heart-${i}`).dataset.file}/${true}`,{
                                                method:"POST",
                                                cache:"no-cache"
                                            })
                                            arrayMutex[i] = 1;
                                        }else{
                                            fetch(`/api/change_liked/${localStorage.getItem("username")}/${document.getElementById(`heart-${i}`).dataset.file}/${false}`,{
                                                method:"POST",
                                                cache:"no-cache"
                                            })
                                            arrayMutex[i] = 0;
                                        }
                                    });
                                    document.getElementById(`dots-${i}`).addEventListener('click',()=>{
                                        let thisTrash = document.getElementById(`dots-${i}`);
                                        thisTrash.classList.toggle("hit");
                                        let fileToRemove = thisTrash.dataset.file;
                                        let bruh = fileToRemove.split("-");
                                        let songToRemove = bruh[0].replace(/_/g,' ');
                                        let artistToRemove = bruh[1].substring(0,bruh[1].length-4).replace(/_/g,' ');
                                        let imgTemp = fileToRemove.split(".")[0];
                                        let imageToRemove = `../img/${imgTemp+".jpeg"}`;
                                        let confirmResult = window.confirm(`Do you want to remove this song:\n\n${songToRemove} - ${artistToRemove}`);
                                        if(confirmResult){
                                            removeSongFromList(fileToRemove,songToRemove,artistToRemove,imageToRemove,i);
                                        }else{
                                            thisTrash.classList.toggle("hit");
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
                                    })
                                }
                            })
                        })
                    })
                })
    }else{
        let tabArray = [document.getElementById("songs"),document.getElementById("playlists"),document.getElementById("listen")];
        tabArray[0].addEventListener('click',()=>{
            alert("You must (Log In) / (Create An Account) before you can access MY SONGS");
        })
        tabArray[1].addEventListener('click',()=>{
            alert("You must (Log In) / (Create An Account) before you can access MY PLAYLISTS");
        })
        tabArray[2].addEventListener('click',()=>{
            alert("You must (Log In) / (Create An Account) before you can access LISTEN NOW");
        })
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
        ref.className = "fa-solid fa-xmark";
        ref.style = "color: #c63939;";
        ref.title = "Clear";
        iconMutex = 1;
        document.getElementById("mySelect").disabled = false;
    }else{
        ref.className = "fa-solid fa-plus";
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
    document.getElementById("mySelect").classList.toggle("off");
    document.querySelector(".filter_bar").classList.toggle("off");
    document.querySelector(".user_add_song").classList.toggle("off");
    if(mutex == 0){
        document.querySelector(".search_bar").disabled = true;
        document.getElementById("mySelect").disabled = true;
        document.querySelector(".filter_bar").disabled = true;
        document.querySelector(".user_add_song").disabled = true;
        document.getElementById("mySelect").value = "Select";
        mutex = 1;
    }else{
        document.querySelector(".search_bar").disabled = false;
        document.getElementById("mySelect").disabled = false;
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
                            document.getElementById("song-container").innerHTML += `<div class = "item_in_list" id="list-item-${numberOfSongs}" >
                                    <img src=${image} class = "list_item_img">
                                    <div class="list_item_title">
                                        ${song}
                                    </div>
                                    <div class ="list_item_artist">
                                        ${artist}
                                    </div>
                                    <i class="fa-regular fa-circle-play" id="play-${numberOfSongs}"></i>
                                    <i class="fa-regular fa-heart" id="heart-${numberOfSongs}" data-file="${filename}"></i>
                                    <i class="fa-solid fa-trash" id="dots-${numberOfSongs}" data-file="${filename}"></i>
                                </div>`;
                            displayNoSongText("remove");
                            numberOfSongs++;
                            songNumberTracker++;
                            let arrayMutex = [];
                            for(let i = 0;i<numberOfSongs;i++){
                                arrayMutex.push(0);
                                document.getElementById(`heart-${i}`).addEventListener('click',()=>{
                                    document.getElementById(`heart-${i}`).classList.toggle("hit");
                                    if(arrayMutex[i] ==0){
                                        fetch(`/api/change_liked/${localStorage.getItem("username")}/${document.getElementById(`heart-${i}`).dataset.file}/${true}`,{
                                            method:"POST",
                                            cache:"no-cache"
                                        })
                                        arrayMutex[i] = 1;
                                    }else{
                                        fetch(`/api/change_liked/${localStorage.getItem("username")}/${document.getElementById(`heart-${i}`).dataset.file}/${false}`,{
                                            method:"POST",
                                            cache:"no-cache"
                                        })
                                        arrayMutex[i] = 0;
                                    }
                                });
                                document.getElementById(`dots-${i}`).addEventListener('click',()=>{
                                    let thisTrash = document.getElementById(`dots-${i}`);
                                    thisTrash.classList.toggle("hit");
                                    let fileToRemove = thisTrash.dataset.file;
                                    let bruh = fileToRemove.split("-");
                                    let songToRemove = bruh[0].replace(/_/g,' ');
                                    let artistToRemove = bruh[1].substring(0,bruh[1].length-4).replace(/_/g,' ');
                                    let imgTemp = filename.split(".")[0];
                                    let imageToRemove = `../img/${imgTemp+".jpeg"}`;
                                    let confirmResult = window.confirm(`Do you want to remove this song:\n\n${songToRemove} - ${artistToRemove}`);
                                    if(confirmResult){
                                        removeSongFromList(fileToRemove,songToRemove,artistToRemove,imageToRemove,i);
                                    }else{
                                        thisTrash.classList.toggle("hit");
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

function populatePlayListSelect(){
    fetch(`/api/get_playlist_names/${localStorage.getItem("username")}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((data_structure)=>{
            fetch(`/api/get_song_list/${localStorage.getItem("username")}`,{
                method:"GET",
                cache:"no-cache"
            }).then((response2)=>{
                response2.json().then((usersSongs)=>{
                    /**
                     * Start population here
                     */
                    let message = `<option value="Select">Select Playlist</option>`;
                    if(data_structure==null){
                        document.getElementById("playlist_select").innerHTML = message;
                        return 0;
                    }
                    playListMap = new Map(data_structure);
                    playListMap.forEach((value,key)=>{
                        message += `<option value="${key}">${key}</option>`
                    })
                    document.getElementById("playlist_select").innerHTML = message;
                })
            })
        })
    })
}

function loadSelectedPlaylist(){
    let selectRef = document.getElementById("playlist_select");
    let value = selectRef.value;
    if(value!="Select"){
        console.log(playListMap.get(selectRef.value));
        /**Create Back Button */
    }
}

function removeSongFromList(filename,song,artist,image,index){
    /**Repopulate select menu */
    let sub = [song,artist,filename,image]
    masterArray.set(filename,sub);
    populate(masterArray,document.getElementById("filterSelect").value);
    
    /**Hide List Item from Scrollable View */
    document.getElementById(`list-item-${index}`).classList.toggle("off");

    /**Remove Song from user db */
    fetch(`/api/remove_song/${localStorage.getItem("username")}/${filename}`,{
        method:"POST",
        cache:"no-cache"
    }).then((response)=>{
        console.log(response.status);
    })

    songNumberTracker--;
    if(songNumberTracker==0){
        displayNoSongText("put");
    }
}

function displayNoSongText(action){
    if(action =="put"){
        document.getElementById("display_no_song").className = "display_no_song_text";
    }else{
        document.getElementById("display_no_song").className = "display_no_song_text off";
    }
}

function newDisplay(){
    document.getElementById("create_display").className = "new_playlist_display";
}

document.querySelector(".back").addEventListener("click",()=>{
    document.getElementById("create_display").className = "new_playlist_display off";
})
