// Firebase imports and config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtA8WEzg6dHtut8QUQMXTI-nSh-i5j5Us",
  authDomain: "cc02-project-c0d04.firebaseapp.com",
  projectId: "cc02-project-c0d04",
  storageBucket: "cc02-project-c0d04.appspot.com",
  messagingSenderId: "355936712835",
  appId: "1:355936712835:web:6fdd95e3523aceb993c3b6",
  measurementId: "G-Q8Q2LQQ8C4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginSection = document.getElementById("loginSection");
const contentSection = document.getElementById("contentSection");
const adminPanel = document.getElementById("adminPanel");
const signInBtn = document.getElementById("signInBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const postForm = document.getElementById("postForm");
const postCategory = document.getElementById("postCategory");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const adminPostList = document.getElementById("adminPostList");
const categoryFilter = document.getElementById("categoryFilter");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editPostId = null;

// Show/hide sections based on auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    loginSection.style.display = "none";
    contentSection.style.display = "block";
    adminPanel.style.display = "block";
    loginError.textContent = "";
    loadPosts();
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    loginSection.style.display = "none";
    contentSection.style.display = "block";
    adminPanel.style.display = "none";
    adminPostList.innerHTML = "";
  }
});

// Login button click
loginBtn.addEventListener("click", () => {
  loginSection.style.display = "block";
  contentSection.style.display = "none";
  adminPanel.style.display = "none";
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).catch((error) => {
    alert("Logout Error: " + error.message);
  });
});

// Sign in with email & password
signInBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    loginError.textContent = "ইমেইল ও পাসওয়ার্ড দিতে হবে";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      emailInput.value = "";
      passwordInput.value = "";
      loginError.textContent = "";
      loginSection.style.display = "none";
      contentSection.style.display = "block";
      adminPanel.style.display = "block";
      loadPosts();
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

// Load posts from Firestore with optional filter
async function loadPosts() {
  let q;
  if (categoryFilter.value === "all") {
    q = collection(db, "posts");
  } else {
    q = query(collection(db, "posts"), where("category", "==", categoryFilter.value));
  }
  
  const querySnapshot = await getDocs(q);
  displayPosts(querySnapshot.docs);
  if (auth.currentUser) loadAdminPosts(); // Load admin posts for editing
}

// Display posts in the content list
function displayPosts(posts) {
  const container = document.getElementById("contentList");
  container.innerHTML = "";
  if (posts.length === 0) {
    container.innerHTML = "<p>কোনো পোস্ট পাওয়া যায়নি।</p>";
    return;
  }
  posts.forEach((doc) => {
    const data = doc.data();
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
      <h4>${data.title}</h4>
      <p>${data.content.replace(/\n/g, "<br>")}</p>
      <small>ক্যাটাগরি: ${data.category}</small>
    `;
    container.appendChild(postDiv);
  });
}

// Listen for filter changes
categoryFilter.addEventListener("change", loadPosts);

// Add new post or update existing
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const category = postCategory.value;
  const title = postTitle.value.trim();
  const content = postContent.value.trim();

  if (!category || !title || !content) {
    alert("সব ফিল্ড পূরণ করুন।");
    return;
  }

  try {
    if (editPostId) {
      // Update post
      const postRef = doc(db, "posts", editPostId);
      await updateDoc(postRef, { category, title, content });
      alert("পোস্ট আপডেট হয়েছে");
      editPostId = null;
      cancelEditBtn.style.display = "none";
      postForm.reset();
    } else {
      // Add new post
      await addDoc(collection(db, "posts"), { category, title, content });
      alert("পোস্ট সংরক্ষণ হয়েছে");
      postForm.reset();
    }
    loadPosts();
    loadAdminPosts();
  } catch (error) {
    alert("ত্রুটি: " + error.message);
  }
});

// Cancel editing
cancelEditBtn.addEventListener("click", () => {
  editPostId = null;
  postForm.reset();
  cancelEditBtn.style.display = "none";
  postForm.querySelector("#submitPostBtn").textContent = "পোস্ট সংরক্ষণ করুন";
});

// Load admin posts for edit/delete
async function loadAdminPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  adminPostList.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
      <span class="admin-post-title">${data.title}</span>
      <div class="admin-post-actions">
        <button onclick="editPost('${docSnap.id}')">সম্পাদনা</button>
        <button class="delete-btn" onclick="deletePost('${docSnap.id}')">মুছে ফেলুন</button>
      </div>
    `;
    adminPostList.appendChild(postDiv);
  });
}

// Edit post handler
window.editPost = async function (id) {
  const postRef = doc(db, "posts", id);
  const postSnap = await getDocs(collection(db, "posts"));
  const docSnap = await import('https://cdn.jsdelivr.net/npm/firebase/firestore@11.8.1').then(({getDoc}) => getDoc(postRef));
  if (docSnap.exists()) {
    const data = docSnap.data();
    postCategory.value = data.category;
    postTitle.value = data.title;
    postContent.value = data.content;
    editPostId = id;
    cancelEditBtn.style.display = "inline-block";
    postForm.querySelector("#submitPostBtn").textContent = "আপডেট করুন";
  }
};

// Delete post handler
window.deletePost = async function (id) {
  if (confirm("আপনি কি নিশ্চিত মুছে ফেলতে চান?")) {
    await deleteDoc(doc(db, "posts", id));
    alert("পোস্ট মুছে ফেলা হয়েছে");
    loadPosts();
    loadAdminPosts();
  }
};
