import { navigate } from "astro:transitions/client";

interface Track {
  info: {
    title: string;
    artworkUrl: string;
    author: string;
    uri: string;
  };
}

export function setupSearchForm() {
  const form = document.getElementById("search-form");
  if (!form) return;

  const data = document.querySelector("data");
  if (!data) return;

  const apiUrl = data.getAttribute("data-api-url");

  if (form.getAttribute("data-listener") === "true") return;
  form.setAttribute("data-listener", "true");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchInputElement = document.getElementById(
      "search-input",
    ) as HTMLInputElement;
    if (!searchInputElement) return;

    const searchInput = "ytsearch:" + searchInputElement.value;

    const tracks = document.getElementById("tracks");
    if (!tracks) return;

    tracks.innerHTML = "";
    createTrackElement(0);
    createTrackElement(1);
    createTrackElement(2);
    createTrackElement(3);
    createTrackElement(4);

    const results = document.getElementById("results");
    if (!results) return;

    results.hidden = false;

    const body = new FormData(form as HTMLFormElement);

    const response = await fetch(
      `${apiUrl}/lavalink/search?q=${encodeURIComponent(searchInput)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "cf-turnstile-response": body.get("cf-turnstile-response"),
        }),
      },
    );

    const data = await response.json();

    for (const track of data) {
      populateTrack(data.indexOf(track), track);
    }

    searchInputElement.value = "";
  });
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  if (
    target.tagName === "BUTTON" &&
    target.getAttribute("data-uri") &&
    target.getAttribute("data-title")
  ) {
    request(
      target.getAttribute("data-uri")!,
      target.getAttribute("data-title")!,
    );
  }
});

function createTrackElement(i: number) {
  if (document.getElementById("track-" + i)) {
    return document.getElementById("track-" + i);
  }

  const element = document.createElement("div");
  element.id = "track-" + i;
  element.classList.add("p-4", "bg-gray-50", "rounded-lg");

  const tracks = document.getElementById("tracks");
  if (!tracks) return;

  tracks.appendChild(element);
  return element;
}

function request(uri: string, title: string) {
  localStorage.setItem("track-uri", uri);
  localStorage.setItem("track-title", title);
  navigate("/request");
}

function populateTrack(i: number, track: Track) {
  const element = createTrackElement(i)!;

  element.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img src="${track.info.artworkUrl}" alt="${track.info.title}" class="w-10 h-10 rounded-lg" />
        <div class="ms-3">
          <h3 class="text-sm font-medium text-gray-900">${track.info.title}</h3>
          <p class="text-sm text-gray-500">${track.info.author}</p>
        </div>
      </div>
      <button data-uri="${track.info.uri}" data-title="${track.info.title}" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Request</button>
    </div>
  `;
}
