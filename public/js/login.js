document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const { idToken, uid } = await response.json();
      document.cookie = `token=${idToken}; path=/;`;
      document.cookie = `uid=${uid}; path=/;`;
      window.location.href = "/";
    } else {
      const errorMessage = await response.text();
      alert("Login failed");
    }
  } catch (error) {
    throw new Error(error);
  }
});

document.getElementById("signupBtn").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/signup";
});
