// DOM Elements
const storyForm = document.getElementById('storyForm');
const storiesSection = document.getElementById('stories');

// লোকালস্টোরেজ থেকে গল্পগুলো লোড করে UI তে দেখাবে
function loadStories() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    stories.forEach(story => {
        addStoryToDOM(story.title, story.body);
    });
}

// DOM এ নতুন গল্প যোগ করার ফাংশন
function addStoryToDOM(title, body) {
    const newArticle = document.createElement('article');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = body;
    newArticle.appendChild(h3);
    newArticle.appendChild(p);
    storiesSection.appendChild(newArticle);
}

// নতুন গল্প ফর্ম সাবমিট হ্যান্ডলার
storyForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('storyTitle').value.trim();
    const body = document.getElementById('storyBody').value.trim();

    if (title && body) {
        // DOM এ যোগ করো
        addStoryToDOM(title, body);

        // লোকালস্টোরেজে সেভ করো
        const stories = JSON.parse(localStorage.getItem('stories')) || [];
        stories.push({ title, body });
        localStorage.setItem('stories', JSON.stringify(stories));

        // ফর্ম রিসেট করো
        this.reset();
    } else {
        alert('অনুগ্রহ করে শিরোনাম এবং বিবরণ উভয়ই পূরণ করুন।');
    }
});

// পেজ লোড হওয়ার সময় লোকালস্টোরেজ থেকে গল্পগুলো লোড করো
window.addEventListener('load', loadStories);