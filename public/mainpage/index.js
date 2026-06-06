  function toggleAdminDropdown(event) {
    // Ngăn chặn sự kiện lan rộng lên window làm đóng menu ngay lập tức
    event.stopPropagation(); 
    const dropdownMenu = document.getElementById("adminDropdownMenu");
    dropdownMenu.classList.toggle("hidden");
  }

  // Tự động đóng menu khi người dùng click vào bất kỳ vị trí nào khác ngoài menu
  window.addEventListener("click", function(event) {
    const dropdownMenu = document.getElementById("adminDropdownMenu");
    // Nếu menu đang hiển thị và click không nằm bên trong container của Admin
    if (!dropdownMenu.classList.contains("hidden") && !event.target.closest(".id-admin-container")) {
      dropdownMenu.add("hidden");
    }
  });