const unitPrice = 250000;
const delFee = 15000;
const sizes = [38, 39, 40, 41, 42, 43, 44];

const langData = {
    mn: {
        heroH1: "Гар хийцийн урлаг", heroP: "Танд зориулсан цор ганц чанар",
        items: "бараа", needDel: "Хүргэлт авах (+15,000₮)", btnReady: "Захиалах",
        payTitle: "Төлбөр шилжүүлэх",
        shoes: ["Сонгодог Лофер", "Уламжлалт Гутал", "Ажлын Ботинк", "Өдөр тутмын Оксфорд"]
    },
    en: {
        heroH1: "Handmade Art", heroP: "Exclusively Crafted for You",
        items: "items", needDel: "Delivery Service (+15,000₮)", btnReady: "Checkout",
        payTitle: "Payment Details",
        shoes: ["Classic Loafers", "Traditional Boots", "Work Boots", "Daily Oxfords"]
    }
};

let currentLang = 'mn';
let cart = {};

function setLang(lang) {
    currentLang = lang;
    document.getElementById('btn-mn').className = lang === 'mn' ? 'active' : '';
    document.getElementById('btn-en').className = lang === 'en' ? 'active' : '';
    
    const d = langData[lang];
    document.getElementById('t-hero-h1').innerText = d.heroH1;
    document.getElementById('t-hero-p').innerText = d.heroP;
    document.getElementById('t-need-del').innerText = d.needDel;
    document.getElementById('t-items').innerText = d.items;
    
    renderProducts();
    calc();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = "";
    langData[currentLang].shoes.forEach((name, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let sizeHtml = sizes.map(sz => {
            const key = `${i}-${sz}`;
            return `
                <div class="size-item">
                    <span>SZ ${sz}</span>
                    <input type="number" min="0" value="${cart[key] || 0}" oninput="updateCart('${key}', this.value)">
                </div>`;
        }).join('');

        card.innerHTML = `
            <img src="https://picsum.photos/400/500?random=${i}" alt="shoe">
            <div class="card-body">
                <h4>${name}</h4>
                <div class="price">${unitPrice.toLocaleString()} ₮</div>
                <div class="size-selector">${sizeHtml}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateCart(key, val) {
    cart[key] = parseInt(val) || 0;
    calc();
}

function calc() {
    const isDel = document.getElementById('del-check').checked;
    const name = document.getElementById('p-name').value;
    const phone = document.getElementById('p-phone').value;
    
    document.getElementById('address').style.display = isDel ? 'block' : 'none';
    
    let totalQty = 0;
    for (let q of Object.values(cart)) totalQty += q;
    
    const totalAmount = (totalQty * unitPrice) + (isDel ? delFee : 0);
    
    document.getElementById('res-qty').innerText = totalQty;
    document.getElementById('res-total').innerText = totalAmount.toLocaleString();
    
    const btn = document.getElementById('submit-btn');
    btn.disabled = !(totalQty > 0 && name && phone);
    
    // Бэлтгэх
    document.getElementById('pay-total-val').innerText = totalAmount.toLocaleString() + "₮";
    document.getElementById('pay-phone-val').innerText = phone || "--";
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KhasBank-5003793719-Amount-${totalAmount}`;
}

function openPayment() {
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeAndReset() {
    if(confirm("Захиалгыг цуцалж, шинээр эхлэх үү?")) {
        window.location.reload();
    } else {
        document.getElementById('paymentModal').style.display = 'none';
    }
}

// Эхлүүлэх
setLang('mn');
