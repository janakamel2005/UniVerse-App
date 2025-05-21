// Request notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// SAVE NOTE + localStorage
function saveNote() {
  const input = document.getElementById("noteInput");
  const text = input.value.trim();

  if (text !== "") {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(text);
    localStorage.setItem("notes", JSON.stringify(notes));
    input.value = "";
    renderNotes(); // refresh list
  }
}


function renderNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = ""; // clear previous content

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.textContent = note;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      notes.splice(index, 1); // remove note
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes(); // re-render list
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}


// ADD DEADLINE + localStorage
function addDeadline(event) {
  event.preventDefault();
  const title = document.getElementById("deadlineTitle").value;
  const date = document.getElementById("deadlineDate").value;

  if (title && date) {
    const deadline = { title, date };
    let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    deadlines.push(deadline);
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
    renderDeadlines(); // refresh list
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDate").value = "";
  }
}


function saveDeadlineToStorage(deadline) {
  let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  deadlines.push(deadline);
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
}

function displayDeadline(deadline, index) {
  const list = document.getElementById("deadlineList");
  const li = document.createElement("li");

  const daysLeft = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
  li.textContent = `${deadline.title} – ${deadline.date} (${daysLeft} days left)`;

  // 🗑️ Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => {
    let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    deadlines.splice(index, 1);
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
    renderDeadlines(); // re-render list
  };

  li.appendChild(deleteBtn);
  list.appendChild(li);

  // 🔔 Notifications
  if (Notification.permission === "granted") {
    if (daysLeft === 7) {
      new Notification("⏳ 1 week left!", {
        body: `Your deadline for "${deadline.title}" is in 7 days.`,
      });
    } else if (daysLeft === 2) {
      new Notification("⚠️ 2 days left!", {
        body: `Don't forget: "${deadline.title}" is in 2 days.`,
      });
    }
  }
}
function renderDeadlines() {
  const list = document.getElementById("deadlineList");
  list.innerHTML = ""; // clear previous list

  let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  deadlines.forEach((deadline, index) => {
    displayDeadline(deadline, index);
  });
}



function loadDeadlines() {
  const saved = JSON.parse(localStorage.getItem("deadlines")) || [];
  saved.forEach(displayDeadline);
}


// 🎯 NEW: SECTION HANDLING

function showSection(section) {
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("dashboardNav").style.display = "none";
  document.getElementById("homeBtn").style.display = "none";

  if (section === "dashboard") {
    document.getElementById("dashboardSection").style.display = "block";
    document.getElementById("dashboardNav").style.display = "block";
    document.getElementById("homeBtn").style.display = "block";
    showDashboardTab("notes");
  } else if (section === "home") {
    document.getElementById("homeSection").style.display = "block";
  }
}

function showDashboardTab(tab) {
  const tabs = ["notesSection", "deadlinesSection", "resourcesSection", "importantSection"];

  tabs.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  const target = document.getElementById(tab + "Section");
  if (target) {
    target.style.display = "block";
  }
}

function saveImportantInfo(event) {
  event.preventDefault();

  const tkId = document.getElementById("tkId").value.trim();
  const socialId = document.getElementById("socialId").value.trim();
  const other = document.getElementById("otherInfo").value.trim();

  const info = { tkId, socialId, other };
  localStorage.setItem("importantInfo", JSON.stringify(info));

  showImportantInfo();
}

function showImportantInfo() {
  const preview = document.getElementById("importantPreview");
  const info = JSON.parse(localStorage.getItem("importantInfo"));

  if (info) {
    preview.innerHTML = `
      <strong>Saved Info:</strong><br>
      TK ID: ${info.tkId || "-"}<br>
      Sozialversicherungsnummer: ${info.socialId || "-"}<br>
      Other: ${info.other || "-"}
    `;
  } else {
    preview.innerHTML = "<em>No info saved yet.</em>";
  }
}
// Save label-value pair
function addInfoItem(event) {
  event.preventDefault();
  const label = document.getElementById("infoLabel").value.trim();
  const value = document.getElementById("infoValue").value.trim();

  if (!label || !value) return;

  let data = JSON.parse(localStorage.getItem("infoItems")) || {};
  data[label] = value;
  localStorage.setItem("infoItems", JSON.stringify(data));

  document.getElementById("infoLabel").value = "";
  document.getElementById("infoValue").value = "";
  renderInfoItems();
}

// Display saved items
function renderInfoItems() {
  const data = JSON.parse(localStorage.getItem("infoItems")) || {};
  const list = document.getElementById("infoList");

  if (Object.keys(data).length === 0) {
    list.innerHTML = "<em>No info saved yet.</em>";
    return;
  }

  let html = "<ul>";
  for (const [label, value] of Object.entries(data)) {
    html += `<li><strong>${label}:</strong> ${value}</li>`;
  }
  html += "</ul>";

  list.innerHTML = html;
}
let uploadedPDFs = []; // in-memory session list

function savePDFs() {
  const input = document.getElementById("pdfUploader");
  const files = Array.from(input.files);

  if (!files.length) return;

  files.forEach(file => {
    const blobURL = URL.createObjectURL(file);
    uploadedPDFs.push({ name: file.name, url: blobURL });
  });

  renderPDFList();
  input.value = "";
}

function renderPDFList() {
  const list = document.getElementById("pdfList");

  if (uploadedPDFs.length === 0) {
    list.innerHTML = "<em>No PDFs uploaded yet.</em>";
    return;
  }

  list.innerHTML = uploadedPDFs
    .map(pdf => `<li><a href="${pdf.url}" target="_blank">${pdf.name}</a></li>`)
    .join("");
}
function toggleSidebar() {
  document.body.classList.toggle("collapsed");
}

function showSection(section) {
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "none";

  if (section === "dashboard") {
    document.getElementById("dashboardSection").style.display = "block";
  } else if (section === "home") {
    document.getElementById("homeSection").style.display = "block";
  }
}

function showDashboardTab(tab) {
  const tabs = ["notesSection", "deadlinesSection", "resourcesSection", "importantSection"];
  
  tabs.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(tab + "Section").style.display = "block";
}



// 🔁 Load saved data
renderDeadlines(); // loads + refreshes saved list
renderNotes();
renderInfoItems();
renderPDFList();
