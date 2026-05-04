import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('tech-vix-web');

  private revealObserver!: IntersectionObserver;
  private progObserver!: IntersectionObserver;
  private statsObserver!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.initNavbarScroll();
    this.initRevealAnimations();
    this.initProgressBars();
    this.initSmoothScroll();
    this.initCounters();
    this.initActiveNav();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.progObserver?.disconnect();
    this.statsObserver?.disconnect();
    window.removeEventListener('scroll', this.onScroll);
  }

  // -------------------------
  // NAVBAR SCROLL
  // -------------------------
  onScroll = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };

  initNavbarScroll() {
    window.addEventListener('scroll', this.onScroll);
  }

  // -------------------------
  // SCROLL REVEAL
  // -------------------------
  initRevealAnimations() {
    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    );

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
          this.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => this.revealObserver.observe(el));
  }

  // -------------------------
  // PROGRESS BARS
  // -------------------------
  initProgressBars() {
    const bars = document.querySelectorAll('.prog-fill');

    this.progObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const targetWidth = el.getAttribute('data-width') || '0%';
          el.style.width = targetWidth;
          this.progObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(el => {
      const htmlEl = el as HTMLElement;
      const target = htmlEl.style.width;

      htmlEl.setAttribute('data-width', target);
      htmlEl.style.width = '0%';

      setTimeout(() => {
        htmlEl.style.width = target;
      }, 500);

      this.progObserver.observe(htmlEl);
    });
  }

  // -------------------------
  // SMOOTH SCROLL
  // -------------------------
  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e: any) => {
        const target = document.querySelector(link.getAttribute('href')!);
        if (target) {
          e.preventDefault();
          (target as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // -------------------------
  // COUNTER ANIMATION
  // -------------------------
  animateCounter(el: HTMLElement, target: number, suffix = '') {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        start = target;
        clearInterval(timer);
      }

      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  initCounters() {
    const stats = document.querySelector('.hero-stats');

    if (!stats) return;

    this.statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-num');

          if (nums[0]) this.animateCounter(nums[0] as HTMLElement, 50, '+');
          if (nums[1]) (nums[1] as HTMLElement).textContent = '98%';
          if (nums[2]) this.animateCounter(nums[2] as HTMLElement, 5, '+');

          this.statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.statsObserver.observe(stats);
  }

  // -------------------------
  // ACTIVE NAV
  // -------------------------
  initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const top = (section as HTMLElement).offsetTop;
        if (window.scrollY >= top - 120) {
          current = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        (link as HTMLElement).style.color =
          href === '#' + current ? 'var(--teal-200)' : '';
      });
    });
  }

  // -------------------------
  // FORM SUBMIT
  // -------------------------
  handleSubmit(btn: HTMLButtonElement) {
    btn.textContent = "✓ Message Sent — We'll be in touch soon!";
    btn.style.background = 'linear-gradient(135deg,#059669,#047857)';
    btn.disabled = true;
  }
}