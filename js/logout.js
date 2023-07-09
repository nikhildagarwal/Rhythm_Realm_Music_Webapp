window.onload = function(){
    localStorage.clear();
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="../html/home.html";
})

document.getElementById("back-to-login").addEventListener('click',()=>{
    window.location.href="../html/login.html";
})