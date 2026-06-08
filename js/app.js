
const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("overlay");
const menuBtn=document.getElementById("menuBtn");

if(menuBtn){
menuBtn.onclick=()=>{
sidebar.classList.toggle("active");
overlay.classList.toggle("active");
}
}

if(overlay){
overlay.onclick=()=>{
sidebar.classList.remove("active");
overlay.classList.remove("active");
}
}

const themeToggle=document.getElementById("themeToggle");

if(themeToggle){
themeToggle.onclick=()=>{
document.body.classList.toggle("light");
localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark");
}
}

if(localStorage.getItem("theme")==="light"){
document.body.classList.add("light");
}

/* =========================
DATABASE
========================= */

let categories = JSON.parse(localStorage.getItem("kac-categories")) || [];
let products = JSON.parse(localStorage.getItem("kac-products")) || [];
let orders = JSON.parse(localStorage.getItem("kac-orders")) || [];

function saveAll(){
localStorage.setItem("kac-categories", JSON.stringify(categories));
localStorage.setItem("kac-products", JSON.stringify(products));
localStorage.setItem("kac-orders", JSON.stringify(orders));
}

/* =========================
CATEGORY LOGIC
========================= */

function renderCategories(){
const categoryList = document.getElementById("categoryList");

if(!categoryList) return;

categoryList.innerHTML = "";

if(categories.length === 0){
categoryList.innerHTML = "<p>No categories added yet.</p>";
return;
}

categories.forEach((category,index)=>{

const div = document.createElement("div");
div.className = "order-card";

div.innerHTML = `
<h3>${category}</h3>

<div class="order-actions">
<button onclick="deleteCategory(${index})">Delete</button>
</div>
`;

categoryList.appendChild(div);

});
}

function deleteCategory(index){
categories.splice(index,1);
saveAll();
renderCategories();
loadCategoryDropdowns();
}

const categoryForm = document.getElementById("categoryForm");

if(categoryForm){
categoryForm.addEventListener("submit",(e)=>{

e.preventDefault();

const categoryName = document.getElementById("categoryName").value.trim();

if(!categoryName) return;

if(categories.includes(categoryName)){
alert("Category already exists");
return;
}

categories.push(categoryName);

saveAll();

categoryForm.reset();

renderCategories();

loadCategoryDropdowns();

});
}

/* =========================
CATEGORY DROPDOWNS
========================= */

function loadCategoryDropdowns(){

const dropdowns = document.querySelectorAll(".categoryDropdown");

dropdowns.forEach(dropdown=>{

const currentValue = dropdown.value;

dropdown.innerHTML = `<option value="">Select Category</option>`;

categories.forEach(category=>{

dropdown.innerHTML += `
<option value="${category}">
${category}
</option>
`;

});

dropdown.value = currentValue;

});

}

/* =========================
PRODUCT LOGIC
========================= */

function renderProducts(){

const productList = document.getElementById("productList");

if(!productList) return;

productList.innerHTML = "";

if(products.length === 0){
productList.innerHTML = "<p>No products added yet.</p>";
return;
}

products.forEach((product,index)=>{

const div = document.createElement("div");

div.className = "order-card";

div.innerHTML = `
<h3>${product.name}</h3>
<p>Category: ${product.category}</p>

<div class="order-actions">
<button onclick="deleteProduct(${index})">Delete</button>
</div>
`;

productList.appendChild(div);

});

}

function deleteProduct(index){

products.splice(index,1);

saveAll();

renderProducts();

}

const productForm = document.getElementById("productForm");

if(productForm){

productForm.addEventListener("submit",(e)=>{

e.preventDefault();

const productName = document.getElementById("productName").value.trim();

const productCategory = document.getElementById("productCategory").value;

if(!productName || !productCategory){
alert("Fill all fields");
return;
}

products.push({
name: productName,
category: productCategory
});

saveAll();

productForm.reset();

renderProducts();

});

}

/* =========================
ORDER PRODUCT FILTER
========================= */

const orderCategory = document.getElementById("orderCategory");

if(orderCategory){

orderCategory.addEventListener("change",(e)=>{

loadProductsByCategory(e.target.value);

});

}

function loadProductsByCategory(category){

const productDropdown = document.getElementById("productDropdown");

if(!productDropdown) return;

productDropdown.innerHTML = `
<option value="">Select Product</option>
`;

products
.filter(product=>product.category===category)
.forEach(product=>{

productDropdown.innerHTML += `
<option value="${product.name}">
${product.name}
</option>
`;

});

}

/* =========================
ORDER LOGIC
========================= */

function renderOrders(){

const orderList = document.getElementById("orderList") || document.getElementById("ordersContainer");

if(!orderList) return;

orderList.innerHTML = "";

if(orders.length === 0){
orderList.innerHTML = "<p>No orders added yet.</p>";
return;
}

orders.slice().reverse().forEach(order=>{

const div = document.createElement("div");

div.className = "order-card";

div.innerHTML = `
<h3>${order.customerName || order.customer}</h3>
<p>Date: ${order.orderDate || order.date}</p>
<p>Category: ${order.category}</p>
<p>Product: ${order.product}</p>
<p>₹${order.amount || 0}</p>
<p>Status: ${order.status || "Pending"}</p>
`;

orderList.appendChild(div);

});

}

const orderForm = document.getElementById("orderForm");

if(orderForm){

orderForm.addEventListener("submit",(e)=>{

e.preventDefault();

const orderData = {
id: Date.now().toString(),
orderDate: document.getElementById("orderDate")?.value || "",
customerName: document.getElementById("customerName")?.value || "",
phone: document.getElementById("phone")?.value || "",
category: document.getElementById("orderCategory")?.value || "",
product: document.getElementById("productDropdown")?.value || "",
amount: document.getElementById("amount")?.value || "",
status: document.getElementById("status")?.value || "Pending",
notes: document.getElementById("notes")?.value || ""
};

orders.push(orderData);

saveAll();

orderForm.reset();

renderOrders();

});

}

/* =========================
DASHBOARD
========================= */

function updateDashboard(){

const total = document.getElementById("totalOrders");

const pending = document.getElementById("pendingOrders");

const completed = document.getElementById("completedOrders");

if(total) total.innerText = orders.length;

if(pending){
pending.innerText = orders.filter(order=>
(order.status || "").toLowerCase()==="pending"
).length;
}

if(completed){
completed.innerText = orders.filter(order=>
(order.status || "").toLowerCase()==="completed"
).length;
}

}

/* =========================
INIT
========================= */

window.addEventListener("DOMContentLoaded",()=>{

loadCategoryDropdowns();

renderCategories();

renderProducts();

renderOrders();

updateDashboard();

});
