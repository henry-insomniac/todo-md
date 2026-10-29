(() => {
  'use strict';
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const names = {blue:'雾蓝', violet:'柔紫', teal:'青碧', rose:'玫瑰', peach:'桃橙'};
  const colors = {dark:{blue:'#9CBEFA',violet:'#C7AEF6',teal:'#88D3C5',rose:'#F0A9C1',peach:'#F2AD94'},light:{blue:'#315FA4',violet:'#7451A6',teal:'#216D61',rose:'#A23D65',peach:'#A34832'}};
  let preference = null;
  try { preference = localStorage.getItem('todo-md-site-appearance'); } catch (_) {}
  let view = 'tasks', accent = 'blue';
  const theme = () => preference === 'light' || preference === 'dark' ? preference : systemTheme.matches ? 'dark' : 'light';
  let imageRequest = 0;
  function changeImage(id, url, description) {
    url += "?v=111";
    const img = document.getElementById(id);
    // Remove the static no-JS fallback only once the live image is available.
    const request = ++imageRequest;
    img.dataset.request = String(request);
    if (img.getAttribute('src') === url && !img.closest('picture').querySelector('source')) {img.alt = description; return;}
    const preload = new Image();
    preload.onload = () => {
      if (img.dataset.request !== String(request)) return;
      img.closest('picture').querySelectorAll('source').forEach(source => source.remove());
      img.src = url; img.alt = description;
      img.classList.remove('image-updated');
      requestAnimationFrame(() => img.classList.add('image-updated'));
    };
    preload.onerror = () => {
      if (img.dataset.request === String(request)) img.alt = '预览暂时无法加载，请稍后重试。';
    };
    preload.src = url;
  }
  function render() {
    const mode = theme();
    root.dataset.theme = mode;
    root.style.setProperty('--accent', colors[mode][accent]);
    const appearance = document.getElementById('appearance-toggle');
    appearance.hidden = false;
    appearance.setAttribute('aria-pressed', String(mode === 'dark'));
    appearance.setAttribute('aria-label', mode === 'dark' ? '切换为浅色外观' : '切换为深色外观');
    document.getElementById('appearance-label').textContent = mode === 'dark' ? '深色' : '浅色';
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    document.querySelectorAll('[data-accent]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accent === accent)));
    const heroURL = view === 'tasks' ? `assets/tasks-${mode}-blue.png` : `assets/markdown-${mode}.png`;
    changeImage('hero-screenshot', heroURL, `Todo MD ${mode === 'dark' ? '深色' : '浅色'}${view === 'tasks' ? '待办与子步骤进度' : 'Markdown 阅读'}实际界面，使用演示数据。`);
    changeImage('theme-screenshot', `assets/tasks-${mode}-${accent}.png`, `${names[accent]}主题的 Todo MD ${mode === 'dark' ? '深色' : '浅色'}实际界面，使用演示数据。`);
    document.getElementById('theme-name').textContent = names[accent];
  }
  document.getElementById('appearance-toggle').addEventListener('click', () => {
    preference = theme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('todo-md-site-appearance', preference); } catch (_) {}
    render();
  });
  systemTheme.addEventListener('change', () => {if (!preference) render();});
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {view = button.dataset.view; render();}));
  document.querySelectorAll('[data-accent]').forEach(button => button.addEventListener('click', () => {accent = button.dataset.accent; render();}));
  render();
})();
