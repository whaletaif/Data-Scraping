import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDicDUXBt2tQUFM0lbaoTi0MMRWJnFFjew",
  authDomain: "data-scraping-fe855.firebaseapp.com",
  projectId: "data-scraping-fe855",
  appId: "1:188193730231:web:91f6723f8115350c946732"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginButtonDiv = document.querySelector('.login-button');
  const userInfoDiv = document.querySelector('.user-info');
  const userAvatarImg = document.querySelector('.user-info .user-photo');
  const userNameSpan = document.querySelector('.user-info .user-name');
  const welcomeUserElement = document.getElementById('welcome-user'); // optional welcome user text
  const tryButton = document.getElementById('tryButton');

  // Auth state logic and setup
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (loginButtonDiv) loginButtonDiv.style.display = 'none';
      if (userInfoDiv) userInfoDiv.style.display = 'flex';

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let name = user.displayName || (user.email ? user.email.split('@')[0] : 'اسم المستخدم');
      let photo = user.photoURL || 'default-avatar.png';

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        name = userData.displayName || name;
        photo = userData.photoURL || photo;
      }

      if (userNameSpan) userNameSpan.textContent = name;
      if (userAvatarImg) userAvatarImg.src = photo;
      if (welcomeUserElement) welcomeUserElement.textContent = `مرحبا ${name}`;
    } else {
      if (loginButtonDiv) loginButtonDiv.style.display = 'block';
      if (userInfoDiv) userInfoDiv.style.display = 'none';
      if (welcomeUserElement) welcomeUserElement.textContent = '';
    }

    // Button logic after auth status is known
    if (tryButton) {
      tryButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = user ? 'scraper-maps' : 'signup';
      });
    }
  });

  // تبويب العرض
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