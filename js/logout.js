window.onload = function(){
    document.getElementById("loading-display").className = "loading_display";
    localStorage.clear();
    document.getElementById("loading-display").className = "loading_display off";
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

document.getElementById("back-to-login").addEventListener('click',()=>{
    window.location.href="/api/login";
})