let link1 = "https://s.shopee.co.th/2B1jiJVvRR";
let link2 = "https://www.lazada.co.th/products/2022-i5661814104-s24147192009.html?trafficFrom=17449020_303586&laz_trackid=2:mm_321251106_287552583_2244402583:clkgikqsm1ir5bco0e9r4o&mkttid=clkgikqsm1ir5bco0e9r4o";

const files = [
  { name: '[BP] Instant Structures v7 BONY162', url: '[BP] Instant Structures v7 BONY162.mcpack' },
  { name: '[RP] Instant Structures v7 BONY162', url: '[RP] Instant Structures v7 BONY162.mcpack' },
  { name: 'AddVenture 1.4', url: 'AddVenture 1.4.mcaddon' },
  { name: 'Fabulous-Furnished-1-7-5s', url: 'Fabulous-Furnished-1-7-5s.mcaddon' },
  { name: 'MoreSkins', url: 'MoreSkins.mcaddon.zip' },
  { name: "NinjaHamster's Book Reader v1.0.1", url: "NinjaHamster's Book Reader v1.0.1.mcaddon" },
  { name: 'slasher_sword_1.0.1', url: 'slasher_sword_1.0.1.mcaddon' },
  { name: 'Streak Up!', url: 'Streak Up!.mcaddon' },
];

let allSelected = false;

// ฟังก์ชันล้างชื่อไฟล์และเติมนามสกุลให้เหมาะสม
function getSafeFilename(name) {
  let ext = '';
  if (name.startsWith('[BP]') || name.startsWith('[RP]')) {
    ext = '.mcpack';
  } else {
    ext = '.mcaddon';
  }

  if (!/\.[a-z0-9]+$/i.test(name)) {
    name += ext;
  }

  return name.replace(/[^\w\s.-]/gi, '_').trim();
}

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

  Swal.fire({
    title: 'กำลังสร้างไฟล์...',
    text: 'กรุณารอสักครู่',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  for (const checkbox of selected) {
    const url = checkbox.value;
    const rawName = checkbox.getAttribute('data-name');
    const safeName = getSafeFilename(rawName);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      zip.file(safeName, blob);
    } catch (error) {
      console.error(`Error downloading ${safeName}:`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const randomName = 'download-' + Date.now() + '.zip';
  saveAs(zipBlob, randomName);

  Swal.fire({
    icon: 'success',
    title: 'ดาวน์โหลดเสร็จสิ้น',
    text: 'ไฟล์ที่คุณเลือกจะถูกดาวน์โหลด',
    confirmButtonText: 'ตกลง'
  });

  // เปิดลิงก์ Shopee และ Lazada
  if (link1) {
    setTimeout(() => {
      window.open(link1, "_blank");
    }, 500);
  }

  if (link2) {
    setTimeout(() => {
      window.location.href = link2;
    }, 500);
  }
}

// รีเฟรชหน้าเว็บ
function refreshPage() {
  Swal.fire({
    title: 'กำลังโหลดใหม่...',
    text: 'กรุณารอสักครู่',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  setTimeout(() => {
    location.reload();
  }, 1500);
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
