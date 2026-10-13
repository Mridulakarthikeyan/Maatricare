function initLayout() {
  const user = localStorage.getItem('maatriCareUser');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const currentPage = window.location.pathname.split('/').pop();

  const navItems = [
    { name: 'Dashboard', path: 'dashboard.html', icon: 'layout-dashboard' },
    { name: 'Reminders', path: 'reminders.html', icon: 'calendar-clock' },
    { name: 'Diet & Meals', path: 'diet.html', icon: 'utensils' },
    { name: 'Wellness', path: 'wellness.html', icon: 'activity' },
    { name: 'Shopping', path: 'shopping.html', icon: 'shopping-cart' },
    { name: 'Education', path: 'education.html', icon: 'book-open' },
    { name: 'Hospital Finder', path: 'hospital-finder.html', icon: 'map-pin' },
  ];

  let navLinksHtml = '';
  navItems.forEach(item => {
    const isActive = currentPage === item.path;
    navLinksHtml += `
      <a href="${item.path}" class="${isActive ? 'active' : ''}">
        <i data-lucide="${item.icon}" width="20" height="20"></i>
        ${item.name}
      </a>`;
  });

  const sidebarHtml = `
    <div class="glass-panel sidebar">
      <div class="sidebar-brand">
        <i data-lucide="heart" width="20" height="20" style="color:#e94a5a; fill:#e94a5a;"></i>
        MaatriCare AI
      </div>
      <div class="sidebar-nav">
        ${navLinksHtml}
      </div>
      <div class="sidebar-footer">
        <div class="user-name">Hi, ${user} 👋</div>
        <button class="logout-btn" onclick="handleLogout()">
          <i data-lucide="log-out" width="20" height="20"></i> Logout
        </button>
      </div>
    </div>`;

  const mainContent = document.getElementById('page-content').innerHTML;

  document.body.innerHTML = `
    <div class="layout-wrapper">
      ${sidebarHtml}
      <div class="main-content">
        ${mainContent}
      </div>
    </div>`;

  lucide.createIcons();
}

function handleLogout() {
  localStorage.removeItem('maatriCareUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', initLayout);
