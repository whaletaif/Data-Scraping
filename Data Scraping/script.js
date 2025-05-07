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
//onAuthStateChanged(auth, (user) => {
  //if (user) {
    //const welcome = document.getElementById('welcomeUser');
    //welcome.textContent = `مرحباً ${user.email.split('@')[0]}`;
  //}
//});

document.addEventListener('DOMContentLoaded', () => {
  const loginButtonDiv = document.querySelector('.login-button');
  const userInfoDiv = document.querySelector('.user-info');
  const userAvatarImg = document.querySelector('.user-info .user-photo');
  const userNameSpan = document.querySelector('.user-info .user-name');
  const welcomeUserElement = document.getElementById('welcomeUser'); // جلب عنصر الترحيب

  onAuthStateChanged(auth, async (user) => {
      if (user) {
          loginButtonDiv.style.display = 'none';
          userInfoDiv.style.display = 'flex';

          if (welcomeUserElement) {
              welcomeUserElement.textContent = `مرحباً ${user.email ? user.email.split('@')[0] : user.displayName || 'مستخدم'}`;
          }

          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              userNameSpan.textContent = userData.displayName || user.displayName || (user.email ? user.email.split('@')[0] : 'اسم المستخدم');
              userAvatarImg.src = userData.photoURL || user.photoURL || 'default-avatar.png';
          } else {
              console.log("لا توجد بيانات إضافية في Firestore.");
              userNameSpan.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'اسم المستخدم');
              userAvatarImg.src = user.photoURL || 'default-avatar.png';
          }
      } else {
          loginButtonDiv.style.display = 'block';
          userInfoDiv.style.display = 'none';
          if (welcomeUserElement) {
              welcomeUserElement.textContent = '';
          }
      }
  });
});

// التبديل بين التابات
const tabMore = document.getElementById('tabMore');
const tabApi = document.getElementById('tabApi');
const moreInfoDiv = document.getElementById('moreInfo');
const apiInfoDiv = document.getElementById('apiInfo');

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
