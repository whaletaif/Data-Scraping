document.getElementById("edit-name").addEventListener("click", function () {
    const nameSpan = document.getElementById("name-display");
    const newName = prompt("أدخل اسمك الجديد:", nameSpan.textContent);
    if (newName) {
      nameSpan.textContent = newName;
    }
  });

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDicDUXBt2tQUFM0lbaoTi0MMRWJnFFjew",
  authDomain: "data-scraping-fe855.firebaseapp.com",
  projectId: "data-scraping-fe855",
  appId: "1:188193730231:web:91f6723f8115350c946732"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
   document.querySelector('.info-box.email').textContent = user.email;
   document.getElementById('name-display').textContent = user.displayName || 'بدون اسم';

    // حفظ الاسم الجديد
    document.getElementById('updateNameBtn').addEventListener('click', () => {
      const newName = document.getElementById('nameInput').value.trim();
      if (newName) {
        updateProfile(user, { displayName: newName })
          .then(() => alert("تم تحديث الاسم بنجاح"))
          .catch(err => alert("خطأ: " + err.message));
      }
    });
  }
});


// ✅ Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '/'; // or main page
  });
});