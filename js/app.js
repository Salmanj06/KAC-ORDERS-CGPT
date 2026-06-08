
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

let orders=JSON.parse(localStorage.getItem("kac-orders"))||[];

function saveOrders(){
localStorage.setItem("kac-orders",JSON.stringify(orders));
updateDashboard();
}

function renderOrders(filter=""){
const container=document.getElementById("ordersContainer");
if(!container)return;

container.innerHTML="";

orders.filter(o=>
o.customerName.toLowerCase().includes(filter.toLowerCase())||
o.product.toLowerCase().includes(filter.toLowerCase())
).reverse().forEach(order=>{

const div=document.createElement("div");
div.className="order-card";

div.innerHTML=`
<h3>${order.customerName}</h3>
<p>${order.product}</p>
<p>₹${order.amount}</p>
<p>Status: ${order.status}</p>

<div class="order-actions">
<button onclick="editOrder('${order.id}')">Edit</button>
<button onclick="deleteOrder('${order.id}')">Delete</button>
</div>
`;

container.appendChild(div);
});
}

const form=document.getElementById("orderForm");

if(form){
form.addEventListener("submit",e=>{
e.preventDefault();

const data={
id:document.getElementById("orderId").value||Date.now().toString(),
customerName:document.getElementById("customerName").value,
phone:document.getElementById("phone").value,
product:document.getElementById("product").value,
amount:document.getElementById("amount").value,
status:document.getElementById("status").value,
notes:document.getElementById("notes").value
};

const index=orders.findIndex(o=>o.id===data.id);

if(index>=0){
orders[index]=data;
}else{
orders.push(data);
}

saveOrders();
renderOrders();
form.reset();
});
}

function editOrder(id){
const order=orders.find(o=>o.id===id);

document.getElementById("orderId").value=order.id;
document.getElementById("customerName").value=order.customerName;
document.getElementById("phone").value=order.phone;
document.getElementById("product").value=order.product;
document.getElementById("amount").value=order.amount;
document.getElementById("status").value=order.status;
document.getElementById("notes").value=order.notes;
}

function deleteOrder(id){
orders=orders.filter(o=>o.id!==id);
saveOrders();
renderOrders();
}

const search=document.getElementById("searchInput");

if(search){
search.addEventListener("input",e=>{
renderOrders(e.target.value);
});
}

function updateDashboard(){
const total=document.getElementById("totalOrders");
const pending=document.getElementById("pendingOrders");
const completed=document.getElementById("completedOrders");

if(total) total.innerText=orders.length;
if(pending) pending.innerText=orders.filter(o=>o.status==="Pending").length;
if(completed) completed.innerText=orders.filter(o=>o.status==="Completed").length;
}

renderOrders();
updateDashboard();



let categories=JSON.parse(localStorage.getItem('kac-categories'))||[];
let products=JSON.parse(localStorage.getItem('kac-products'))||[];
let orders=JSON.parse(localStorage.getItem('kac-orders'))||[];

function saveAll(){
localStorage.setItem('kac-categories',JSON.stringify(categories));
localStorage.setItem('kac-products',JSON.stringify(products));
localStorage.setItem('kac-orders',JSON.stringify(orders));
}

function loadCategories(){
document.querySelectorAll('.categoryDropdown').forEach(d=>{
d.innerHTML='<option value="">Select Category</option>';
categories.forEach(c=>{
d.innerHTML+=`<option value="${c}">${c}</option>`;
});
});
}

const cf=document.getElementById('categoryForm');
if(cf){
cf.onsubmit=e=>{
e.preventDefault();
categories.push(categoryName.value);
saveAll();
location.reload();
}
}

const pf=document.getElementById('productForm');
if(pf){
pf.onsubmit=e=>{
e.preventDefault();
products.push({name:productName.value,category:productCategory.value});
saveAll();
location.reload();
}
}

const oc=document.getElementById('orderCategory');
if(oc){
oc.onchange=()=>{
productDropdown.innerHTML='';
products.filter(p=>p.category===oc.value).forEach(p=>{
productDropdown.innerHTML+=`<option>${p.name}</option>`;
});
}
}

const of=document.getElementById('orderForm');
if(of){
of.onsubmit=e=>{
e.preventDefault();
orders.push({
date:orderDate.value,
customer:customerName.value,
category:orderCategory.value,
product:productDropdown.value
});
saveAll();
location.reload();
}
}

window.onload=()=>{
loadCategories();

const cl=document.getElementById('categoryList');
if(cl){
categories.forEach(c=>{
cl.innerHTML+=`<div class='card'>${c}</div>`;
});
}

const pl=document.getElementById('productList');
if(pl){
products.forEach(p=>{
pl.innerHTML+=`<div class='card'>${p.name} - ${p.category}</div>`;
});
}

const ol=document.getElementById('orderList');
if(ol){
orders.forEach(o=>{
ol.innerHTML+=`<div class='card'>${o.date}<br>${o.customer}<br>${o.category}<br>${o.product}</div>`;
});
}
}
