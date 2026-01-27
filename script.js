//log out button shown when clicked on user card
const user_card = document.querySelector(".user-card");
const logout_btn = document.getElementById("logout__btn");

user_card.addEventListener("click", () => {
  logout_btn.classList.toggle("hidden");
});
//selecting elements
const form = document.getElementById("documentForm");
const docNameInput = document.getElementById("docName");
const statusInput = document.getElementById("status");
const tableBody = document.getElementById("documentsBody");
const cancelBtn = document.getElementById("cancelBtn");
const addBtn = document.querySelector(".add-btn");
const formBody = document.querySelector(".form_body");
//number of people waiting elements
const statusSelect = document.getElementById("status");
const waiting_div = document.getElementById("waiting_div");
const waitingInput = document.getElementById("waiting_person");

let editIndex = null;
//this shows input for adding number of person when status is selected pending
statusSelect.addEventListener("change", () => {
  if (statusSelect.value === "pending") {
    waiting_div.classList.remove("hidden");
    waitingInput.required = true;
  } else {
    waiting_div.classList.add("hidden");
    waitingInput.required = false;

  }
});


// display the form
addBtn.addEventListener("click", () => {
  form.reset();
  formBody.classList.remove("hidden");
  formBody.classList.add("display");

});

// hide form when clicked on cancle button
cancelBtn.addEventListener("click", () => {
  form.reset();
  waiting_div.classList.add("hidden");

  formBody.classList.add("hidden");
  formBody.classList.remove("display");

});

//form validation
function formValidation(status, title) {
  if (status === "select") {
    return "invalid";
  }
  if (title === "") {
    return "invalid";
  }
  return "valid"
}


//search functionality
function searchFilter() {
  const searchInput = document.getElementById("inputBox");
  search = searchInput.value.toUpperCase();
  const table = document.getElementById("tableBox");
  tr = table.getElementsByTagName("tr");
  // console.log(tr);
  for (let i = 1; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[1];
    // console.log(td);
    if (td.innerText.toUpperCase().includes(search)) {
      tr[i].style.display = "";
    }
    else {
      tr[i].style.display = "none";
    }

  }
}

// form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = docNameInput.value.trim();
  const status = statusInput.value;
  const waitingCount = status === "pending" ? waitingInput.value : null;

  if (formValidation(status, title) === "invalid") return;

  const documents = getDoc();
  const { date, time } = getCurrentDateTime();

  if (editIndex === null) {
    // when a new item is to be added

    const newDoc = { title, status, waitingCount, date, time };
    documents.push(newDoc);
  } else {
    // edit the selected item based on editIndex
    documents[editIndex].title = title;
    documents[editIndex].status = status;
    documents[editIndex].waitingCount = waitingCount;
    documents[editIndex].date = date; 
    documents[editIndex].time = time; 
    editIndex = null; // reset edit mode
  }

  saveDoc(documents);

  //refresh table
  tableBody.innerHTML = "";
  documents.forEach((doc, i) => addRow(doc, i));

  form.reset();
  waiting_div.classList.add("hidden");
  formBody.classList.add("hidden");
  formBody.classList.remove("display");
});


function addRow(doc, index) {

  const row = document.createElement("tr");
  row.setAttribute("data-index", index);
  row.innerHTML = `
    <td><input type="checkbox" /></td>

    <td class="doc-title">${doc.title}</td>

    <td>
      ${getStatusHTML(doc.status, doc.waitingCount)}
    </td>

    <td class="date">
      ${doc.date}<br/><span>${doc.time}</span>
    </td>

    <td>
      ${getActionButton(doc.status)}
    </td>

    <td>
      <div class="threeDotDiv">
        <button  class="threeDotBtn">
          <strong >⋮</strong>
        </button>
        <div class="editDelete hiddenThreeDot">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>
    </td>
  `;

  tableBody.appendChild(row); // add to top

  const btn = row.querySelector(".threeDotBtn");
  const editDelete = row.querySelector(".editDelete");
  btn.addEventListener("click", () => {
    editDelete.classList.toggle("hiddenThreeDot");
  });
}


tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  const index = row.getAttribute("data-index");
  let documents = getDoc();

  // deletee
  if (e.target.classList.contains("delete")) {
    e.target.closest(".editDelete").classList.add("hidden");

    documents.splice(index, 1); // remove from array
    saveDoc(documents);


    // refresh table again to update indexes
    tableBody.innerHTML = "";
    documents.forEach((doc, i) => addRow(doc, i));
  }

  //edit
  if (e.target.classList.contains("edit")) {
    e.target.closest(".editDelete").classList.add("hidden");

    const doc = documents[index];
    editIndex = index; // set edit mode
    
    // show form
    formBody.classList.remove("hidden");
    formBody.classList.add("display");

    // prefill form
    docNameInput.value = doc.title;
    statusInput.value = doc.status;

    if (doc.status === "pending") {
      waiting_div.classList.remove("hidden");
      waitingInput.value = doc.waitingCount;
    }
  }
});


//const threeDotBtn=document.getElementsByClassName("threeDotBtn");
// const btn=document.getElementById("threeDot");
// const editDelete=document.getElementsByClassName("editdelete");
//console.log(threeDotBtn);
// btn.addEventListener("click",()=>{
//   threeDotBtn.style.display="flex";
// });

// getting current date and time
function getCurrentDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString("en-US");
  const time = now.toLocaleTimeString("en-US");

  return { date, time };
}
// function to display status based on user selection from the form
function getStatusHTML(status, waitingCount) {
  if (status === "signing") {
    return `<span class="status needs-signing">Needs Signing</span>`;
  }

  if (status === "pending") {
    return `
      <span class="status pending">Pending</span>
      <div class="status-sub">Waiting for <strong>${waitingCount}${waitingCount > 1 ? " people" : " person"}</strong></div>
    `;
  }
  if (status === "completed") {
    return `<span class="status completed">Completed</span>`;
  }
  else {
    return "";
  }
}
// function to change text on the button based on status(signing-signnow, pending-preview, completed-downloadpdf)
function getActionButton(status) {
  if (status === "signing") {
    return `<button class="btn-outline">Sign now</button>`;
  }

  if (status === "pending") {
    return `<button class="btn-outline">Preview</button>`;
  }

  return `<button class="btn-outline">Download PDF</button>`;
}




//local storage functionalities
function getDoc() {
  return JSON.parse(localStorage.getItem("documents")) || [];
}

function saveDoc(docs) {
  localStorage.setItem("documents", JSON.stringify(docs));
}

document.addEventListener("DOMContentLoaded", () => {
  const documents = getDoc();
  documents.forEach((doc, index) => addRow(doc, index));
});

const formDiv = document.querySelector(".form_div");

// click on overlay close form
formBody.addEventListener("click", () => {
  form.reset();
  waiting_div.classList.add("hidden");
  formBody.classList.add("hidden");
  formBody.classList.remove("display");
});

// prevent clicking inside form from closing it
formDiv.addEventListener("click", (e) => {
  e.stopPropagation();
});
