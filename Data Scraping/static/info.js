document.addEventListener('DOMContentLoaded', () => {
  const tabMore = document.getElementById('tabMore');
  const tabApi = document.getElementById('tabApi');
  const moreInfoDiv = document.getElementById('moreInfo');
  const apiInfoDiv = document.getElementById('apiInfo');

  if (tabMore && tabApi && moreInfoDiv && apiInfoDiv) {
    tabMore.addEventListener('click', () => showContent('info'));
    tabApi.addEventListener('click', () => showContent('api'));

    function showContent(type) {
      if (type === 'info') {
        moreInfoDiv.style.display = "block";
        apiInfoDiv.style.display = "none";
        tabMore.classList.add("active");
        tabApi.classList.remove("active");
      } else if (type === 'api') {
        moreInfoDiv.style.display = "none";
        apiInfoDiv.style.display = "block";
        tabApi.classList.add("active");
        tabMore.classList.remove("active");
      }
    }
  }

});


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase config — same as signup.js
const firebaseConfig = {
  apiKey: "AIzaSyDicDUXBt2tQUFM0lbaoTi0MMRWJnFFjew",
  authDomain: "data-scraping-fe855.firebaseapp.com",
  projectId: "data-scraping-fe855",
  appId: "1:188193730231:web:91f6723f8115350c946732"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Add event listener to Try button
document.getElementById('tryButton').addEventListener('click', (e) => {
  e.preventDefault(); // prevent default anchor behavior

  onAuthStateChanged(auth, (user) => {
    if (user) {

      window.location.href = "/scraper-maps";
    } else {
      
      window.location.href = "/signup";
    }
  });
});