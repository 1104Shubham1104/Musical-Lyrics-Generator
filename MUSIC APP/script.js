const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// Function to search for songs
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

// Function to get lyrics
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  if (data.error) {
    showAlert(data.error);
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    result.innerHTML = `
        <h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
    `;
  }
  more.innerHTML = "";
}

// Function to get more songs (Pagination)
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
}

// Function to display search results
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join("")}
    </ul>
  `;

  // Pagination (Previous/Next)
  more.innerHTML = `
    ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ""}
    ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ""}
  `;
}

// Function to show alert messages
function showAlert(message) {
  const notif = document.createElement("div");
  notif.classList.add("toast");
  notif.innerText = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) showAlert("Please type in a search term");
  else searchSongs(searchTerm);
});

result.addEventListener("click", (e) => {
  const clickedElement = e.target;
  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});

// Preload Masoom Sharma's popular songs including "2 Khatola" & "Chambal Ke Daaku"
const masoomSharmaSongs = [
  "Bholenath", 
  "Jalebi", 
  "Desi Haan Ji", 
  "Chand", 
  "Fukri Na Maar", 
  "Jaatni", 
  "Kisan",
  "2 Khatola", 
  "Chambal Ke Daaku"
];

masoomSharmaSongs.forEach((song) => searchSongs(song));

// Additional Functionality for Form Shake & Toast Notification
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const searchInput = document.getElementById("search");
    const toast = document.getElementById("toast");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (searchInput.value.trim() === "") {
            showToast();
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 500);
        }
    });

    function showToast() {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
});
