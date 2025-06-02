
document.addEventListener('DOMContentLoaded', () => {
  loadContents();
  const form = document.querySelector('#submission-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});

function loadContents() {
  const sections = [
    'stories', 'poems', 'rhymes', 'novels', 'short-stories', 'long-stories', 'jokes', 'educational', 'rhythms'
  ];

  sections.forEach(section => {
    const container = document.querySelector(`#${section} .content-list`);
    if (container) {
      for (let i = 1; i <= 40; i++) {
        const item = document.createElement('div');
        item.textContent = `${section.replace('-', ' ').toUpperCase()} ${i}: এখানে আপনার কাহিনী/রচনা থাকবে।`;
        container.appendChild(item);
      }
    }
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const type = document.querySelector('#type').value;
  const content = document.querySelector('#content').value;

  if (name && email && content) {
    alert("আপনার লেখা জমা হয়েছে! ধন্যবাদ।");
    e.target.reset();
  } else {
    alert("সব ফিল্ড পূরণ করুন।");
  }
}
