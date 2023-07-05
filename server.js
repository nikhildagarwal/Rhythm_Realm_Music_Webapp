const http = require("http");
const url = require("url");
const fs = require("fs");
const admin = require('./js/firebase.js').admin;
const db = admin.database();

const server = http.createServer((req,res) => {
    let parsedURL = url.parse(req.url,true);
    let path = parsedURL.path.replace(/^\/+|\/+$/g,"");
    if(path==""){
        path = "html/home.html";
    }
    console.log(`Requested path ${path} `);
    let splited = path.split("/");
    if(splited[0] == "api"){
        switch(splited[1]){
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
        }
        return;
    }
    let file =  __dirname +"/"+path;
    fs.readFile(file,function(err,content){
        if(err){
            console.log(`file not found  ${file}`);
            res.writeHead(404);
            res.end();
        }else{
            console.log(`Returning ${path}`);
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
    pathToSet.set({
        email:userinfo.email,
        password:userinfo.password
    })
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