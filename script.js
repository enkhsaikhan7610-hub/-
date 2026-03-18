const unitPrice = 250000;
const quantityInput = document.getElementById('quantity');
const totalDisplay = document.getElementById('total-amount');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.getElementById('submit-btn');
const sizeChecks = document.querySelectorAll('.size-check');

function calculateTotal() {
    const qty = parseInt(quantityInput.value);
    
    if (qty < 10) {
        errorMsg.style.display = 'block';
        submitBtn.disabled = true;
    } else {
        errorMsg.style.display = 'none';
        submitBtn.disabled = false;
        const total = qty * unitPrice;
        totalDisplay.innerText = total.toLocaleString();
        document.getElementById('hidden-total').value = total;
    }

    // Сонгосон хэмжээг хадгалах
    let selectedSizes = [];
    sizeChecks.forEach(check => {
        if (check.checked) selectedSizes.push(check.value);
    });
    document.getElementById('hidden-sizes').value = selectedSizes.join(', ');
}

quantityInput.addEventListener('input', calculateTotal);
sizeChecks.forEach(check => check.addEventListener('change', calculateTotal));

// Анхны тооцоолол
calculateTotal();
