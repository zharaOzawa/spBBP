/**
 * Data Dummy Produk (Hasil Observasi nanti dimasukkan ke sini)
 */
const productsData = [
    {
        id: 1,
        name: "Keripik Singkong LadaHitam",
        category: "makanan",
        price: 15000,
        image: "singkong.jpg",
        description: "Keripik singkong renyah dengan bumbu balado pedas manis buatan rumahan.",
        producer: "Ibu Siti (UMKM Mawar)",
        phone: "6281234567890" // Nomor WA untuk fitur beli
    },
    {
        id: 2,
        name: "Anyaman Bambu Tradisional",
        category: "kerajinan",
        price: 75000,
        image: "https://images.unsplash.com/photo-1590740924443-4b68453cc19b?auto=format&fit=crop&q=80&w=400",
        description: "Kerajinan tangan anyaman bambu untuk hiasan dinding atau wadah serbaguna.",
        producer: "Bapak Herman",
        phone: "6281234567891"
    },
    {
        id: 3,
        name: "Kopi Robusta Asli",
        category: "pertanian",
        price: 45000,
        image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400",
        description: "Biji kopi robusta pilihan yang ditanam di pegunungan Sukamakmur.",
        producer: "Kelompok Tani Harapan",
        phone: "6281234567892"
    },
    {
        id: 4,
        name: "Madu Hutan Liar",
        category: "makanan",
        price: 120000,
        image: "https://images.unsplash.com/photo-1587049352847-81a56d773cac?auto=format&fit=crop&q=80&w=400",
        description: "Madu murni yang diambil langsung dari hutan sekitar desa oleh warga.",
        producer: "Pak Joko",
        phone: "6281234567893"
    },
    {
        id: 5,
        name: "Kain Tenun Khas",
        category: "kerajinan",
        price: 250000,
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=400",
        description: "Kain tenun dengan motif khas desa yang ditenun secara tradisional.",
        producer: "Koperasi Wanita",
        phone: "6281234567894"
    },
    {
        id: 6,
        name: "Sayur Organik Segar",
        category: "pertanian",
        price: 20000,
        image: "https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?auto=format&fit=crop&q=80&w=400",
        description: "Paket sayur segar bebas pestisida kimia langsung dari kebun.",
        producer: "Kebun Hijau",
        phone: "6281234567895"
    }
];

// ==========================================================================
// Fitur UI Umum
// ==========================================================================

// Efek Navbar transparan ke solid saat di-scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Ubah ikon hamburger ke silang (X)
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        mobileToggle.classList.add('dark-icon');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        mobileToggle.classList.remove('dark-icon');
    }
});

// Tutup menu mobile saat link diklik
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        mobileToggle.classList.remove('dark-icon');
    });
});


// ==========================================================================
// Fitur Katalog Produk
// ==========================================================================

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// Render Produk ke HTML
function renderProducts(products) {
    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
                <h3 style="color: #64748b;">Produk tidak ditemukan</h3>
                <p style="color: #94a3b8;">Coba gunakan kata kunci lain.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        // Format harga ke Rupiah
        const hargaRp = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(product.price);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrap">
                <span class="product-category">${product.category}</span>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    <i class="fas fa-store"></i> ${product.producer}
                </div>
                <div class="product-price">${hargaRp}</div>
                <div class="product-actions">
                    <button class="btn btn-buy-wa" onclick="buyViaWA(${product.id})">
                        <i class="fab fa-whatsapp"></i> Beli via WhatsApp
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Inisialisasi Tampilan Awal
renderProducts(productsData);

// Logika Filter & Pencarian
let currentCategory = 'all';

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = productsData.filter(product => {
        // Cek filter kategori
        const matchCategory = currentCategory === 'all' || product.category === currentCategory;

        // Cek filter pencarian
        const matchSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.producer.toLowerCase().includes(searchTerm);

        return matchCategory && matchSearch;
    });

    renderProducts(filteredProducts);
}

// Event Listener Kategori
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update styling tombol aktif
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Set state dan jalankan filter
        currentCategory = e.target.getAttribute('data-filter');
        applyFilters();
    });
});

// Event Listener Pencarian
searchInput.addEventListener('input', applyFilters);

// ==========================================================================
// Fitur Tombol Beli WhatsApp
// ==========================================================================
function buyViaWA(productId) {
    const product = productsData.find(p => p.id === productId);

    if (!product) {
        alert("Maaf, produk tidak ditemukan.");
        return;
    }

    // Format pesan
    const message = `Halo ${product.producer}, saya tertarik untuk membeli produk "${product.name}" yang ada di website Desa Wisata Sukamakmur. Apakah stoknya masih ada?`;

    // Encode URL (mengganti spasi dengan %20, dll)
    const encodedMessage = encodeURIComponent(message);

    // Buat link WA
    const waLink = `https://wa.me/${product.phone}?text=${encodedMessage}`;

    // Buka di tab baru
    window.open(waLink, '_blank');
}
