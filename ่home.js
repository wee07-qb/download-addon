// Toggle Dark Mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
  
    // เปลี่ยนไอคอนเพื่อแสดงสถานะของโหมด
    const modeIcon = document.getElementById("modeIcon");
    if (body.classList.contains("dark-mode")) {
      modeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      modeIcon.classList.replace("fa-sun", "fa-moon");
    }
  }
  