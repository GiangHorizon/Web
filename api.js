const API = "http://localhost:3000";

async function register() {//method POST
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (!name || !email || !username || !password) {
    alert("Please fill in all fields");
    return;
  }
  if (password !== confirmPassword) {
    alert("Password and confirm password do not match");
    return;
  }
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, username, password })
  });
  const data= await res.json();
  if(res.ok){
    alert("Registration successful");
    window.location.href="main.html";
  }
  else{
    alert(data.error);
  }

}
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.message);
    window.location.href = "main.html";
  } else {
    alert(data.message);
  }
}