// ---------------------------
// Write.as Custom JavaScript
// Imported from https://write.as/skew/
// ---------------------------

// Respect user's reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('scroll-behavior','auto');
}

// Add target=_blank to external links for security and UX
document.querySelectorAll('a[href^="http"]').forEach(a=>{
  if(!a.href.includes(location.host)){ a.target='_blank'; a.rel='noopener'; }
});

// Add Phosphor Infinity icon to blog title
document.addEventListener('DOMContentLoaded', function () {
  const title = document.querySelector('h1#blog-title');
  if (!title) return;

  // Create SVG wrapper
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 0 256 256');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.verticalAlign = '-4px';
  svg.style.marginRight = '8px';
  svg.style.fill = '#64ffda'; // accent color matching theme

  // Add Phosphor Infinity path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M252,128a60,60,0,0,1-102.43,42.43l-.49-.53L89.22,102.31a36,36,0,1,0,0,51.38l3.08-3.48a12,12,0,1,1,18,15.91l-3.35,3.78-.49.53a60,60,0,1,1,0-84.86l.49.53,59.86,67.59a36,36,0,1,0,0-51.38l-3.08,3.48a12,12,0,1,1-18-15.91l3.35-3.78.49-.53A60,60,0,0,1,252,128Z'
  );
  svg.appendChild(path);

  // Insert icon before title text
  title.insertBefore(svg, title.firstChild);
});
