import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

window.toggleMode = toggleMode;

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert('সফলভাবে লগইন হয়েছে'))
    .catch(error => alert('ভুল ইমেইল বা পাসওয়ার্ড'));
}
window.login = login;

function logout() {
  signOut(auth).then(() => alert('লগআউট সম্পন্ন'));
}
window.logout = logout;

onAuthStateChanged(auth, user => {
  document.querySelector('.login-panel').style.display = user ? 'none' : 'block';
});

const stories = Array.from({length: 40}, (_, i) => ({
  title: `গল্প ${i + 1}`,
  image: `https://source.unsplash.com/600x400/?nature,story,${i}`,
  content: `এটি গল্প নম্বর ${i + 1}। এই গল্পে রয়েছে এক গভীর শিক্ষণীয় বার্তা ও আবেগের ছোঁয়া। বাস্তব জীবনের অনুপ্রেরণামূলক ঘটনা তুলে ধরা হয়েছে এখানে।`
}));

const storyContainer = document.getElementById('storyContainer');

stories.forEach(story => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${story.image}" alt="Story Image">
    <h2>${story.title}</h2>
    <p>${story.content}</p>
    <div class="signature">— Content Creators 02</div>
  `;
  storyContainer.appendChild(card);
});
