// ══════════════════════════════════════
  // ORG CHART SCROLL ANIMATION
  // ══════════════════════════════════════
  const orgChart = document.getElementById('orgChart');

  function animateOrgChart() {
    // Animate all lines and nodes with their data-delay
    const vlines   = orgChart.querySelectorAll('.fc-vline');
    const hlines   = orgChart.querySelectorAll('.fc-hline');
    const hlinesm  = orgChart.querySelectorAll('.fc-hline-sm');
    const nodes    = orgChart.querySelectorAll('.fc-node');
    const memCols  = orgChart.querySelectorAll('.org-member-col');

    vlines.forEach(el => {
      const d0 = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('drawn'), d0);
    });
    hlines.forEach(el => {
      const d1 = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('drawn'), d1);
    });
    hlinesm.forEach(el => {
      const d2 = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('drawn'), d2);
    });
    nodes.forEach(el => {
      const d3 = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('drawn'), d3);
    });
    memCols.forEach((el, i) => {
      setTimeout(() => el.classList.add('drawn'), 600 + i * 30);
    });
  }

  // Trigger when section enters viewport
  const orgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateOrgChart();
        orgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  if (orgChart) orgObserver.observe(orgChart);

  // ══════════════════════════════════════
  // DARK THEME
  // ══════════════════════════════════════
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel  = document.getElementById('themeLabel');

  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeToggle.classList.toggle('on', dark);
    themeLabel.textContent = dark ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('ecell-theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    applyTheme(!document.body.classList.contains('dark'));
  }

  // Apply saved theme on load
  if (localStorage.getItem('ecell-theme') === 'dark') applyTheme(true);


  // ══════════════════════════════════════
  // CONTACT FORM — Web3Forms
  // ══════════════════════════════════════
  async function submitContactForm() {
    const name    = document.getElementById('cfName').value.trim();
    const email   = document.getElementById('cfEmail').value.trim();
    const subject = document.getElementById('cfSubject').value;
    const message = document.getElementById('cfMessage').value.trim();
    const btn     = document.getElementById('cfSubmitBtn');
    const success = document.getElementById('cfSuccess');
    const errBox  = document.getElementById('cfError');

    // Validation
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before sending!');
      return;
    }
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    // Loading state
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    success.classList.remove('show');
    errBox.style.display = 'none';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: document.getElementById('cfAccessKey').value,
          name:    name,
          email:   email,
          subject: '[E-Cell GEC Rewa] ' + subject + ' — from ' + name,
          message: message,
          from_name: 'E-Cell GEC Rewa Website',
        })
      });

      const data = await res.json();

      if (data.success) {
        // Clear form
        document.getElementById('cfName').value    = '';
        document.getElementById('cfEmail').value   = '';
        document.getElementById('cfSubject').value = '';
        document.getElementById('cfMessage').value = '';
        // Show success
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 6000);
      } else {
        errBox.style.display = 'block';
        setTimeout(() => errBox.style.display = 'none', 5000);
      }
    } catch (err) {
      errBox.style.display = 'block';
      setTimeout(() => errBox.style.display = 'none', 5000);
    }

    // Reset button
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    btn.style.opacity = '1';
  }

  // ══════════════════════════════════════
  // LIGHTBOX
  // ══════════════════════════════════════
  // Image srcs are read from the DOM photo-card imgs (no base64 in JS)
  const lbMeta = [
    { title: 'E-Cell Team',          sub: 'The crew behind it all 💙' },
    { title: 'Event Day',            sub: 'Students packed the auditorium' },
    { title: 'Illuminate',           sub: '21 November · Ideas in the spotlight' },
    { title: 'Squad Goals',          sub: 'REC Frame — the whole gang ✊' },
    { title: 'Full House',           sub: 'Every member, one frame 🙌' },
    { title: 'E-Cell IIT Bombay',    sub: 'Creating Job Creators since 1998' },
    { title: 'The Stage',            sub: 'Before the curtain rises 🎭' },
    { title: 'E-Summit Night Gate',  sub: 'Deciphering the Labyrinth 🌐' },
    { title: '10 Minute Million',    sub: "India's first on-spot funding event ⚡" },
    { title: 'IIT Bombay Campus',    sub: 'Where the ecosystem breathes 🌿' },
    { title: 'E-Cell Member',        sub: 'Focused & dedicated 💙' },
    { title: 'Gold Passes',          sub: 'Welcome to the 21st E-Summit 🏅' },
    { title: 'Workshop Session',     sub: 'Learning from the best minds 🎓' },
    { title: 'Eureka! IIT Bombay',   sub: 'Where ideas come to life ✨' },
    { title: 'E-Summit Day Gate',    sub: 'Deciphering the Labyrinth — IIT Bombay 🌟' },
  ];
  // Build lbData by pulling src from each photo-card img in DOM order
  const lbData = Array.from(document.querySelectorAll('.photo-card img')).map((img, i) => ({
    src:   img.src,
    title: (lbMeta[i] || {}).title || '',
    sub:   (lbMeta[i] || {}).sub   || '',
  }));

  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbTitle   = document.getElementById('lbTitle');
  const lbSub     = document.getElementById('lbSub');
  const lbCounter = document.getElementById('lbCounter');
  const lbWrap    = lb.querySelector('.lb-img-wrap');
  let lbCurrent   = 0;

  // Build dots
  lbData.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'lb-dot' + (i === 0 ? ' active' : '');
    lbCounter.appendChild(d);
  });

  function updateDots(i) {
    document.querySelectorAll('.lb-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  function openLightbox(idx) {
    lbCurrent = idx;
    lbWrap.classList.add('loading');
    lbImg.src = lbData[idx].src;
    lbTitle.textContent = lbData[idx].title;
    lbSub.textContent   = lbData[idx].sub;
    updateDots(idx);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbImg.onload = () => lbWrap.classList.remove('loading');
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function closeLightboxOutside(e) {
    if (e.target === lb || e.target.classList.contains('lb-backdrop')) closeLightbox();
  }

  function lbNav(dir) {
    lbCurrent = (lbCurrent + dir + lbData.length) % lbData.length;
    lbWrap.classList.add('switching', 'loading');
    setTimeout(() => {
      lbImg.src       = lbData[lbCurrent].src;
      lbTitle.textContent = lbData[lbCurrent].title;
      lbSub.textContent   = lbData[lbCurrent].sub;
      updateDots(lbCurrent);
      lbWrap.classList.remove('switching');
      lbImg.onload = () => lbWrap.classList.remove('loading');
    }, 220);
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft')  lbNav(-1);
  });

  // Touch swipe in lightbox
  let lbTouchX = 0;
  lbWrap.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, {passive:true});
  lbWrap.addEventListener('touchend',   e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) lbNav(diff > 0 ? 1 : -1);
  });

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
// ══════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════
function toggleMenu() {
  const nav  = document.getElementById('navLinks');
  const btn  = document.getElementById('hamburger');
  nav.classList.toggle('mobile-open');
  btn.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('mobile-open');
  document.getElementById('hamburger').classList.remove('open');
}
// Close menu when clicking outside
document.addEventListener('click', function(e) {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('hamburger');
  if (nav && btn && !nav.contains(e.target) && !btn.contains(e.target)) {
    closeMenu();
  }
});
// Close menu on scroll
window.addEventListener('scroll', closeMenu, { passive: true });
document.addEventListener("DOMContentLoaded", () => {
    // Select all photo cards within your photo grid
    const photoCards = document.querySelectorAll('.photo-grid .photo-card');
    const maxVisible = 6;

    // Check if there are more than 6 photos
    if (photoCards.length > maxVisible) {
        // Calculate how many extra photos there are
        const extraPhotosCount = photoCards.length - maxVisible;

        // Hide all cards from the 7th onwards
        photoCards.forEach((card, index) => {
            if (index >= maxVisible) {
                card.style.display = 'none';
            }
        });

        // Target the 6th card (index 5)
        const sixthCard = photoCards[maxVisible - 1];
        
        // Ensure the 6th card can contain the absolute overlay properly
        sixthCard.style.position = 'relative'; 

        // Create the "+N" overlay element
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('more-photos-overlay');
        overlayDiv.innerText = `+${extraPhotosCount}`;

        // Append the overlay to the 6th card
        sixthCard.appendChild(overlayDiv);
    }
});
function toggleDropdown(element) {
    // 1. Kis event par click hua hai usko dhoondo
    const clickedItem = element.closest('.event-item');
    
    // 2. Page par jitne bhi event items hain sabko select karo
    const allItems = document.querySelectorAll('.event-item');
    
    // 3. Sab items ko check karo
    allItems.forEach(item => {
        // Agar wo item wo nahi hai jispar humne abhi click kiya hai...
        if (item !== clickedItem) {
            // ...toh uski 'active' class hata do (usko close kar do)
            item.classList.remove('active');
        }
    });
    
    // 4. Finally, jispar click kiya hai usko open ya close karo
    clickedItem.classList.toggle('active');
}