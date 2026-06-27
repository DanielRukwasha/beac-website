/* ============================================================
   BEAC – Base en Action | script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Menu mobile ── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('nav ul');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('ouvert');
      navMenu.classList.toggle('ouverte');
      hamburger.setAttribute('aria-expanded', navMenu.classList.contains('ouverte'));
    });

    /* Fermer le menu en cliquant en dehors */
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('ouvert');
        navMenu.classList.remove('ouverte');
      }
    });

    /* Fermer le menu après navigation */
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('ouvert');
        navMenu.classList.remove('ouverte');
      });
    });
  }

  /* ── Lien actif dans la nav ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul li a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page) a.classList.add('actif');
  });

  /* ── Scroll to top ── */
  const btnTop = document.getElementById('scrollTop');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('visible', window.scrollY > 400);
    });
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Animation d'apparition (IntersectionObserver) ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.carte, .organe-carte, .ressource-item, .cat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(el);
  });

  /* ── Navigation des statuts (highlight ancre active) ── */
  const statutsNav = document.querySelector('.statuts-nav');
  if (statutsNav) {
    const sections = document.querySelectorAll('.statuts-content [id]');
    const navLinks = statutsNav.querySelectorAll('a');

    const onScroll = () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('actif-doc', a.getAttribute('href') === '#' + current);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Formulaire de contact ── */
  const form = document.getElementById('formContact');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom    = form.querySelector('#nom').value.trim();
      const email  = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!nom || !email || !message) {
        afficherMessage(form, 'Veuillez remplir tous les champs obligatoires.', 'erreur');
        return;
      }

      /* Mailto de secours */
      const sujet = encodeURIComponent(form.querySelector('#sujet').value || 'Contact BEAC');
      const corps = encodeURIComponent(`Nom: ${nom}\n\n${message}`);
      window.location.href = `mailto:baseenaction.beac@gmail.com?subject=${sujet}&body=${corps}`;
    });
  }

  function afficherMessage(form, texte, type) {
    let alerte = form.querySelector('.alerte-form');
    if (!alerte) {
      alerte = document.createElement('p');
      alerte.className = 'alerte-form';
      alerte.style.cssText = 'padding:.6rem 1rem;border-radius:6px;margin-top:.75rem;font-size:.9rem;';
      form.appendChild(alerte);
    }
    alerte.textContent = texte;
    alerte.style.background = type === 'erreur' ? '#fce8ea' : '#e8f5ee';
    alerte.style.color = type === 'erreur' ? '#7a1f2b' : '#1a5c38';
    alerte.style.border = `1px solid ${type === 'erreur' ? '#7a1f2b' : '#1a5c38'}`;
  }

  /* ── Compteur animé (stats) ── */
  const stats = document.querySelectorAll('.stat-item h3[data-count]');
  if (stats.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(timer);
        }, 30);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(s => countObs.observe(s));
  }
});
