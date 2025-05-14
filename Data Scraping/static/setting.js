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
    // Display the user's current name and email
    document.querySelector('.info-box.email').textContent = user.email;
    document.getElementById('name-display').textContent = user.displayName || 'بدون اسم';

    // Update the username in the left section
    document.querySelector('.username').textContent = user.displayName || 'بدون اسم';
    
    // Handle name editing
    document.getElementById('edit-name').addEventListener('click', () => {
      const newName = prompt("أدخل اسمك الجديد:", user.displayName || "بدون اسم");
      if (newName) {
        updateProfile(user, { displayName: newName })
          .then(() => {
            // Update the name in the UI
            document.getElementById('name-display').textContent = newName;
            document.querySelector('.username').textContent = newName;
            // alert("تم تحديث الاسم بنجاح");
          })
          .catch(err => alert("خطأ: " + err.message));
      }
    });
  } else {
    // Redirect to login/signup page if not logged in
    window.location.href = '/signup';
  }
});


// ✅ Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '/'; // or main page
  });
});