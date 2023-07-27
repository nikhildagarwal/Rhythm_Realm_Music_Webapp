const http = require("http");
const url = require("url");
const fs = require("fs");
const nodemailer = require("nodemailer");
const admin = require('./js/firebase.js').admin;
const db = admin.database();

const server = http.createServer((req,res) => {
    let parsedURL = url.parse(req.url,true);
    let path = parsedURL.path.replace(/^\/+|\/+$/g,"");
    if(path==""){
        path = "html/index.html";
    }
    console.log(`Requested path ${path} `);
    let splited = path.split("/");
    if(splited[0] == "api"){
        if(splited[1]=="html"){
            let file = __dirname +"/html/"+splited[2];
            fs.readFile(file,function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end();
                }else{
                    res.setHeader("X-Content-Type-Options","nosniff");
                    res.writeHead(200,{'Content-type':'text/html'});
                    res.end(content);
                }
            })
        }else if(splited[1]=="css"){
            let file = __dirname +"/css/"+splited[2];
            fs.readFile(file,function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end();
                }else{
                    res.setHeader("X-Content-Type-Options","nosniff");
                    res.writeHead(200,{'Content-type':'text/css'});
                    res.end(content);
                }
            })
        }else if(splited[1]=="img"){
            let file = __dirname +"/img/"+splited[2];
            fs.readFile(file,function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end();
                }else{
                    res.setHeader("X-Content-Type-Options","nosniff");
                    res.writeHead(200,{'Content-type':'image/jpeg'});
                    res.end(content);
                }
            })
        }else if(splited[1] =="js"){
            let file = __dirname +"/js/"+splited[2];
            fs.readFile(file,function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end();
                }else{
                    res.setHeader("X-Content-Type-Options","nosniff");
                    res.writeHead(200,{'Content-type':'application/javascript'});
                    res.end(content);
                }
            })
        }else if(splited[1] == "audio"){
            let file = __dirname +"/audio/"+splited[2];
            fs.readFile(file,function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end();
                }else{
                    res.setHeader("X-Content-Type-Options","nosniff");
                    res.writeHead(200,{'Content-type':'audio/mpeg'});
                    res.end(content);
                }
            })
        }else{
            switch(splited[1]){
                case "tester":
                    res.writeHead(200);
                    res.end();
                    break;
                case "changePassword":
                    handleChangePassword(req,res,splited[2],splited[3]);
                    break;
                case "changeUsername":
                    handleChangeUsername(req,res,splited[2],splited[3]);
                    break;
                case "checkUsernameMatchFound":
                    handleCheckUsernameMatchFound(req,res,splited[2]);
                    break;
                case "changeEmail":
                    handleChangeEmail(req,res,splited[2],splited[3]);
                    break;
                case "checkEmailMatchFound":
                    handleCheckEmailMatchFound(req,res,splited[2]);
                    break;
                case "get_for_listen_now":
                    handleGetForListenNow(req,res,splited[2]);
                    break;
                case "checkLogIn":
                    handleCheckLogIn(req,res,splited[2],splited[3]);
                    break;
                case "createUser":
                    handleCreateUser(req,res,splited[2],splited[3],splited[4],splited[5]);
                    break;
                case "getUserList":
                    handleGetUserList(req,res,splited[2],splited[3]);
                    break;
                case "load_songs":
                    handleLoadSongs(req,res);
                    break;
                case "add_song_to_user":
                    handleAddSongToUser(req,res,splited[2],splited[3],splited[4]);
                    break;
                case "get_song_list":
                    handleGetSongList(req,res,splited[2]);
                    break;
                case "change_liked":
                    handleChangeLiked(req,res,splited[2],splited[3],splited[4]);
                    break;
                case "check_liked":
                    handleCheckLiked(req,res,splited[2]);
                    break;
                case "remove_song":
                    handleRemoveSong(req,res,splited[2],splited[3]);
                    break;
                case "get_playlist_names":
                    handleGetPlaylistNames(req,res,splited[2]);
                    break;
                case "get_my_song_filenames":
                    handleGetMySongsFilenames(req,res,splited[2]);
                    break;
                case "playlist_add_song":
                    handlePlaylistAddSong(req,res,splited[2],splited[3],splited[4]);
                    break;
                case "check_individual_liked":
                    handleCheckIndividualLiked(req,res,splited[2],splited[3]);
                    break;
                case "remove_song_from_playlist":
                    handleRemoveSongFromPlaylist(req,res,splited[2],splited[3],splited[4]);
                    break;
                case "remove_song_from_all_playlists":
                    handleRemoveSongFromAllPlaylists(req,res,splited[2],splited[3]);
                    break;
                case "check_valid_email":
                    handleCheckValidEmail(req,res,splited[2]);
                    break;
                case "send_email_forgot_username":
                    handleSendEmailForgotUsername(req,res,splited[2],splited[3]);
                    break;
                case "send_forgot_password_email":
                    handleSendForgotPasswordEmail(req,res,splited[2],splited[3]);
                    break;
                case "account_recovery":
                    handleAccountRecovery(req,res,splited[2]);
                    break;
                case "reset_passwords_from_recovery":
                    handleResetPasswordsFromRecovery(req,res,splited[2],splited[3]);
                    break;
                case "changed_password_notif":
                    handleChangedPasswordNotif(req,res,splited[2]);
                case "home":
                    handleHome(req,res);
                    break;
                case "zoom_picture":
                    handleZoomPicture(req,res,splited[2]);
                    break;
                case "login":
                    handleLogin(req,res);
                    break;
                case "logout":
                    handleLogout(req,res);
                    break;
                case "profile":
                    handleProfile(req,res);
                    break;
                case "signup":
                    handleSignup(req,res);
                    break;
                case "confirm":
                    if(splited[2]=="password"){
                        handleConfirmPassword(req,res);
                    }
                    break;
                case "email":
                    if(splited[2]=="sent"){
                        handleEmailSent(req,res);
                    }
                    break;
                case "forgot":
                    if(splited[2]=="password"){
                        handleForgotPassword(req,res);
                    }else{
                        handleForgotUsername(req,res);
                    }
                    break;
                case "test":
                    handleTest(req,res);
            }
        }
        return;
    }
    let file =  __dirname +"/"+path;
    fs.readFile(file,function(err,content){
        if(err){
            //console.log(`file not found  ${file}`);
            res.writeHead(404);
            res.end();
        }else{
            //console.log(`Returning ${path}`);
            res.setHeader("X-Content-Type-Options","nosniff"); //tells the browser to strictly honor the given content-type (security concerns);
            const array = path.split("/");
            switch(array[0]){
                case "html":
                    res.writeHead(200,{'Content-type':'text/html'});
                    res.end(content);
                    break;
                case "css":
                    res.writeHead(200,{'Content-type':'text/css'});
                    res.end(content);
                    break;
                case "img":
                    res.writeHead(200,{'Content-type':'image/jpeg'});
                    res.end(content);
                    break;
                case "js":
                    res.writeHead(200,{'Content-type':'application/javascript'});
                    res.end(content);
                    break;
                case "audio":
                    res.writeHead(200,{'Content-type':'audio/mpeg'});
                    res.end(content);
            }
            
        }
    });
});

server.listen(3000, "localhost", () => {
    console.log("Listening on port 3000");
});

async function handleZoomPicture(req,res,image_filename){
    try{
        let file =  __dirname +"/img/"+image_filename;
        fs.readFile(file,function(nope,content){
            if(nope){
                res.writeHead(404);
                res.end();
            }else{
                res.setHeader("X-Content-Type-Options","nosniff");
                res.writeHead(200,{'Content-type':'image/jpeg'});
                    res.end(content);
            }
        })
    }catch (err){
        console.log(err);
    }
}

async function handleChangedPasswordNotif(req,res,email){
    try{
        let subject = `RhythmRealm - Password Reset`;
        let html = `<p>Dear Valued Member,</p>
        <p>&nbsp;</p>
        <p>Your password has been successfully reset. Enjoy!!<br>We look forward to seeing you back soon. Rock On!!</p>
        <p>&nbsp;</p>
        <p>All the best,<br>The RhythmRealm Team</p>`;
        let sentStatus = await sendEmail(subject,html,email);
        if(sentStatus == 1){
            res.writeHead(200);
        }else{
            res.writeHead(300);
        } 
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function handleResetPasswordsFromRecovery(req,res,userid,newPassword){
    try{
        let email = await resetPasswordsFromRecovery(userid,newPassword);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(email));
    }catch (err){
        console.log(err);
    }
}

async function resetPasswordsFromRecovery(checkuserid,newPassword){
    let path = db.ref(`/users/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let usernames = Object.keys(promise);
    let info = Object.values(promise);
    for(let i = 0;i<usernames.length;i++){
        let username = usernames[i];
        let userid = info[i].userid;
        if(userid==checkuserid){
            let newPath = db.ref(`/users/${username}/`);
            newPath.update({
                password:newPassword
            })
            return info[i].email;
        }
    }
}

async function handleGetForListenNow(req,res,username){
    try{
        let array = await getForListenNow(username);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(array));
    }catch (err){
        console.log(err);
    }
}

async function getForListenNow(username){
    let path = db.ref(`/users/${username}/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let arrayToReturn = [];
    let songs = [];
    let liked = [];
    let songObjects = promise.songs;
    if(songObjects != undefined){
        let a = Object.values(songObjects);
        a.forEach((object)=>{
            songs.push(object.filename);
            if(object.liked == 'true'){
                liked.push(object.filename);
            }
        })
        arrayToReturn.push(['My Songs',songs]);
        if(liked.length != 0){
            arrayToReturn.push(['Liked',liked]);
        }
    }
    let playlistObjects = promise.playlists;
    if(playlistObjects != undefined){
        let names = Object.keys(playlistObjects);
        let contentsOfName = Object.values(playlistObjects);
        for(let i = 0;i<names.length;i++){
            let currpl = [];
            let currName = names[i];
            let currContents = Object.values(contentsOfName[i]);
            for(let j = 0;j<currContents.length;j++){
                let file = currContents[j].filename;
                currpl.push(file);
            }
            arrayToReturn.push([currName,currpl]);
        }
    }
    return arrayToReturn;
}

async function handleTest(req,res){
    let file = __dirname +"/html/test.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleForgotUsername(req,res){
    let file = __dirname +"/html/forgot_username.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleForgotPassword(req,res){
    let file = __dirname +"/html/forgot_password.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleEmailSent(req,res){
    let file = __dirname +"/html/email_sent.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleConfirmPassword(req,res){
    let file = __dirname +"/html/confirm_password.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleSignup(req,res){
    let file = __dirname +"/html/signup.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleProfile(req,res){
    let file = __dirname +"/html/profile.html";
    fs.readFile(file,function(err,content){
        if(err){
            console.log(err);
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleLogout(req,res){
    let file = __dirname +"/html/logout.html";
    fs.readFile(file,function(err,content){
        if(err){
            console.log(err);
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleLogin(req,res){
    let file = __dirname +"/html/login.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleHome(req,res){
    let file = __dirname +"/html/index.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleAccountRecovery(req,res,userid){
    let file = __dirname +"/html/account_recovery.html";
    fs.readFile(file,function(err,content){
        if(err){
            res.writeHead(404);
            res.end();
        }else{
            res.setHeader("X-Content-Type-Options","nosniff");
            res.writeHead(200,{'Content-type':'text/html'});
            res.end(content);
        }
    })
}

async function handleSendForgotPasswordEmail(req,res,userid,email){
    try{
        let subject = `RhythmRealm - Account Recovery`;
        let html = `<p>Dear Valued Member,</p>
        <p>&nbsp;</p>
        <p>Do not worry, we'll get you back to jamming right!! Please click the link provided below to reset your password and recover your account.</p>
        <a href="http://localhost:3000/api/account_recovery/${userid}">Account Recovery</a>
        <p>We look forward to seeing you back soon. Rock On!!</p>
        <p>&nbsp;</p>
        <p>All the best,<br>The RhythmRealm Team</p>`;
        let sentStatus = await sendEmail(subject,html,email);
        if(sentStatus == 1){
            res.writeHead(200);
        }else{
            res.writeHead(300);
        } 
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function handleSendEmailForgotUsername(req,res,username,email){
    try{
        let subject = `RhythmRealm - Username Recovery`;
        let html = `<p>Dear Valued Member,</p>
        <p>&nbsp;</p>
        <p>Do not worry your username is here!!</p>
        <p>Your username is:  ${username}</p>
        <p>Please revisit the login page, log in, and rock on!!</p>
        <p>&nbsp;</p>
        <p>All the best,<br>The RhythmRealm Team</p>`;
        let sentStatus = await sendEmail(subject,html,email);
        if(sentStatus == 1){
            res.writeHead(200);
        }else{
            res.writeHead(300);
        } 
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function sendEmail(subject,html,email){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rhythmrealm.play@gmail.com',
          pass: 'yxprvpwiiycuanjb'
        }
    });
    const mailOptions = {
        from: 'rhythmrealm.play@gmail.com',
        to: `${email}`,
        subject: `${subject}`,
        html: `${html}`
    };
    let promise = await new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                resolve(0);
            }else{
                resolve(1);
            }
        })
    });
    return promise;
}

async function handleCheckValidEmail(req,res,email){
    try{
        let result = await checkValidEmail(email);
        if(result[0]==0){
            res.writeHead(300);
            res.end();
        }else{
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(JSON.stringify([result[1],result[2]]));
        }
    }catch (err){
        console.log(err);
    }
}

async function checkValidEmail(email){
    let path = db.ref(`/users/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let users = Object.keys(promise);
    let info = Object.values(promise);
    for(let i = 0;i<info.length;i++){
        if(info[i].email == email){
            return [1,users[i],info[i].userid];
        }
    }
    return [0];
}

async function handleRemoveSongFromAllPlaylists(req,res,username,filename){
    try{
        await removeSongFromAllPlaylists(username,filename);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function removeSongFromAllPlaylists(username,filename){
    let path = db.ref(`/users/${username}/playlists/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(promise!=null){
        let playlist_names = Object.keys(promise);
        let playlist_contents = Object.values(promise);
        for(let i = 0;i<playlist_names.length;i++){
            let currName = playlist_names[i];
            let thisContent = playlist_contents[i];
            let codes = Object.keys(thisContent);
            let files = Object.values(thisContent);
            for(let j = 0;j<codes.length;j++){
                let thisCode = codes[j];
                let thisFile = files[j].filename;
                if(thisFile==filename){
                    let tempPath = db.ref(`/users/${username}/playlists/${currName}/${thisCode}/`);
                    tempPath.remove();
                }
            }
        }
    }
}

function deleteValueRecursively(ref) {
  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        // Recursively delete child nodes
        deleteValueRecursively(childSnapshot.ref);
      });
    }

    // Delete the current value
    ref.remove()
      .then(() => {
        console.log('Value deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting value:', error);
      });
  });
}

async function handleRemoveSongFromPlaylist(req,res,username,name,filename){
    try{
        await removeSongFromPlaylist(username,name,filename);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function removeSongFromPlaylist(username,name,filename){
    let path = db.ref(`/users/${username}/playlists/${name}/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    });
    let code = "";
    let objects = Object.values(promise);
    for(let i = 0;i<objects.length;i++){
        let thisFilename = objects[i].filename;
        if(thisFilename==filename){
            code = Object.keys(promise)[i];
            i = objects.length;
        }
    }
    let newPath = db.ref(`/users/${username}/playlists/${name}/${code}/`);
    newPath.remove();
    return 0;
}

async function handleCheckIndividualLiked(req,res,username,filename){
    try{
        let value = await checkIndiviualLiked(username,filename);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(value));
    }catch (err){
        console.log(err);
    }
}

async function checkIndiviualLiked(username,filename){
    let path = db.ref(`/users/${username}/songs`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let objects = Object.values(promise);
    for(let i = 0;i<objects.length;i++){
        if(objects[i].filename == filename){
            return objects[i].liked;
        }
    }
    return null;
}

async function handlePlaylistAddSong(req,res,username,filename,playlistName){
    try{
        await playlistAddSong(username,filename,playlistName);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function playlistAddSong(username,filename,playlistName){
    let path = db.ref(`/users/${username}/playlists/${playlistName}/`);
    path.push({
        filename:filename
    })
    return 0;
}

async function handleGetMySongsFilenames(req,res,username){
    try{
        let array = await getMySongsFilenames(username);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(array));
    }catch (Err){
        console.log(Err);
    }
}

async function getMySongsFilenames(username){
    let path = db.ref(`/users/${username}/songs/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(promise == null){
        return [];
    }
    let values = Object.values(promise);
    let array = [];
    values.forEach((item)=>{
        array.push(item.filename);
    })
    return array;
}

async function handleGetPlaylistNames(req,res,username){
    try{
        let dataToSend = await getPlaylistName(username);
        if(dataToSend ==null){
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(JSON.stringify(dataToSend));
        }else{
            const mapArray = Array.from(dataToSend.entries());
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(JSON.stringify(mapArray));
        }
    }catch (err){
        console.log(err);
    }
}

async function getPlaylistName(username){
    let path = db.ref(`/users/${username}/playlists/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(promise == null){
        return null;
    }
    let ourMap = new Map();
    let playlist_names = Object.keys(promise);
    let contents = Object.values(promise);
    let index = 0;
    contents.forEach((item)=>{
        let inner = Object.values(item);
        ourMap.set(playlist_names[index],inner);
        index++;
    })
    return ourMap;
}

async function handleRemoveSong(req,res,username,filename){
    try{
        let result = await removeSong(username,filename);
        if(result == 1){
            res.writeHead(200);
        }else{
            res.writeHead(400);
        }
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function removeSong(username,filename){
    let path = db.ref(`/users/${username}/songs/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let objects = Object.values(promise);
    for(let i = 0;i<objects.length;i++){
        if(objects[i].filename == filename){
            let code = Object.keys(promise)[i];
            let newPath = db.ref(`/users/${username}/songs/${code}/`);
            newPath.remove();
            return 1;
        }
    }
    return 0;
}

async function handleCheckLiked(req,res,username){
    try{
        let array = await checkLiked(username);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(array));
    }catch (err){
        console.log(err);
    }
}

async function checkLiked(username){
    let path = db.ref(`/users/${username}/songs`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(promise == null){
        return [];
    }
    let code = Object.keys(promise);
    let booleanArray = [];
    for(let i = 0;i<code.length;i++){
        let newPath = db.ref(`/users/${username}/songs/${code[i]}/`);
        let songData = await new Promise((resolve,reject)=>{
            newPath.get().then((snapshot)=>{
                resolve(snapshot.val());
            })
        })
        booleanArray.push(songData.liked);
    }
    return booleanArray;
}

async function handleChangeLiked(req,res,username,filename,value){
    try{
        await changeLiked(username,filename,value);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function changeLiked(username,filename,value){
    let path = db.ref(`/users/${username}/songs`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let code = "";
    let objects = Object.values(promise);
    for(let i = 0;i<objects.length;i++){
        if(objects[i].filename == filename){
            code = Object.keys(promise)[i];
            i = objects.length;
        }
    }
    path = db.ref(`/users/${username}/songs/${code}`);
    path.update({
        liked:value
    })
    return 0;
}

async function handleGetSongList(req,res,username){
    try{
        let set = await getSongList(username);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(set));
    }catch (err){
        console.log(err);
    }
}

async function getSongList(username){
    let path = db.ref(`/users/${username}/songs/`);
    let promise = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(promise == null){
        return [];
    }
    let array = Object.values(promise);
    let setArray = [];
    array.forEach((item)=>{
        setArray.push([item.filename,item.liked]);
    });
    return setArray;
}

async function handleAddSongToUser(req,res,username,filename){
    try{
        let hi = await addSongToUser(username,filename);
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end(JSON.stringify(hi));
    }catch(err){
        console.log(err);
    }
}

async function addSongToUser(username,filename){
    path = db.ref(`/users/${username}/songs/`);
    path.push({
        filename:filename,
        liked:false
    })
}

async function handleLoadSongs(req,res){
    try{
        const folderPath = __dirname+"/audio";
    let array = [];
    fs.readdir(folderPath,(err,files)=>{
        if(err){
            console.log('Error reading folder'+err);
            return;
        }
        files.forEach((file)=>{
            array.push(file);
        })
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(array));
    })
        
    }catch (err){
        console.log(err);
    }
}

async function handleChangePassword(req,res,username,newPassword){
    try{
        await changePassword(username,newPassword);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function changePassword(username,newPassword){
    path = db.ref(`/users/${username}/`);
    path.update({
        password:newPassword
    })
    return "done";
}

async function handleChangeUsername(req,res,newUsername, oldUsername){
    try{
        await changeUsername(newUsername,oldUsername);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function changeUsername(newUsername,oldUsername){
    let pathToRemove = db.ref(`/users/${oldUsername}/`);
    let userinfo = await new Promise((resolve,reject)=>{
        pathToRemove.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let pathToSet = db.ref(`/users/${newUsername}/`);
    pathToRemove.remove();
    if(userinfo.songs == undefined && userinfo.playlists == undefined){

        pathToSet.set({
            email:userinfo.email,
            password:userinfo.password,
            userid:userinfo.userid
        })
    }else if(userinfo.songs == undefined){

        pathToSet.set({
            email:userinfo.email,
            password:userinfo.password,
            playlists:userinfo.playlists,
            userid:userinfo.userid
        })
    }else if(userinfo.playlists == undefined){
        pathToSet.set({
            email:userinfo.email,
            password:userinfo.password,
            songs:userinfo.songs,
            userid:userinfo.userid
        })

    }else{
        pathToSet.set({
            email:userinfo.email,
            password:userinfo.password,
            songs:userinfo.songs,
            playlists:userinfo.playlists,
            userid:userinfo.userid
        })
    }
    
    return "done";
}

async function handleCheckUsernameMatchFound(req,res,username){
    try{
        let code = await checkUsernameMatchFound(username);
        if(code=="found"){
            res.writeHead(400);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function checkUsernameMatchFound(username){
    let path = db.ref(`/users/`);
    let list = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let usernames = Object.keys(list);
    for(let i = 0;i<usernames.length;i++){
        if(usernames[i]==username){
            return "found";
        }
    }
    return "notfound";
}

async function handleChangeEmail(req,res,email,username){
    try{
        await changeEmail(email,username);
        res.writeHead(200);
        res.end();
    }catch(err){
        console.log(err);
    }
}

async function changeEmail(email,username){
    let path = db.ref(`/users/${username}/`);
    path.update({
        email:email
    })
    return "done";
}

async function handleCheckEmailMatchFound(req,res,email){
    try{
        let code = await checkEmailMatch(email);
        if(code == 1){
            res.writeHead(400);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function checkEmailMatch(email){
    let path = db.ref(`/users/`);
    let list = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    let userInfoArray = Object.values(list);
    for(let i = 0;i<userInfoArray.length;i++){
        let item = userInfoArray[i];
        if(item.email == email){
            return 1;
        }
    }
    return 0;
}

async function handleCheckLogIn(req,res,username,password){
    try{
        let code = await checkLogIn(username,password);
        code = code.split(",");
        switch(code[0]){
            case "-1":
                res.writeHead(400);
                res.end();
                break;
            case "1":
                res.writeHead(200,{'Content-type':'text/plain'});
                res.end(JSON.stringify(code[1]+","+code[2]));
                break;
            case "0":
                res.writeHead(401);
                res.end();
        }
    }catch(err){
        console.log(err);
    }
}

async function checkLogIn(username,password){
    let path = db.ref(`/users/${username}/`);
    const userinfo = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    })
    if(userinfo==null){
        return "-1";
    }
    if(userinfo.password == password){
        return "1,"+userinfo.email+","+userinfo.userid;
    }else{
        return "0";
    }
}

async function handleCreateUser(req,res,email,username,password,userid){
    try{
        await createUser(email,username,password,userid);
        res.writeHead(200);
        res.end();
    }catch (err){
        console.log(err);
    }
}

async function createUser(email,username,password,userid){
    let path = db.ref(`/users/${username}/`);
    path.set({
        "email":email,
        "password":password,
        "userid":userid
    })
}

async function handleGetUserList(req,res,username,email){
    try{
        let build = await retreiveUsers(username,email);
        res.writeHead(200,{'Content-type':'text/plain'});
        res.end(JSON.stringify(build));
    }catch (err){
        console.log(err);
    }
}

async function retreiveUsers(username,email){
    let path = db.ref('/users/');
    const list = await new Promise((resolve,reject)=>{
        path.get().then((snapshot)=>{
            resolve(snapshot.val());
        })
    });
    let userNames = Object.keys(list);
    let build = "";
    userNames.forEach((item)=>{
        if(item==username){
            build = "1,";
        }
    })
    if(build==""){
        build = "0,";
    }
    let subObject = Object.values(list);
    subObject.forEach((item)=>{
        let k = Object.keys(item);
        let v = Object.values(item);
        if(k[0]=="email"){
            if(v[0]==email){
                build+="1";
            }
        }
    })
    if(build.length==2){
        build+="0";
    }
    return build;
}