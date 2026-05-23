const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(
  path.join(__dirname, 'worldcup_matchs.json'),
  'utf8'
);
const data = JSON.parse(raw);

function toUtcIcs(dateStr, timeStr) {
  const m = timeStr.match(/(\d{2}):(\d{2})\s+UTC([+-]\d+)/);
  if (!m) return null;

  let h = parseInt(m[1]);
  let min = parseInt(m[2]);
  const offset = parseInt(m[3]);

  let totalMin = h * 60 + min - offset * 60;

  let dayOffset = 0;
  while (totalMin < 0) { totalMin += 1440; dayOffset--; }
  while (totalMin >= 1440) { totalMin -= 1440; dayOffset++; }

  const [y, mo, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, mo - 1, d + dayOffset);

  const utcH = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const utcM = String(totalMin % 60).padStart(2, '0');

  return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}T${utcH}${utcM}00Z`;
}

// Generate DTSTAMP in ICS format from current time
function nowStamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
}

const stamp = nowStamp();

const ics = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//WorldCup Calendar 2026//worldcup-calendar-2026.web.app//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
  'X-PUBLISHED-TTL:PT6H',
  'X-WR-CALNAME:Copa Mundial FIFA 2026',
  'X-WR-TIMEZONE:UTC',
  'X-WR-CALDESC:Los 104 partidos del Mundial 2026',
];

let matchIndex = 1;
for (const match of data.matches) {
  const dtstart = toUtcIcs(match.date, match.time);
  if (!dtstart) {
    console.warn(`Skipping unparseable: ${match.date} ${match.time}`);
    continue;
  }

  const sy = parseInt(dtstart.slice(0, 4));
  const sm = parseInt(dtstart.slice(4, 6)) - 1;
  const sd = parseInt(dtstart.slice(6, 8));
  const sh = parseInt(dtstart.slice(9, 11));
  const smin = parseInt(dtstart.slice(11, 13));

  const start = new Date(Date.UTC(sy, sm, sd, sh, smin));
  const end = new Date(start.getTime() + 105 * 60 * 1000); // 1h45m like FotMob
  const dtend = end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');

  const team1 = match.team1 || 'TBD';
  const team2 = match.team2 || 'TBD';
  const round = match.round || '';
  const group = match.group || '';
  const ground = match.ground || '';
  const num = match.num || '';

  const summary = `${team1} vs ${team2}`;
  let description = 'Copa Mundial FIFA 2026';
  if (round) description += `\\n${round}`;
  if (group) description += ` - ${group}`;
  if (num) description += `\\nPartido #${num}`;
  if (ground) description += `\\n${ground}`;

  ics.push('BEGIN:VEVENT');
  ics.push(`CLASS:PUBLIC`);
  ics.push(`DESCRIPTION:${description}`);
  ics.push(`DTEND:${dtend}`);
  ics.push(`DTSTAMP:${stamp}`);
  ics.push(`DTSTART:${dtstart}`);
  ics.push(`LAST-MODIFIED:${stamp}`);
  ics.push(`SEQUENCE:0`);
  ics.push(`SUMMARY:${summary}`);
  ics.push(`TRANSP:TRANSPARENT`);
  ics.push(`UID:wc2026-match-${matchIndex}@worldcup-calendar-2026.web.app`);
  if (ground) {
    ics.push(`LOCATION:${ground}`);
  }
  ics.push('END:VEVENT');

  matchIndex++;
}

ics.push('END:VCALENDAR');

const outPath = path.join(__dirname, 'worldcup_2026_v2.ics');
fs.writeFileSync(outPath, ics.join('\r\n') + '\r\n', 'utf8');

const groupCounts = {};
for (const m of data.matches) {
  const r = m.round || 'Knockout';
  groupCounts[r] = (groupCounts[r] || 0) + 1;
}