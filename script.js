// Request notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// SAVE NOTE + localStorage
function saveNote() {
  const input = document.getElementById("noteInput");
  const text = input.value.trim();

  if (text !== "") {
    const list = document.getElementById("noteList");
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);

    input.value = "";

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(text);
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

function loadNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  const list = document.getElementById("noteList");

  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
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
    saveDeadlineToStorage(deadline);
    displayDeadline(deadline);
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDate").value = "";
  }
}

function saveDeadlineToStorage(deadline) {
  let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  deadlines.push(deadline);
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
}

function displayDeadline(deadline) {
  const list = document.getElementById("deadlineList");
  const li = document.createElement("li");

  const daysLeft = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
  li.textContent = `${deadline.title} – ${deadline.date} (${daysLeft} days left)`;
  list.appendChild(li);

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

function loadDeadlines() {
  let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  deadlines.forEach(deadline => {
    displayDeadline(deadline);
  });
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
  const tabs = ["notesSection", "deadlinesSection", "resourcesSection"];

  tabs.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  const target = document.getElementById(tab + "Section");
  if (target) {
    target.style.display = "block";
  }
}

// 🔁 Load saved data
loadNotes();
loadDeadlines();
