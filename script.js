function getPageSpeedData() {
    const url = document.getElementById('urlInput').value;
    const resultsDiv = document.getElementById('results');

    // Tampilkan pesan "sedang memproses"
    resultsDiv.innerHTML = '<p class="loading">Sedang memproses... Mohon tunggu...</p>';

    // Endpoint tanpa API key
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}`;

    // Ambil data dari PageSpeed Insights API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => {
            resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Error fetching PageSpeed data:', error);
        });
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Kosongkan hasil sebelumnya

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

        // Tampilkan SEO score jika tersedia
        const seoScore = data.lighthouseResult.categories.seo?.score * 100 || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>SEO Score:</strong> ${seoScore}/100 (Skor optimasi untuk mesin pencari)
        </div>`;

        // Tampilkan Aksesibilitas jika tersedia
        const accessibilityScore = data.lighthouseResult.categories.accessibility?.score * 100 || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Aksesibilitas Score:</strong> ${accessibilityScore}/100 (Skor aksesibilitas halaman)
        </div>`;

        // Tampilkan Best Practices jika tersedia
        const bestPracticesScore = data.lighthouseResult.categories['best-practices']?.score * 100 || 'N/A';
        resultsDiv.innerHTML += `<div class="result-item">
            <strong>Best Practices Score:</strong> ${bestPracticesScore}/100 (Skor kepatuhan pada praktik terbaik web)
        </div>`;

    } else {
        resultsDiv.innerHTML = `<p>Data tidak ditemukan. Pastikan URL yang Anda masukkan valid.</p>`;
    }
}
