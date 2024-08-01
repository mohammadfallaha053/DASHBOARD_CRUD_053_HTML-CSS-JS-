
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let image = document.getElementById('image');

let mod = 'create';
let temp;

function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = "";
        total.style.background = "orange";
    }
}

let productData;
if (localStorage.productData != null) {
    productData = JSON.parse(localStorage.productData);
} else {
    productData = [];
}

submit.onclick = function () {
    getTotal();
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
        imageUrl: '' // سيتم تحديث هذا لاحقًا
    };

    if (mod === 'create') {
        if (newPro.count >= 1) {
            for (let i = 0; i < newPro.count; i++) {
                productData.push(newPro);
            }
        }
    } else {
        productData[temp] = newPro;
        mod = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
    }

    if (image.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newPro.imageUrl = e.target.result;
            localStorage.setItem("productData", JSON.stringify(productData));
            clearData();
            showData();
        };
        reader.readAsDataURL(image.files[0]);
    } else {
        localStorage.setItem("productData", JSON.stringify(productData));
        clearData();
        showData();
    }
}

function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
    image.value = '';
    total.style.background = "orange";
}

function showData() {
    let table = '';
    for (let i = 0; i < productData.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${productData[i].title}</td>
            <td>${productData[i].price}</td>
            <td>${productData[i].taxes}</td>
            <td>${productData[i].ads}</td>
            <td>${productData[i].discount}</td>
            <td>${productData[i].total}</td>
            <td>${productData[i].category}</td>
            <td><img src="${productData[i].imageUrl}" alt="${productData[i].title}" style="width: 100px; height: 100px;"></td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>`;
    }

    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('delete-all');
    if (productData.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All (${productData.length} items)</button>`;
    } else {
        btnDelete.innerHTML = `<h1><p>No Data Found</p></h1>`;
    }
}

showData();

function deleteAll() {
    localStorage.clear();
    productData.splice(0);
    showData();
}

function deleteData(i) {
    productData.splice(i, 1);
    localStorage.productData = JSON.stringify(productData);
    showData();
}

function updateData(i) {
    title.value = productData[i].title;
    price.value = productData[i].price;
    taxes.value = productData[i].taxes;
    ads.value = productData[i].ads;
    discount.value = productData[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = productData[i].category;
    image.value = ''; // لا يمكن تعيين قيمة ملف
    submit.innerHTML = 'Save Update';
    mod = 'update';
    temp = i;

    scroll({
        top: 0,
        behavior: 'smooth'
    });
}

let searchMood = 'title';
function searchByMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = 'Search by ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}

function searchData(v) {
    let table = '';
    for (let i = 0; i < productData.length; i++) {
        let bool;
        if (searchMood == 'title') bool = productData[i].title.includes(v);
        else bool = productData[i].category.includes(v);

        if (bool) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${productData[i].title}</td>
                <td>${productData[i].price}</td>
                <td>${productData[i].taxes}</td>
                <td>${productData[i].ads}</td>
                <td>${productData[i].discount}</td>
                <td>${productData[i].total}</td>
                <td>${productData[i].category}</td>
                <td><img src="${productData[i].imageUrl}" alt="${productData[i].title}" style="width: 100px; height: 100px;"></td>
                <td><button onclick="updateData(${i})" id="update">Update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
            </tr>`;
        }
    }

    document.getElementById('tbody').innerHTML = table;
}
