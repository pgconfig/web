import { ref, onMounted } from 'vue';

export function useTheme() {
  const isDark = ref(false);

  function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    applyTheme(!isDark.value);
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') applyTheme(true);
    else if (saved === 'light') applyTheme(false);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);
  });

  return { isDark, toggleTheme, applyTheme };
}
