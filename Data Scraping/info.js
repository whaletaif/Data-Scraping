import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDicDUXBt2tQUFM0lbaoTi0MMRWJnFFjew",
  authDomain: "data-scraping-fe855.firebaseapp.com",
  projectId: "data-scraping-fe855",
  appId: "1:188193730231:web:91f6723f8115350c946732"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// عرض اسم المستخدم
onAuthStateChanged(auth, (user) => {
  if (user) {
    const welcome = document.getElementById('welcomeUser');
    welcome.textContent = `مرحباً ${user.email.split('@')[0]}`;
  }
});

// التبديل بين التابات
document.getElementById("tabMore").addEventListener("click", () => {
  document.getElementById("moreInfo").style.display = "block";
  document.getElementById("apiInfo").style.display = "none";
  document.getElementById("tabMore").classList.add("active");
  document.getElementById("tabApi").classList.remove("active");
});

document.getElementById("tabApi").addEventListener("click", () => {
  document.getElementById("moreInfo").style.display = "none";
  document.getElementById("apiInfo").style.display = "block";
  document.getElementById("tabApi").classList.add("active");
  document.getElementById("tabMore").classList.remove("active");
});

function showContent(type) {
  const tabMore = document.querySelector('.tab:nth-child(1)');
  const tabApi = document.querySelector('.tab:nth-child(2)');
  
  if (type === 'info') {
    document.getElementById("moreInfo").style.display = "block";
    document.getElementById("apiInfo").style.display = "none";
    tabMore.classList.add("active");
    tabApi.classList.remove("active");
  } else if (type === 'api') {
    document.getElementById("moreInfo").style.display = "none";
    document.getElementById("apiInfo").style.display = "block";
    tabApi.classList.add("active");
    tabMore.classList.remove("active");
  }
}