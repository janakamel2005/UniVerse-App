< !DOCTYPE html >
  <html lang="en">

    <head>
      <meta charset="UTF-8">
        <title>UniVerse – Your Student Companion</title>
        <link rel="stylesheet" href="style.css" />
        <style>
    /* (CSS unchanged for brevity — keep your original styles) */
        </style>
    </head>

    <body>
      <!-- SIDEBAR -->
      <div id="sidebar">
        <button id="toggleSidebar" onclick="toggleSidebar()">☰</button>
        <div id="sidebarContent">
          <button onclick="showSection('dashboard'); showDashboardTab('notes')">📝 Notes</button>
          <button onclick="showSection('dashboard'); showDashboardTab('deadlines')">⏰ Deadlines</button>
          <button onclick="showSection('dashboard'); showDashboardTab('resources')">🌐 Resources</button>
          <button onclick="showSection('dashboard'); showDashboardTab('important')">🔒 Important Info</button>
          <button onclick="showSection('home')">🏠 Home</button>
        </div>
      </div>

      <!-- TOPBAR -->
      <header class="topbar">
        <img src="images/universe-logo.png" alt="UniVerse Logo" class="app-logo-large">
      </header>

      <!-- MAIN CONTENT -->
      <div id="mainContent">
        <!-- HOME SECTION -->
        <section id="homeSection" class="homepage">
          <div class="welcome" style="text-align: center;">
            <h2>Welcome to UniVerse 🌍</h2>
            <p>Your companion for surviving and thriving as an international student.</p>
          </div>

          <!-- Slideshow -->
          <div class="slideshow-container">
            <div class="slide fade"><img src="images/students1.jpg" alt="Berlin city life" /></div>
            <div class="slide fade"><img src="images/students2.jpg" alt="Students working together" /></div>
            <div class="slide fade"><img src="images/students3.jpg" alt="TU Berlin library" /></div>
          </div>

          <!-- What is Universe -->
          <section class="highlight-box">
            <h3>🌟 What is UniVerse?</h3>
            <p>UniVerse is your personal student sidekick — designed to help you keep track of everything from important deadlines and personal documents to helpful resources and housing links.</p>
          </section>

          <!-- Video -->
          <div class="video-wrapper" style="text-align: center;">
            <video width="100%" controls style="max-width: 600px; border-radius: 10px;">
              <source src="welcome-video.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
          </div>

          <!-- About the Developer -->
          <section class="highlight-box" style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
            <img src="images/jana-profile.jpg" alt="Jana profile" style="width: 120px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.15);" />
            <div style="flex: 1;">
              <h3>👩‍💻 About the Developer</h3>
              <p>Hi, I’m Jana — a Computer Engineering student at TU Berlin with a passion for technology and helping others.</p>
            </div>
          </section>

          <!-- Features -->
          <section class="highlight-box">
            <h3>🧭 What You Can Do</h3>
            <ul>
              <li>📝 Save quick notes instantly</li>
              <li>⏰ Track deadlines with 7- and 2-day reminders</li>
              <li>🔒 Store your Sozialversicherungsnummer, TK ID, etc.</li>
              <li>📎 Upload and view important PDFs like visa papers and CVs</li>
              <li>🌐 Access student-friendly links for housing, jobs, and more</li>
            </ul>
          </section>
        </section>

        <!-- DASHBOARD SECTION (moved outside homeSection) -->
        <section id="dashboardSection" style="display: none;">
          <div id="notesSection" class="tabContent">
            <h2>Quick Notes</h2>
            <input id="noteInput" placeholder="Write a note..." />
            <button onclick="saveNote()">Save</button>
            <ul id="noteList"></ul>
          </div>

          <div id="deadlinesSection" class="tabContent" style="display: none;">
            <h2>Deadlines</h2>
            <form onsubmit="addDeadline(event)">
              <input id="deadlineTitle" placeholder="Title" />
              <input type="date" id="deadlineDate" />
              <button type="submit">Add</button>
            </form>
            <ul id="deadlineList"></ul>
          </div>

          <div id="resourcesSection" class="tabContent" style="display: none;">
            <h2>Helpful Links</h2>
            <ul>
              <li><a href="https://www.stw.berlin/en/" target="_blank">Studentenwerk Berlin</a></li>
              <li><a href="https://jobportal.berlin/" target="_blank">Berlin Job Portal</a></li>
            </ul>
          </div>

          <div id="importantSection" class="tabContent" style="display: none;">
            <h2>Important Info</h2>
            <form onsubmit="saveImportantInfo(event)">
              <input id="tkId" placeholder="TK ID" />
              <input id="socialId" placeholder="Sozialversicherungsnummer" />
              <input id="otherInfo" placeholder="Other Info" />
              <button type="submit">Save</button>
            </form>
            <div id="importantPreview"></div>
          </div>
        </section>
      </div>

      <script>
        let slideIndex = 0;
        function showSlides() {
          let slides = document.getElementsByClassName("slide");
        for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
        slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1; }
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 3500);
    }
        showSlides();

        function toggleSidebar() {
          document.body.classList.toggle("collapsed");
    }
      </script>
    </body>

  </html>