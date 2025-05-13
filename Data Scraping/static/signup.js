// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDicDUXBt2tQUFM0lbaoTi0MMRWJnFFjew",
  authDomain: "data-scraping-fe855.firebaseapp.com",
  projectId: "data-scraping-fe855",
  appId: "1:188193730231:web:91f6723f8115350c946732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Get DOM elements safely
window.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const nameField = document.getElementById('nameField');
  const form = document.getElementById('form');
  const continueBtn = document.querySelector('.continue-btn');
  const googleBtn = document.querySelector('.google-btn');

  let mode = 'login'; // default mode

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    nameField.style.display = 'none';
    mode = 'login';
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    nameField.style.display = 'block';
    mode = 'signup';
  });

  // Form submit (Email/Password)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (mode === 'signup') {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = '/mainpage')
        .catch(err => alert(err.message));
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = '/mainpage')
        .catch(err => alert(err.message));
    }
  });

  // Google Sign-In
  googleBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then(() => window.location.href = '/mainpage')
      .catch(err => alert(err.message));
  });
});