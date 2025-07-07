import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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
  const userAvatarImg = document.querySelector('.user-photo');
  const userNameSpan = document.querySelector('.user-name');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (loginButtonDiv) loginButtonDiv.style.display = 'none';
      if (userInfoDiv) userInfoDiv.style.display = 'flex';

      let name = user.displayName || (user.email ? user.email.split('@')[0] : 'مستخدم');
      let photo = user.photoURL || "/static/userava.png";

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.displayName) name = data.displayName;
          if (data.photoURL) photo = data.photoURL;
        }
      } catch (e) {
        console.error("Error fetching user doc:", e);
      }

      if (userNameSpan) userNameSpan.textContent = name;
      if (userAvatarImg) userAvatarImg.src = photo;
    } else {
      if (loginButtonDiv) loginButtonDiv.style.display = 'block';
      if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    const wrapper = document.getElementById('auth-wrapper');
    if (wrapper) wrapper.style.visibility = 'visible';

  });
});