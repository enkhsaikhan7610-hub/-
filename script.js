const unitPrice = 250000;
const delFee = 15000;
const sizes = [38, 39, 40, 41, 42, 43, 44];
let currentOrderID = "";

const langData = {
    mn: {
        navProducts: "Бүтээгдэхүүн", orderTitle: "Захиалга өгөх",
        needDel: "Хүргэлт авах (+15,000₮)", btnReady: "ЗАХИАЛАХ", btnSending: "Илгээж байна...",
        totalLabel: "НИЙТ ТӨЛӨХ", shoes: ["Сонгодог Лофер", "Уламжлалт Гутал", "Ажлын Ботинк", "Өдөр тутмын Оксфорд"]
    },
    en: {
        navProducts: "Products", orderTitle: "Order Now",
        needDel: "Delivery Service (+15,000₮)", btnReady: "CHECKOUT", btnSending: "Sending...",
        totalLabel: "TOTAL AMOUNT", shoes: ["Classic Loafers", "Traditional Boots", "Work Boots", "Daily Oxfords"]
    }
};

let currentLang = 'mn';
let cart = {};

function setLang(lang) {
    currentLang = lang;
    const d = langData[lang];
    document.getElementById('t-nav-products').innerText = d.navProducts;
    document.getElementById('t-products-title').innerText = d.navProducts;
    document.getElementById('t-order-title').innerText = d.orderTitle;
    document.getElementById('t-need-del').innerText = d.needDel;
    document.getElementById('t-total-label').innerText = d.totalLabel;
    document.getElementById('submit-btn').innerText = d.btnReady;
    renderProducts();
    calc();
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = langData[currentLang].shoes.map((name, i) => {
        let sizeHtml = sizes.map(sz => {
            const key = `${i}-${sz}`;
            return `<div class="size-item"><span>${sz}</span><input type="number" min="0" placeholder="0" value="${cart[key] || ''}" oninput="updateCart('${key}', this.value)"></div>`;
        }).join('');
        return `<div class="product-card"><img class="product-img" src="https://picsum.photos/400/500?random=${i}"><div class="card-content"><h3>${name}</h3><span class="price-tag">${unitPrice.toLocaleString()} ₮</span><div class="size-grid">${sizeHtml}</div></div></div>`;
    }).join('');
}

function updateCart(key, val) {
    const v = parseInt(val);
    if (isNaN(v) || v <= 0) delete cart[key];
    else cart[key] = v;
    calc();
}

function calc() {
    const isDel = document.getElementById('del-check').checked;
    const name = document.getElementById('p-name').value.trim();
    const phone = document.getElementById('p-phone').value.trim();
    document.getElementById('address').style.display = isDel ? 'block' : 'none';
    let totalQty = 0;
    Object.values(cart).forEach(q => totalQty += q);
    const totalAmount = (totalQty * unitPrice) + (isDel && totalQty > 0 ? delFee : 0);
    document.getElementById('res-total').innerText = totalAmount.toLocaleString();
    document.getElementById('submit-btn').disabled = !(totalQty > 0 && name && phone);
    document.getElementById('pay-total-val').innerText = totalAmount.toLocaleString() + "₮";
}

function generateOrderID() {
    return '#UK-' + Math.floor(1000 + Math.random() * 9000);
}

function sendOrder() {
    const btn = document.getElementById('submit-btn');
    btn.innerText = "Илгээж байна...";
    btn.disabled = true;

    currentOrderID = generateOrderID();
    let orderDetails = "";
    Object.keys(cart).forEach(key => {
        const [shoeIdx, size] = key.split('-');
        orderDetails += `${langData[currentLang].shoes[shoeIdx]} (SZ: ${size}, ${cart[key]}ш); `;
    });

    const templateParams = {
        order_id: currentOrderID,
        from_name: document.getElementById('p-name').value,
        phone: document.getElementById('p-phone').value,
        order_details: orderDetails,
        address: document.getElementById('address').value || "Хүргэлтгүй",
        total_price: document.getElementById('res-total').innerText + "₮"
    };

    emailjs.send('service_izdours', 'template_ix01rik', templateParams)
        .then(() => {
            document.getElementById('pay-order-id').innerText = currentOrderID;
            document.getElementById('paymentModal').style.display = 'flex';
            const qrData = `Bank:KhasBank|Acc:5003793719|Amount:${templateParams.total_price}|Msg:${currentOrderID}`;
            document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
            btn.innerText = langData[currentLang].btnReady;
            btn.disabled = false;
        });
}

function notifyPaymentSent() {
    const btn = document.getElementById('payment-sent-btn');
    btn.innerText = "Мэдэгдэж байна...";
    btn.disabled = true;

    const params = {
        order_id: currentOrderID,
        from_name: document.getElementById('p-name').value,
        phone: document.getElementById('p-phone').value,
        order_details: "Хэрэглэгч төлбөрөө шилжүүлсэн гэж мэдэгдлээ. Дансаа шалгана уу."
    };

    emailjs.send('service_izdours', 'template_ix01rik', params)
        .then(() => {
            document.getElementById('modal-body').innerHTML = `
                <div style="padding: 30px 10px; text-align: center;">
                    <div style="font-size: 50px; color: #25D366; margin-bottom: 15px;">✓</div>
                    <h2 style="color: #d4af37; margin-bottom: 10px;">БАЯРЛАЛАА!</h2>
                    <p style="font-size: 14px; color: #fff;">Мэдэгдэл илгээгдлээ. Бид төлбөрийг шалгаад тантай эргэж холбогдох болно.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">Дугаар: ${currentOrderID}</p>
                    <button onclick="window.location.reload()" style="margin-top: 25px; width: 100%; padding: 12px; background: #333; color: #fff; border: none; border-radius: 10px; cursor: pointer;">Дуусгах</button>
                </div>
            `;
        });
}

function closeAll() {
    if(confirm("Захиалгын дугаараа тэмдэглэсэн үү?")) window.location.reload();
}

window.onload = () => setLang('mn');
