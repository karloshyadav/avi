const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const themeToggle = document.getElementById('theme-toggle');
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav__link');
const revealItems = document.querySelectorAll('.reveal, section .section-shell');
const contactForm = document.querySelector('.contact__form');

// Mobile Menu toggle
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
  });

  navLinks.forEach((link) =>
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Theme Toggle with persistence
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem('avi-theme');

const applyTheme = (theme) => {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark');
    body.classList.remove('light');
    themeToggle.innerHTML = '<i class="uil uil-sun"></i>';
  } else {
    body.classList.add('light');
    body.classList.remove('dark');
    themeToggle.innerHTML = '<i class="uil uil-moon"></i>';
  }
};

applyTheme(storedTheme || (prefersDarkScheme.matches ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('avi-theme', newTheme);
});

prefersDarkScheme.addEventListener('change', (event) => {
  if (!localStorage.getItem('avi-theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// Scroll reveal using IntersectionObserver
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  }
);

revealItems.forEach((item) => observer.observe(item));

// Header state on scroll
const handleScroll = () => {
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll);
handleScroll();

// Active link tracking
const sectionElements = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  },
  {
    threshold: 0.6,
  }
);

sectionElements.forEach((section) => navObserver.observe(section));

// Contact form feedback (non-submitting for demo)
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactForm.classList.add('sent');
    const button = contactForm.querySelector('button');
    button.classList.add('button--success');
    setTimeout(() => {
      button.classList.remove('button--success');
      contactForm.reset();
      contactForm.classList.remove('sent');
    }, 2000);
  });
}

// Particle background enhancement for retina devices
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particlesArray = [];
  const particleCount = 140;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(ratio, ratio);
  };

  resizeCanvas();

  window.addEventListener('resize', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    resizeCanvas();
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.radius = Math.random() * 2 + 1;
      this.dx = (Math.random() - 0.5) * 0.7;
      this.dy = (Math.random() - 0.5) * 0.7;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(45, 123, 255, 0.75)';
      ctx.fill();
    }

    update() {
      if (this.x > window.innerWidth || this.x < 0) this.dx *= -1;
      if (this.y > window.innerHeight || this.y < 0) this.dy *= -1;
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i += 1) {
    particlesArray.push(new Particle());
  }

  const connectParticles = () => {
    for (let a = 0; a < particlesArray.length; a += 1) {
      for (let b = a + 1; b < particlesArray.length; b += 1) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 110) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(45, 123, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => particle.update());
    connectParticles();
    requestAnimationFrame(animate);
  };

  animate();
}
