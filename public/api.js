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
    window.location.href="../main.html";
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
    window.location.href = "../main.html";
  } else {
    alert(data.message);
  }
}

const selectEl = document.getElementById('generation-select');
const container = document.getElementById('tree-container');

async function fetchAndRenderTree(generation) {
  try {
    const response = await fetch(`${API}/api/family_tree?generation=${generation}`);
    const members = await response.json();
    // Gom cac object tu database theo generation
    const groupedByGen = {};
    members.forEach(member => {
      if (!groupedByGen[member.generation]) {
        groupedByGen[member.generation] = [];
      }
      groupedByGen[member.generation].push(member);
    });

    let htmlContent = `
      <div class="bg-slate-50 border rounded-2xl h-[700px] relative p-10 overflow-auto">
    `;

    Object.keys(groupedByGen).forEach((genKey, index) => {
      const listMembers = groupedByGen[genKey];
      const marginTopClass = index === 0 ? '' : 'mt-24';
      
      htmlContent += `<div class="flex justify-center gap-10 ${marginTopClass}">`;

      listMembers.forEach(member => {
        const lifespan = (member.date_birth && member.date_death) 
          ? `${member.date_birth} - ${member.date_death}` 
          : (member.date_birth ? `${member.date_birth}` : "Chưa cập nhật");

        htmlContent += `
          <div class="bg-white shadow rounded-2xl w-64 p-4 text-center border border-gray-100 z-10">
            <h3 class="font-bold text-lg text-slate-800">${member.name}</h3>
            <p class="text-slate-500 text-sm">${lifespan}</p>
          </div>
        `;
      });

      htmlContent += `</div>`; 
    });

    htmlContent += `
        <div class="absolute bottom-6 right-6 w-40 h-40 border rounded-xl bg-white flex items-center justify-center text-gray-400 shadow-sm z-20">
          Mini Map
        </div>
      </div>
    `;
    
    // Do HTML vao container
    container.innerHTML = htmlContent;

  } catch (error) {
    console.error("Failed to load family tree:", error);
    container.innerHTML = `
      <div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
        Can't load family tree. Please try again later.
      </div>`;
  }
}

if(selectEl) {
  selectEl.addEventListener('change', function() {
    fetchAndRenderTree(this.value);
  });
}

// Kich hoat cho lan dau tien
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderTree('all');
});