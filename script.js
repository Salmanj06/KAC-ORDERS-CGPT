
const form = document.getElementById("orderForm");
const ordersContainer = document.getElementById("ordersContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let orders = JSON.parse(localStorage.getItem("kac-orders")) || [];

function saveOrders(){
  localStorage.setItem("kac-orders", JSON.stringify(orders));
}

function renderOrders(filter=""){
  ordersContainer.innerHTML = "";

  const filtered = orders.filter(order =>
    order.customerName.toLowerCase().includes(filter.toLowerCase()) ||
    order.product.toLowerCase().includes(filter.toLowerCase())
  );

  if(filtered.length === 0){
    ordersContainer.innerHTML = "<p>No orders found.</p>";
    return;
  }

  filtered.reverse().forEach(order => {
    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <h3>${order.customerName}</h3>
      <p><strong>Product:</strong> ${order.product}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Amount:</strong> ₹${order.amount}</p>
      <p><strong>Delivery:</strong> ${order.deliveryDate || "-"}</p>
      <p>${order.notes || ""}</p>
      <span class="status">${order.status}</span>

      <div class="order-actions">
        <button onclick="editOrder('${order.id}')">Edit</button>
        <button onclick="downloadPDF('${order.id}')">PDF</button>
        <button class="secondary" onclick="deleteOrder('${order.id}')">Delete</button>
      </div>
    `;

    ordersContainer.appendChild(div);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const orderData = {
    id: document.getElementById("orderId").value || Date.now().toString(),
    customerName: document.getElementById("customerName").value,
    phone: document.getElementById("phone").value,
    product: document.getElementById("product").value,
    amount: document.getElementById("amount").value,
    status: document.getElementById("status").value,
    deliveryDate: document.getElementById("deliveryDate").value,
    notes: document.getElementById("notes").value
  };

  const existingIndex = orders.findIndex(o => o.id === orderData.id);

  if(existingIndex >= 0){
    orders[existingIndex] = orderData;
  }else{
    orders.push(orderData);
  }

  saveOrders();
  renderOrders();
  form.reset();
  document.getElementById("orderId").value = "";
});

function editOrder(id){
  const order = orders.find(o => o.id === id);

  document.getElementById("orderId").value = order.id;
  document.getElementById("customerName").value = order.customerName;
  document.getElementById("phone").value = order.phone;
  document.getElementById("product").value = order.product;
  document.getElementById("amount").value = order.amount;
  document.getElementById("status").value = order.status;
  document.getElementById("deliveryDate").value = order.deliveryDate;
  document.getElementById("notes").value = order.notes;
}

function deleteOrder(id){
  if(confirm("Delete this order?")){
    orders = orders.filter(o => o.id !== id);
    saveOrders();
    renderOrders();
  }
}

function downloadPDF(id){
  const order = orders.find(o => o.id === id);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("KAC Order Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Customer: ${order.customerName}`, 20, 40);
  doc.text(`Phone: ${order.phone}`, 20, 50);
  doc.text(`Product: ${order.product}`, 20, 60);
  doc.text(`Amount: ₹${order.amount}`, 20, 70);
  doc.text(`Status: ${order.status}`, 20, 80);
  doc.text(`Delivery: ${order.deliveryDate}`, 20, 90);
  doc.text(`Notes: ${order.notes}`, 20, 100);

  doc.save(`${order.customerName}-invoice.pdf`);
}

searchInput.addEventListener("input", e => {
  renderOrders(e.target.value);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const mode = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", mode);
});

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
  document.body.classList.add("light");
}

renderOrders();
