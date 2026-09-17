// --- 1. LOGIKA UI & MOBILE RESPONSIVE ---
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobile-overlay');
const btnOpenSidebar = document.getElementById('btn-open-sidebar');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

btnOpenSidebar.addEventListener('click', toggleSidebar);
btnCloseSidebar.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// --- 2. LOGIKA INFO BUBBLE TOOLTIP ('i') ---
const varInfoDict = {
    'v0': { title: "Kecepatan Semburan Awal ($v_0$)", text: "Kecepatan dorongan material saat keluar dari kawah (Gas Thrust). Momentum kinetik dari kecepatan ini akan mendorong material melawan gravitasi awal sebelum daya apung konvektif mengambil alih." },
    'temp': { title: "Temperatur Magma ($T_0$)", text: "Suhu awal campuran gas dan abu. Perbedaan suhu yang ekstrem dengan udara sekitar memicu gaya apung (Thermal Buoyancy), memberikan kecepatan vertikal tambahan (updraft) yang kuat." },
    'plumeHeight': { title: "Tinggi Kolom Erupsi", text: "Dihitung secara analitik berdasarkan momentum semburan ($v_0$), gaya apung termal ($T_0$), dan elevasi ($h_0$). Ketinggian ini akan membatasi seberapa jauh penyebaran awan payung (Umbrella Cloud) di peta." },
    'angle': { title: "Sudut Letusan ($\\theta$)", text: "Mempengaruhi arah jatuhan proyektil balistik (batu pijar/bom vulkanik). Semakin miring, lontaran batu akan semakin jauh ke laut." },
    'ventAlt': { title: "Elevasi Kawah ($h_0$)", text: "Ketinggian awal lubang kawah dari permukaan laut. Untuk Anak Krakatau posisinya dekat dengan permukaan laut (hampir 0)." },
    'mix': { title: "Komposisi Partikel", text: "Letusan ekstrem menghasilkan bongkahan proyektil berat yang cepat jatuh, letusan debu memproduksi abu mikroskopis ringan yang terbang jauh." },
    'density': { title: "Densitas ($\\rho_p$)", text: "Massa jenis abu. Batu apung (Pumice) ringan (~800 kg/m³) akan terbang jauh, lelehan padat Basaltik (~2800 kg/m³) akan cepat jatuh." },
    'windLow': { title: "Angin Troposfer", text: "Arus angin di ketinggian bawah 11 km. Sangat berpengaruh menggeser jatuhan abu lapili sedang." },
    'windHigh': { title: "Angin Stratosfer", text: "Arus jet stream berkecepatan tinggi (> 11 km). Jika abu berhasil menembus lapisan ini, partikel akan terseret hingga lintas benua." },
    'warp': { title: "Akselerasi (Warp)", text: "Debu mikron jatuh ke bumi sangat lambat (< 0.1 m/s), butuh berhari-hari. Gunakan warp untuk mempercepat rentang waktu (time-lapse) simulasi." },
    'mode': { title: "Mode Mesin Fisika", text: "<b>Realis:</b> Abu mikroskopis seolah menolak turun karena gaya gesek udaranya sangat besar (mampu terbang melintasi benua).<br><b>Demo:</b> Simulasi dieksagerasi agar debu cepat jatuh melengkung untuk presentasi cepat." }
};

function toggleInfo(key, btn, event) {
    event.stopPropagation();
    const tooltip = document.getElementById('bubble-tooltip');
    
    if (tooltip.dataset.key === key && !tooltip.classList.contains('hidden')) {
        tooltip.classList.add('hidden', 'opacity-0');
        tooltip.dataset.key = "";
        return;
    }
    
    const data = varInfoDict[key];
    document.getElementById('bubble-title').innerHTML = data.title;
    document.getElementById('bubble-text').innerHTML = data.text;
    
    tooltip.classList.remove('hidden');
    const rect = btn.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2);
    tooltip.style.top = top + 'px';
    
    let tooltipWidth = 256; 
    let actualLeft = left - (tooltipWidth / 2);
    
    if (actualLeft < 10) actualLeft = 10;
    if (actualLeft + tooltipWidth > window.innerWidth - 10) actualLeft = window.innerWidth - tooltipWidth - 10;
    
    tooltip.style.left = actualLeft + 'px';
    
    const arrow = document.getElementById('bubble-arrow');
    let arrowLeft = left - actualLeft - 8; 
    arrow.style.left = arrowLeft + 'px';
    
    setTimeout(() => tooltip.classList.remove('opacity-0'), 10);
    tooltip.dataset.key = key;

    if (window.MathJax) MathJax.typesetPromise([tooltip]);
}

window.addEventListener('click', (e) => {
    if(!e.target.closest('.info-btn') && !e.target.closest('#bubble-tooltip')) {
        const tooltip = document.getElementById('bubble-tooltip');
        tooltip.classList.add('hidden', 'opacity-0');
        tooltip.dataset.key = "";
    }
});


// --- 3. LOGIKA CUSTOM DROPDOWN UI ---
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
    const select = wrapper.querySelector('select');
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const textNode = trigger.querySelector('.custom-select-text');
    const optionsPanel = wrapper.querySelector('.custom-select-options');
    const arrow = trigger.querySelector('svg');
    const options = optionsPanel.querySelectorAll('.custom-option');

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target) && !optionsPanel.classList.contains('hidden')) {
            optionsPanel.classList.add('opacity-0', 'scale-y-95');
            arrow.style.transform = 'rotate(0deg)';
            setTimeout(() => optionsPanel.classList.add('hidden'), 200);
        }
    });

    trigger.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        const isHidden = optionsPanel.classList.contains('hidden');
        
        document.querySelectorAll('.custom-select-options').forEach(p => {
            if (p !== optionsPanel && !p.classList.contains('hidden')) {
                p.classList.add('opacity-0', 'scale-y-95');
                const otherArrow = p.parentElement.querySelector('.custom-select-trigger svg');
                if(otherArrow) otherArrow.style.transform = 'rotate(0deg)';
                setTimeout(() => p.classList.add('hidden'), 200);
            }
        });

        if (isHidden) {
            optionsPanel.classList.remove('hidden');
            setTimeout(() => optionsPanel.classList.remove('opacity-0', 'scale-y-95'), 10);
            arrow.style.transform = 'rotate(180deg)';
        } else {
            optionsPanel.classList.add('opacity-0', 'scale-y-95');
            arrow.style.transform = 'rotate(0deg)';
            setTimeout(() => optionsPanel.classList.add('hidden'), 200);
        }
    });

    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            textNode.innerText = opt.innerText; 
            select.value = opt.dataset.value;   
            
            optionsPanel.classList.add('opacity-0', 'scale-y-95');
            arrow.style.transform = 'rotate(0deg)';
            setTimeout(() => optionsPanel.classList.add('hidden'), 200);
            
            select.dispatchEvent(new Event('change'));
        });
    });
});


// --- 4. LOGIKA DRAGGABLE PANELS & COLLAPSE UI ---
const durasiPanel = document.getElementById('durasi-panel');
const panelHeader = document.getElementById('panel-header');
const panelBody = document.getElementById('panel-body');
const minimizeIcon = document.getElementById('minimize-icon');
let isPanelOpen = true;

const legendPanel = document.getElementById('legend-panel');
const legendHeader = document.getElementById('legend-header');
const legendBody = document.getElementById('legend-body');
const legendIcon = document.getElementById('legend-minimize-icon');
let isLegendOpen = window.innerWidth > 768; 

function makeDraggable(el, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let didDrag = false;

    handle.addEventListener('mousedown', dragStart, { passive: false });
    handle.addEventListener('touchstart', dragStart, { passive: false });

    function dragStart(e) {
        if (e.target.tagName === 'BUTTON') return;
        if (e.target.id === 'minimize-icon' || e.target.id === 'legend-minimize-icon' || e.target.closest('svg')) return;

        didDrag = false;
        pos3 = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        pos4 = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        if(!el.style.width) el.style.width = el.offsetWidth + 'px';

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('mousemove', dragMove, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
    }

    function dragMove(e) {
        didDrag = true;
        e.preventDefault();

        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        let newTop = el.offsetTop - pos2;
        let newLeft = el.offsetLeft - pos1;

        const sidebarActive = window.innerWidth > 768 && !document.getElementById('sidebar').classList.contains('-translate-x-full');
        const sidebarWidth = sidebarActive ? document.getElementById('sidebar').offsetWidth : 0;

        if (newTop < 0) newTop = 0;
        if (newLeft < sidebarWidth) newLeft = sidebarWidth;
        if (newTop + el.offsetHeight > window.innerHeight) newTop = window.innerHeight - el.offsetHeight;
        if (newLeft + el.offsetWidth > window.innerWidth) newLeft = window.innerWidth - el.offsetWidth;

        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.top = newTop + "px";
        el.style.left = newLeft + "px";
    }

    function dragEnd() {
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
    }

    return function wasDragged() { return didDrag; }
}

const durasiWasDragged = makeDraggable(durasiPanel, panelHeader);
const legendWasDragged = makeDraggable(legendPanel, legendHeader);

panelHeader.addEventListener('click', () => {
    if(durasiWasDragged()) return;
    isPanelOpen = !isPanelOpen;
    if (isPanelOpen) { 
        panelBody.classList.remove('max-h-0', 'opacity-0', 'border-transparent', 'py-0', 'px-0'); 
        panelBody.classList.add('max-h-[500px]', 'opacity-100', 'border-slate-200'); 
        minimizeIcon.style.transform = 'rotate(0deg)'; 
        panelHeader.classList.remove('rounded-b-xl'); 
    } else { 
        panelBody.classList.remove('max-h-[500px]', 'opacity-100', 'border-slate-200'); 
        panelBody.classList.add('max-h-0', 'opacity-0', 'border-transparent', 'py-0', 'px-0'); 
        minimizeIcon.style.transform = 'rotate(180deg)'; 
        panelHeader.classList.add('rounded-b-xl'); 
    }
});

function applyLegendState() {
    if (isLegendOpen) {
        legendBody.classList.remove('max-h-0', 'opacity-0', 'border-transparent', 'py-0', 'px-0');
        legendBody.classList.add('max-h-[500px]', 'opacity-100', 'border-slate-200');
        legendIcon.style.transform = 'rotate(0deg)';
        legendHeader.classList.remove('rounded-b-xl');
    } else {
        legendBody.classList.remove('max-h-[500px]', 'opacity-100', 'border-slate-200');
        legendBody.classList.add('max-h-0', 'opacity-0', 'border-transparent', 'py-0', 'px-0');
        legendIcon.style.transform = 'rotate(180deg)';
        legendHeader.classList.add('rounded-b-xl');
    }
}

legendHeader.addEventListener('click', () => {
    if(legendWasDragged()) return;
    isLegendOpen = !isLegendOpen;
    applyLegendState();
});

function updateLegendUI() {
    const mixType = document.getElementById('input-mix').value;
    const container = document.getElementById('legend-materials');
    container.innerHTML = '';
    
    let html = '';
    if (mixType === 'all' || mixType === 'bomb_only' || mixType === 'mega') {
        let label = mixType === 'mega' ? "Bom Megablock (1 m)" : "Lapili / Proyektil (30 cm)";
        html += `<div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm"></div> ${label}</div>`;
    }
    if (mixType === 'all' || mixType === 'ash_only' || mixType === 'mega') {
        const ashClasses = [ 
            { name: 'Sangat halus (10 µm)', color: 'bg-[#cbd5e1]' }, 
            { name: 'Halus (63 µm)', color: 'bg-[#94a3b8]' }, 
            { name: 'Menengah (0.25 mm)', color: 'bg-[#64748b]' }, 
            { name: 'Kasar (1 mm)', color: 'bg-[#475569]' } 
        ];
        ashClasses.forEach(ac => {
            html += `<div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full ${ac.color} shadow-sm border border-slate-300"></div> Abu ${ac.name}</div>`;
        });
    }
    container.innerHTML = html;
}

applyLegendState();


// --- 5. LOGIKA INTERACTIVE GUIDED TOUR BEBAS LONCAT ---
let currentTourStep = -1;
const tourSteps = [
    { target: null, title: "Selamat Datang di KRAKASON!", desc: "Mari kenali fitur-fitur di simulasi Erupsi Anak Krakatau ini. Tekan lanjut untuk mulai tur interaktif." },
    { target: 'tour-step-1-container', title: "1. Panel Fisika Dinamis", desc: "Anda bisa mengatur parameter layaknya di dunia nyata. Ubah kecepatan semburan, suhu magma, hingga kemiringan tebing kawah di sini." },
    { target: 'tour-step-info-example', title: "2. Belajar Teori Fisika", desc: "Bingung fungsi suatu variabel? Tekan ikon 'i' untuk menampilkan penjelasan ringkas tentang efeknya di dunia nyata (lengkap dengan rumus!)." },
    { target: 'tour-step-mode', title: "3. Mode Fisika vs Demo", desc: "Ini sangat penting! Gunakan Mode Realis untuk melihat lambatnya debu asli turun (butuh berhari-hari). Gunakan Mode Demo untuk presentasi visual cepat di mana debu dipaksa jatuh melengkung." },
    { target: 'tour-step-3', title: "4. Mempercepat Waktu", desc: "Debu berukuran mikro butuh berhari-hari untuk mendarat ke bumi. Anda wajib menggunakan fitur 'Akselerasi Warp' ini agar proses jatuhnya terlihat. <br><br><span class='bg-blue-50 border border-blue-200 text-blue-900 px-3 py-2 rounded-lg text-[11px] leading-relaxed font-medium inline-block mt-3 shadow-sm'>💡 <b>Fakta:</b> Karena terlalu ringan dan terus terbawa arus angin, abu ini seolah <b>menolak turun</b> ke bumi! Inilah sebabnya letusan besar bisa menyelimuti bumi berbulan-bulan.</span>" },
    { target: 'btn-info', title: "5. Metodologi Simulasi", desc: "Ingin tahu persamaan matematika di balik engine ini? Klik tombol kuning ini untuk membaca dokumentasi fisika yang menggerakkan simulasi." },
    { target: 'btn-map', title: "6. Integrasi Peta Satelit", desc: "Begitu letusan berjalan, klik tombol biru ini untuk melihat prediksi area abu (Umbrella Cloud & Adveksi) yang diproyeksikan langsung di atas Selat Sunda." },
    { target: 'btn-start', title: "7. Mulai Simulasi", desc: "Sekarang tekan tombol merah ini dan jadilah ilmuwan! Lakukan eksperimen Anda sendiri." }
];

function startTour() {
    document.getElementById('tour-click-blocker').classList.remove('hidden');
    
    const sidebarScrollArea = document.getElementById('sidebar-scroll-area');
    if (sidebarScrollArea) {
        sidebarScrollArea.classList.remove('overflow-y-auto');
        sidebarScrollArea.classList.add('overflow-hidden');
    }

    currentTourStep = 0;
    
    document.getElementById('tour-highlighter').classList.remove('hidden');
    document.getElementById('tour-dialog').classList.remove('hidden');

    setTimeout(() => { renderTourStep(); }, 50);
}

function renderTourStep() {
    const step = tourSteps[currentTourStep];
    const isMobile = window.innerWidth < 768;
    const inSidebar = ['tour-step-1-container', 'tour-step-info-example', 'tour-step-mode', 'tour-step-3', 'btn-start'].includes(step.target);
    
    if (isMobile) {
        if (inSidebar && sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden');
        } else if (!inSidebar && !sidebar.classList.contains('-translate-x-full') && step.target) {
            sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden');
        }
    }

    const highlighter = document.getElementById('tour-highlighter');
    const dialog = document.getElementById('tour-dialog');
    const prevBtn = document.getElementById('tour-prev-btn');
    
    document.getElementById('tour-title').innerHTML = step.title;
    document.getElementById('tour-desc').innerHTML = step.desc;
    document.getElementById('tour-progress').innerText = `${currentTourStep + 1} / ${tourSteps.length}`;
    document.getElementById('tour-next-btn').innerText = currentTourStep === tourSteps.length - 1 ? "Selesai" : "Lanjut";

    if (currentTourStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');

    setTimeout(() => {
        if (step.target) {
            const el = document.getElementById(step.target);
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                const rect = el.getBoundingClientRect();
                
                highlighter.style.top = (rect.top - 6) + 'px'; 
                highlighter.style.left = (rect.left - 6) + 'px';
                highlighter.style.width = (rect.width + 12) + 'px'; 
                highlighter.style.height = (rect.height + 12) + 'px';
                highlighter.style.boxShadow = '0 0 0 9999px rgba(15, 23, 42, 0.85)';
                highlighter.classList.remove('opacity-0');

                if (isMobile) {
                    const dialogWidth = window.innerWidth * 0.9;
                    dialog.style.width = dialogWidth + 'px';
                    dialog.style.left = ((window.innerWidth - dialogWidth) / 2) + 'px';
                    
                    const elementCenterY = rect.top + (rect.height / 2);
                    if (elementCenterY > window.innerHeight / 2) {
                        dialog.style.top = '24px';
                        dialog.style.bottom = 'auto';
                    } else {
                        dialog.style.top = 'auto';
                        dialog.style.bottom = '24px';
                    }
                    dialog.style.borderRadius = '1rem';
                } else {
                    dialog.style.width = '350px';
                    let dlgX = rect.right + 20;
                    let dlgY = rect.top;
                    
                    if (dlgX + 350 > window.innerWidth) dlgX = rect.left - 350 - 20;
                    
                    const dialogHeight = dialog.offsetHeight;
                    if (dlgY + dialogHeight > window.innerHeight - 20) {
                        dlgY = window.innerHeight - dialogHeight - 20;
                        if (dlgY < 20) dlgY = 20; 
                    }
                    
                    dialog.style.left = dlgX + 'px';
                    dialog.style.top = dlgY + 'px';
                }
                
                dialog.classList.remove('opacity-0', 'scale-95');
            }, 300); 
        } else {
            highlighter.style.top = '50%'; highlighter.style.left = '50%';
            highlighter.style.width = '0px'; highlighter.style.height = '0px';
            highlighter.style.boxShadow = '0 0 0 9999px rgba(15, 23, 42, 0.85)';
            highlighter.classList.remove('opacity-0');

            if (isMobile) {
                const dialogWidth = window.innerWidth * 0.9;
                dialog.style.width = dialogWidth + 'px';
                dialog.style.left = ((window.innerWidth - dialogWidth) / 2) + 'px';
                const dH = dialog.offsetHeight;
                dialog.style.top = ((window.innerHeight - dH) / 2) + 'px';
            } else {
                dialog.style.width = '350px';
                const dW = 350;
                dialog.style.left = ((window.innerWidth - dW) / 2) + 'px';
                const dH = dialog.offsetHeight;
                dialog.style.top = ((window.innerHeight - dH) / 2) + 'px';
            }

            dialog.classList.remove('opacity-0', 'scale-95');
        }
    }, isMobile ? 350 : 50); 
}

function nextTourStep() {
    if (currentTourStep >= tourSteps.length - 1) {
        endTour();
    } else {
        document.getElementById('tour-dialog').classList.add('opacity-0', 'scale-95');
        document.getElementById('tour-highlighter').classList.add('opacity-0');
        setTimeout(() => {
            currentTourStep++;
            renderTourStep();
        }, 250); 
    }
}

function prevTourStep() {
    if (currentTourStep > 0) {
        document.getElementById('tour-dialog').classList.add('opacity-0', 'scale-95');
        document.getElementById('tour-highlighter').classList.add('opacity-0');
        setTimeout(() => {
            currentTourStep--;
            renderTourStep();
        }, 250);
    }
}

function endTour() {
    document.getElementById('tour-click-blocker').classList.add('hidden');
    document.getElementById('tour-highlighter').classList.add('hidden', 'opacity-0');
    document.getElementById('tour-dialog').classList.add('hidden', 'opacity-0', 'scale-95');
    
    const sidebarScrollArea = document.getElementById('sidebar-scroll-area');
    if (sidebarScrollArea) {
        sidebarScrollArea.classList.add('overflow-y-auto');
        sidebarScrollArea.classList.remove('overflow-hidden');
    }

    if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden');
    }
}

window.addEventListener('DOMContentLoaded', () => { startTour(); });


// =========================================================================
// --- 6. ENGINE FISIKA, PINCH-TO-ZOOM, CANVAS, & LEAFLET MAP ---
// =========================================================================

let state = { t: 0, scale: 0.03, offsetX: 200, offsetY: 100, particles: [], hColBase: 6000 };

// UI Pemeberitahuan Tinggi Kolom
function updatePlumeUI() {
    const ventAlt = parseFloat(inputs.ventAlt.value) || 150;
    document.getElementById('ui-plume-height').innerText = ((state.hColBase + ventAlt) / 1000).toFixed(1) + " km DPL";
}

// --- MAP LEAFLET LOGIC ---
let mapInitialized = false; let leafletMap; let ashMapLayers = []; 

function initMap() {
    if(mapInitialized) return;
    const lat = -6.102; const lng = 105.423;
    
    const vectorMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' });
    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
    const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenTopoMap' });
    const darkMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

    // DEFAULT LAYER BERUBAH KE vectorMap
    leafletMap = L.map('leaflet-map', { center: [lat, lng], zoom: 8, layers: [vectorMap], zoomControl: false });
    L.control.zoom({ position: 'topleft' }).addTo(leafletMap);
    L.control.layers({ "Peta Vektor (OSM)": vectorMap, "Satelit (Esri)": satelliteMap, "Topografi": topoMap, "Gelap (Dark Mode)": darkMap }, null, {position: 'topright'}).addTo(leafletMap);

    const craterIcon = L.divIcon({ html: '<div class="w-4 h-4 bg-red-600 border-2 border-white rounded-full shadow-[0_0_15px_rgba(220,38,38,1)]"></div>', className: '' });
    L.marker([lat, lng], {icon: craterIcon}).addTo(leafletMap).bindPopup("<b>Gunung Anak Krakatau</b>").openPopup();
    mapInitialized = true;
}

function getDestinationPoint(lat, lng, dist, brngDeg) {
    const R = 6378137; const brng = brngDeg * Math.PI / 180; const l1 = lat * Math.PI / 180; const lon1 = lng * Math.PI / 180;
    const l2 = Math.asin(Math.sin(l1) * Math.cos(dist/R) + Math.cos(l1) * Math.sin(dist/R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist/R) * Math.cos(l1), Math.cos(dist/R) - Math.sin(l1) * Math.sin(l2));
    return [l2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

function getTephraFanPolygon(lat, lng, radius, bearing, spreadAngle) {
    let points = [[lat, lng]]; 
    const startAngle = bearing - (spreadAngle / 2); const endAngle = bearing + (spreadAngle / 2);
    for(let i=0; i<=15; i++) points.push(getDestinationPoint(lat, lng, radius, startAngle + (endAngle - startAngle) * (i/15)));
    return points;
}

function updateMapDynamicRadius() {
    if (!leafletMap) return;
    ashMapLayers.forEach(layer => leafletMap.removeLayer(layer));
    ashMapLayers = [];
    const lat = -6.102; const lng = 105.423;
    
    let umbrella = L.circle([lat, lng], { radius: state.hColBase * 1.5, color: '#dc2626', weight: 2, dashArray: '6, 6', fillColor: '#0f172a', fillOpacity: 0.15 })
        .bindPopup(`<b>Batas Awan Payung (Umbrella Cloud)</b><br>Radius Radial: ${((state.hColBase * 1.5)/1000).toFixed(1)} km`);
    umbrella.addTo(leafletMap); ashMapLayers.push(umbrella);

    const windDir = parseFloat(document.getElementById('map-wind-dir').value) || 90;
    let dynamicSpread = 20 + (state.hColBase / 15000) * 60;
    dynamicSpread = Math.min(90, Math.max(20, dynamicSpread));

    // PERBAIKAN: Mengurutkan dari maxX terbesar ke terkecil agar poligon yang kecil bisa diklik (z-index Leaflet)
    const abuParticles = state.particles.filter(p => p.type === 'abu').sort((a, b) => b.maxX - a.maxX);
    
    abuParticles.forEach(p => {
        if (p.maxX > 50) { 
            let fan = L.polygon(getTephraFanPolygon(lat, lng, p.maxX, windDir, dynamicSpread), { color: p.color, weight: 1, fillColor: p.color, fillOpacity: 0.35 })
                .bindPopup(`<b>${p.name}</b><br>Jangkauan Angin: ${(p.maxX/1000).toFixed(2)} km<br>Arah: ${windDir}°`);
            fan.addTo(leafletMap); ashMapLayers.push(fan);
        }
    });
}

document.getElementById('map-wind-dir').addEventListener('input', function(e) {
    document.getElementById('map-wind-label').innerText = e.target.value + '°'; updateMapDynamicRadius(); 
});

// --- DOM Elements ---
const btnMap = document.getElementById('btn-map'); const mapModal = document.getElementById('map-modal'); const mapModalContent = document.getElementById('map-modal-content'); const btnCloseMapModal = document.getElementById('btn-close-map-modal');
const canvas = document.getElementById('simCanvas'); const ctx = canvas.getContext('2d');

const inputs = { v0: document.getElementById('input-v0'), temp: document.getElementById('input-temp'), angle: document.getElementById('input-angle'), ventAlt: document.getElementById('input-vent-alt'), density: document.getElementById('input-density'), windLow: document.getElementById('input-wind-low'), windHigh: document.getElementById('input-wind-high'), warp: document.getElementById('input-warp'), scale: document.getElementById('input-scale') };
const nums = { v0: document.getElementById('num-v0'), temp: document.getElementById('num-temp'), angle: document.getElementById('num-angle'), ventAlt: document.getElementById('num-vent-alt'), density: document.getElementById('num-density'), windLow: document.getElementById('num-wind-low'), windHigh: document.getElementById('num-wind-high'), warp: document.getElementById('num-warp') };

const modeSelect = document.getElementById('input-mode'); const mixSelect = document.getElementById('input-mix'); const unitSelect = document.getElementById('input-unit');
const results = { batuX: document.getElementById('res-batu-x'), batuY: document.getElementById('res-batu-y'), abuX: document.getElementById('res-abu-x'), abuY: document.getElementById('res-abu-y'), time: document.getElementById('sim-time') };
const btnStart = document.getElementById('btn-start'); const btnReset = document.getElementById('btn-reset'); const btnResetView = document.getElementById('btn-reset-view');
const btnInfo = document.getElementById('btn-info'); const infoModal = document.getElementById('info-modal'); const infoModalContent = document.getElementById('info-modal-content'); const btnCloseModal = document.getElementById('btn-close-modal');

btnMap.addEventListener('click', () => { mapModal.classList.remove('opacity-0', 'pointer-events-none'); mapModalContent.classList.remove('scale-95'); mapModalContent.classList.add('scale-100'); initMap(); updateMapDynamicRadius(); setTimeout(() => { leafletMap.invalidateSize(); }, 100); });
btnCloseMapModal.addEventListener('click', () => { mapModal.classList.add('opacity-0', 'pointer-events-none'); mapModalContent.classList.remove('scale-100'); mapModalContent.classList.add('scale-95'); });

btnInfo.addEventListener('click', () => { infoModal.classList.remove('opacity-0', 'pointer-events-none'); infoModalContent.classList.remove('scale-95'); infoModalContent.classList.add('scale-100'); if (window.MathJax) MathJax.typesetPromise([infoModalContent]); });
btnCloseModal.addEventListener('click', () => { infoModal.classList.add('opacity-0', 'pointer-events-none'); infoModalContent.classList.remove('scale-100'); infoModalContent.classList.add('scale-95'); });

let animationId; let isPlaying = false; let isDraggingCanvas = false; let dragStartX = 0, dragStartY = 0, initOffsetX = 0, initOffsetY = 0; let frameCount = 0;

// KONSTANTA FISIKA
const G0 = 9.80665; const R_GAS = 287.05; const T_REF = 273.15; const MU_REF = 1.716e-5; const S_SUTH = 110.4; const T0 = 288.15; const P0 = 101325; const L_LAPSE = 0.0065; const GROUND_Z = -157;

function calculateAnalyticalPlumeHeight(v0, tempC, ventAlt) {
    const gasThrustH = (v0 * v0) / (2 * G0); 
    const tempFactor = Math.max(0, (tempC - 20) / 1000); 
    const massFactor = v0 / 100; 
    const elevationFactor = 1 + (ventAlt / 10000); 
    const thermalH = 3500 * tempFactor * massFactor * elevationFactor; 
    let hMax = (gasThrustH * 0.25) + thermalH;
    if (hMax > 11000) hMax = 11000 + (hMax - 11000) * 0.65;
    return Math.max(500, hMax);
}

function precalcHL(Psi) {
    return {
        A: Math.exp(2.3288 - 6.4581 * Psi + 2.4486 * Math.pow(Psi, 2)), B: 0.0964 + 0.5565 * Psi,
        C: Math.exp(4.905 - 13.8944 * Psi + 18.4222 * Math.pow(Psi, 2) - 10.2599 * Math.pow(Psi, 3)), D: Math.exp(1.4681 + 12.2584 * Psi - 20.7322 * Math.pow(Psi, 2) + 15.8855 * Math.pow(Psi, 3))
    };
}
const HL_BATU = precalcHL(0.80);

function formatTime(seconds) {
    const d = Math.floor(seconds / (3600 * 24)); const h = Math.floor((seconds % (3600 * 24)) / 3600); const m = Math.floor((seconds % 3600) / 60); const s = Math.floor(seconds % 60);
    return `${d} Hari, ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getAtmosphere(z) {
    let T, P;
    if (z <= 11000) { T = T0 - L_LAPSE * z; P = P0 * Math.pow(T / T0, G0 / (R_GAS * L_LAPSE)); } 
    else { T = 216.65; P = 22632 * Math.exp(-G0 * (z - 11000) / (R_GAS * 216.65)); }
    const rho = P / (R_GAS * T); const mu = MU_REF * Math.pow(T / T_REF, 1.5) * ((T_REF + S_SUTH) / (T + S_SUTH));
    return { T, P, rho, mu };
}

function getCdOptimized(Re, hl) {
    const Re_eff = Math.max(Re, 1e-6); const term2 = hl.A * Math.exp(hl.B * Math.log(Re_eff));
    return (24 / Re_eff) * (1 + term2) + (hl.C / (1 + hl.D / Re_eff));
}

const PlumeDynamics = {
    getEnvironment: function(altitude, ventAlt, v0, tempC, hColBase) {
        const y_rel = Math.max(0, altitude - ventAlt);
        if (y_rel >= hColBase) return { updraftVy: 0, plumeRadius: 0 };
        const alpha = 0.15; const b0 = 100.0; const plumeRadius = b0 + alpha * y_rel; 
        const z_norm = y_rel / hColBase; const peakZ = 0.15; let updraftVy = 0; const v_peak = v0 + (tempC / 1000) * 40; 
        if (z_norm <= peakZ) { const progress = z_norm / peakZ; updraftVy = v0 + (v_peak - v0) * Math.sin(progress * Math.PI / 2); } 
        else { const progress = (z_norm - peakZ) / (1 - peakZ); updraftVy = v_peak * Math.cos(progress * Math.PI / 2); }
        return { updraftVy, plumeRadius };
    }
};

function resetSimulation() {
    cancelAnimationFrame(animationId); isPlaying = false;
    
    const v0 = parseFloat(inputs.v0.value) || 470; 
    const tempC = parseFloat(inputs.temp.value) || 1000; 
    const ventAlt = parseFloat(inputs.ventAlt.value) || 150;
    const angleRad = (parseFloat(inputs.angle.value) || 88) * Math.PI / 180; 
    const rho_p = parseFloat(inputs.density.value) || 1800; 
    const mixType = mixSelect.value;
    
    state.hColBase = calculateAnalyticalPlumeHeight(v0, tempC, ventAlt); 
    updatePlumeUI();
    updateLegendUI();
    
    state.t = 0; state.particles = [];
    
    // PERBAIKAN: UKURAN BATU DIPERBESAR
    let d_batu = 0.3; // 30 cm untuk default campuran realistis
    if (mixType === 'mega') d_batu = 1.0; 
    else if (mixType === 'bomb_only') d_batu = 0.5;

    if (mixType === 'all' || mixType === 'bomb_only' || mixType === 'mega') {
        state.particles.push({
            type: 'batu', x: 0, y: ventAlt, vx: v0 * Math.cos(angleRad), vy: v0 * Math.sin(angleRad), k_drag: 0.006, 
            d: d_batu, rho: rho_p, Psi: 0.80, m: rho_p * (Math.PI*Math.pow(d_batu,3))/6, A: (Math.PI*Math.pow(d_batu,2))/4, hl: HL_BATU,
            active: true, maxX: 0, maxY: ventAlt, pathTimer: 0, path: [{x:0, y:ventAlt}], color: '#ef4444' 
        });
    }
    if (mixType === 'all' || mixType === 'ash_only' || mixType === 'mega') {
        const ashClasses = [ { name: 'Sangat halus', d: 1.0e-5, Psi: 0.45, k_demo: 110, color: '#cbd5e1' }, { name: 'Halus', d: 6.3e-5, Psi: 0.50, k_demo: 40, color: '#94a3b8' }, { name: 'Menengah', d: 2.5e-4, Psi: 0.60, k_demo: 12, color: '#64748b' }, { name: 'Kasar', d: 1.0e-3, Psi: 0.65, k_demo: 2.5, color: '#475569' } ];
        ashClasses.forEach(ac => {
            let hlAbu = precalcHL(ac.Psi);
            state.particles.push({
                type: 'abu', name: ac.name, x: 0, y: ventAlt, vx: (v0 * 0.5 * Math.cos(angleRad)) + (Math.random()*10 - 5), vy: v0 * 0.5 * Math.sin(angleRad),
                k_drag: ac.k_demo, d: ac.d, rho: rho_p, Psi: ac.Psi, m: rho_p * (Math.PI*Math.pow(ac.d,3))/6, A: (Math.PI*Math.pow(ac.d,2))/4, hl: hlAbu,
                active: true, maxX: 0, maxY: 0, pathTimer: 0, path: [{x:0, y:ventAlt}], color: ac.color
            });
        });
    }
    updateResults(); draw(); btnStart.innerText = "Mulai Erupsi";
}

function stepPhysicsCore(obj, dt) {
    const mode = modeSelect.value;
    const v0 = parseFloat(inputs.v0.value) || 470; 
    const tempC = parseFloat(inputs.temp.value) || 1000; 
    const ventAlt = parseFloat(inputs.ventAlt.value) || 150;
    const windLow = (parseFloat(inputs.windLow.value) || 20) / 3.6; 
    const windHigh = (parseFloat(inputs.windHigh.value) || 110) / 3.6;
    
    let u_env = 0; const altDPL = Math.max(0, obj.y);
    if (altDPL <= 11000) u_env = windLow + (windHigh - windLow) * (altDPL / 11000); else u_env = windHigh;
    const hCol = state.hColBase; const y_rel = Math.max(0, obj.y - ventAlt);
    const env = PlumeDynamics.getEnvironment(obj.y, ventAlt, v0, tempC, hCol);

    if (mode === 'demo') {
        let wind_y = 0; let umbrella_x = 0;
        if (obj.type === 'abu') {
            let r_decay = env.plumeRadius > 0 ? Math.exp(-Math.pow(obj.x / env.plumeRadius, 2)) : 0;
            wind_y = env.updraftVy * r_decay;
            let z_diff = (y_rel - hCol) / (hCol * 0.12); let dir = (obj.x > 0) ? 1 : ((obj.x < 0) ? -1 : (u_env === 0 ? 0 : Math.sign(u_env)));
            umbrella_x = dir * (v0 * 0.2) * Math.exp(-Math.pow(z_diff, 2));
        }
        const atmDemo = getAtmosphere(obj.y); const CdDemo = obj.type === 'batu' ? 0.47 : 0.75; const KDemo = (atmDemo.rho * CdDemo * obj.A) / (2 * Math.max(obj.m, 1e-18));
        const uAirDemo = u_env + umbrella_x; const vrelX = obj.vx - uAirDemo; const vrelY = obj.vy - wind_y;
        const vrelMag = Math.hypot(vrelX, vrelY); const betaDemo = KDemo * vrelMag; const denomDemo = 1 + betaDemo * dt;

        obj.vx = (obj.vx + betaDemo * uAirDemo * dt) / denomDemo;
        obj.vy = (obj.vy + (betaDemo * wind_y - G0) * dt) / denomDemo;
        obj.x += obj.vx * dt; obj.y += obj.vy * dt;
    } else {
        const atm = getAtmosphere(obj.y);
        let elutriation = 1.0;
        
        if (obj.type === 'batu') elutriation = 0.05; 
        else if (obj.d > 1e-3) elutriation = 0.1; 
        else if (obj.d > 2.5e-4) elutriation = 0.5;   
        
        let w_air = 0; let u_umbrella = 0;
        if (obj.type === 'abu') {
            let r_decay = env.plumeRadius > 0 ? Math.exp(-Math.pow(obj.x / env.plumeRadius, 2)) : 0;
            if (obj.y > (ventAlt + hCol + 2000)) r_decay = 0; 
            w_air = env.updraftVy * r_decay * elutriation;
            if (env.updraftVy < 15 && y_rel > hCol * 0.6) {
                let z_diff = (y_rel - hCol) / (hCol * 0.15); let dir = (obj.x > 0) ? 1 : ((obj.x < 0) ? -1 : (u_env === 0 ? 0 : Math.sign(u_env)));
                const m_ref = 2400 * (Math.PI / 6) * Math.pow(1e-4, 3); const mass_damping = 1 / (1 + obj.m / m_ref); 
                u_umbrella = dir * 20 * Math.exp(-Math.pow(z_diff, 2)) * mass_damping;
            }
        }
        let u_air = u_env + u_umbrella; let vrel_x = obj.vx - u_air; let vrel_y = obj.vy - w_air; let vrel_mag = Math.hypot(vrel_x, vrel_y);
        let Re = (atm.rho * vrel_mag * obj.d) / atm.mu; let Cd = getCdOptimized(Re, obj.hl); let K = (atm.rho * Cd * obj.A) / (2 * obj.m);
        let beta = K * vrel_mag; let denom = 1 + beta * dt;
        
        let vx_next = (obj.vx + beta * u_air * dt) / denom; let vy_next = (obj.vy + (beta * w_air - G0) * dt) / denom;
        obj.x += vx_next * dt; obj.y += vy_next * dt; obj.vx = vx_next; obj.vy = vy_next;
    }

    if (obj.y <= GROUND_Z) { obj.y = GROUND_Z; obj.active = false; }
    obj.maxX = Math.max(obj.maxX, Math.abs(obj.x)); obj.maxY = Math.max(obj.maxY, obj.y);
    
    const lastPath = obj.path[obj.path.length - 1];
    if (lastPath) {
        const dist = Math.hypot(obj.x - lastPath.x, obj.y - lastPath.y); obj.pathTimer += dt;
        let shouldSave = false;
        if (obj.type === 'batu' && dist > 10) shouldSave = true; else if (obj.type === 'abu' && (dist > 500 || obj.pathTimer > 60)) shouldSave = true;
        if (shouldSave) { obj.path.push({x: obj.x, y: obj.y}); obj.pathTimer = 0; if (obj.path.length > 5000) obj.path.shift(); }
    }
}

function stepPhysicsAdaptive(obj, dt) {
    if (!obj.active) return;
    if (modeSelect.value === 'demo') { stepPhysicsCore(obj, dt); return; }
    const maxSubstep = (obj.type === 'batu') ? 0.05 : 0.002; const n = Math.ceil(dt / maxSubstep); const subDt = dt / n;
    for (let i = 0; i < n; i++) { stepPhysicsCore(obj, subDt); if (!obj.active) break; }
}

function resizeCanvas() { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; if (!isPlaying) draw(); }
window.addEventListener('resize', resizeCanvas);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const originX = state.offsetX; const originY = canvas.height - state.offsetY; const scale = state.scale;
    const ventAlt = parseFloat(inputs.ventAlt.value) || 150; const hColBase = state.hColBase; 
    const unit = unitSelect.value; const uDiv = unit === 'km' ? 1000 : 1; const uStr = unit === 'km' ? 'km' : 'm';
    
    const targetSpacingPx = 80; const rawStepMeters = targetSpacingPx / scale; const magnitude = Math.pow(10, Math.floor(Math.log10(rawStepMeters)));
    const normalized = rawStepMeters / magnitude; let multiplier = (normalized < 2) ? 1 : ((normalized < 5) ? 2 : 5);
    const gridStepMeters = multiplier * magnitude; const gridStepPx = gridStepMeters * scale;

    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath();
    
    for(let x = 0; x < canvas.width; x += gridStepPx) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
    for(let y = canvas.height; y > 0; y -= gridStepPx) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
    ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY); ctx.stroke();

    const groundY = originY - GROUND_Z * scale;
    const drawZone = (radiusMeters, color) => { ctx.fillStyle = color; ctx.fillRect(originX - (radiusMeters * scale), groundY, (radiusMeters * 2 * scale), canvas.height - groundY); };
    
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    drawZone(8000, 'rgba(253, 224, 71, 0.4)'); drawZone(5000, 'rgba(244, 114, 182, 0.5)'); drawZone(3000, 'rgba(220, 38, 38, 0.6)');  

    ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();
    
    const ventPy = originY - ventAlt * scale; const baseW = Math.max(1500, ventAlt * 2.5) * scale;
    ctx.fillStyle = '#475569'; ctx.beginPath();
    ctx.moveTo(originX - baseW, groundY); ctx.lineTo(originX + baseW, groundY);
    ctx.lineTo(originX + 20 * scale, ventPy); ctx.lineTo(originX - 20 * scale, ventPy); ctx.fill();

    ctx.fillStyle = '#ea580c'; ctx.shadowColor = '#f97316'; ctx.shadowBlur = 10;
    ctx.fillRect(originX - 15 * scale, ventPy - 2, 30 * scale, 4); ctx.shadowBlur = 0;

    const hLineY = originY - (ventAlt + hColBase) * scale;
    ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, hLineY); ctx.lineTo(canvas.width, hLineY); ctx.stroke(); ctx.setLineDash([]);

    ctx.fillStyle = '#475569'; ctx.font = '10px Arial'; ctx.textAlign = 'center';
    let dec = (gridStepMeters / uDiv) < 1 ? 1 : 0; if (gridStepMeters / uDiv < 0.1) dec = 2;
    const labelY = Math.max(15, Math.min(originY + 15, canvas.height - 10)); const labelX = Math.max(30, Math.min(originX - 5, canvas.width - 10));

    ctx.fillStyle = '#a855f7'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`Estimasi Max Plume (${((ventAlt + hColBase)/uDiv).toFixed(1)} ${uStr})`, labelX + 15, hLineY - 8);

    for(let x = 0; x < canvas.width; x += gridStepPx) { let val = (x - originX) / scale; ctx.fillText((val / uDiv).toFixed(dec) + uStr, x + 5, labelY); }
    ctx.textAlign = 'right';
    for(let y = canvas.height; y > 0; y -= gridStepPx) { let val = (originY - y) / scale; ctx.fillText((val / uDiv).toFixed(dec) + uStr, labelX, y - 5); }

    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'right'; ctx.fillText(`Jarak Horizontal (${uStr}) ➔`, canvas.width - 20, labelY - 20);
    ctx.textAlign = 'left'; ctx.fillText(`Ketinggian Elevasi (${uStr})`, labelX + 15, 20);

    const drawPath = (path, color) => {
        if (path.length === 0) return;
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.moveTo(originX + path[0].x * scale, originY - path[0].y * scale);
        for(let i=1; i<path.length; i++) ctx.lineTo(originX + path[i].x * scale, originY - path[i].y * scale); ctx.stroke();
    };

    const drawBall = (obj, color, size) => { ctx.beginPath(); ctx.arc(originX + obj.x * scale, originY - obj.y * scale, size, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); };

    const particleSize = Math.max(3, Math.min(6, 3 + (scale - 0.0005) * 60)); const sortedParticles = [...state.particles].reverse();
    sortedParticles.forEach(p => {
        drawPath(p.path, p.color); drawBall(p, p.color, p.type === 'batu' ? particleSize + 2 : particleSize);
        if (p.type === 'abu' && p.active && scale > 0.00008) {
            ctx.fillStyle = p.color; ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(p.name, originX + p.x * scale + 7, originY - p.y * scale - 5);
        }
    });
}

function updateResults() {
    const unit = unitSelect.value; const uDiv = unit === 'km' ? 1000 : 1; const uStr = unit === 'km' ? 'km' : 'm'; const dec = unit === 'km' ? 2 : 0;
    const batu = state.particles.find(p => p.type === 'batu'); let maxAbuX = 0; let maxAbuY = 0;
    state.particles.filter(p => p.type === 'abu').forEach(a => { maxAbuX = Math.max(maxAbuX, Math.abs(a.x), a.maxX); maxAbuY = Math.max(maxAbuY, a.maxY); });

    if(batu) { results.batuX.innerText = (batu.maxX / uDiv).toFixed(dec); results.batuY.innerText = (batu.maxY / uDiv).toFixed(dec); } 
    else { results.batuX.innerText = "0.0"; results.batuY.innerText = "0.0"; }
    
    if(maxAbuX > 0 || maxAbuY > 0) { results.abuX.innerText = (maxAbuX / uDiv).toFixed(unit === 'km' ? 1 : 0); results.abuY.innerText = (maxAbuY / uDiv).toFixed(unit === 'km' ? 1 : 0); } 
    else { results.abuX.innerText = "0.0"; results.abuY.innerText = "0.0"; }
    
    results.time.innerText = formatTime(state.t); document.querySelectorAll('.unit-label').forEach(el => el.innerText = uStr);
}

function triggerSeamlessReset() { const wasPlaying = isPlaying; resetSimulation(); if (wasPlaying) { isPlaying = true; btnStart.innerText = "Jeda"; animate(); } }

function syncValues(key, source) {
    if (source === 'range' && nums[key]) nums[key].value = inputs[key].value; else if (source === 'num' && inputs[key]) inputs[key].value = nums[key].value;
    if (key === 'scale') state.scale = parseFloat(inputs.scale.value);
    if (['v0', 'temp', 'ventAlt'].includes(key) && !isPlaying) {
        const v0 = parseFloat(inputs.v0.value) || 470; 
        const tempC = parseFloat(inputs.temp.value) || 1000;
        const ventAlt = parseFloat(inputs.ventAlt.value) || 150;
        state.hColBase = calculateAnalyticalPlumeHeight(v0, tempC, ventAlt); 
        updatePlumeUI(); draw();
    } else if (!isPlaying) { draw(); }
}

const simulationInputKeys = new Set(['v0', 'temp', 'angle', 'ventAlt', 'density', 'windLow', 'windHigh']);

Object.keys(inputs).forEach(key => {
    if (inputs[key]) inputs[key].addEventListener('input', () => { syncValues(key, 'range'); if (simulationInputKeys.has(key)) triggerSeamlessReset(); });
    if (nums[key]) nums[key].addEventListener('input', () => { syncValues(key, 'num'); if (simulationInputKeys.has(key)) triggerSeamlessReset(); });
});

document.getElementById('input-mix').addEventListener('change', triggerSeamlessReset); 
document.getElementById('input-mode').addEventListener('change', triggerSeamlessReset);
document.getElementById('input-unit').addEventListener('change', () => { updateResults(); if (!isPlaying) draw(); });

function animate() {
    if (!isPlaying) return;
    const mode = document.getElementById('input-mode').value; const dt = mode === 'demo' ? 0.05 : 0.005; const targetMinutesPerRealSec = parseFloat(inputs.warp.value) || 60; const fps = 60; const MAX_ITER = 3000;
    let simSecondsPerFrame = (targetMinutesPerRealSec * 60) / fps; let warpFactor = Math.ceil(simSecondsPerFrame / dt);
    if (warpFactor > MAX_ITER) warpFactor = MAX_ITER;
    
    for(let i = 0; i < warpFactor; i++) { state.particles.forEach(p => stepPhysicsAdaptive(p, dt)); state.t += dt; }
    draw(); updateResults();
    if (mapInitialized && !mapModal.classList.contains('opacity-0')) { frameCount++; if (frameCount % 30 === 0) updateMapDynamicRadius(); }
    if (state.particles.some(p => p.active)) { animationId = requestAnimationFrame(animate); } else { isPlaying = false; btnStart.innerText = "Ulangi Erupsi"; }
}

btnStart.addEventListener('click', () => {
    if (!isPlaying) { if (!state.particles.some(p => p.active)) resetSimulation(); isPlaying = true; btnStart.innerText = "Jeda"; animate(); } 
    else { isPlaying = false; btnStart.innerText = "Lanjutkan"; cancelAnimationFrame(animationId); }
});
btnReset.addEventListener('click', resetSimulation); btnResetView.addEventListener('click', () => { state.offsetX = 200; state.offsetY = 100; if (!isPlaying) draw(); });

// -- LOGIKA PAN DAN PINCH TO ZOOM TOUCHSCREEN ---
let isPinching = false;
let initialPinchDistance = null;
let initialPinchScale = null;

canvas.addEventListener('mousedown', (e) => { isDraggingCanvas = true; dragStartX = e.clientX; dragStartY = e.clientY; initOffsetX = state.offsetX; initOffsetY = state.offsetY; canvas.classList.add('grabbing-cursor'); });
window.addEventListener('mousemove', (e) => { if (!isDraggingCanvas) return; state.offsetX = initOffsetX + (e.clientX - dragStartX); state.offsetY = initOffsetY - (e.clientY - dragStartY); if (!isPlaying) draw(); });

canvas.addEventListener('touchstart', (e) => { 
    if (e.touches.length === 2) {
        e.preventDefault();
        isPinching = true;
        isDraggingCanvas = false;
        initialPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        initialPinchScale = state.scale;
    } else if (e.touches.length === 1) {
        isDraggingCanvas = true; 
        dragStartX = e.touches[0].clientX; 
        dragStartY = e.touches[0].clientY; 
        initOffsetX = state.offsetX; 
        initOffsetY = state.offsetY; 
    }
}, {passive: false});

window.addEventListener('touchmove', (e) => { 
    if (isPinching && e.touches.length === 2) {
        e.preventDefault(); 
        const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        state.scale = Math.max(0.000005, Math.min(0.05, initialPinchScale * (currentDistance / initialPinchDistance)));
        inputs.scale.value = state.scale;
        if (!isPlaying) draw();
    } else if (isDraggingCanvas && e.touches.length === 1) {
        state.offsetX = initOffsetX + (e.touches[0].clientX - dragStartX); 
        state.offsetY = initOffsetY - (e.touches[0].clientY - dragStartY); 
        if (!isPlaying) draw(); 
    }
}, {passive: false});

window.addEventListener('mouseup', () => { isDraggingCanvas = false; canvas.classList.remove('grabbing-cursor'); });
window.addEventListener('touchend', (e) => { 
    if (e.touches.length < 2) isPinching = false;
    if (e.touches.length === 0) isDraggingCanvas = false; 
});
canvas.addEventListener('mouseleave', () => { isDraggingCanvas = false; canvas.classList.remove('grabbing-cursor'); });

canvas.addEventListener('wheel', (e) => { e.preventDefault(); let zoomMultiplier = e.deltaY < 0 ? 1.15 : 0.85; state.scale = Math.max(0.000005, Math.min(0.05, state.scale * zoomMultiplier)); inputs.scale.value = state.scale; if (!isPlaying) draw(); }, { passive: false });

resizeCanvas(); state.hColBase = calculateAnalyticalPlumeHeight(470, 1000, 150); resetSimulation();
