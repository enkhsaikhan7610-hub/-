const unitPrice = 150000; // Нэгж үнэ
let quantity = 1;

// Тоо ширхэг шинэчлэх функц
function updateQty(change) {
    const qtyInput = document.getElementById('qty');
    quantity = parseInt(qtyInput.value) + change;
    
    if (quantity < 1) quantity = 1;
    
    qtyInput.value = quantity;
    updateTotal();
}

// Нийт үнийг тооцоолж харуулах
function updateTotal() {
    const total = unitPrice * quantity;
    const formattedTotal = total.toLocaleString() + '₮';
    
    document.getElementById('total-price').innerText = formattedTotal;
    document.getElementById('modal-total').innerText = formattedTotal;
}

// Модал нээх
function openModal() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    
    if (!name || !phone) {
        alert("Нэр болон утасны дугаараа оруулна уу.");
        return;
    }
    
    document.getElementById('payment-modal').style.display = 'flex';
}

// Модал хаах
function closeModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

// Модалын гадна дарахад хаах
window.onclick = function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
