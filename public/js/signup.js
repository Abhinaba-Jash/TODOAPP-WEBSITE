document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const c_password = document.getElementById('c_password').value;
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, email, password, c_password })
    });
    if (response.ok) {
      alert('Signup successful, please login.');
      window.location.href = '/';
    } else {
      alert('Signup failed');
    }
  });

  document.getElementById("loginBtn").addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href="/";
  })