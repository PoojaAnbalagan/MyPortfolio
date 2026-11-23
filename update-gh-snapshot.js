// Usage: node update-gh-snapshot.js [username] [year]
// Saves gh-snapshot.json next to index.html; the page uses it only if the live API is unreachable.
const user = process.argv[2] || 'PoojaAnbalagan';
const year = process.argv[3] || new Date().getFullYear();
(async () => {
  const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=${year}`);
  if (!r.ok) throw new Error('API returned ' + r.status);
  const j = await r.json();
  const days = j.contributions.map(x => ({ d: x.date, c: x.count, l: Math.max(0, Math.min(4, x.level | 0)) }));
  const total = (j.total && j.total[year]) || days.reduce((a, x) => a + x.c, 0);
  require('fs').writeFileSync('gh-snapshot.json', JSON.stringify({ total, days }));
  console.log(`Saved ${days.length} days, ${total} contributions`);
})().catch(e => { console.error(e.message); process.exit(1); });
