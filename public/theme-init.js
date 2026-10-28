(() => {
  const key = "codex-pocket-theme";
  let mode = "system";
  try {
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") mode = saved;
  } catch {}
  const resolved = mode === "system"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : mode;
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  root.style.colorScheme = resolved;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = resolved === "light" ? "#f3f6ef" : "#11130f";
})();