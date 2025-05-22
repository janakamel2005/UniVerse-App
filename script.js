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
    renderNotes();
  }
}

function renderNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = "";

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.textContent = note;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function addDeadline(event) {
  event.preventDefault();
  const title = document.getElementById("deadlineTitle").value;
  const date = document.getElementById("deadlineDate").value;

  if (title && date) {
    const deadline = { title, date };
    let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    deadlines.push(deadline);
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
    renderDeadlines();
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDate").value = "";
  }
}

function displayDeadline(deadline, index) {
  const list = document.getElementById("deadlineList");
  const li = document.createElement("li");

  const daysLeft = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
  li.textContent = `${deadline.title} – ${deadline.date} (${daysLeft} days left)`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => {
    let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    deadlines.splice(index, 1);
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
    renderDeadlines();
  };

  li.appendChild(deleteBtn);
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

function renderDeadlines() {
  const list = document.getElementById("deadlineList");
  list.innerHTML = "";

  let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  deadlines.forEach((deadline, index) => {
    displayDeadline(deadline, index);
  });
}

function toggleSidebar() {
  document.body.classList.toggle("collapsed");
}

function showSection(section) {
  // Hide all sections first
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "none";

  // Show the selected section
  if (section === "dashboard") {
    document.getElementById("dashboardSection").style.display = "block";
  } else if (section === "home") {
    document.getElementById("homeSection").style.display = "block";
  }
}

function showDashboardTab(tab) {
  // Hide all tab content
  const tabs = ["notesSection", "deadlinesSection", "resourcesSection", "importantSection"];
  tabs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  });

  // Show selected tab
  const selectedTab = document.getElementById(tab + "Section");
  if (selectedTab) {
    selectedTab.style.display = "block";
  }
}

function saveImportantInfo(event) {
  event.preventDefault();

  const label = document.getElementById("infoLabel").value.trim();
  const value = document.getElementById("infoValue").value.trim();

  if (!label || !value) return;

  let data = JSON.parse(localStorage.getItem("infoItems")) || {};
  data[label] = value;
  localStorage.setItem("infoItems", JSON.stringify(data));

  document.getElementById("infoLabel").value = "";
  document.getElementById("infoValue").value = "";
  showImportantInfo();
}

function showImportantInfo() {
  const data = JSON.parse(localStorage.getItem("infoItems")) || {};
  const preview = document.getElementById("importantPreview");

  if (Object.keys(data).length === 0) {
    preview.innerHTML = "<em>No info saved yet.</em>";
    return;
  }

  let html = "<strong>Saved Info:</strong><br><ul>";
  for (const [label, value] of Object.entries(data)) {
    html += `
      <li>
        <strong>${label}:</strong> ${value}
        <button onclick="deleteInfoItem('${label}')" style="margin-left: 10px;">🗑</button>
      </li>
    `;
  }
  html += "</ul>";

  preview.innerHTML = html;
}

function deleteInfoItem(label) {
  let data = JSON.parse(localStorage.getItem("infoItems")) || {};
  delete data[label];
  localStorage.setItem("infoItems", JSON.stringify(data));
  showImportantInfo();
}



function deleteInfo(index) {
  let savedInfo = JSON.parse(localStorage.getItem("importantInfo")) || [];
  savedInfo.splice(index, 1);
  localStorage.setItem("importantInfo", JSON.stringify(savedInfo));
  showImportantInfo();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  renderDeadlines();
  renderNotes();
  showImportantInfo();
  showDashboardTab('notes'); // Show notes tab by default
});

function openModal(dateStr) {
  const modal = document.getElementById("eventModal");
  const modalDate = document.getElementById("modalDate");
  const eventList = document.getElementById("modalEventList");

  modalDate.textContent = dateStr;
  eventList.innerHTML = "";

  const allEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
  const eventsForDate = allEvents.filter(e => e.date === dateStr);

  if (eventsForDate.length === 0) {
    eventList.innerHTML = "<li>No events</li>";
  } else {
    eventsForDate.forEach((event, idx) => {
      const li = document.createElement("li");
      li.textContent = `${event.title} — ${event.category}`;
      li.setAttribute("data-category", event.category);

      const delBtn = document.createElement("button");
      delBtn.innerHTML = "&times;";
      delBtn.onclick = () => {
        allEvents.splice(allEvents.indexOf(event), 1);
        localStorage.setItem("calendarEvents", JSON.stringify(allEvents));
        renderCalendar();
        openModal(dateStr); // Refresh modal
      };

      li.appendChild(delBtn);
      eventList.appendChild(li);
    });
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("eventModal").classList.add("hidden");
}
