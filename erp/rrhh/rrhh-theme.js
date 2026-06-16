(function initThemeManager(){
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('rrhh-theme') || 'light';

  const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    if (themeToggle) themeToggle.checked = theme === 'dark';
    if (themeToggle) {
      const control = document.getElementById('themeToggle');
      if (control) control.checked = theme === 'dark';
    }
  };

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const nextTheme = themeToggle.checked ? 'dark' : 'light';
      localStorage.setItem('rrhh-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
})();
