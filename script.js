
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const formData = { name, message };
  localStorage.setItem("contactFormData", JSON.stringify(formData));
  alert("আপনার বার্তা LocalStorage এ সংরক্ষিত হয়েছে।");
  displayStoredData();
});

function displayStoredData() {
  const data = JSON.parse(localStorage.getItem("contactFormData"));
  if (data) {
    document.getElementById("storedData").innerHTML = 
      `<p><strong>নাম:</strong> ${data.name}</p><p><strong>বার্তা:</strong> ${data.message}</p>`;
  }
}

// Display stored data on load
window.onload = displayStoredData;
