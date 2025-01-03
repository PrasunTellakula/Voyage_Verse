import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyMAhcamfnjH9TtPKbP9BcGluDW8XbY0U",
  authDomain: "user-auth-80d87.firebaseapp.com",
  projectId: "user-auth-80d87",
  storageBucket: "user-auth-80d87.firebasestorage.app",
  messagingSenderId: "207285303304",
  appId: "1:207285303304:web:5b940a45926dfc8d11f9bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const signinForm = document.getElementById("container");
const signinButton = document.getElementById("signin");


signinButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  try {
    // Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Signed in successfully!");
    console.log("User details:", userCredential.user);
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error("Signin error:", error);
  }
});


onAuthStateChanged(auth, (user) => {
  if (user) {

    console.log("User is signed in:", user.email);
    signinForm.style.display = "none";


    const existingSignoutButton = document.getElementById("dynamic-signout");
    if (!existingSignoutButton) {
      const signoutButton = document.createElement("button");
      signoutButton.id = "dynamic-signout";
      signoutButton.textContent = "SignOut";
      signoutButton.style.marginTop = "20px";
      document.body.appendChild(signoutButton);


      signoutButton.addEventListener("click", async () => {
        try {
          await signOut(auth);
          alert("Signed out successfully!");
        } catch (error) {
          alert(`Error: ${error.message}`);
          console.error("Signout error:", error);
        }
      });
    }
  } else {

    console.log("User is not signed in.");
    signinForm.style.display = "block";


    const signoutButton = document.getElementById("dynamic-signout");
    if (signoutButton) {
      signoutButton.remove();
    }
  }
});







