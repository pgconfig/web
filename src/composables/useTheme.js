import { ref, onMounted, onUnmounted } from 'vue';

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const isDark = ref(false);
  let mediaQuery = null;

  function setDarkClass(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle('dark', dark);
  }

  function applyTheme(dark) {
    setDarkClass(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    applyTheme(!isDark.value);
  }

  function onSystemThemeChange(event) {
    if (!localStorage.getItem('theme')) {
      setDarkClass(event.matches);
    }
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') setDarkClass(true);
    else if (saved === 'light') setDarkClass(false);
    else setDarkClass(mediaQuery.matches);

    mediaQuery.addEventListener('change', onSystemThemeChange);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', onSystemThemeChange);
  });

  return { isDark, toggleTheme, applyTheme };
}
