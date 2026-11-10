// Demo-only authentication: credentials are stored in this browser's localStorage.
// Do not use this client-side example for real accounts or sensitive information.
document.addEventListener("DOMContentLoaded", () => {
  // Reveal cards as they enter the screen.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Gallery lightbox.
  const thumbs = [...document.querySelectorAll(".thumbnail")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  let current = 0;
  function show(index) {
    if (!thumbs.length || !lightbox || !lightboxImage) return;
    current = (index + thumbs.length) % thumbs.length;
    lightboxImage.src = thumbs[current].src;
    lightboxImage.alt = thumbs[current].alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  thumbs.forEach((img, index) => img.addEventListener("click", () => show(index)));
  document.querySelector(".lightbox .close")?.addEventListener("click", closeBox);
  document.querySelector(".lightbox .prev")?.addEventListener("click", () => show(current - 1));
  document.querySelector(".lightbox .next")?.addEventListener("click", () => show(current + 1));
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeBox(); });
  function closeBox() {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
  }
  document.addEventListener("keydown", e => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") closeBox();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Login and sign-up form.
  const authForm = document.getElementById("authForm");
  if (authForm) {
    let isLogin = true;
    const title = document.getElementById("formTitle");
    const confirmWrap = document.getElementById("confirmWrap");
    const toggle = document.getElementById("toggleText");
    const error = document.getElementById("errorMessage");
    const button = document.getElementById("authButton");
    document.getElementById("toggleMode").addEventListener("click", e => {
      e.preventDefault();
      isLogin = !isLogin;
      authForm.reset();
      error.textContent = "";
      title.textContent = isLogin ? "Welcome Back" : "Create Account";
      button.textContent = isLogin ? "Login" : "Sign Up";
      confirmWrap.hidden = isLogin;
      toggle.textContent = isLogin ? "New here? " : "Already registered? ";
      const link = document.createElement("a");
      link.href = "#";
      link.id = "toggleMode";
      link.textContent = isLogin ? "Create an account" : "Login";
      toggle.append(link);
      link.addEventListener("click", e2 => { e2.preventDefault(); document.getElementById("toggleMode").click(); });
    });
    authForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      if (!username || password.length < 4) {
        error.textContent = "Enter a username and a password with at least 4 characters.";
        return;
      }
      if (isLogin) {
        if (localStorage.getItem("flowerSiteUser") === username &&
            localStorage.getItem("flowerSitePass") === password) {
          sessionStorage.setItem("flowerSiteLoggedIn", "yes");
          location.href = "index.html";
        } else error.textContent = "Account not found. Please check your details or sign up.";
      } else {
        const confirm = document.getElementById("confirmPassword").value;
        if (password !== confirm) { error.textContent = "Passwords do not match."; return; }
        localStorage.setItem("flowerSiteUser", username);
        localStorage.setItem("flowerSitePass", password);
        alert("Account created! You can now log in.");
        isLogin = true;
        title.textContent = "Welcome Back";
        button.textContent = "Login";
        confirmWrap.hidden = true;
        authForm.reset();
        toggle.textContent = "New here? ";
        const link = document.createElement("a");
        link.href = "#"; link.id = "toggleMode"; link.textContent = "Create an account";
        toggle.append(link);
        link.addEventListener("click", e2 => { e2.preventDefault(); document.getElementById("toggleMode").click(); });
      }
    });
  }

  // Show/hide password.
  document.getElementById("showPassword")?.addEventListener("change", e => {
    document.getElementById("password").type = e.target.checked ? "text" : "password";
  });

  // Contact form validation (demo only; no message is sent to a server).
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("formStatus");
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      status.textContent = "Please enter your name, a valid email, and a message (at least 5 characters).";
      return;
    }
    status.textContent = "Thank you! Your form passed validation. Connect a server or email service to send it.";
    contactForm.reset();
  });
});

function confirmLogout() {
  if (confirm("Are you sure you want to log out?")) {
    sessionStorage.removeItem("flowerSiteLoggedIn");
    location.href = "login.html";
  }
}
