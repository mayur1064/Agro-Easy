//Function to calculate and display Total of Equipment Order on  equipment order page
//Price * Quantity * Hours
function calculateEquipmentTotal() {
  var quantity = parseInt(document.getElementById("quantity").value, 10);
  var time = parseInt(document.getElementById("time").value, 10);
  var price = parseInt(document.getElementById("priceId").innerHTML, 10);
  var quantityAvailable = parseInt(
    document.getElementById("quantityId").innerHTML,
    10
  );
  var total = time * quantity * price;
  var totalTag = document.getElementById("total");
  if (quantity <= quantityAvailable && time <= 24 && time >= 1) {
    totalTag.innerHTML = `Total Cost - &#8377; ${total}`;
  } else if (quantity > quantityAvailable) {
    totalTag.innerHTML = `Please Enter correct Quantity`;
  } else {
    totalTag.innerHTML = `Please Enter correct time`;
  }
}

//Function to calculate and display  Total of Product Order on product order page
//Price * Quantity * Hours
function calculateProductTotal() {
  var quantity = parseInt(document.getElementById("quantity").value, 10);

  var price = parseInt(document.getElementById("priceId").innerHTML, 10);
  var quantityAvailable = parseInt(
    document.getElementById("quantityId").innerHTML,
    10
  );
  var total = quantity * price;
  var totalTag = document.getElementById("total");
  if (quantity <= quantityAvailable) {
    totalTag.innerHTML = `Total Cost - &#8377; ${total}`;
  } else {
    totalTag.innerHTML = `Please Enter correct Quantity`;
  }
}

//Function to addSkill button
function addSkill() {
  var skill = document.getElementById("skill");
  var allSkills = document.getElementById("allSkills");
  var newSkill = document.createElement("button");
  newSkill.innerHTML = skill.value;
  newSkill.type = "button";
  newSkill.classList.add("btn");
  newSkill.classList.add("btn-warning");
  newSkill.classList.add("rounded-pill");
  newSkill.classList.add("ml-3");
  newSkill.classList.add("mb-3");
  newSkill.classList.add("px-3");
  newSkill.classList.add("btnSkill");
  skill.value = "";

  newSkill.onclick = function () {
    //newSkill.style.display = "none";
    newSkill.parentNode.removeChild(newSkill);
  };
  allSkills.appendChild(newSkill);
}

function collectSkill() {
  var skills = document.getElementsByClassName("btnSkill");
  let str = "";
  for (var i = 0; i < skills.length; i++) {
    str = str + skills[i].innerHTML + ",";
  }

  var skillFinal = document.getElementById("skillFinal");
  skillFinal.value = str;
}

var skills = document.getElementsByClassName("btnSkill");
for (var i = 0; i < skills.length; i++) {
  skills[i].onclick = function () {
    //this.style.display = "none";
    this.parentNode.removeChild(this);
  };
}

function searchProduct() {
  var prodcards = document.getElementsByClassName("productCard");
  // console.log(prodcards);
  var searchValue = document.getElementById("search").value;
  for (var i = 0; i < prodcards.length; i++) {
    let name = prodcards[i].childNodes[1].innerHTML;
    // console.log(name);
    if (!name.toLowerCase().includes(searchValue.toLowerCase())) {
      prodcards[i].style.display = "none";
    } else {
      prodcards[i].style.display = "inline";
    }
  }
}

function searchJob() {
  var jobcards = document.getElementsByClassName("jobCard");
  var searchValue = document.getElementById("search").value.toLowerCase();

  for (var i = 0; i < jobcards.length; i++) {
    let nameCity =
      jobcards[i].children[0].children[0].children[0].children[0].innerHTML.toLowerCase();
    let nameJob =
      jobcards[i].children[0].children[0].children[0].children[1].innerHTML.toLowerCase();

    if (nameCity.includes(searchValue) || nameJob.includes(searchValue)) {
      jobcards[i].style.display = "inline";
    } else {
      jobcards[i].style.display = "none";
    }
  }
}

function filterOrders() {
  var orders = document.getElementsByClassName("orderCard");
  var checkProduct = document.getElementById("checkproduct").checked;
  var checkEquipment = document.getElementById("checkequipment").checked;
  console.log(checkProduct);

  for (var i = 0; i < orders.length; i++) {
    let category =
      orders[
        i
      ].children[0].children[1].children[0].children[0].innerHTML.toLowerCase();

    console.log(category);

    if (category.includes("agro product") && checkProduct) {
      orders[i].style.display = "flex";
    } else if (category.includes("farm equipment") && checkEquipment) {
      orders[i].style.display = "flex";
    } else {
      orders[i].style.display = "none";
    }
  }
}
