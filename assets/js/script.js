// regular expression for validation
const countryList = document.getElementById("country-list");
const general = document.getElementById("general");
const modalForm = document.getElementById("modal");
const addBtn = document.getElementById("add-button");
const closeButton = document.getElementById("close-btn");
const modalButtons = document.getElementById("form-button");
const addrBookList = document.querySelector("#address-save-list tbody");
const deleteButton = document.getElementById('delete-button')
const form = document.getElementById("modal");

let addrName =
  (firstName =
  lastName =
  email =
  phone =
  street =
  postalCode =
  city =
  country =
  labels =
    "");

class Address {
  constructor(
    id,
    addrName,
    firstName,
    lastName,
    email,
    phone,
    street,
    postalCode,
    city,
    country,
    labels
  ) {
    this.id = id;
    this.addrName = addrName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.labels = labels;
  }
  static getAddresses() {
    // from local storage
    let addresses;
    if (localStorage.getItem("addresses") == null) {
      addresses = [];
    } else {
      addresses = JSON.parse(localStorage.getItem("addresses"));
    }
    return addresses;
  }
  static addAddress(address) {
    const addresses = Address.getAddresses();
    addresses.push(address);
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadJSON(); //------------> For Country list from jsonFile
  eventListeners();
  UI.showAddressList();
  deleteButton.addEventListener('click',()=>{
      localStorage.clear();
      document.getElementById('area').innerHTML =``
  })
});

class UI {
  static showAddressList() {
    const addresses = Address.getAddresses();
    addresses.forEach((address) => UI.addToAddressList(address));
  }
  static addToAddressList(address) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-id", address.id);
    tableRow.innerHTML = `
        <td>${address.id}</td>
        <td>
            <span class = "addressing-name">${
              address.addrName
            }</span><br><span class = "address">${address.street} ${
      address.postalCode
    } ${address.city} ${address.country}</span>
        </td>
        <td><span>${address.labels}</span></td>
        <td>${address.firstName + " " + address.lastName}</td>
        <td>${address.phone}</td>
    `;
    addrBookList.appendChild(tableRow);
  }

  static showModalData(id) {
    const addresses = Address.getAddresses();
    addresses.forEach((address) => {
      if (address.id == id) {
        form.address_name.value = address.addrName;
        form.first_name.value = address.firstName;
        form.last_name.value = address.lastName;
        form.email.value = address.email;
        form.phone.value = address.phone;
        form.street.value = address.street;
        form.postalcode.value = address.postalCode;
        form.city.value = address.city;
        form.country.value = address.country;
        form.labels.value = address.labels;
        document.getElementById("form-title").innerHTML =
          "Show Address Details";

        document.getElementById("save-button").style.display="none";
      }
    });
  }

  static showModal() {
    modal.style.display = "block";
    general.style.display = "block";
  }
  static closeModal() {
    modal.style.display = "none";
    general.style.display = "none";
    document.getElementById("save-button").style.display="block";
  }
}

function eventListeners() {
  addBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("form-title").innerHTML = "Add Address";
    UI.showModal();
  });

  closeButton.addEventListener("click", UI.closeModal);

  modalButtons.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.id == "save-button") {
      let isFormValidation = getFormData();
      if (!isFormValidation) {
        form.querySelectorAll("input").forEach((input) => {
          setTimeout(() => {
            input.classList.remove("error-message");
          }, 1500);
        });
      } else {
        let allItem = Address.getAddresses();
        let lastItemId =
          allItem.length > 0 ? allItem[allItem.length - 1].id : 0;
        lastItemId++;
        const addressItem = new Address(
          lastItemId,
          addrName,
          firstName,
          lastName,
          email,
          phone,
          street,
          postalCode,
          city,
          country,
          labels
        );
        Address.addAddress(addressItem);
        UI.closeModal();
        UI.addToAddressList(addressItem);
        form.reset();
      }
    }
  });
}

addrBookList.addEventListener("click", (e) => {
  UI.showModal();
  let trElem;

  if (e.target.parentElement.tagName == "TD") {
    trElem = e.target.parentElement.parentElement;
  }

  if (e.target.parentElement.tagName == "TR") {
    trElem = e.target.parentElement;
  }
  let viewID = trElem.dataset.id;
  UI.showModalData(viewID);
});

function loadJSON() {
  fetch("db/countries.json")
    .then((res) => res.json())
    .then((data) => {
      let contentSelectCountry = " ";
      data.forEach((country) => {
        contentSelectCountry += `
            <option>${country.country}</option>

            `;
      });
      countryList.innerHTML = contentSelectCountry;
    });
}

function getFormData() {
  let inputValidationStatus = [];
  //console.log(form.address_name.value,form.first_name.value, form.last_name.value, form.email.value, form.phone.value, form.street.value, form.postalcode.value, form.city.value, form.country.value, form.labels.value )
  if (!form.address_name.value) {
    addErrMsg(form.address_name);
    inputValidationStatus[0] = false;
  } else {
    addrName = form.address_name.value;
    inputValidationStatus[0] = true;
  }

  if (!form.first_name.value) {
    addErrMsg(form.first_name);
    inputValidationStatus[1] = false;
  } else {
    firstName = form.first_name.value;
    inputValidationStatus[1] = true;
  }

  if (!form.last_name.value) {
    addErrMsg(form.last_name);
    inputValidationStatus[2] = false;
  } else {
    lastName = form.last_name.value;
    inputValidationStatus[2] = true;
  }

  if (!form.email.value) {
    addErrMsg(form.email);
    inputValidationStatus[3] = false;
  } else {
    email = form.email.value;
    inputValidationStatus[3] = true;
  }

  if (!form.phone.value) {
    addErrMsg(form.phone);
    inputValidationStatus[4] = false;
  } else {
    phone = form.phone.value;
    inputValidationStatus[4] = true;
  }

  if (!form.street.value) {
    addErrMsg(form.street);
    inputValidationStatus[5] = false;
  } else {
    street = form.street.value;
    inputValidationStatus[5] = true;
  }

  if (!form.postalcode.value) {
    addErrMsg(form.postalcode);
    inputValidationStatus[6] = false;
  } else {
    postalCode = form.postalcode.value;
    inputValidationStatus[6] = true;
  }

  if (!form.city.value) {
    addErrMsg(form.city);
    inputValidationStatus[7] = false;
  } else {
    city = form.city.value;
    inputValidationStatus[7] = true;
  }

  country = form.country.value;
  labels = form.labels.value;
  return inputValidationStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox) {
  inputBox.classList.add("error-message");
}
