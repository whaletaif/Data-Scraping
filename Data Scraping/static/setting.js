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
    const name = user.displayName || 'بدون اسم';
    const email = user.email;

    // Set data
    document.getElementById('user-email').textContent = email;
    document.getElementById('name-display').textContent = name;
    document.getElementById('user-name').textContent = name;

    // Show the user text
    document.getElementById('user-email').classList.remove('hidden');
    document.getElementById('user-name-box').classList.remove('hidden');
    document.getElementById('user-name').classList.remove('hidden');

    // Edit name
    document.getElementById('edit-name').addEventListener('click', () => {
      const newName = prompt("أدخل اسمك الجديد:", name);
      if (newName) {
        updateProfile(user, { displayName: newName })
          .then(() => {
            document.getElementById('name-display').textContent = newName;
            document.getElementById('user-name').textContent = newName;
          })
          .catch(err => alert("خطأ: " + err.message));
      }
    });

  } else {
    // Not logged in
    window.location.href = '/signup';
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '/';
  });
});