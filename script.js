// ตั้งค่า link หลังจากดาวน์โหลดเสร็จ
let link1 = "https://s.shopee.co.th/2B1jiJVvRR";  // ลิงก์แรก (เปิดแท็บใหม่)

const files = [
  // Golem
  { name: 'Hay Golem [BP] v1.1.0.mcpack', url: 'addon/golem/Hay Golem [BP] v1.1.0.mcpack' },
  { name: 'Hay Golem [RP] v1.1.0.mcpack', url: 'addon/golem/Hay Golem [RP] v1.1.0.mcpack' },

  // Magic
  { name: 'A Magic Way Behavior v1.5.mcpack', url: 'addon/magic/A Magic Way Behavior v1.5 (1).mcpack' },
  { name: 'A Magic Way Resource v1.5.mcpack', url: 'addon/magic/A Magic Way Resource v1.5.mcpack' },

  // Village
  { name: 'CircularHotbar-210425.mcpack', url: 'addon/village/CircularHotbar-210425.mcpack' },
  { name: 'Ruins_Addon_1.2.9.mcaddon', url: 'addon/village/Ruins_Addon_1.2.9.mcaddon' }
];

let allSelected = false;

// สร้างรายการไฟล์
function renderFiles(filter = '') {
  const list = document.getElementById('fileList');
  list.innerHTML = '';
  files
    .filter(file => file.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'list-group-item';
      item.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="file-${index}" value="${file.url}" data-name="${file.name}" onchange="updateSelectedCount()">
          <label class="form-check-label" for="file-${index}">
            <i class="fas fa-file-alt me-2 text-primary"></i>${file.name}
          </label>
        </div>
      `;
      list.appendChild(item);
    });
  updateSelectedCount();
}

// นับจำนวนไฟล์ที่เลือก
function updateSelectedCount() {
  const selected = document.querySelectorAll('#fileList input[type="checkbox"]:checked').length;
  document.getElementById('selectedCount').innerText = `เลือก ${selected} ไฟล์`;
}

// เลือก/ไม่เลือกทั้งหมด
function toggleSelectAll() {
  const checkboxes = document.querySelectorAll('#fileList input[type="checkbox"]');
  allSelected = !allSelected;
  checkboxes.forEach(checkbox => {
    checkbox.checked = allSelected;
  });
  updateSelectedCount();
}

// ดาวน์โหลดไฟล์ที่เลือก
async function downloadSelected() {
  const selected = document.querySelectorAll('#fileList input[type="checkbox"]:checked');
  
  if (selected.length === 0) {
    return Swal.fire({
      icon: 'warning',
      title: 'ยังไม่ได้เลือกไฟล์',
      text: 'กรุณาเลือกไฟล์อย่างน้อย 1 รายการ',
      confirmButtonText: 'ตกลง'
    });
  }

  const zip = new JSZip();

  // ดาวน์โหลดไฟล์แต่ละไฟล์
  for (const checkbox of selected) {
    const url = checkbox.value;
    const filename = checkbox.getAttribute('data-name');

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(filename, blob);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error);
    }
  }

  // สร้างไฟล์ zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // บันทึก zip ลงเครื่อง
  saveAs(zipBlob, 'selected-files.zip');

  // เสร็จแล้วเปิดลิงก์
  if (link1) {
    setTimeout(() => {   // ดีเลย์เล็กน้อยเพื่อให้ saveAs ทำงานเสร็จ
      window.open(link1, "_blank");
    }, 50);  // 0.5 วินาที
  }

  // เคลียร์ตัวเลือก
  document.getElementById('searchInput').value = '';
  renderFiles();
}


// โหมดกลางวัน/กลางคืน
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('modeIcon');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

// กู้สถานะธีม
function restoreDarkMode() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('modeIcon');
    if (icon) {
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  }
}

// เริ่มต้นเมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', () => {
  restoreDarkMode();
  renderFiles();
});
