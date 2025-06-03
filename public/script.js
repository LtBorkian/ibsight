import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js"; // Fixed import (getDoc instead of getDocs)

console.log("createUserWithEmailAndPassword function:", createUserWithEmailAndPassword);

const firebaseConfig = {
  apiKey: "AIzaSyD_WSY4SxCx-u8OaK3AluEo22E5jpw2zyk",
  authDomain: "ibsight.firebaseapp.com",
  projectId: "ibsight",
  storageBucket: "ibsight.firebasestorage.app",
  messagingSenderId: "84917699257",
  appId: "1:84917699257:web:ba685494985514b8dc1168",
  measurementId: "G-T42DK1W1WN"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app);

const auth = getAuth(app);
const db = getFirestore(app);

console.log("Auth and Firestore initialized:", auth, db);

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => { // Added async here for better structure
      e.preventDefault();
      console.log("Sign-up form submitted!");

      const name = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created:", user);

        // Save user data in Firestore
        await saveUserData(user.uid, name, email);

        // Update Firebase Authentication profile
        await updateProfile(user, { displayName: name });

        alert("Account created successfully!");
        window.location.href = "home.html";
      } catch (error) {
        console.error("Error signing up:", error);
        alert("Sign-up failed: " + error.message);
      }
    });
  } else {
    console.error("Sign-up form not found!");
  }

  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => { // Added async for better structure
      e.preventDefault();
      console.log("Sign-in form submitted!");

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign-in successful:", userCredential.user);
        alert("Sign-in successful! Redirecting to the home page...");
        window.location.href = "home.html"; // Redirect to home page
      } catch (error) {
        console.error("Sign-in error:", error);
        alert("Sign-in failed: " + error.message);
      }
    });
  } else {
    console.error("Sign-in form not found!");
  }
});

async function saveUserData(userId, name, email) {
  try {
    await setDoc(doc(db, "users", userId), {
      name: name,
      email: email,
      createdAt: new Date()
    });
    console.log("User data saved to Firestore!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

async function getUserData(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId)); // Fixed function call
    if (userDoc.exists()) {
      console.log("User Data:", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
  }
}

document.getElementById("forgotPassword").addEventListener("click", async function () {
  const email = prompt("Enter your email to reset your password:");

  if (email) {
      try {
          await sendPasswordResetEmail(auth, email);
          alert("✅ Password reset email sent! Check your inbox.");
      } catch (error) {
          console.error("Error:", error.message);
          alert("❌ Error: " + error.message);
      }
  }
});