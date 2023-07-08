function getSongAndArtist(filename){
    let yo = filename.split("-");
    song = yo[0].replace(/_/g,' ');
    artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
    return [song,artist];
}

let scrollable = new Map();
let numberOfSongs = 0;
let indexOfPlay = -1;
let tabIndex = 0;
let audioArray = [];
let indexOfDots = -1;
let songNumberTracker = 0;
let playListMap = null;
let currPlaylistMap = null;
let numberOfSongsInPlaylist = new Map();
let START = 0;

window.onload = function(){
    
    if(localStorage.getItem("username") != null){
        document.getElementById("myInput").classList.toggle("off");
    document.getElementById("mySelect").classList.toggle("off");
    document.getElementById("filterSelect").classList.toggle("off");
    document.getElementById("in_songs").classList.toggle("off");
    document.getElementById("myInput").disabled = true;
        document.getElementById("mySelect").disabled = true;
        document.getElementById("filterSelect").disabled = true;
        document.getElementById("in_songs").disabled = true;
    loadSongs();
                let tabArray = [document.getElementById("songs"),document.getElementById("playlists"),document.getElementById("listen")];
                let tabContainer = [document.getElementById("test_test_test"),document.querySelector(".playlist_tab"),document.querySelector(".listen_tab")];
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
                    populatePlayListSelect();
                    document.getElementById("current_playlist_text").className = "playlist_text off";
                    document.getElementById("my_songs_search").className = "search_bar hid";
                    document.getElementById("my_songs_search").value = "";
                    document.getElementById("my_songs_select").className = "select_bar hid";
                    document.getElementById("my_songs_select").value = "Select";
                    document.getElementById("in_playlist").className = "user_add_song hid";
                    document.getElementById("in_playlist").disabled = true;
                    document.getElementById("playlist_filter").className = "filter_bar hid";

                    document.getElementById("playlist_select").className = "select_bar";
                    document.getElementById("playlist_select").value = "Select";
                    document.getElementById("create_new_playlist_btn").className = "playlist_btn";

                    document.getElementById("playlist-container").innerHTML = `<div class = "display_no_song_text" id="display_no_playlist">
                                                                                    No Playlist Selected
                                                                                </div>
                                                                                <div class = "display_no_song_text off" id="display_no_playlist_songs">
                                                                                    No Songs Yet
                                                                                </div>`;
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
                                document.getElementById("display_no_song").className = "display_no_song_text";
                                for(let i = 0;i<numberOfSongs;i++){
                                    displayNoSongText("remove");
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
    document.getElementById("myInput").classList.toggle("off");
    document.getElementById("mySelect").classList.toggle("off");
    document.getElementById("filterSelect").classList.toggle("off");
    document.getElementById("in_songs").classList.toggle("off");
    if(mutex == 0){
        document.getElementById("myInput").disabled = true;
        document.getElementById("mySelect").disabled = true;
        document.getElementById("filterSelect").disabled = true;
        document.getElementById("in_songs").disabled = true;
        document.getElementById("mySelect").value = "Select";
        mutex = 1;
    }else{
        document.getElementById("myInput").disabled = false;
        document.getElementById("mySelect").disabled = false;
        document.getElementById("filterSelect").disabled = false;
        
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

  function filterOptions2() {
    const input = document.getElementById('my_songs_search').value.toLowerCase();
    const select = document.getElementById('my_songs_select');
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
    document.getElementById("in_songs").disabled = true;
    populate(masterArray,val);
}

function playlistChangeList(){
    let val = document.getElementById("playlist_filter").value;
    document.getElementById("in_playlist").disabled = true;
    populate1(currPlaylistMap,val);
}

function spoof_btn(){
    let val = document.getElementById("mySelect").value;
    if(val=="Select"){
        document.getElementById("in_songs").disabled = true;
    }else{
        document.getElementById("in_songs").disabled = false;
    }
}

function makeAddBtn(){
    let val = document.getElementById("my_songs_select").value;
    if(val=="Select"){
        document.getElementById("in_playlist").disabled = true;
    }else{
        document.getElementById("in_playlist").disabled = false;
    }
}



document.getElementById("in_songs").addEventListener(("click"),()=>{
    document.getElementById("myInput").value = "";
    let filename = document.getElementById("mySelect").value;
    fetch(`/api/add_song_to_user/${localStorage.getItem("username")}/${filename}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        if(response.status==200){
            document.getElementById("mySelect").value = "Select";
            document.getElementById("in_songs").disabled = true;
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

function populate1(masterArray,val){
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
            document.getElementById("my_songs_select").innerHTML = message;
    }else{
        let message = `<option value="Select">Select</option>`;
        sortableArray.sort((a,b)=>a[0].localeCompare(b[0]));
        sortableArray.forEach((item)=>{
                let subMessage = `<option value="${item[2]}">${item[0]} - ${item[1]}</option>`;
                message+=subMessage;
            })
            document.getElementById("my_songs_select").innerHTML = message;
    }
}

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

let playlistMasterMap = null;

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
                    playlistMasterMap = playListMap;
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
    let vish = selectRef.value;
    switchTop(0,vish);
    if(vish!="Select"){
        let array = playListMap.get(selectRef.value);
        let ourset = new Set();
        array.forEach((item)=>{
            ourset.add(item.filename);
        })
        let tempMap = new Map();
        fetch(`/api/get_my_song_filenames/${localStorage.getItem("username")}`,{
            method:"GET",
            cache:"no-cache"
        }).then((response)=>{
            response.json().then((filenames)=>{
                filenames.forEach((filename)=>{
                    if(!ourset.has(filename)){
                        let yo = filename.split("-");
                    let song = yo[0].replace(/_/g,' ');
                    let image = "";
                    let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                    const sub = [song,artist,filename,image];
                    tempMap.set(filename,sub);
                    }
                })
                currPlaylistMap = tempMap;
                populate1(tempMap,document.getElementById("in_playlist").value);
                let start = array.length*-1;
                START = start;
                document.getElementById("display_no_playlist").className = "display_no_song_text off";
                for(let j=0;j<array.length;j++){
                    let res = array[j];
                    let filename = res.filename;
                    let yo = filename.split("-");
                    song = yo[0].replace(/_/g,' ');
                    artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                    let imgName = filename.split(".")[0];
                    let image = `../img/${imgName+".jpeg"}`;
                    document.getElementById("playlist-container").innerHTML += `<div class = "item_in_list" id="${vish}-${start+j}">
                                        <img src=${image} class = "list_item_img">
                                        <div class="list_item_title">
                                            ${song}
                                        </div>
                                        <div class ="list_item_artist">
                                            ${artist}
                                        </div>
                                        <i class="fa-regular fa-circle-play" id="${vish}-play-${start+j}"></i>
                                        <i class="fa-regular fa-heart" id="${vish}-heart-${start+j}" data-file="${filename}"></i>
                                        <i class="fa-solid fa-trash" id="${vish}-dots-${start+j}" data-file="${filename}"></i>
                                    </div>`;
                    fetch(`/api/check_individual_liked/${localStorage.getItem("username")}/${filename}`,{
                        method:"GET",
                        cache:"no-cache"
                    }).then((r)=>{
                        r.json().then((bool)=>{
                            if(bool=="true"){
                                document.getElementById(`${vish}-heart-${start+j}`).className = "fa-regular fa-heart hit";
                            }else{
                                document.getElementById(`${vish}-heart-${start+j}`).className = "fa-regular fa-heart";
                            }
                        })
                    })
                }
                for(let i = start;i<0;i++){
                    document.getElementById(`${vish}-dots-${i}`).addEventListener('click',()=>{
                        document.getElementById(`${vish}-dots-${i}`).classList.toggle("hit");
                        let sa = getSongAndArtist(document.getElementById(`${vish}-dots-${i}`).dataset.file);
                        let c = window.confirm(`Do you want to remove\n${sa[0]}    by   ${sa[1]}\nfrom this playlist?`);
                        if(c){
                            fetch(`/api/remove_song_from_playlist/${localStorage.getItem("username")}/${vish}/${document.getElementById(`${vish}-dots-${i}`).dataset.file}`,{
                                method:"DELETE",
                                cache:"no-cache"
                            }).then(()=>{
                                document.getElementById(`${vish}-${i}`).classList.toggle("off");
                                let filename = document.getElementById(`${vish}-dots-${i}`).dataset.file;
                                let yo = filename.split("-");
                                let song = yo[0].replace(/_/g,' ');
                                let image = "";
                                let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                                const sub = [song,artist,filename,image];
                                tempMap.set(filename,sub);
                                currPlaylistMap = tempMap;
                                populate1(tempMap,document.getElementById("in_playlist").value);
                            })
                        }else{
                            document.getElementById(`${vish}-dots-${i}`).classList.toggle("hit");
                        }
                    })
                }
            })
        })
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
    })

    /**
     * Remove song from each playlist that it is in
     */
    fetch(`/api/remove_song_from_all_playlists/${localStorage.getItem("username")}/${filename}`,{
        method:"DELETE",
        cache:"no-cache"
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
    document.getElementById("name-empty").className = "error1";
    document.getElementById("name-taken").className = "error1";
})

document.getElementById("create_btn_final").addEventListener('click',()=>{
    document.getElementById("name-empty").className = "error1";
    document.getElementById("name-taken").className = "error1";
    let val = document.getElementById("name-field").value;
    document.getElementById("name-field").value = "";
    if(val==""){
        document.getElementById("name-empty").className = "error";
        return;
    }
    let errorOcc = false;
    if(playlistMasterMap==null){
        document.getElementById("playlist_creating").className = "success";
        setTimeout(function(){
            document.getElementById("playlist_creating").className = "success1";
            afterPlaylistCreation(val);
        },1000);
        return;
    }
    playlistMasterMap.forEach((value,key)=>{
        if(key==val){
            document.getElementById("name-taken").className = "error";
            errorOcc = true;
            return;
        }
    })
    if(!errorOcc){
        document.getElementById("playlist_creating").className = "success";
        setTimeout(function(){
            document.getElementById("playlist_creating").className = "success1";
            afterPlaylistCreation(val);
        },1000);
    }
})

function afterPlaylistCreation(name){
    switchTop(0,name);
    fetch(`/api/get_my_song_filenames/${localStorage.getItem("username")}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((filenames)=>{
            let tempMap = new Map();
            filenames.forEach((filename)=>{
                let yo = filename.split("-");
                let song = yo[0].replace(/_/g,' ');
                let image = "";
                let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                const sub = [song,artist,filename,image];
                tempMap.set(filename,sub);
            })
            currPlaylistMap = tempMap;
            populate1(currPlaylistMap,document.getElementById("playlist_filter").value);
            document.getElementById("display_no_playlist").className = "display_no_song_text off";
            document.getElementById("display_no_playlist_songs").className = "display_no_song_text";
        })
    })
}

document.getElementById("in_playlist").addEventListener('click',()=>{
    document.getElementById("display_no_playlist_songs").className = "display_no_song_text off";
    let filename = document.getElementById("my_songs_select").value;
    document.getElementById("in_playlist").disabled = true;
    document.getElementById("my_songs_select").value = "Select";
    let name = document.getElementById("current_playlist_text").innerHTML;
    fetch(`/api/playlist_add_song/${localStorage.getItem("username")}/${filename}/${name}`,{
        method:"POST",
        cache:"no-cache"
    }).then((response)=>{
        let value = currPlaylistMap.get(filename);
        let imgName = filename.split(".")[0];
        let image = `../img/${imgName+".jpeg"}`;
        if(numberOfSongsInPlaylist.get(name)==null){
            document.getElementById("playlist-container").innerHTML += `<div class = "item_in_list" id="${name}-${0}">
                                        <img src=${image} class = "list_item_img">
                                        <div class="list_item_title">
                                            ${value[0]}
                                        </div>
                                        <div class ="list_item_artist">
                                            ${value[1]}
                                        </div>
                                        <i class="fa-regular fa-circle-play" id="${name}-play-${0}"></i>
                                        <i class="fa-regular fa-heart" id="${name}-heart-${0}" data-file="${filename}"></i>
                                        <i class="fa-solid fa-trash" id="${name}-dots-${0}" data-file="${filename}"></i>
                                    </div>`;
            numberOfSongsInPlaylist.set(name,1);
        }else{
            document.getElementById("playlist-container").innerHTML += `<div class = "item_in_list" id="${name}-${numberOfSongsInPlaylist.get(name)}">
                                        <img src=${image} class = "list_item_img">
                                        <div class="list_item_title">
                                            ${value[0]}
                                        </div>
                                        <div class ="list_item_artist">
                                            ${value[1]}
                                        </div>
                                        <i class="fa-regular fa-circle-play" id="${name}-play-${numberOfSongsInPlaylist.get(name)}"></i>
                                        <i class="fa-regular fa-heart" id="${name}-heart-${numberOfSongsInPlaylist.get(name)}" data-file="${filename}"></i>
                                        <i class="fa-solid fa-trash" id="${name}-dots-${numberOfSongsInPlaylist.get(name)}" data-file="${filename}"></i>
                                    </div>`;
            numberOfSongsInPlaylist.set(name,numberOfSongsInPlaylist.get(name)+1);
        }
        for(let i = START;i<numberOfSongsInPlaylist.get(name);i++){
            document.getElementById(`${name}-dots-${i}`).addEventListener('click',()=>{
                document.getElementById(`${name}-dots-${i}`).classList.toggle("hit");
                let sa = getSongAndArtist(document.getElementById(`${name}-dots-${i}`).dataset.file);
                let c = window.confirm(`Do you want to remove\n${sa[0]}    by   ${sa[1]}\nfrom this playlist?`);
                if(c){
                    fetch(`/api/remove_song_from_playlist/${localStorage.getItem("username")}/${name}/${document.getElementById(`${name}-dots-${i}`).dataset.file}`,{
                        method:"DELETE",
                        cache:"no-cache"
                    }).then(()=>{
                        let tempMap = currPlaylistMap;
                        document.getElementById(`${name}-${i}`).classList.toggle("off");
                        let filename = document.getElementById(`${name}-dots-${i}`).dataset.file;
                        let yo = filename.split("-");
                        let song = yo[0].replace(/_/g,' ');
                        let image = "";
                        let artist = yo[1].substring(0,yo[1].length-4).replace(/_/g,' ');
                        const sub = [song,artist,filename,image];
                        tempMap.set(filename,sub);
                        populate1(tempMap,document.getElementById("in_playlist").value);
                    })
                }else{
                    document.getElementById(`${name}-dots-${i}`).classList.toggle("hit");
                }
            })
        }
        currPlaylistMap.delete(filename);
        populate1(currPlaylistMap,document.getElementById("playlist_filter").value);
    })
})

function switchTop(direction,name){
    if(direction == 0){
        document.getElementById("current_playlist_text").className = "playlist_text";
        document.getElementById("create_display").className = "new_playlist_display off";
        document.getElementById("current_playlist_text").innerHTML = name;
        document.getElementById("playlist_select").className = "select_bar dis";
        document.getElementById("create_new_playlist_btn").className = "playlist_btn off";
        document.getElementById("my_songs_search").className = "search_bar";
        document.getElementById("my_songs_select").className = "select_bar";
        document.getElementById("in_playlist").className = "user_add_song";
        document.getElementById("playlist_filter").className = "filter_bar";
        document.getElementById("my_songs_search").disabled = false;
        document.getElementById("my_songs_select").disabled = false;
        document.getElementById("in_playlist").disabled = true;
        document.getElementById("playlist_filter").disabled = false;
    }
}

document.getElementById("current_playlist_text").addEventListener('mouseenter',()=>{
    let ref = document.getElementById("current_playlist_text");
    let name = ref.innerHTML;
    localStorage.setItem("playlist_name",name);
    let length = name.length;
    let back = "Back";
    if(length<=4){
        ref.innerHTML = back;
        return;
    }
    for(let i =0;i<length-4;i++){
        if(i%2==0){
            back+="&nbsp;";
        }else{
            back = "&nbsp;"+back;
        }
    }
    ref.innerHTML = back;
})

document.getElementById("current_playlist_text").addEventListener('mouseleave',()=>{
    document.getElementById("current_playlist_text").innerHTML = localStorage.getItem("playlist_name");
})

document.getElementById("current_playlist_text").addEventListener('click',()=>{
    populatePlayListSelect();
    document.getElementById("current_playlist_text").className = "playlist_text off";
    document.getElementById("my_songs_search").className = "search_bar hid";
    document.getElementById("my_songs_search").value = "";
    document.getElementById("my_songs_select").className = "select_bar hid";
    document.getElementById("my_songs_select").value = "Select";
    document.getElementById("in_playlist").className = "user_add_song hid";
    document.getElementById("in_playlist").disabled = true;
    document.getElementById("playlist_filter").className = "filter_bar hid";

    document.getElementById("playlist_select").className = "select_bar";
    document.getElementById("playlist_select").value = "Select";
    document.getElementById("create_new_playlist_btn").className = "playlist_btn";

    document.getElementById("playlist-container").innerHTML = `<div class = "display_no_song_text" id="display_no_playlist">
                                                                    No Playlist Selected
                                                                </div>
                                                                <div class = "display_no_song_text off" id="display_no_playlist_songs">
                                                                    No Songs Yet
                                                                </div>`;
})