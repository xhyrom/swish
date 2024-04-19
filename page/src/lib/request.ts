import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

export function setupRequestForm() {
  const form = document.getElementById("request-form");
  if (!form) return;

  const id = document.getElementById("id") as HTMLInputElement;
  if (!id) return;

  if (
    !localStorage.getItem("track-title") ||
    !localStorage.getItem("track-uri")
  ) {
    navigate("/");
    return;
  }

  id.value = localStorage.getItem("track-title")!;

  if (form.getAttribute("data-listener") === "true") return;
  form.setAttribute("data-listener", "true");

  form.addEventListener("submit", async (e) => {
    console.log("submitting request");
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    if (!target) return;

    const formData = new FormData(target);

    const response = await fetch(target.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "cf-turnstile-response": formData.get("cf-turnstile-response"),
        from: formData.get("from"),
        to: formData.get("to"),
        id: localStorage.getItem("track-uri")?.split("?v=")[1]!,
      }),
    });

    localStorage.removeItem("track-title");
    localStorage.removeItem("track-uri");

    if (response.ok) {
      Swal.fire({
        title: "Song Requested",
        text: "Your song has been requested successfully",
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "An error occurred while requesting the song",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/");
      });
    }
  });
}
