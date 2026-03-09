/* =============================================
   portfolio/js/main.js
   ─ 스크롤 애니메이션
   ─ 스킬 바 애니메이션
   ─ 실시간 차트 (BTC 시뮬레이션)
   ─ GitHub 컨트리뷰션 그리드
   ============================================= */

// ──────────────────────────────────────────────
// 1. 스크롤 애니메이션 (Intersection Observer)
// ──────────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// 스킬 바: Skills 섹션이 보이면 막대 채우기
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          document.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }, 300);
      }
    });
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

// ──────────────────────────────────────────────
// 2. 실시간 차트 (Chart.js + BTC 시뮬레이션)
// ──────────────────────────────────────────────
const chartCanvas = document.getElementById('liveChart');
if (chartCanvas) {
  const ctx = chartCanvas.getContext('2d');
  const LABELS = [];
  const DATA = [];
  let basePrice = 87_500_000; // 초기 BTC 가격 (원) ← 원하면 수정

  // 랜덤워크 함수 (가격 시뮬레이션)
  function randomWalk(prev) {
    return prev + (Math.random() - 0.48) * 300_000;
  }

  // 초기 데이터 30개 생성
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setSeconds(d.getSeconds() - i * 2);
    LABELS.push(d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    basePrice = randomWalk(basePrice);
    DATA.push(Math.round(basePrice));
  }

  const liveChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: LABELS,
      datasets: [{
        label: 'BTC/KRW',
        data: DATA,
        borderColor: '#00e5ff',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#00e5ff',
        fill: true,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(0,229,255,0.15)');
          gradient.addColorStop(1, 'rgba(0,229,255,0)');
          return gradient;
        },
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 300 },
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#10101a',
          borderColor: '#1e1e35',
          borderWidth: 1,
          titleColor: '#64748b',
          bodyColor: '#00e5ff',
          titleFont: { family: 'DM Mono', size: 11 },
          bodyFont: { family: 'DM Mono', size: 12 },
          callbacks: {
            label: (ctx) => '  ₩' + ctx.raw.toLocaleString()
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#1e1e35' },
          ticks: { color: '#64748b', font: { family: 'DM Mono', size: 10 }, maxTicksLimit: 6 },
          border: { color: '#1e1e35' }
        },
        y: {
          grid: { color: '#1e1e35' },
          ticks: {
            color: '#64748b',
            font: { family: 'DM Mono', size: 10 },
            callback: v => '₩' + (v / 1_000_000).toFixed(1) + 'M'
          },
          border: { color: '#1e1e35' }
        }
      }
    }
  });

  // 통계 업데이트 함수
  function updateStats() {
    const cur = DATA[DATA.length - 1];
    const prev = DATA[0];
    const chg = ((cur - prev) / prev * 100).toFixed(2);
    const hi = Math.max(...DATA);
    const lo = Math.min(...DATA);

    document.getElementById('stat-price').textContent = '₩' + cur.toLocaleString();
    const chgEl = document.getElementById('stat-change');
    chgEl.textContent = (chg >= 0 ? '+' : '') + chg + '%';
    chgEl.className = 'stat-value ' + (chg >= 0 ? 'up' : 'down');
    document.getElementById('stat-high').textContent = '₩' + hi.toLocaleString();
    document.getElementById('stat-low').textContent = '₩' + lo.toLocaleString();
  }

  updateStats();

  // 2초마다 새 데이터 추가 ← 간격 바꾸려면 숫자(ms) 수정
  setInterval(() => {
    const now = new Date();
    const label = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newVal = Math.round(randomWalk(DATA[DATA.length - 1]));

    DATA.push(newVal);
    LABELS.push(label);

    // 최대 60개 유지 (오래된 데이터 제거)
    if (DATA.length > 60) { DATA.shift(); LABELS.shift(); }

    liveChart.update('none');
    updateStats();
  }, 2000);
}

// ──────────────────────────────────────────────
// 3. GitHub 컨트리뷰션 그리드 (랜덤 시뮬레이션)
// ──────────────────────────────────────────────
function buildContribGrid() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;

  const levels = ['', 'l1', 'l2', 'l3', 'l4'];

  for (let d = 0; d < 7; d++) {      // 7일(행)
    const row = document.createElement('div');
    row.className = 'contrib-row';

    for (let w = 0; w < 52; w++) {   // 52주(열)
      const cell = document.createElement('div');
      const r = Math.random();
      // 확률 조정: 0=45%, 1=20%, 2=15%, 3=12%, 4=8%
      const lvl = r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4;
      cell.className = 'contrib-cell ' + levels[lvl];
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

buildContribGrid();
