const user_card=document.querySelector(".user-card");
const logout_btn=document.getElementById("logout__btn");

user_card.addEventListener("click",()=>{
    logout_btn.classList.toggle("hidden");
});