/// <reference types="astro/client" />

interface Window {
  turnstile: {
    reset: () => void;
    implicitRender: () => void;
  };
}
