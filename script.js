let mode = 'desktop'; // Default mode
let useCurrentUrl = false; // Default to using input URL

// Fungsi untuk mengganti mode (desktop/mobile)
function toggleMode() {
    mode = mode === 'desktop' ? 'mobile' : 'desktop';
    document.getElementById('modeBtn').innerText = mode === 'desktop' ? 'Switch to Mobile' : 'Switch to Desktop';
}

// Fungsi untuk mengganti sumber URL (Input URL atau Current URL)
function toggleUrlSource() {
    useCurrentUrl = !useCurrentUrl;
    document.getElementById('urlSourceBtn').innerText = useCurrentUrl ? 'Use Input URL' : 'Use Current URL';
}

// Fungsi untuk mengambil domain utama dari URL
function getMainDomain(url) {
    let urlObject = new URL(url);
    return urlObject.origin; // Mengembalikan hanya domain utama, misal: https://www.youtube.com/
}

// Fungsi untuk mendapatkan data PageSpeed
function getPageSpeedData() {
    const inputUrl = document.getElementById('urlInput').value;
    const url = useCurrentUrl ? getMainDomain(window.location.href) : inputUrl;
    const strategy = mode; // 'desktop' atau 'mobile'
    const resultsDiv = document.getElementById('results');

    if (!url) {
        alert("Please enter a valid URL.");
        return;
    }

    // Tampilkan pesan "sedang memproses"
    resultsDiv.innerHTML = '<p class="loading">Sedang memproses... Mohon tunggu...</p>';

    // Endpoint API tanpa API key dengan strategi mode (desktop/mobile)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    console.log(`Requesting URL: ${apiUrl}`); // Tambahkan log untuk debug

    // Ambil data dari PageSpeed Insights API
    fetch(apiUrl)
        .then(response => {
            console.log('API Response Status:', response.status); // Tambahkan log untuk debug
            return response.json();
        })
        .then(data => {
            console.log('API Data:', data); // Tambahkan log untuk debug
            displayResults(data, url);
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Error fetching PageSpeed data:', error);
        });
}

// Fungsi untuk menampilkan hasil PageSpeed
function displayResults(data, url) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Kosongkan hasil sebelumnya

    // Tampilkan URL yang dicek
    resultsDiv.innerHTML += `<div class="result-item">
        <strong>URL:</strong> ${url} (Mode: ${mode})
    </div>`;

    if (data.lighthouseResult) {
        const metrics = data.lighthouseResult.audits;

        // Tampilkan First Contentful Paint (FCP)
        const fcp = metrics['first-contentful-paint']?.displayValue || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>First Contentful Paint (FCP):</strong> ${fcp} (Waktu hingga konten pertama kali terlihat)
        </div>`;

        // Tampilkan Largest Contentful Paint (LCP)
        const lcp = metrics['largest-contentful-paint']?.displayValue || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Largest Contentful Paint (LCP):</strong> ${lcp} (Waktu hingga elemen terbesar terlihat)
        </div>`;

        // Tampilkan Cumulative Layout Shift (CLS)
        const cls = metrics['cumulative-layout-shift']?.displayValue || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Cumulative Layout Shift (CLS):</strong> ${cls} (Perubahan tata letak halaman yang terjadi)
        </div>`;

        // Tampilkan Total Blocking Time (TBT)
        const tbt = metrics['total-blocking-time']?.displayValue || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Total Blocking Time (TBT):</strong> ${tbt} (Waktu saat halaman tidak merespons)
        </div>`;

        // Tampilkan Time to Interactive (TTI)
        const tti = metrics['interactive']?.displayValue || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Time to Interactive (TTI):</strong> ${tti} (Waktu hingga halaman sepenuhnya interaktif)
        </div>`;

        // Tampilkan skor performa keseluruhan
        const performanceScore = data.lighthouseResult.categories.performance?.score * 100 || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Performance Score:</strong> ${performanceScore}/100 (Skor keseluruhan performa halaman)
        </div>`;

    } else {
        resultsDiv.innerHTML = `<p>Data tidak ditemukan. Pastikan URL yang Anda masukkan valid.</p>`;
    }
}
