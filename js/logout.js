window.onload = function(){
    localStorage.clear();
}

document.getElementById("crest").addEventListener(("click"),()=>{
    window.location.href="/api/home";
})

document.getElementById("back-to-login").addEventListener('click',()=>{
    window.location.href="/api/login";
})