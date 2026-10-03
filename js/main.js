/**
 * ============================================================================
 * Dipta Saha — Software Engineer Portfolio
 * Interactive 3D Engine & UI Controller (Next.js, Python AI, Flutter)
 * ============================================================================
 */

(function () {
  'use strict';

  // Global State
  let is3DModeActive = true;
  let activeTechPillar = 'nextjs'; // 'nextjs' | 'ai' | 'flutter'

  // --------------------------------------------------------------------------
  // 1. Initialize Icons
  // --------------------------------------------------------------------------
  const CUSTOM_BRAND_SVGS = {
    github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
  };

  function renderCustomIcons() {
    Object.keys(CUSTOM_BRAND_SVGS).forEach(function (name) {
      const elements = document.querySelectorAll('[data-lucide="' + name + '"]');
      elements.forEach(function (el) {
        const style = el.getAttribute('style') || '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(CUSTOM_BRAND_SVGS[name], 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) return;

        let w = el.getAttribute('width');
        let h = el.getAttribute('height');
        const matchW = style.match(/width:\s*(\d+(?:\.\d+)?(?:px|rem|em)?)/i);
        const matchH = style.match(/height:\s*(\d+(?:\.\d+)?(?:px|rem|em)?)/i);
        if (matchW) w = matchW[1];
        if (matchH) h = matchH[1];
        if (w) svg.style.width = w.includes('px') || w.includes('em') || w.includes('rem') ? w : w + 'px';
        if (h) svg.style.height = h.includes('px') || h.includes('em') || h.includes('rem') ? h : h + 'px';

        if (el.className) {
          svg.setAttribute('class', svg.getAttribute('class') + ' ' + el.className);
        }
        if (style) {
          svg.style.cssText += ';' + style;
        }
        svg.style.flexShrink = '0';
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';

        el.replaceWith(svg);
      });
    });
  }

  function initIcons() {
    renderCustomIcons();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // --------------------------------------------------------------------------
  // 2. Toast Notification System
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(text) {
    const toast = document.getElementById('toast');
    const message = document.getElementById('toast-message');
    if (!toast || !message) return;

    message.textContent = text;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  window.copyEmail = function () {
    const email = 'sdipta707@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email (' + email + ') copied to clipboard!');
      }).catch(() => {
        showToast('Email: ' + email);
      });
    } else {
      showToast('Email: ' + email);
    }
  };

  // --------------------------------------------------------------------------
  // 3. Projects Category Filtering (Cinematic Stagger Animation)
  // --------------------------------------------------------------------------
  function filterProjects(targetFilter) {
    const filterButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((btn) => {
      const f = btn.getAttribute('data-filter');
      btn.classList.toggle('active', f === targetFilter);
    });

    let matchedIndex = 0;
    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (targetFilter === 'all' || category === targetFilter) {
        card.style.display = card.classList.contains('featured') ? 'grid' : 'flex';
        card.classList.remove('filter-anim-in');
        // Trigger browser reflow for clean re-animation
        void card.offsetWidth;
        card.style.animationDelay = `${matchedIndex * 45}ms`;
        card.classList.add('filter-anim-in');
        matchedIndex++;
      } else {
        card.style.display = 'none';
        card.classList.remove('filter-anim-in');
      }
    });
  }

  function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.tab-btn');
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterProjects(filter);
      });
    });
  }

  // Dynamically load projects from projects.json and render them
  function loadProjectsFromJSON() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    fetch('projects.json')
      .then(res => res.json())
      .then(data => {
        container.innerHTML = '';
        data.forEach(p => {
          const article = document.createElement('article');
          article.className = `project-card${p.featured ? ' featured' : ''}`;
          article.setAttribute('data-category', p.category);
          article.innerHTML = `
            <div>
              <div class="card-top">
                <span class="badge-status">${p.kind}</span>
                <span class="card-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</span>
              </div>
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.shortDescription}</p>
              <div class="tech-stack-row">
                ${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
            </div>
            <div class="card-actions">
              ${p.links.github ? `<a href="${p.links.github}" target="_blank" class="project-link-btn primary"><i data-lucide="github" style="width:14px;height:14px;"></i> View Repository</a>` : ''}
            </div>
          `;
          container.appendChild(article);
        });
        // Reinitialize icons for any new SVGs
        initIcons();
        // Apply default 'all' filter to ensure proper display
        filterProjects('all');
        initIcons();
      })
      .catch(err => console.error('Failed to load projects:', err));
  }

  // --------------------------------------------------------------------------
  // 4. 3D Card Tilt Physics & Interactive Spotlight Cursor
  // --------------------------------------------------------------------------
  function initCardTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    const interactiveCards = document.querySelectorAll(
      '.project-card, #hero-tilt-card, .info-card, .about-portrait-card, .skill-card'
    );

    interactiveCards.forEach((card) => {
      card.classList.add('spotlight-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle 3D tilt on project cards and hero card
        if (card.classList.contains('project-card') || card.id === 'hero-tilt-card') {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4.5;
          const rotateY = ((x - centerX) / centerX) * 4.5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-999px`);
        card.style.setProperty('--mouse-y', `-999px`);
        if (card.classList.contains('project-card') || card.id === 'hero-tilt-card') {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Active Nav Indicator & Scrolled Glass Header Elevation
  // --------------------------------------------------------------------------
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-nav-link[href^="#"]');
    const header = document.querySelector('header');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      if (header) {
        header.classList.toggle('scrolled', scrollY > 40);
      }

      let currentSection = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 6. Cinematic Scroll Reveal (IntersectionObserver)
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.section-header, .timeline-item, .skill-card, .about-portrait-card, .about-content-column .info-card, .two-column-grid .info-card, .contact-card'
    );

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((el) => {
      el.classList.add('reveal-item');
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Three.js: 3D Hero Core Visualizer & Pillar Morpher
  // --------------------------------------------------------------------------
  let heroScene, heroCamera, heroRenderer;
  let heroGroupNextjs, heroGroupAI, heroGroupFlutter, activeHeroGroup;
  let heroLight1, heroLight2;
  let nextjsCdnNodes = [], aiNeuralCore, aiPythonTorus1, aiPythonTorus2, aiYoloBoxGroup;
  let flutterCards = [], flutterSatellites = [], flutterPhone;

  // Configurations for Next.js, Python AI, and Flutter
  const pillarConfigs = {
    nextjs: {
      title: 'nextjs_edge_server.wasm',
      coreColor: 0x06B6D4,       // Cyan
      emissiveColor: 0x0E2A47,
      wireColor: 0x38BDF8,
      ringColor: 0x818CF8,
      light1Color: 0x06B6D4,
      light2Color: 0x6366F1,
      rotationSpeedX: 0.004,
      rotationSpeedY: 0.008,
      actionBtnText: '⚡ Simulate SSR Fetch',
      categoryTarget: 'web',
      status: 'App Router · Server Actions · 99.9% Cache Hit',
      consoleLog: `> Next.js 14 (App Router) initialized.\n> GET /api/v1/marketplace -> 200 OK (16ms latency)\n> Streaming Server Components with Turbopack.`
    },
    ai: {
      title: 'yolov11_neural_pipeline.bin',
      coreColor: 0xA855F7,       // Purple
      emissiveColor: 0x2E1065,
      wireColor: 0x10B981,       // Emerald
      ringColor: 0xC084FC,
      light1Color: 0xA855F7,
      light2Color: 0x10B981,
      rotationSpeedX: 0.006,
      rotationSpeedY: 0.010,
      actionBtnText: '🎯 Run YOLOv11 Inference',
      categoryTarget: 'ai',
      status: 'YOLOv11 · PyTorch CUDA · FastAPI Docker Ready',
      consoleLog: `> YOLOv11 model weights loaded into GPU VRAM.\n> FastAPI REST container healthy (sub-35ms inference).\n> Object Detection: Bangladeshi Banknote [100% confidence].`
    },
    flutter: {
      title: 'flutter_impeller_engine.apk',
      coreColor: 0x38BDF8,       // Sky Blue
      emissiveColor: 0x0369A1,
      wireColor: 0xF59E0B,       // Amber
      ringColor: 0x0284C7,
      light1Color: 0x38BDF8,
      light2Color: 0xF59E0B,
      rotationSpeedX: 0.004,
      rotationSpeedY: 0.007,
      actionBtnText: '📱 Render 60 FPS Frame',
      categoryTarget: 'mobile',
      status: 'Flutter 3.x · Dart BLoC · Dual Stores Live',
      consoleLog: `> Flutter Engine (Impeller / Metal) active.\n> Oiikko Community App: 60 FPS smooth rendering.\n> Cloud Firestore real-time push synchronization: Connected.`
    }
  };

  function setHeroTechPillar(mode) {
    if (!pillarConfigs[mode]) return;
    activeTechPillar = mode;
    const config = pillarConfigs[mode];

    // 1. Update Buttons & Badges Active States
    document.querySelectorAll('.tech-mode-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-mode') === mode);
    });

    document.querySelectorAll('.pillar-badge').forEach((badge) => {
      badge.classList.toggle('active', badge.getAttribute('data-mode') === mode);
    });

    // 2. Update Console Elements
    const terminalTitle = document.getElementById('terminal-title-text');
    const consoleOutput = document.getElementById('console-output-text');
    const consoleStatus = document.getElementById('console-status-text');
    const actionBtn = document.getElementById('console-action-trigger');
    const jumpLink = document.getElementById('console-jump-projects');

    if (terminalTitle) terminalTitle.textContent = config.title;
    if (consoleOutput) consoleOutput.textContent = config.consoleLog;
    if (consoleStatus) consoleStatus.textContent = config.status;
    if (actionBtn) {
      actionBtn.innerHTML = `<i data-lucide="play" style="width:12px;height:12px;"></i> <span>${config.actionBtnText}</span>`;
    }
    if (jumpLink) {
      jumpLink.setAttribute('data-target-filter', config.categoryTarget);
    }
    initIcons();

    // 3. Switch Active 3D Thematic Model Group
    if (heroScene && typeof THREE !== 'undefined') {
      if (heroGroupNextjs) heroGroupNextjs.visible = (mode === 'nextjs');
      if (heroGroupAI) heroGroupAI.visible = (mode === 'ai');
      if (heroGroupFlutter) heroGroupFlutter.visible = (mode === 'flutter');

      if (mode === 'nextjs') activeHeroGroup = heroGroupNextjs;
      else if (mode === 'ai') activeHeroGroup = heroGroupAI;
      else if (mode === 'flutter') activeHeroGroup = heroGroupFlutter;

      if (heroLight1) heroLight1.color.setHex(config.light1Color);
      if (heroLight2) heroLight2.color.setHex(config.light2Color);

      // Dynamic burst spin on switch
      if (activeHeroGroup) {
        activeHeroGroup.rotation.y += 0.85;
      }
    }
  }

  function initHero3D() {
    const heroCanvas = document.getElementById('hero-canvas-3d');
    if (!heroCanvas || typeof THREE === 'undefined') return;

    const width = heroCanvas.clientWidth || 320;
    const height = heroCanvas.clientHeight || 250;

    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    heroCamera.position.z = 4.8;

    heroRenderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true
    });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic Lights
    heroLight1 = new THREE.DirectionalLight(0x06B6D4, 2.2);
    heroLight1.position.set(5, 5, 5);
    heroScene.add(heroLight1);

    heroLight2 = new THREE.DirectionalLight(0x6366F1, 2.0);
    heroLight2.position.set(-5, -5, 2);
    heroScene.add(heroLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    heroScene.add(ambientLight);

    // ========================================================================
    // MODEL 1: Next.js (Delta Prism + 'N' Cyber Monolith + CDN Edge Cubes + Ring)
    // ========================================================================
    heroGroupNextjs = new THREE.Group();

    // Semi-transparent dark glass triangular prism
    const nPrismGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 3);
    const nPrismMat = new THREE.MeshPhysicalMaterial({
      color: 0x050d1a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.12,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75
    });
    const nPrism = new THREE.Mesh(nPrismGeo, nPrismMat);
    heroGroupNextjs.add(nPrism);

    // Cyan glowing wireframe edges
    const nPrismEdges = new THREE.EdgesGeometry(nPrismGeo);
    const nPrismLine = new THREE.LineSegments(
      nPrismEdges,
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85 })
    );
    heroGroupNextjs.add(nPrismLine);

    // The iconic 3D Next.js "N" Monolith Core
    const nCoreGroup = new THREE.Group();
    const nBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      roughness: 0.15
    });

    const nLegL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.25, 0.14), nBarMat);
    nLegL.position.set(-0.42, 0, 0.05);
    nCoreGroup.add(nLegL);

    const nLegR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.25, 0.14), nBarMat);
    nLegR.position.set(0.42, 0, 0.05);
    nCoreGroup.add(nLegR);

    const nSlash = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.45, 0.14), nBarMat);
    nSlash.rotation.z = -Math.PI / 5.5; // Angled diagonal connecting top-left to bottom-right
    nSlash.position.set(0, 0, 0.05);
    nCoreGroup.add(nSlash);
    heroGroupNextjs.add(nCoreGroup);

    // Orbiting CDN Edge Micro-Cubes (Cache distribution)
    nextjsCdnNodes = [];
    const cdnCubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const cdnCubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85
    });
    for (let i = 0; i < 4; i++) {
      const cube = new THREE.Mesh(cdnCubeGeo, cdnCubeMat);
      const radius = 1.75 + (i * 0.18);
      const speed = 0.9 + (i * 0.35);
      const offset = (i * Math.PI) / 2;
      const yOffset = (i - 1.5) * 0.3;
      nextjsCdnNodes.push({ mesh: cube, radius, speed, offset, yOffset });
      heroGroupNextjs.add(cube);
    }

    // Outer Server Orbit Ring
    const nRingGeo = new THREE.TorusGeometry(1.85, 0.03, 16, 100);
    const nRingMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.7 });
    const nRing = new THREE.Mesh(nRingGeo, nRingMat);
    nRing.rotation.x = Math.PI / 3;
    heroGroupNextjs.add(nRing);

    heroScene.add(heroGroupNextjs);

    // ========================================================================
    // MODEL 2: Python & AI (Neural Core + Twin Helical Snakes + YOLOv11 Box)
    // ========================================================================
    heroGroupAI = new THREE.Group();

    // Geodesic Neural Brain Core
    const neuralGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const neuralMat = new THREE.MeshPhongMaterial({
      color: 0xa855f7,
      emissive: 0x581c87,
      emissiveIntensity: 0.65,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    aiNeuralCore = new THREE.Mesh(neuralGeo, neuralMat);
    heroGroupAI.add(aiNeuralCore);

    // Inner Synaptic Nucleus
    const synapseGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const synapseMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.95
    });
    const synapseMesh = new THREE.Mesh(synapseGeo, synapseMat);
    heroGroupAI.add(synapseMesh);

    // Twin Interlocking Python Helical Toruses
    // Torus 1: Emerald Python Snake
    const torus1Geo = new THREE.TorusGeometry(1.22, 0.12, 20, 60);
    const torus1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.8
    });
    aiPythonTorus1 = new THREE.Mesh(torus1Geo, torus1Mat);
    aiPythonTorus1.rotation.set(0.65, 0.45, 0);
    heroGroupAI.add(aiPythonTorus1);

    // Torus 2: Sky Blue Python Snake
    const torus2Geo = new THREE.TorusGeometry(1.22, 0.12, 20, 60);
    const torus2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x075985,
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.8
    });
    aiPythonTorus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    aiPythonTorus2.rotation.set(-0.65, -0.45, 0);
    heroGroupAI.add(aiPythonTorus2);

    // Active YOLOv11 Computer Vision Bounding Box + 8 Reticles
    aiYoloBoxGroup = new THREE.Group();
    const yoloBoxGeo = new THREE.BoxGeometry(1.85, 1.85, 1.85);
    const yoloBoxEdges = new THREE.EdgesGeometry(yoloBoxGeo);
    const yoloBoxLines = new THREE.LineSegments(
      yoloBoxEdges,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 })
    );
    aiYoloBoxGroup.add(yoloBoxLines);

    // 8 Corner Target Reticles (Bounding Box Corners)
    const cornerGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const cornerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const cornerCoords = [
      [-0.92, -0.92, -0.92], [-0.92, -0.92, 0.92], [-0.92, 0.92, -0.92], [-0.92, 0.92, 0.92],
      [0.92, -0.92, -0.92], [0.92, -0.92, 0.92], [0.92, 0.92, -0.92], [0.92, 0.92, 0.92]
    ];
    cornerCoords.forEach(([cx, cy, cz]) => {
      const cMesh = new THREE.Mesh(cornerGeo, cornerMat);
      cMesh.position.set(cx, cy, cz);
      aiYoloBoxGroup.add(cMesh);
    });

    // Central Vision Crosshair Target
    const crosshairGeoH = new THREE.BoxGeometry(0.32, 0.02, 0.02);
    const crosshairGeoV = new THREE.BoxGeometry(0.02, 0.32, 0.02);
    const crosshairMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    aiYoloBoxGroup.add(new THREE.Mesh(crosshairGeoH, crosshairMat));
    aiYoloBoxGroup.add(new THREE.Mesh(crosshairGeoV, crosshairMat));

    heroGroupAI.add(aiYoloBoxGroup);
    heroGroupAI.visible = false;
    heroScene.add(heroGroupAI);

    // ========================================================================
    // MODEL 3: Flutter (3D Smartphone + Parallax Widget Cards + Wings)
    // ========================================================================
    heroGroupFlutter = new THREE.Group();

    // Smartphone Chassis
    const phoneGeo = new THREE.BoxGeometry(1.22, 2.15, 0.14);
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.85
    });
    flutterPhone = new THREE.Mesh(phoneGeo, phoneMat);
    heroGroupFlutter.add(flutterPhone);

    // Smartphone Screen (Glowing OLED Cyan/Blue)
    const screenGeo = new THREE.PlaneGeometry(1.1, 2.02);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85
    });
    const phoneScreen = new THREE.Mesh(screenGeo, screenMat);
    phoneScreen.position.z = 0.075;
    heroGroupFlutter.add(phoneScreen);

    // Screen Beveled Edge Wire
    const phoneEdges = new THREE.EdgesGeometry(phoneGeo);
    const phoneEdgeLine = new THREE.LineSegments(
      phoneEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    heroGroupFlutter.add(phoneEdgeLine);

    // Floating Parallax Flutter Widget Cards
    flutterCards = [];

    // Card 1: App Header Bar Widget
    const card1Geo = new THREE.BoxGeometry(0.92, 0.32, 0.04);
    const card1Mat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.92
    });
    const card1 = new THREE.Mesh(card1Geo, card1Mat);
    card1.position.set(0, 0.62, 0.28);
    heroGroupFlutter.add(card1);
    flutterCards.push({ mesh: card1, baseZ: 0.28, speed: 2.0, amp: 0.04 });

    // Card 2: Interactive Chart / Feed Widget Card
    const card2Geo = new THREE.BoxGeometry(0.92, 0.65, 0.04);
    const card2Mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x3730a3,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.92
    });
    const card2 = new THREE.Mesh(card2Geo, card2Mat);
    card2.position.set(0, 0.04, 0.4);
    heroGroupFlutter.add(card2);
    flutterCards.push({ mesh: card2, baseZ: 0.4, speed: 2.3, amp: 0.05 });

    // Card 3: Floating Action Button (FAB)
    const fabGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24);
    fabGeo.rotateX(Math.PI / 2);
    const fabMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    const fab = new THREE.Mesh(fabGeo, fabMat);
    fab.position.set(0.3, -0.62, 0.5);
    heroGroupFlutter.add(fab);
    flutterCards.push({ mesh: fab, baseZ: 0.5, speed: 2.7, amp: 0.06 });

    // Flutter Origami Chevrons / Wings
    const wingGeo1 = new THREE.ConeGeometry(0.32, 0.65, 3);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.55,
      roughness: 0.2
    });
    const wing1 = new THREE.Mesh(wingGeo1, wingMat);
    wing1.rotation.set(0, 0, Math.PI / 4);
    wing1.position.set(0.82, 0.35, 0);
    heroGroupFlutter.add(wing1);

    const wingGeo2 = new THREE.ConeGeometry(0.24, 0.48, 3);
    const wing2 = new THREE.Mesh(wingGeo2, wingMat);
    wing2.rotation.set(0, 0, -Math.PI / 4);
    wing2.position.set(0.82, -0.2, 0);
    heroGroupFlutter.add(wing2);

    // Orbiting App Store & Play Store Satellites
    flutterSatellites = [];
    const satGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const sat1 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    const sat2 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    heroGroupFlutter.add(sat1);
    heroGroupFlutter.add(sat2);
    flutterSatellites.push({ mesh: sat1, radius: 1.8, speed: 1.1, phase: 0 });
    flutterSatellites.push({ mesh: sat2, radius: 1.8, speed: 1.1, phase: Math.PI });

    heroGroupFlutter.visible = false;
    heroScene.add(heroGroupFlutter);

    // Default Active Group: Next.js
    activeHeroGroup = heroGroupNextjs;

    // Drag to Rotate Interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    heroCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      if (activeHeroGroup) {
        activeHeroGroup.rotation.y += deltaX * 0.01;
        activeHeroGroup.rotation.x += deltaY * 0.01;
      }
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    function animateHero3D() {
      requestAnimationFrame(animateHero3D);
      if (!is3DModeActive) return;

      const time = Date.now() * 0.002;
      const speed = pillarConfigs[activeTechPillar] || pillarConfigs.nextjs;

      // Primary group continuous smooth rotation
      if (activeHeroGroup) {
        activeHeroGroup.rotation.y += speed.rotationSpeedY;
      }

      // 1. Next.js Animations
      if (activeTechPillar === 'nextjs' && heroGroupNextjs) {
        nextjsCdnNodes.forEach(node => {
          node.mesh.position.x = Math.cos(time * node.speed + node.offset) * node.radius;
          node.mesh.position.z = Math.sin(time * node.speed + node.offset) * node.radius;
          node.mesh.position.y = node.yOffset + Math.sin(time * 2 + node.offset) * 0.2;
          node.mesh.rotation.x += 0.025;
          node.mesh.rotation.y += 0.025;
        });
      }

      // 2. Python & AI Animations
      if (activeTechPillar === 'ai' && heroGroupAI) {
        if (aiPythonTorus1) {
          aiPythonTorus1.rotation.z += 0.014;
          aiPythonTorus1.rotation.y += 0.008;
        }
        if (aiPythonTorus2) {
          aiPythonTorus2.rotation.z -= 0.014;
          aiPythonTorus2.rotation.x += 0.008;
        }
        if (aiNeuralCore) {
          const pulse = 1 + Math.sin(time * 3.5) * 0.07;
          aiNeuralCore.scale.set(pulse, pulse, pulse);
        }
        if (aiYoloBoxGroup) {
          aiYoloBoxGroup.rotation.y = Math.sin(time * 1.2) * 0.12;
          aiYoloBoxGroup.rotation.x = Math.cos(time * 0.9) * 0.08;
        }
      }

      // 3. Flutter Animations
      if (activeTechPillar === 'flutter' && heroGroupFlutter) {
        if (flutterPhone) {
          flutterPhone.rotation.z = Math.sin(time * 1.4) * 0.05;
          flutterPhone.rotation.x = Math.sin(time * 1.0) * 0.04;
        }
        flutterCards.forEach(card => {
          card.mesh.position.z = card.baseZ + Math.sin(time * card.speed) * card.amp;
        });
        flutterSatellites.forEach(sat => {
          sat.mesh.position.x = Math.cos(time * sat.speed + sat.phase) * sat.radius;
          sat.mesh.position.z = Math.sin(time * sat.speed + sat.phase) * sat.radius;
          sat.mesh.position.y = Math.sin(time * 1.8 + sat.phase) * 0.35;
        });
      }

      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero3D();

    window.addEventListener('resize', () => {
      const w = heroCanvas.clientWidth || 320;
      const h = heroCanvas.clientHeight || 250;
      heroCamera.aspect = w / h;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(w, h);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Hero Console Controls (Live Simulations)
  // --------------------------------------------------------------------------
  function initHeroPillarInteractivity() {
    // Mode Switcher Tabs
    document.querySelectorAll('.tech-mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        setHeroTechPillar(mode);
      });
    });

    // Left Column Pillar Badges
    document.querySelectorAll('.pillar-badge').forEach((badge) => {
      badge.addEventListener('click', () => {
        const mode = badge.getAttribute('data-mode');
        setHeroTechPillar(mode);
      });
    });

    // Interactive Action Trigger ("Simulate Build / Detection / Frame")
    const actionBtn = document.getElementById('console-action-trigger');
    const consoleOutput = document.getElementById('console-output-text');

    if (actionBtn && consoleOutput) {
      actionBtn.addEventListener('click', () => {
        const originalText = actionBtn.innerHTML;
        actionBtn.innerHTML = `<i data-lucide="loader" style="width:12px;height:12px;animation:spin3D 1s linear infinite;"></i> Executing...`;
        initIcons();

        setTimeout(() => {
          actionBtn.innerHTML = originalText;
          initIcons();

          if (activeTechPillar === 'nextjs') {
            consoleOutput.textContent = `[BENCHMARK] Next.js 14 SSR response generated in 14.8ms.\n✓ Hydrated React Server Components (Bundle size: 48KB).\nStatus: 200 OK | Core Web Vitals Score: 99.`;
            showToast('Next.js SSR Benchmark: 14.8ms Response!');
          } else if (activeTechPillar === 'ai') {
            consoleOutput.textContent = `[INFERENCE] YOLOv11 model detected target objects in 28ms.\n✓ Class: '500_BDT' (Confidence: 99.7%)\n✓ Class: '1000_BDT' (Confidence: 99.2%)\nFastAPI JSON payload dispatched.`;
            showToast('YOLOv11 Inference Completed: 99.7% Accuracy!');
          } else if (activeTechPillar === 'flutter') {
            consoleOutput.textContent = `[60 FPS FRAME] Impeller Pipeline rendered 60.0 FPS.\n✓ Frame render time: 4.2ms (Zero dropped frames).\n✓ BLoC state stream updated with zero jank.`;
            showToast('Flutter 60 FPS Render Cycle Verified!');
          }
        }, 600);
      });
    }

    // Quick Jump to Filtered Projects
    const jumpLink = document.getElementById('console-jump-projects');
    if (jumpLink) {
      jumpLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetFilter = jumpLink.getAttribute('data-target-filter') || 'all';
        filterProjects(targetFilter);

        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Three.js: 3D Galaxy / Starfield Particle Field
  // --------------------------------------------------------------------------
  let bgScene, bgCamera, bgRenderer, starField;

  function initBackground3D() {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas || typeof THREE === 'undefined') return;

    bgScene = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    bgCamera.position.z = 400;

    bgRenderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: false
    });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x6366F1), // Indigo
      new THREE.Color(0x06B6D4), // Cyan
      new THREE.Color(0x818CF8), // Purple Light
      new THREE.Color(0xFFFFFF)  // White
    ];

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1200;
      positions[i + 1] = (Math.random() - 0.5) * 1200;
      positions[i + 2] = (Math.random() - 0.5) * 800;

      const pickedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = pickedColor.r;
      colors[i + 1] = pickedColor.g;
      colors[i + 2] = pickedColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    starField = new THREE.Points(starGeo, starMat);
    bgScene.add(starField);

    let mouseX = 0, mouseY = 0;
    if (!window.matchMedia('(hover: none)').matches) {
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.08;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
      });
    }

    function animateBG() {
      requestAnimationFrame(animateBG);
      if (!is3DModeActive) return;

      if (starField) {
        starField.rotation.y += 0.0004;
        starField.rotation.x += 0.0002;
      }

      bgCamera.position.x += (mouseX - bgCamera.position.x) * 0.03;
      bgCamera.position.y += (-mouseY - bgCamera.position.y) * 0.03;
      bgCamera.lookAt(bgScene.position);

      bgRenderer.render(bgScene, bgCamera);
    }
    animateBG();

    window.addEventListener('resize', () => {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --------------------------------------------------------------------------
  // 9. 3D Mode Toggle Switcher
  // --------------------------------------------------------------------------
  function set3DMode(active) {
    is3DModeActive = active;
    const canvasContainer = document.getElementById('canvas-container');
    const heroCanvasContainer = document.getElementById('hero-canvas-3d');
    const toggleBtns = [
      document.getElementById('toggle-3d-btn'),
      document.getElementById('mobile-toggle-3d-btn')
    ].filter(Boolean);

    toggleBtns.forEach((btn) => {
      const btnSpan = btn.querySelector('span');
      if (is3DModeActive) {
        btn.classList.add('active');
        if (btnSpan) btnSpan.textContent = '3D Mode: ON';
      } else {
        btn.classList.remove('active');
        if (btnSpan) btnSpan.textContent = '3D Mode: OFF';
      }
    });

    if (canvasContainer) {
      canvasContainer.style.opacity = is3DModeActive ? '0.85' : '0.1';
    }
    if (heroCanvasContainer) {
      heroCanvasContainer.style.opacity = is3DModeActive ? '1' : '0.3';
    }

    showToast(is3DModeActive ? '3D Cyber Mode Activated (60 FPS WebGL)' : '3D Effects Minimized (Performance Saver)');
  }

  function init3DModeToggle() {
    const desktopBtn = document.getElementById('toggle-3d-btn');
    const mobileBtn = document.getElementById('mobile-toggle-3d-btn');

    if (desktopBtn) {
      desktopBtn.addEventListener('click', () => set3DMode(!is3DModeActive));
    }
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => set3DMode(!is3DModeActive));
    }
  }

  // --------------------------------------------------------------------------
  // 10. Mobile Navigation Drawer Controller
  // --------------------------------------------------------------------------
  function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-drawer-btn');
    const overlay = document.getElementById('mobile-overlay');
    const drawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      initIcons();
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // AI Chatbot Controller (Animated & Knowledge-Powered)
  // --------------------------------------------------------------------------
  function initAIChatbot() {
    const triggerBtn = document.getElementById('ai-trigger-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-close-btn');
    const resetBtn = document.getElementById('ai-reset-btn');
    const teaserBadge = document.getElementById('ai-teaser-badge');
    const chatBody = document.getElementById('ai-chat-body');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-send-btn');

    if (!triggerBtn || !chatWindow || !chatBody || !chatForm || !chatInput) return;

    let isOpen = false;

    // Toggle window open / closed
    function toggleChat(forceState) {
      isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
      if (isOpen) {
        chatWindow.classList.add('active');
        triggerBtn.classList.add('open');
        if (teaserBadge) teaserBadge.classList.add('hidden');
        setTimeout(() => chatInput.focus(), 300);
      } else {
        chatWindow.classList.remove('active');
        triggerBtn.classList.remove('open');
      }
    }

    triggerBtn.addEventListener('click', () => toggleChat());
    if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));
    if (teaserBadge) teaserBadge.addEventListener('click', () => toggleChat(true));

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat(false);
      }
    });

    // Handle Input validation
    chatInput.addEventListener('input', () => {
      if (sendBtn) {
        sendBtn.disabled = !chatInput.value.trim();
      }
    });

    // Reset Chat Conversation
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        chatBody.innerHTML = `
          <div class="ai-message bot">
            <div class="ai-msg-avatar">
              <i data-lucide="bot" style="width:16px;height:16px;"></i>
            </div>
            <div class="ai-msg-bubble">
              Conversation reset! 👋 What would you like to explore about Dipta's <strong>18 production projects</strong>, AI agents & RAG pipelines, or Flutter mobile architecture?
            </div>
          </div>
          <div class="ai-suggestions-wrap" id="ai-suggestions">
            <span class="ai-suggestions-title">Quick Questions:</span>
            <div class="ai-suggestions-list">
              <button type="button" class="ai-prompt-chip" data-query="Tell me about your AI Agent and RAG projects">🤖 AI Agents & RAG (10)</button>
              <button type="button" class="ai-prompt-chip" data-query="Tell me about your mobile apps">📱 Mobile Apps (4)</button>
              <button type="button" class="ai-prompt-chip" data-query="What is your tech stack?">⚡ Tech Stack</button>
              <button type="button" class="ai-prompt-chip" data-query="Tell me about Medical AI Agent">🏥 Medical AI Agent</button>
              <button type="button" class="ai-prompt-chip" data-query="Tell me about Bangla RAG Chatbot">📖 Bangla RAG Chatbot</button>
              <button type="button" class="ai-prompt-chip" data-query="How can I contact or hire Dipta?">📬 Contact & Hire</button>
            </div>
          </div>
        `;
        initIcons();
        attachSuggestionHandlers();
      });
    }

    // Knowledge Base Matcher
    function getBotResponse(userQuery) {
      const q = userQuery.toLowerCase().trim();

      // Specific Project: Medical AI Multi-Tool Agent System
      if (q.includes('medical') || q.includes('clinical') || (q.includes('multi-tool') && q.includes('medical')) || q.includes('tavily') || q.includes('fallback')) {
        return `🏥 <strong>Medical AI Multi-Tool Agent System</strong> is an enterprise-grade clinical assistant engineered by Dipta:
        <br>&bull; <strong>Multi-Database SQL Agents:</strong> Natural language querying across SQLite clinical datasets (Cardiology, Oncology, Metabolic health).
        <br>&bull; <strong>Live Web Retrieval:</strong> Real-time clinical guidelines via Tavily Search API.
        <br>&bull; <strong>Zero-Downtime Fallback:</strong> Intelligent chaining of Google Gemini & OpenAI GPT-4o-mini via LangChain <code>.with_fallbacks</code>.
        <br>&bull; <strong>Fault-Tolerant Engine:</strong> Contextual medical degradation ensuring 0% crash rate during API quotas.
        <br>&bull; <strong>Stack:</strong> Python 3.11+, LangChain, Gemini, GPT-4o-mini, SQLite, Tavily, Pytest.
        <br><br>👉 Check out the repository: <a href="https://lnkd.in/gp4JS435" target="_blank">View on GitHub</a> or filter by <a href="#projects" class="ai-jump-filter" data-filter="ai">AI Projects</a>.`;
      }

      // Specific Project: Bangla Book Knowledge Base RAG Chatbot
      if (q.includes('bangla') || q.includes('devdas') || q.includes('দেবদাস') || q.includes('rag') || q.includes('bengali') || q.includes('bge-m3') || q.includes('wikisource')) {
        return `📖 <strong>Bangla Book Knowledge Base RAG Chatbot</strong> is an end-to-end Bengali RAG system built on "দেবদাস" (Devdas):
        <br>&bull; <strong>Automated Pipeline:</strong> Dynamic Wikisource crawler & paragraph-preserving chunking.
        <br>&bull; <strong>Hybrid Retrieval:</strong> Dense embeddings (bge-m3) + Bengali morphological stemmer achieving 100% retrieval hit rate.
        <br>&bull; <strong>Grounding Safeguards:</strong> Clickable chapter citations and strict anti-hallucination refusal rules.
        <br>&bull; <strong>Real-Time UI:</strong> Interactive Streamlit chat powered by Groq LLaMA 3.
        <br><br>👉 View the project: <a href="https://github.com/didipta/bangla-book-rag-chatbot" target="_blank">View on GitHub</a> or browse the <a href="#projects" class="ai-jump-filter" data-filter="ai">AI Projects section</a>.`;
      }

      // Specific Project: Bangladesh Multi-Tool AI Agent
      if (q.includes('bangladesh') || q.includes('hospital data') || (q.includes('multi-tool') && q.includes('bangladesh')) || q.includes('dghs')) {
        return `🇧🇩 <strong>Bangladesh Multi-Tool AI Agent</strong> is an autonomous tool-calling system:
        <br>&bull; <strong>Automatic Routing:</strong> Dynamically detects intent and routes queries to hospital databases, academic institutions, restaurant data, or live Tavily web search.
        <br>&bull; <strong>LangChain + Gemini:</strong> Uses tool calling to connect structured SQLite datasets with natural conversation.
        <br>&bull; <strong>Stack:</strong> Python, LangChain, Google Gemini, SQLite, Streamlit, Docker, Hugging Face.
        <br><br>👉 Try the live demo: <a href="https://lnkd.in/gEhdKeQY" target="_blank">Launch Live Demo</a> | <a href="https://github.com/didipta/bangladesh-multitool-agent" target="_blank">GitHub Repo</a>`;
      }

      // Specific Project: AI LinkedIn Post Generator
      if (q.includes('linkedin') || q.includes('post generator') || q.includes('content generator')) {
        return `🚀 <strong>AI LinkedIn Post Generator</strong> is a multi-lingual generative AI application:
        <br>&bull; <strong>Multi-Lingual Generation:</strong> Supports English, Bengali, Hindi, Spanish, and French.
        <br>&bull; <strong>Agent Validation:</strong> Validates post structure, viral hooks, hashtag suggestions, and paragraph counts.
        <br>&bull; <strong>Export:</strong> Instant .txt downloads for publish-ready content.
        <br>&bull; <strong>Stack:</strong> Python, Streamlit, LangChain, Google Gemini.
        <br><br>👉 Try it live: <a href="https://lnkd.in/gF4TxQzn" target="_blank">Try Live Generator</a> | <a href="https://github.com/didipta/Linkedin-post-agent" target="_blank">GitHub Repo</a>`;
      }

      // Mobile Apps
      if (q.includes('mobile') || q.includes('flutter') || q.includes('android') || q.includes('ios') || q.includes('app')) {
        if (q.includes('field force')) {
          return `<strong>Field Force App</strong> is an enterprise mobile solution built by Dipta for remote sales teams:
          <br>&bull; Real-time GPS location tracking & route optimization
          <br>&bull; Camera verification and attendance geofencing
          <br>&bull; Offline-first synchronization with BLoC architecture
          <br><br>👉 Check it out under the <a href="#projects" class="ai-jump-filter" data-filter="mobile">Mobile Apps section</a>.`;
        }
        return `Dipta has engineered <strong>4 production-grade mobile applications</strong> built primarily with <strong>Flutter & Dart</strong>:
        <br>1. <strong>Oiikko Community App:</strong> Social collaboration active on Google Play & Apple App Store.
        <br>2. <strong>Field Force App:</strong> Enterprise GPS tracking & sales team route automation for Samsung.
        <br>3. <strong>Flutter Social Media App:</strong> Real-time messaging, feed rendering & media uploads.
        <br>4. <strong>Ecommerce Mobile App:</strong> Product discovery, basket management & secure checkout.
        <br><br>👉 You can view all 4 under the <a href="#projects" class="ai-jump-filter" data-filter="mobile">Mobile Filter (#projects)</a>.`;
      }

      // Tech Stack / Skills
      if (q.includes('tech stack') || q.includes('skill') || q.includes('technology') || q.includes('framework') || q.includes('languages')) {
        return `Here is Dipta's core engineering stack:
        <br>&bull; <strong>AI & RAG:</strong> LangChain, Google Gemini, OpenAI GPT-4o, Groq, bge-m3, Tavily API, CrewAI, AutoGen, YOLOv11, OpenCV
        <br>&bull; <strong>Mobile:</strong> Flutter, Dart, BLoC, Provider, Firebase, SQLite
        <br>&bull; <strong>Full-Stack:</strong> Next.js 14, React, Node.js, NestJS, ASP.NET Core, TypeScript
        <br>&bull; <strong>Databases & Cloud:</strong> PostgreSQL, SQLite, MongoDB, Docker, Git, CI/CD
        <br><br>He brings <strong>4+ years of hands-on software engineering experience</strong>.`;
      }

      // AI / Machine Learning / Computer Vision / Agents / RAG
      if (q.includes('ai') || q.includes('machine learning') || q.includes('deep learning') || q.includes('computer vision') || q.includes('agent')) {
        return `Dipta has built <strong>8 specialized AI, RAG & Autonomous Agent systems</strong>:
        <br>&bull; <strong>Medical AI Multi-Tool Agent:</strong> Dual-LLM fallback (Gemini/OpenAI) + clinical SQL agents + Tavily search.
        <br>&bull; <strong>Bangla Book RAG Chatbot:</strong> Hybrid retrieval (bge-m3 + Bengali stemmer) with 100% hit rate on "দেবদাস".
        <br>&bull; <strong>Bangladesh Multi-Tool Agent:</strong> Natural language routing across hospitals, institutions & web data.
        <br>&bull; <strong>AI LinkedIn Post Generator:</strong> Multilingual post creator with structural agent validation.
        <br>&bull; <strong>Bangladeshi Taka Detection:</strong> Deep learning computer vision for banknote classification.
        <br>&bull; <strong>Leo Study Tutor:</strong> Collaborative multi-agent tutoring with CrewAI & AutoGen.
        <br>&bull; <strong>People Flow Analytics:</strong> Real-time YOLOv8 spatial tracking with ByteTrack.
        <br><br>👉 Filter by <a href="#projects" class="ai-jump-filter" data-filter="ai">Applied AI & Vision (#projects)</a> to explore all 8!`;
      }

      // Experience / Bio / Softograph
      if (q.includes('experience') || q.includes('softograph') || q.includes('company') || q.includes('work') || q.includes('background') || q.includes('who is')) {
        return `Dipta Saha is a <strong>Software Engineer with 4+ years of experience</strong> based in Dhaka, Bangladesh.
        <br>&bull; Currently building high-scale distributed systems and mobile solutions at <strong>Softograph Ltd</strong>.
        <br>&bull; Specialized in Next.js web platforms, cross-platform Flutter mobile apps, and LLM/RAG agent systems.
        <br>&bull; Delivered over 16 production systems with clean code, testing, and modern DevOps.`;
      }

      // Contact / Hire / Email
      if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('github') || q.includes('linkedin')) {
        return `You can connect with Dipta directly:
        <br>&bull; <strong>Email:</strong> <a href="mailto:sdipta707@gmail.com">sdipta707@gmail.com</a>
        <br>&bull; <strong>Location:</strong> Dhaka, Bangladesh
        <br>&bull; <strong>GitHub:</strong> <a href="https://github.com/didipta" target="_blank">github.com/didipta</a>
        <br>&bull; <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/dipta-saha-11a4b8194/" target="_blank">linkedin.com/in/dipta-saha-11a4b8194</a>
        <br><br>Ready to collaborate! You can also send a direct message through the contact form below.`;
      }

      // Projects general
      if (q.includes('project') || q.includes('portfolio') || q.includes('works') || q.includes('built')) {
        return `Dipta's portfolio features <strong>18 comprehensive production deployments</strong> across:
        <br>&bull; <strong>Applied AI & RAG Agents (10):</strong> Medical AI agent, Bangla RAG chatbot, Bangladesh multi-tool agent, LinkedIn generator, banknote vision, etc.
        <br>&bull; <strong>Mobile Apps (4):</strong> Oiikko Community (App Store & Play Store), Field Force App, Flutter Social, Ecommerce.
        <br>&bull; <strong>Web & ERP (4):</strong> Multi-vendor marketplace, Shopping Corner, Event Management, Social platform.
        <br><br>Explore the interactive filters in the <a href="#projects">Projects Showcase</a>!`;
      }

      // Greeting
      if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings')) {
        return `Hello there! 👋 Glad to have you here. I can answer questions about Dipta's skills, 18 production projects (including his latest Medical AI and Bangla RAG systems), or how to get in touch. Try one of the buttons below!`;
      }

      // Fallback
      return `I can definitely help with that! You can ask me about:
      <br>&bull; Dipta's <strong>AI Agent & RAG projects</strong> (Medical AI Agent, Bangla RAG Chatbot, Bangladesh Multi-Tool)
      <br>&bull; <strong>4 mobile applications</strong> (including Oiikko on Play/App Store & Field Force App)
      <br>&bull; <strong>Tech stack</strong> (LangChain, Gemini, Flutter, Python, Next.js)
      <br>&bull; How to <strong>hire or contact</strong> Dipta directly at <a href="mailto:sdipta707@gmail.com">sdipta707@gmail.com</a>.`;
    }

    // Append a message to the chat body
    function appendMessage(sender, htmlContent) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `ai-message ${sender}`;

      if (sender === 'bot') {
        msgDiv.innerHTML = `
          <div class="ai-msg-avatar">
            <i data-lucide="bot" style="width:16px;height:16px;"></i>
          </div>
          <div class="ai-msg-bubble">${htmlContent}</div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="ai-msg-bubble">${escapeHtml(htmlContent)}</div>
        `;
      }

      chatBody.appendChild(msgDiv);
      initIcons();
      chatBody.scrollTop = chatBody.scrollHeight;

      // Handle interactive category jump links
      msgDiv.querySelectorAll('.ai-jump-filter').forEach(link => {
        link.addEventListener('click', () => {
          const filter = link.getAttribute('data-filter');
          if (filter) {
            const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
            if (tab) tab.click();
          }
          if (window.innerWidth <= 480) {
            toggleChat(false);
          }
        });
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Show bouncing typing indicator
    function showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'ai-typing-indicator';
      indicator.id = 'ai-active-typing';
      indicator.innerHTML = `
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      `;
      chatBody.appendChild(indicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
      const indicator = document.getElementById('ai-active-typing');
      if (indicator) indicator.remove();
    }

    // Process user question
    function handleUserSubmit(queryText) {
      const text = (queryText || chatInput.value).trim();
      if (!text) return;

      appendMessage('user', text);
      chatInput.value = '';
      if (sendBtn) sendBtn.disabled = true;

      // Show typing indicator
      showTypingIndicator();

      // Realistic response delay for natural animation
      const delay = Math.min(800, 300 + text.length * 8);
      setTimeout(() => {
        removeTypingIndicator();
        const botReply = getBotResponse(text);
        appendMessage('bot', botReply);
      }, delay);
    }

    // Form submission
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSubmit();
    });

    // Prompt Chips Handler
    function attachSuggestionHandlers() {
      document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-query');
          if (query) {
            handleUserSubmit(query);
          }
        });
      });
    }

    attachSuggestionHandlers();
  }

  // --------------------------------------------------------------------------
  // Direct Email Contact Form Controller (1-Click Gmail Direct Send)
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const gmailBtn = document.getElementById('contact-gmail-btn');
    const statusBox = document.getElementById('contact-form-status');

    if (!form || !gmailBtn) return;

    function getFormData() {
      const name = (form.name.value || '').trim();
      const email = (form.email.value || '').trim();
      const subject = (form.subject.value || '').trim();
      const message = (form.message.value || '').trim();
      return { name, email, subject, message };
    }

    function validate({ name, email, message }) {
      if (!name || !email || !message) {
        showStatus('Please fill in your name, email, and message.', 'error');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return false;
      }
      return true;
    }

    // Enter key inside form redirects to Gmail send action
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      gmailBtn.click();
    });

    // 1-Click Direct Send via Gmail Web (Guaranteed inbox delivery)
    gmailBtn.addEventListener('click', () => {
      const data = getFormData();
      if (!validate(data)) return;

      const emailSubject = encodeURIComponent(data.subject || 'Portfolio Inquiry for Dipta Saha');
      const emailBody = encodeURIComponent(
        `Hi Dipta,\n\n${data.message}\n\n---\nSender Name: ${data.name}\nSender Email: ${data.email}`
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sdipta707@gmail.com&su=${emailSubject}&body=${emailBody}`;
      const mailtoUrl = `mailto:sdipta707@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Open Gmail in a new tab
      const win = window.open(gmailUrl, '_blank');

      showStatus(`
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="font-size:20px;line-height:1;">✉️</span>
          <div>
            <strong style="color:#38bdf8;">Gmail compose opened!</strong>
            <p style="margin:5px 0 0;font-size:13px;color:#cbd5e1;line-height:1.5;">
              Your message is pre-filled directly to <strong>sdipta707@gmail.com</strong>. Just click <strong>Send</strong> in Gmail.
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;line-height:1.4;">
              <em>Using another mail client? <a href="${mailtoUrl}" style="color:#38bdf8;text-decoration:underline;">Click here to open in Outlook / Apple Mail</a>.</em>
            </p>
          </div>
        </div>
      `, 'success');

      if (typeof window.showToast === 'function') {
        window.showToast('Gmail opened for sdipta707@gmail.com');
      }
    });

    function showStatus(htmlMessage, type) {
      if (!statusBox) return;
      statusBox.className = `form-status-alert ${type}`;
      statusBox.innerHTML = htmlMessage;
      statusBox.style.display = 'block';
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // --------------------------------------------------------------------------
  // 9. Interactive 3D Cybernetic Chatbot Icon (Three.js)
  // --------------------------------------------------------------------------
  function init3DChatbotIcon() {
    if (typeof THREE === 'undefined') return;

    const triggerCanvas = document.getElementById('ai-bot-3d-canvas');
    const headerCanvas = document.getElementById('ai-bot-header-3d-canvas');
    const triggerBtn = document.getElementById('ai-trigger-btn');

    const instances = [];

    function buildBotInstance(canvas, isHeader = false) {
      if (!canvas) return null;
      const size = isHeader ? 38 : 56;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0.1, 3.4);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Bot Group
      const botGroup = new THREE.Group();
      scene.add(botGroup);

      // 1. Head Chassis (Metallic Slate Helmet)
      const headGeo = new THREE.SphereGeometry(0.78, 24, 20);
      headGeo.scale(1, 0.88, 0.95);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.25,
        metalness: 0.85
      });
      const head = new THREE.Mesh(headGeo, headMat);
      botGroup.add(head);

      // 2. Glowing Visor (Curved Cyber Glass Face)
      const visorGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.42, 20, 1, false, -Math.PI / 2.6, Math.PI / 1.3);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92
      });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 0.05, 0.06);
      botGroup.add(visor);

      // 3. Digital Eyes (Dual glowing eye points)
      const eyeGeo = new THREE.SphereGeometry(0.085, 12, 12);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.25, 0.08, 0.72);
      leftEye.scale.set(1.4, 0.7, 0.5);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.25, 0.08, 0.72);
      rightEye.scale.set(1.4, 0.7, 0.5);

      botGroup.add(leftEye);
      botGroup.add(rightEye);

      // 4. Ear Pods (Left & Right audio sensors)
      const earGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 16);
      earGeo.rotateZ(Math.PI / 2);
      const earMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        metalness: 0.9
      });
      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.84, 0.04, 0);
      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.84, 0.04, 0);
      botGroup.add(leftEar);
      botGroup.add(rightEar);

      // 5. Antenna with Pulsing Beacon
      const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(0, 0.82, 0);
      botGroup.add(stem);

      const beaconGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x06b6d4,
        emissiveIntensity: 1.2
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 0.98, 0);
      botGroup.add(beacon);

      // Dedicated Lighting
      const pLight1 = new THREE.PointLight(0x06b6d4, 1.8, 10);
      pLight1.position.set(2, 2, 3);
      scene.add(pLight1);

      const pLight2 = new THREE.PointLight(0x6366f1, 1.2, 10);
      pLight2.position.set(-2, -1, 2);
      scene.add(pLight2);

      const ambLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambLight);

      return {
        scene,
        camera,
        renderer,
        botGroup,
        beaconMat,
        leftEye,
        rightEye,
        spinVelocity: 0,
        targetRotX: 0,
        targetRotY: 0
      };
    }

    const mainBot = buildBotInstance(triggerCanvas, false);
    // Existing initialization continues
    if (mainBot) instances.push(mainBot);

    const headerBot = buildBotInstance(headerCanvas, true);
    if (headerBot) instances.push(headerBot);

    if (instances.length === 0) return;

    // Track cursor across screen so bot head dynamically looks toward user
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      instances.forEach(inst => {
        inst.targetRotY = normX * 0.55;
        inst.targetRotX = -normY * 0.35;
      });
    });

    // Spin animation on hover trigger
    if (triggerBtn) {
      triggerBtn.addEventListener('mouseenter', () => {
        if (mainBot) mainBot.spinVelocity = 0.32;
      });
    }

    // Animation Loop
    function animateBot() {
      requestAnimationFrame(animateBot);
      const time = Date.now() * 0.003;

      instances.forEach(inst => {
        // Smooth cursor tracking lerp
        inst.botGroup.rotation.y += (inst.targetRotY - inst.botGroup.rotation.y) * 0.08;
        inst.botGroup.rotation.x += (inst.targetRotX - inst.botGroup.rotation.x) * 0.08;

        // Spin burst handling
        if (inst.spinVelocity > 0.005) {
          inst.botGroup.rotation.y += inst.spinVelocity;
          inst.spinVelocity *= 0.94;
        }

        // Floating idle breathing
        inst.botGroup.position.y = Math.sin(time * 1.5) * 0.06;

        // Antenna beacon pulse
        if (inst.beaconMat) {
          inst.beaconMat.emissiveIntensity = 0.8 + Math.sin(time * 4) * 0.6;
        }

        // Periodic eye blink
        const blinkPhase = Math.sin(time * 0.6);
        if (blinkPhase > 0.97) {
          inst.leftEye.scale.y = 0.05;
          inst.rightEye.scale.y = 0.05;
        } else {
          inst.leftEye.scale.y = 0.7;
          inst.rightEye.scale.y = 0.7;
        }

        inst.renderer.render(inst.scene, inst.camera);
      });
    }
    animateBot();
  }

  // --------------------------------------------------------------------------
  // Bootstrap Application
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    // Load and render projects from JSON
    loadProjectsFromJSON();
    initIcons();
    initProjectFilters();
    initCardTilt();
    initScrollReveal();
    initActiveNav();
    initMobileNav();
    initHero3D();
    initBackground3D();
    init3DModeToggle();
    initHeroPillarInteractivity();
    initAIChatbot();
    initContactForm();
    init3DChatbotIcon();
  });
})();
