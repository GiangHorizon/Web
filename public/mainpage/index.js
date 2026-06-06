  function toggleAdminDropdown(event) {
    event.stopPropagation(); 
    const dropdownMenu = document.getElementById("adminDropdownMenu");
    dropdownMenu.classList.toggle("hidden");
  }

  // Tu dong dong menu khi click ra ngoai
  window.addEventListener("click", function(event) {
    const dropdownMenu = document.getElementById("adminDropdownMenu");
    if (!dropdownMenu.classList.contains("hidden") && !event.target.closest(".id-admin-container")) {
      dropdownMenu.add("hidden");
    }
  });