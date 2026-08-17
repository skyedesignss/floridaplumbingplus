// Initialize AOS
AOS.init({
    duration: 900,
    once: true,      
    offset: 80,
    easing: 'ease-out-cubic'
});

function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');

    if (!header || !hamburger || !drawer) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    const currentPage = location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    hamburger.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            drawer.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', e => {
        if (!header.contains(e.target) && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('headerLoaded', initHeader);


(function () {
  const section = document.querySelector('.hiw-section');
  if (!section) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    section.classList.add('in-view');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        observer.disconnect(); 
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();


// ==================== SERVICE AREAS PAGE ====================


// ---- FAQ Accordion ----
function initFAQ() {
    const items = document.querySelectorAll('.sa-faq-item');
    if (!items.length) return;

    items.forEach(item => {
        const btn = item.querySelector('.sa-faq-q');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            items.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.sa-faq-q')?.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


// ---- Stats Counter Animation ----
function animateCounter(el, target, duration = 1500) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * (target - startVal) + startVal);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }

    requestAnimationFrame(step);
}

function initStatsCounters() {
    const statNums = document.querySelectorAll('.sa-stat-num[data-target]');
    if (!statNums.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNums.forEach(el => observer.observe(el));
}


// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initStatsCounters();
});

// ==================== SCROLL INDICATOR ====================

function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    const progressBar = document.getElementById('scrollProgress');
    const scrollBtn = document.getElementById('scrollBtn');
    const scrollText = document.getElementById('scrollText');

    if (!indicator || !progressBar || !scrollBtn || !scrollText) return;

    let hideTimer;
    let lastScrollY = window.scrollY;

    function showIndicator() {
        indicator.classList.add('visible');

        clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 5000); // Hide after 5 seconds
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        progressBar.style.height = `${Math.min(progress, 100)}%`;
    }

    function updateDirection() {
        const currentScroll = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        // Near bottom
        if (currentScroll >= docHeight - 200) {
            scrollText.textContent = 'Scroll Up';
        }
        // Scrolling up
        else if (currentScroll < lastScrollY) {
            scrollText.textContent = 'Scroll Up';
        }
        // Scrolling down
        else {
            scrollText.textContent = 'Scroll Down';
        }

        lastScrollY = currentScroll;
    }

    function shouldShowIndicator() {
        // Show only after user reaches second section
        return window.scrollY > 350;
    }

    function handleScroll() {
        updateProgress();
        updateDirection();

        if (shouldShowIndicator()) {
            showIndicator();
        } else {
            indicator.classList.remove('visible');
        }
    }

    // Button click
    scrollBtn.addEventListener('click', () => {

        const direction = scrollText.textContent;

        if (direction === 'Scroll Up') {

            window.scrollBy({
                top: -window.innerHeight,
                behavior: 'smooth'
            });

        } else {

            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });

        }

    });

    // Scroll event
    window.addEventListener('scroll', handleScroll, {
        passive: true
    });

    // Initial state
    updateProgress();
    updateDirection();

    if (window.scrollY > 350) {
        showIndicator();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initScrollIndicator);







// ==================== SERVICES DATA (Homepage) ====================
const services = [
    { 
        icon: "fas fa-wrench", 
        title: "Residential Plumbing", 
        desc: "Our residential plumbing contractors handle full services, from leaking water heater repairs to kitchen and bathroom plumbing, fixture work, and more throughout Melbourne and Brevard County.", 
        slug: "residential-plumbing" 
    },
    { 
        icon: "fas fa-water", 
        title: "Drain & Sewer", 
        desc: "Keep your sewer lines and water lines flowing properly. We clear clogs, repair main lines, and handle sewer drain replacements with straightforward pricing and the latest technology.", 
        slug: "drain-sewer" 
    },
    { 
        icon: "fas fa-fire", 
        title: "Water Heater Services", 
        desc: "Water heater repair and installation, including tankless water heater repair and installation. We provide same-day service when you need hot water restored quickly.", 
        slug: "water-heaters" 
    },
    { 
        icon: "fas fa-building", 
        title: "Commercial Plumbing", 
        desc: "Reliable commercial plumbing services for businesses across Melbourne, FL and the surrounding areas. From repairs to larger projects, our team is ready to help.", 
        slug: "commercial-plumbing" 
    },
    { 
        icon: "fas fa-filter", 
        title: "Water Filtration & Softeners", 
        desc: "Whole house water filtration system installations and water softener replacement. Improve water quality and protect your plumbing with professional solutions.", 
        slug: "water-filtration" 
    },
    { 
        icon: "fas fa-home", 
        title: "Whole House Repiping", 
        desc: "Whole house repiping and sewer line replumbing services. We replace aged piping and handle major projects with professionalism and care for your home.", 
        slug: "repiping" 
    }
];

// ==================== RENDER ====================
function renderServices() {
    const grid = document.getElementById('services');
    if (!grid) return;

    grid.innerHTML = services.map((service, index) => `
        <div class="svc-card" data-aos="fade-up" data-aos-delay="${index * 70}">
            <div class="svc-icon-wrap">
                <i class="${service.icon}"></i>
            </div>
            <div class="svc-card-body">
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
            <a href="services.html#${service.slug}" class="svc-link">
                Learn more <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderServices);

// ==================== TESTIMONIALS ====================

const testimonials = [
    {
        text: "David and his crew did an amazing job replumb my aged cast-iron piping under the house. Their pricing and professionalism was excellent. The work was completed in a timely fashion. I would highly recommend them to anyone who needs any plumbing work from small to giant jobs done at their home.",
        name: "Scott Vickers",
        location: "Melbourne, FL",
        photo: "assets/images/testimonial_img.webp"
    },
    {
        text: "Great service! Solomon and Sebestian were very nice and professional. Definitely would recommend them.",
        name: "Ben Corbisiero",
        location: "Brevard County",
        photo: "assets/images/testimonial_img.webp"
    },
    {
        text: "Florida Plumbing Plus has been my plumbing company for the last 5 years. David the owner operator is a professional plumber who is very personable and takes his trade to the next level. As a multiple property owner David has performed jobs from lift pumps to water purification systems, clogged drains and septic connections. Florida Plumbing Plus is my go to plumbing company.",
        name: "Frank Campana",
        location: "Melbourne, FL",
        photo: "assets/images/testimonial_img.webp"
    }
];

let currentIndex = 0;
let autoSlide;
let isMobile = window.innerWidth < 768;

// ---- Helpers ----

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function buildCard(t) {
    const avatarHTML = t.photo
        ? `<img src="${t.photo}" alt="${t.name}" class="testi-photo" onerror="this.replaceWith(buildAvatarEl('${getInitials(t.name)}'))">`
        : `<div class="testi-avatar">${getInitials(t.name)}</div>`;

    return `
        <div class="testi-card">
            <span class="testi-quote-mark" aria-hidden="true">"</span>
            <p class="testi-text">${t.text}</p>
            <div class="testi-stars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <div class="testi-author">
                ${avatarHTML}
                <div class="testi-author-info">
                    <span class="testi-name">${t.name}</span>
                    <span class="testi-location">
                        <i class="fas fa-map-marker-alt"></i> ${t.location}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Fallback avatar element builder (called from onerror inline)
function buildAvatarEl(initials) {
    const el = document.createElement('div');
    el.className = 'testi-avatar';
    el.textContent = initials;
    return el;
}
window.buildAvatarEl = buildAvatarEl;

// ---- Render ----

function renderTestimonials() {
    const track = document.getElementById('testimonial-slider');
    if (!track) return;

    track.innerHTML = testimonials.map(t => buildCard(t)).join('');
    buildDots();
    updateSlider();
}

// ---- Dots ----

function buildDots() {
    const dotsWrap = document.getElementById('testi-dots');
    if (!dotsWrap) return;

    dotsWrap.innerHTML = testimonials.map((_, i) => `
        <button class="testi-dot${i === 0 ? ' active' : ''}" aria-label="Go to review ${i + 1}"></button>
    `).join('');

    dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetAutoSlide();
        });
    });
}

function updateDots() {
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// ---- Slider movement (mobile only) ----

function updateSlider() {
    if (!isMobile) return;

    const track = document.getElementById('testimonial-slider');
    if (!track) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    updateDots();
}

// ---- Navigation ----

function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateSlider();
}

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 6000);
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}


function handleResize() {
    const wasDesktop = !isMobile;
    isMobile = window.innerWidth < 768;

    const track = document.getElementById('testimonial-slider');
    const controls = document.getElementById('testi-controls');

    if (track && controls) {
        if (!isMobile) {
            track.style.transform = '';
            controls.style.display = 'none';
            clearInterval(autoSlide);
        } else {
            controls.style.display = '';
            updateSlider();
            if (wasDesktop) startAutoSlide();
        }
    }
}

// ---- Init ----

function initTestimonials() {
    renderTestimonials();

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    if (isMobile) startAutoSlide();

    window.addEventListener('resize', handleResize, { passive: true });

    const sliderWrap = document.querySelector('.testi-slider-wrap');
    if (sliderWrap) {
        let touchStartX = 0;
        sliderWrap.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        sliderWrap.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? nextSlide() : prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', initTestimonials);

// ==================== FAQ ACCORDION ====================
const faqs = [
    {
        q: "Do you offer same-day plumbing service?",
        a: "Yes. We offer same-day services for your convenience. When you need a water heater replacement or other urgent repair, we work to get it done quickly."
    },
    {
        q: "What plumbing services do you provide?",
        a: "We handle residential and commercial plumbing services including water heater repair and installation, tankless water heaters, water line repair and installation, kitchen plumbing, bathroom remodeling, slab leak repair, water softener replacement, water filtration systems, drain and sewer work, whole house repiping, and more."
    },
    {
        q: "Do you offer straightforward pricing?",
        a: "Yes. We offer straightforward pricing to avoid any confusion on your bill later. Our goal is clear, honest pricing on all services."
    },
    {
        q: "What areas do you serve?",
        a: "We serve Melbourne, FL, Brevard County, Satellite Beach, Indian Harbour Beach, Indialantic, Melbourne Beach, Cocoa Beach, Suntree, Viera, Rockledge, West Melbourne, and the surrounding areas."
    },
    {
        q: "Are you a local company?",
        a: "Yes. We are a family-owned and operated company. Helping our neighbors throughout the Space Coast is our priority."
    },
    {
        q: "What is your license number?",
        a: "Florida Plumbing Plus, Inc. is licensed under CFC1428154."
    },
    {
        q: "Do you handle commercial plumbing?",
        a: "Yes. We provide commercial plumbing services along with full residential plumbing for homes throughout Brevard County."
    },
    {
        q: "How can I request service?",
        a: "Call us at 321-446-0162 or schedule online. Speak with our helpful customer service reps and book your appointment. We provide same-day services when available."
    }
];

function renderFAQs() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item" data-aos="fade-up" data-aos-delay="${index * 70}">
            <button class="faq-question" aria-expanded="false">
                <span class="faq-num">0${index + 1}</span>
                <span class="faq-q-text">${faq.q}</span>
                <i class="fas fa-plus" aria-hidden="true"></i>
            </button>
            <div class="faq-answer" role="region">
                <p>${faq.a}</p>
            </div>
        </div>
    `).join('');

    // Accordion logic — one open at a time
    container.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            container.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderFAQs);

// ==================== SERVICES PAGE — ALL SERVICES ====================
const allServices = [
    { 
        icon: "fas fa-wrench", 
        title: "Residential Plumbing", 
        desc: "Full residential plumbing services from leaking water heater repairs to fixture work, kitchen plumbing, and more for homes in Melbourne and Brevard County.", 
        slug: "residential-plumbing" 
    },
    { 
        icon: "fas fa-water", 
        title: "Drain & Sewer", 
        desc: "Sewer line and drain services including clog clearing, main water line repairs, and sewer drain replacements. We keep your lines flowing properly.", 
        slug: "drain-sewer" 
    },
    { 
        icon: "fas fa-fire", 
        title: "Water Heater Repair & Installation", 
        desc: "Water heater repair and installation for traditional tanks. Same-day service available when you need hot water restored quickly.", 
        slug: "water-heaters" 
    },
    { 
        icon: "fas fa-bolt", 
        title: "Tankless Water Heater Services", 
        desc: "Tankless water heater repair, installation, and replacement. Efficient solutions with professional installation and straightforward pricing.", 
        slug: "tankless-water-heaters" 
    },
    { 
        icon: "fas fa-building", 
        title: "Commercial Plumbing", 
        desc: "Reliable commercial plumbing services for businesses throughout Melbourne, FL and the surrounding Space Coast areas.", 
        slug: "commercial-plumbing" 
    },
    { 
        icon: "fas fa-home", 
        title: "Whole House Repiping", 
        desc: "Whole house repiping services to replace aged piping and restore reliable water flow throughout your home.", 
        slug: "repiping" 
    },
    { 
        icon: "fas fa-bath", 
        title: "Bathroom Remodeling", 
        desc: "Bathroom remodeling including shower, tub, toilet, sink, faucets, and fixtures. Quality workmanship for your renovation project.", 
        slug: "bathroom-remodeling" 
    },
    { 
        icon: "fas fa-sink", 
        title: "Kitchen Plumbing", 
        desc: "Kitchen plumbing services for sinks, faucets, and garbage disposals. Reliable repairs and installations for your kitchen.", 
        slug: "kitchen-plumbing" 
    },
    { 
        icon: "fas fa-tint", 
        title: "Water Line Repair & Installation", 
        desc: "Water line repair and installation services to fix leaks, replace damaged lines, and ensure proper water delivery to your property.", 
        slug: "water-line" 
    },
    { 
        icon: "fas fa-filter", 
        title: "Water Filtration Systems", 
        desc: "Whole house water filtration system installations to improve water quality and protect your plumbing and appliances.", 
        slug: "water-filtration" 
    },
    { 
        icon: "fas fa-droplet", 
        title: "Water Softener Replacement", 
        desc: "Water softener replacement services to help reduce scale buildup and improve water quality in your home.", 
        slug: "water-softener" 
    },
    { 
        icon: "fas fa-search", 
        title: "Slab Leak Repair", 
        desc: "Slab leak repair to locate and fix leaks under your foundation before they cause major damage to your home.", 
        slug: "slab-leak-repair" 
    }
];

function renderAllServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = allServices.map((service, index) => `
        <div class="svc-card" data-aos="fade-up" data-aos-delay="${index * 55}">
            <div class="svc-icon-wrap">
                <i class="${service.icon}"></i>
            </div>
            <div class="svc-card-body">
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
            <a href="services/${service.slug}.html" class="svc-link">
                Learn more <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderAllServices);

// ==================== CONTACT PAGE ====================

const commonIssues = [
    "Emergency Leak", "No Hot Water", "Clogged Drain", "Burst Pipe",
    "Toilet Not Flushing", "Water Heater Issue", "Low Water Pressure",
    "Garbage Disposal Jam", "Sewer Backup", "Bathroom Remodel",
    "Commercial Job", "Other"
];

function renderIssueOptions() {
    const container = document.getElementById('issue-options');
    if (!container) return;

    container.innerHTML = commonIssues.map(issue => `
        <div class="ct-issue-chip" data-issue="${issue}" role="button" tabindex="0" aria-pressed="false">
            ${issue}
        </div>
    `).join('');

    container.querySelectorAll('.ct-issue-chip').forEach(chip => {
        chip.addEventListener('click', () => toggleChip(chip));
        chip.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChip(chip);
            }
        });
    });
}

function toggleChip(chip) {
    const pressed = chip.classList.toggle('active');
    chip.setAttribute('aria-pressed', String(pressed));
}

// ---- Form submission ----
function initContactForm() {
    const form     = document.getElementById('contact-form');
    const btn      = document.getElementById('ct-submit');
    const success  = document.getElementById('ct-success');
    const error    = document.getElementById('ct-error');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name  = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        if (!name || !phone) {
            highlightEmpty(['name', 'phone']);
            return;
        }

        const selectedIssues = Array.from(
            document.querySelectorAll('.ct-issue-chip.active')
        ).map(el => el.dataset.issue);

        const formData = {
            name,
            phone,
            email:   document.getElementById('email').value.trim(),
            issues:  selectedIssues.join(', '),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };

        setLoading(btn, true);
        success.classList.remove('show');
        error.classList.remove('show');

        const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            success.classList.add('show');
            form.reset();
            document.querySelectorAll('.ct-issue-chip.active').forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            });

        } catch (err) {
            error.classList.add('show');
            console.error('Form submission error:', err);

        } finally {
            setLoading(btn, false);
            (success.classList.contains('show') ? success : error)
                .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function setLoading(btn, isLoading) {
    btn.classList.toggle('loading', isLoading);
    btn.disabled = isLoading;
}

function highlightEmpty(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
            el.style.borderColor = '#ef4444';
            el.addEventListener('input', () => {
                el.style.borderColor = '';
            }, { once: true });
        }
    });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    renderIssueOptions();
    initContactForm();
});

// ==================== REVIEWS PAGE ====================
const reviews = [
    {
        text: "Excellent service!",
        name: "Cathy McKeone",
        location: "Melbourne, FL",
        stars: 5,
        platform: "google",
        date: "3 days ago"
    },
    {
        text: "David and his crew did an amazing job replumb my aged cast-iron piping under the house. Their pricing and professionalism was excellent. The work was completed in a timely fashion. I would highly recommend them to anyone who needs any plumbing work from small to giant jobs done at their home.",
        name: "Scott Vickers",
        location: "Melbourne, FL",
        stars: 5,
        platform: "google",
        date: "6 days ago"
    },
    {
        text: "Great service! Solomon and Sebestian were very nice and professional. Definitely would recommend them.",
        name: "Ben Corbisiero",
        location: "Brevard County",
        stars: 5,
        platform: "google",
        date: "7 days ago"
    },
    {
        text: "Florida Plumbing Plus has been my plumbing company for the last 5 years. David the owner operator is a professional plumber who is very personable and takes his trade to the next level. As a multiple property owner David has performed jobs from lift pumps to water purification systems, clogged drains and septic connections. Florida Plumbing Plus is my go to plumbing company.",
        name: "Frank Campana",
        location: "Melbourne, FL",
        stars: 5,
        platform: "google",
        date: "9 days ago"
    },
    {
        text: "Thanks for always showing and doing a great job! Appreciated Solomon’s expertise!",
        name: "Viv Light",
        location: "Brevard County",
        stars: 5,
        platform: "google",
        date: "10 days ago"
    },
    {
        text: "My wife and me live in a 69 year old beachside house that has cast iron and copper pipes still in place. Dave is the owner of Florida Plumbing Plus and came to our house to check things out. Dave is a Master Plumber, his knowledge and approach to resolve our issues left us feeling like we had called the right guy! He made recommendations, offered solutions, and talked to us about how and why he would choose one over the other. His team came to the house, all were perfect gentlemen, very respectful of us and our home. They worked, made repairs to replace original plumbing with latest products, cleaned up all areas where they had to get into walls, behind cabinets, behind washers and dryers, etc. He had provided us with a well documented estimate and cost. Did a huge amount of work in one day, and now we have peace of mind that our plumbing concerns are behind us. I highly recommend this business! They are a great bunch of men, and you are treated with respect. They will leave you feeling like you did indeed choose the right company to fix your plumbing problem.",
        name: "Steve Smith",
        location: "Melbourne, FL",
        stars: 5,
        platform: "google",
        date: "10 days ago"
    },
    {
        text: "Great work at a good price. Very thorough.",
        name: "James Fidler",
        location: "Brevard County",
        stars: 5,
        platform: "google",
        date: "12 days ago"
    },
    {
        text: "The guys showed on time. They were very professional and know what they needed to do. They cleaned up after themselves.",
        name: "Larry Vincent",
        location: "Melbourne, FL",
        stars: 5,
        platform: "google",
        date: "12 days ago"
    }
];

// How many to show initially and per load-more click
const INITIAL_SHOW = 6;
const LOAD_MORE_COUNT = 3;

let activeFilter = 'all';
let visibleCount = INITIAL_SHOW;

// ---- Helpers ----

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function buildStars(count) {
    return Array(count).fill('<i class="fas fa-star"></i>').join('');
}

function buildCard(review) {
    const platformLabel = review.platform === 'google' ? 'Google' : 'Yelp';
    return `
        <div class="rv-card" data-platform="${review.platform}" data-stars="${review.stars}">
            <span class="rv-card-quote" aria-hidden="true">"</span>
            <div class="rv-card-stars">${buildStars(review.stars)}</div>
            <p class="rv-card-text">${review.text}</p>
            <div class="rv-card-author">
                <div class="rv-avatar">${getInitials(review.name)}</div>
                <div class="rv-author-info">
                    <span class="rv-author-name">${review.name}</span>
                    <span class="rv-author-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${review.location} · ${review.date}
                    </span>
                </div>
                <span class="rv-platform-badge ${review.platform}">
                    <i class="fab fa-${review.platform}"></i>
                    ${platformLabel}
                </span>
            </div>
        </div>
    `;
}

// ---- Render ----

function getFilteredReviews() {
    return reviews.filter(r => {
        if (activeFilter === 'all') return true;
        if (activeFilter === '5') return r.stars === 5;
        return r.platform === activeFilter;
    });
}

function renderGrid() {
    const grid = document.getElementById('rv-grid');
    const loadBtn = document.getElementById('rv-load-more');
    if (!grid) return;

    const filtered = getFilteredReviews();
    const toShow = filtered.slice(0, visibleCount);

    grid.innerHTML = toShow.map(r => buildCard(r)).join('');

    // Show/hide load more button
    if (loadBtn) {
        if (visibleCount >= filtered.length) {
            loadBtn.classList.add('rv-no-more');
        } else {
            loadBtn.classList.remove('rv-no-more');
        }
    }
}

// ---- Filters ----

function initFilters() {
    const filterBtns = document.querySelectorAll('.rv-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            visibleCount = INITIAL_SHOW;
            renderGrid();
        });
    });
}

// ---- Load more ----

function initLoadMore() {
    const btn = document.getElementById('rv-load-more');
    if (!btn) return;

    btn.addEventListener('click', () => {
        visibleCount += LOAD_MORE_COUNT;
        renderGrid();
        // Scroll new cards into view smoothly
        const cards = document.querySelectorAll('.rv-card');
        const firstNew = cards[visibleCount - LOAD_MORE_COUNT];
        if (firstNew) {
            firstNew.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    initFilters();
    initLoadMore();
});


// ==================== GALLERY PAGE ====================

document.addEventListener('DOMContentLoaded', () => {

    const projects = [
        { img: 'assets/images/hero_img1.webp',       cat: 'emergency',     catLabel: 'Emergency',     title: 'Burst Pipe Emergency Repair',          desc: 'Rapid response repair preventing major water damage in a Miami Beach residence.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'water-heater',  catLabel: 'Water Heater',  title: 'Tankless Water Heater Installation',   desc: 'Modern energy-efficient upgrade completed for a luxury condo in Brickell.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'drain',         catLabel: 'Drain & Sewer', title: 'Commercial Drain Cleaning',             desc: 'Preventative maintenance for a South Beach restaurant with recurring blockages.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'bathroom',      catLabel: 'Bathroom',      title: 'Bathroom Renovation Plumbing',          desc: 'Complete rough-in and fixture installation for a full remodel in Sunny Isles.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'pipe',          catLabel: 'Pipes',         title: 'Full Repipe — Condo Unit',              desc: 'Complete copper repipe for an older Miami Beach condo with corroded galvanized pipes.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'kitchen',       catLabel: 'Kitchen',       title: 'Kitchen Sink & Fixture Upgrade',        desc: 'Modern fixture replacement and supply line upgrade in a Bal Harbour home.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'commercial',    catLabel: 'Commercial',    title: 'Hotel Plumbing Maintenance',            desc: 'Scheduled preventative maintenance across 8 floors of a Miami Beach boutique hotel.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'water-heater',  catLabel: 'Water Heater',  title: 'Water Heater Replacement',              desc: 'Same-day tank replacement for a family in North Miami Beach with no hot water.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'emergency',     catLabel: 'Emergency',     title: 'Sewer Line Emergency',                  desc: 'Emergency sewer line repair after a backup flooded a ground-floor Brickell apartment.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'bathroom',      catLabel: 'Bathroom',      title: 'Shower & Tub Installation',             desc: 'New walk-in shower installation with custom valve and rainfall showerhead.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'drain',         catLabel: 'Drain & Sewer', title: 'Hydro Jetting — Grease Blockage',       desc: 'High-pressure hydro jetting service to clear a severe grease blockage for a Downtown restaurant.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'pipe',          catLabel: 'Pipes',         title: 'Leak Detection & Pipe Repair',          desc: 'Electronic leak detection locating a hidden leak behind drywall with zero demolition.' }
    ];

    const INITIAL_COUNT = 8;
    const LOAD_COUNT = 4;

    let activeFilter = 'all';
    let visibleCount = INITIAL_COUNT;
    let filteredProjects = [];
    let lightboxIndex = 0;

    // ---- Masonry Grid ----
    function getFiltered() {
        return activeFilter === 'all' 
            ? projects 
            : projects.filter(p => p.cat === activeFilter);
    }

    function buildCard(p, idx) {
        return `
            <div class="gl-card" data-idx="${idx}" role="button" tabindex="0" aria-label="View ${p.title}">
                <div class="gl-card-img-wrap">
                    <img src="${p.img}" alt="${p.title}" class="gl-card-img" loading="lazy">
                    <span class="gl-card-cat">${p.catLabel}</span>
                    <span class="gl-card-zoom"><i class="fas fa-expand"></i></span>
                </div>
                <div class="gl-card-body">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                </div>
            </div>
        `;
    }

    function renderGrid() {
        const grid = document.getElementById('gl-masonry');
        const loadBtn = document.getElementById('gl-load-more');
        if (!grid) return;

        filteredProjects = getFiltered();
        const toShow = filteredProjects.slice(0, visibleCount);

        grid.innerHTML = toShow.map((p, i) => buildCard(p, i)).join('');

        // Card click handlers
        grid.querySelectorAll('.gl-card').forEach((card, i) => {
            card.addEventListener('click', () => openLightbox(i));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(i);
                }
            });
        });

        if (loadBtn) {
            loadBtn.classList.toggle('gl-no-more', visibleCount >= filteredProjects.length);
        }
    }

    function initFilters() {
        document.querySelectorAll('.gl-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.gl-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                visibleCount = INITIAL_COUNT;
                renderGrid();
            });
        });
    }

    function initLoadMore() {
        const btn = document.getElementById('gl-load-more');
        if (!btn) return;
        btn.addEventListener('click', () => {
            visibleCount += LOAD_COUNT;
            renderGrid();
        });
    }

    // ---- Lightbox ----
    function openLightbox(idx) {
        lightboxIndex = idx;
        const lb = document.getElementById('gl-lightbox');
        const img = document.getElementById('gl-lb-img');
        const cap = document.getElementById('gl-lb-caption');
        const p = filteredProjects[idx];

        if (!p || !lb || !img) return;

        img.src = p.img;
        img.alt = p.title;
        cap.textContent = `${p.title} — ${p.desc}`;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lb = document.getElementById('gl-lightbox');
        if (lb) lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    function lbNavigate(dir) {
        lightboxIndex = (lightboxIndex + dir + filteredProjects.length) % filteredProjects.length;
        openLightbox(lightboxIndex);
    }

    function initLightbox() {
        document.getElementById('gl-lb-close')?.addEventListener('click', closeLightbox);
        document.getElementById('gl-lb-prev')?.addEventListener('click', () => lbNavigate(-1));
        document.getElementById('gl-lb-next')?.addEventListener('click', () => lbNavigate(1));

        const lightbox = document.getElementById('gl-lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', e => {
                if (e.target.id === 'gl-lightbox') closeLightbox();
            });
        }

        document.addEventListener('keydown', e => {
            const lb = document.getElementById('gl-lightbox');
            if (!lb?.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lbNavigate(-1);
            if (e.key === 'ArrowRight') lbNavigate(1);
        });
    }

    // ---- Before & After Sliders ----
    function initBASliders() {
        document.querySelectorAll('.gl-ba-slider').forEach(slider => {
            const after = slider.querySelector('.gl-ba-after');
            const handle = slider.querySelector('.gl-ba-handle');
            if (!after || !handle) return;

            let isDragging = false;

            function setPos(clientX) {
                const rect = slider.getBoundingClientRect();
                let pct = ((clientX - rect.left) / rect.width) * 100;
                pct = Math.max(2, Math.min(98, pct));
                after.style.clipPath = `inset(0 0 0 ${pct}%)`;
                handle.style.left = `${pct}%`;
            }

            slider.addEventListener('mousedown', e => { isDragging = true; setPos(e.clientX); });
            window.addEventListener('mousemove', e => { if (isDragging) setPos(e.clientX); });
            window.addEventListener('mouseup', () => { isDragging = false; });

            slider.addEventListener('touchstart', e => { isDragging = true; setPos(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchmove', e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchend', () => { isDragging = false; });
        });
    }

    // ---- Stats Counters ----
    function animateCounter(el, target, duration = 1500) {
        let start = null;
        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    function initStatsCounters() {
        const nums = document.querySelectorAll('.gl-stat-num[data-target]');
        if (!nums.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        nums.forEach(el => obs.observe(el));
    }

    // ---- FAQ ----
    function initFAQ() {
        document.querySelectorAll('.gl-faq-item').forEach(item => {
            const question = item.querySelector('.gl-faq-q');
            if (!question) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all
                document.querySelectorAll('.gl-faq-item').forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.gl-faq-q')?.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ---- Initialize Everything ----
    renderGrid();
    initFilters();
    initLoadMore();
    initLightbox();
    initBASliders();
    initStatsCounters();
    initFAQ();
});



// Play / Pause Toggle

(function () {
  const video = document.getElementById('company-video');
  const btn = document.getElementById('vid-toggle');
  const icon = document.getElementById('vid-toggle-icon');

  if (!video || !btn || !icon) return;

  // Start paused with sound enabled
  video.pause();
  video.muted = false;
  video.volume = 1;

  btn.addEventListener('click', () => {

    if (video.paused) {
      video.muted = false;
      video.volume = 1;

      video.play();

      icon.className = 'fas fa-pause';
      btn.setAttribute('aria-label', 'Pause video');

    } else {
      video.pause();

      icon.className = 'fas fa-play';
      btn.setAttribute('aria-label', 'Play video');
    }

  });

  video.addEventListener('pause', () => {
    icon.className = 'fas fa-play';
    btn.setAttribute('aria-label', 'Play video');
  });

  video.addEventListener('play', () => {
    icon.className = 'fas fa-pause';
    btn.setAttribute('aria-label', 'Pause video');
  });

})();


// ==================== TESTIMONIALS PAGE ====================

(() => {

    // ---- Reviews ----
    const testimonialsData = [
        {
            name: "Vickie J.",
            date: "January 12, 2026",
            stars: 5,
            text: "I had to call on Saturday and schedule for someone to come out. Shawn Kenney came out and worked so hard and never gave up on getting my issue resolved. Absolutely incredible service — I couldn't be happier."
        },
        {
            name: "Lynda P.",
            date: "January 7, 2026",
            stars: 5,
            text: "Always a great job. On time, fast, and courteous. Always use Duck Duck Rooter."
        },
        {
            name: "Patrick R.",
            date: "January 14, 2026",
            stars: 5,
            text: "Had septic tank service performed by Marc and Jordan. They were on time and did a great job — professional and very thorough."
        }
    ];


    // ---- Carousel state ----
    const CARDS_MOBILE = 1;
    const CARDS_TABLET = 2;
    const CARDS_DESKTOP = 3;

    let currentIndex = 0;
    let cardsVisible = CARDS_MOBILE;
    let autoSlideTimer;

    let dragStartX = 0;
    let isDragging = false;


    // ---- Helpers ----

    function getInitials(name) {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }


    function buildStars(count) {
        return Array(count)
            .fill('<i class="fas fa-star"></i>')
            .join("");
    }


    function getCardsVisible() {
        if (window.innerWidth >= 1024) return CARDS_DESKTOP;
        if (window.innerWidth >= 640) return CARDS_TABLET;
        return CARDS_MOBILE;
    }


    function getMaxIndex() {
        return Math.max(0, testimonialsData.length - cardsVisible);
    }


    // ---- Build Card ----

    function buildCard(testimonial) {

        return `
            <div class="testi-card">

                <div class="testi-stars">
                    ${buildStars(testimonial.stars)}
                </div>

                <p class="testi-text">
                    ${testimonial.text}
                </p>

                <div class="testi-author">

                    <div class="testi-avatar">
                        ${getInitials(testimonial.name)}
                    </div>

                    <div class="testi-author-info">
                        <strong>${testimonial.name}</strong>
                        <small>${testimonial.date}</small>
                    </div>

                </div>

            </div>
        `;
    }


    // ---- Render Cards ----

    function renderCards() {

        const track = document.getElementById("testimonial-slider");

        if (!track) return;

        track.innerHTML = testimonialsData
            .map(buildCard)
            .join("");
    }


    // ---- Dots ----

    function buildDots() {

        const wrap = document.getElementById("testi-dots");

        if (!wrap) return;


        const totalDots = getMaxIndex() + 1;


        wrap.innerHTML = Array.from(
            { length: totalDots },
            (_, index) => `
                <button 
                    class="testi-dot ${index === currentIndex ? "active" : ""}"
                    data-index="${index}"
                    aria-label="Go to testimonial ${index + 1}">
                </button>
            `
        ).join("");



        wrap.querySelectorAll(".testi-dot")
            .forEach(dot => {

                dot.addEventListener("click", () => {

                    goTo(Number(dot.dataset.index));
                    resetAuto();

                });

            });

    }


    function updateDots() {

        document.querySelectorAll(".testi-dot")
            .forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

    }



    // ---- Movement ----

    function getCardWidth() {

        const track = document.getElementById("testimonial-slider");

        const card = track?.querySelector(".testi-card");


        if (!card) return 0;


        return card.offsetWidth + 24;

    }



    function goTo(index) {

        currentIndex = Math.max(
            0,
            Math.min(index, getMaxIndex())
        );


        const track = document.getElementById(
            "testimonial-slider"
        );


        if (track) {

            track.style.transform =
                `translateX(-${currentIndex * getCardWidth()}px)`;

        }


        updateDots();

    }



    function nextSlide() {

        goTo(
            currentIndex < getMaxIndex()
            ? currentIndex + 1
            : 0
        );

    }



    function previousSlide() {

        goTo(
            currentIndex > 0
            ? currentIndex - 1
            : getMaxIndex()
        );

    }



    // ---- Auto Slide ----

    function startAuto() {

        autoSlideTimer = setInterval(
            nextSlide,
            6000
        );

    }



    function resetAuto() {

        clearInterval(autoSlideTimer);

        startAuto();

    }



    // ---- Swipe ----

    function initSwipe() {

        const wrap = document.querySelector(
            ".testi-slider-wrap"
        );


        if (!wrap) return;



        wrap.addEventListener(
            "touchstart",
            e => {

                isDragging = true;

                dragStartX =
                    e.touches[0].clientX;

            },
            { passive: true }
        );



        wrap.addEventListener(
            "touchend",
            e => {

                if (!isDragging) return;


                const difference =
                    dragStartX -
                    e.changedTouches[0].clientX;



                if (Math.abs(difference) > 40) {

                    difference > 0
                        ? nextSlide()
                        : previousSlide();


                    resetAuto();

                }


                isDragging = false;

            },
            { passive: true }
        );

    }



    // ---- Resize ----

    function handleResize() {

        const newVisible =
            getCardsVisible();



        if (newVisible !== cardsVisible) {

            cardsVisible = newVisible;

            currentIndex =
                Math.min(
                    currentIndex,
                    getMaxIndex()
                );


            buildDots();

            goTo(currentIndex);

        }

    }



    // ---- Init ----

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            cardsVisible =
                getCardsVisible();


            renderCards();

            buildDots();

            goTo(0);

            startAuto();

            initSwipe();



            document
                .getElementById("prev-btn")
                ?.addEventListener(
                    "click",
                    () => {

                        previousSlide();

                        resetAuto();

                    }
                );



            document
                .getElementById("next-btn")
                ?.addEventListener(
                    "click",
                    () => {

                        nextSlide();

                        resetAuto();

                    }
                );



            window.addEventListener(
                "resize",
                handleResize,
                { passive: true }
            );

        }
    );


})();

document.addEventListener("DOMContentLoaded", function () {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
    if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
    }
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});
