/* ==========================================================================
   GARVIND — Parametric Materialization (Full-Page Scroll-Synced System)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Preloader (Instant Execution) ---------------- */
  (function preloader() {
    const pre = document.getElementById("preloader");
    const fill = document.getElementById("preloaderFill");
    const pct = document.getElementById("preloaderPct");
    const label = document.getElementById("preloaderLabel");
    if (!pre) return;

    const labels = [
      "heating heatbed & nozzle…",
      "homing X/Y/Z axes…",
      "slicing parametric_sculpture.stl…",
      "calibrating mesh bed leveling…",
      "materializing parametric layers…"
    ];

    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 28 + 12;
      if (p >= 100) { p = 100; clearInterval(t); }
      if (fill) fill.style.width = p + "%";
      if (pct) pct.textContent = Math.floor(p) + "%";
      
      if (label) {
        const labelIdx = Math.min(Math.floor((p / 100) * labels.length), labels.length - 1);
        label.textContent = labels[labelIdx];
      }

      if (p === 100) {
        setTimeout(() => pre.classList.add("is-hidden"), 150);
      }
    }, 50);

    // Guaranteed Failsafe: Hide preloader after 1 second under all conditions
    setTimeout(() => pre.classList.add("is-hidden"), 1000);
    window.addEventListener("load", () => {
      setTimeout(() => pre.classList.add("is-hidden"), 300);
    });
  })();

  // Set current year safely
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Centralized WhatsApp Links ---------------- */
  function getWaUrl(text) {
    const num = (typeof CONFIG !== "undefined" && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : "919876543210";
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  }

  /* ---------------- Razorpay Payment SDK Handler ---------------- */
  window.initiateRazorpayPayment = function({ amount, name, description, orderDbId, onSuccess }) {
    fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt: "rcpt_" + Date.now() })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Unable to reach Razorpay server. Opening WhatsApp Order link.");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "GARVIND 3D Studio",
        description: description || name || "3D Print Order",
        image: "images/dragon.png",
        order_id: data.orderId,
        handler: function (response) {
          fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_db_id: orderDbId
            })
          })
          .then(res => res.json())
          .then(ver => {
            if (typeof onSuccess === "function") {
              onSuccess(response.razorpay_payment_id);
            } else {
              alert("🎉 Payment Successful! Payment ID: " + response.razorpay_payment_id);
            }
          });
        },
        prefill: {
          name: "Valued Customer",
          email: "customer@garvind.in",
          contact: "9876543210"
        },
        theme: {
          color: "#00F5A0"
        }
      };

      if (typeof Razorpay !== "undefined") {
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay Checkout SDK is loading. Please try again.");
      }
    })
    .catch(err => {
      alert("Opening Razorpay payment gateway sandbox...");
    });
  };

  function updateGlobalWaBtns() {
    const defaultMsg = "Hi GARVIND! I would like to ask about a custom 3D print.";
    const defaultUrl = getWaUrl(defaultMsg);
    
    document.querySelectorAll(".btn-wa-direct").forEach(btn => {
      if (!btn.hasAttribute("data-custom-url")) {
        btn.href = defaultUrl;
      }
    });
  }
  updateGlobalWaBtns();

  /* ---------------- Top Scroll Laser Progress Line ---------------- */
  let globalScrollProgress = 0;
  (function scrollProgress() {
    const bar = document.getElementById("scrollProgress");
    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      globalScrollProgress = height > 0 ? (winScroll / height) : 0;
      if (bar) bar.style.width = (globalScrollProgress * 100) + "%";
    });
  })();

  /* ---------------- Scroll-Driven Entrance Observer ---------------- */
  (function scrollRevealEngine() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-scroll-reveal]").forEach(el => observer.observe(el));
  })();

  /* ---------------- 3D Perspective Tilt Engine for Cards ---------------- */
  (function tiltEngine() {
    if (window.matchMedia("(hover: none)").matches) return;

    document.addEventListener("mousemove", (e) => {
      const tiltCards = document.querySelectorAll(".tilt-card, .process-step, .insta-tile");
      tiltCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = -((y - centerY) / centerY) * 12;
          const rotateY = ((x - centerX) / centerX) * 12;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
        }
      });
    });

    document.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".tilt-card, .process-step, .insta-tile");
      if (card && !card.contains(e.relatedTarget)) {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
    });
  })();

  /* ---------------- Kinetic Magnetic Button Engine ---------------- */
  (function magneticButtons() {
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".btn-magnetic, .btn-wa-direct, header a.btn-wa-direct").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.04)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0px, 0px) scale(1)";
      });
    });
  })();

  /* ---------------- Preloader ---------------- */
  (function preloader() {
    const pre = document.getElementById("preloader");
    const fill = document.getElementById("preloaderFill");
    const pct = document.getElementById("preloaderPct");
    const label = document.getElementById("preloaderLabel");
    if (!pre || !fill || !pct) return;

    const labels = [
      "heating heatbed & nozzle…",
      "homing X/Y/Z axes…",
      "slicing parametric_sculpture.stl…",
      "calibrating mesh bed leveling…",
      "materializing parametric layers…"
    ];

    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 24;
      if (p >= 100) { p = 100; clearInterval(t); }
      fill.style.width = p + "%";
      pct.textContent = Math.floor(p) + "%";
      
      const labelIdx = Math.min(Math.floor((p / 100) * labels.length), labels.length - 1);
      label.textContent = labels[labelIdx];

      if (p === 100) {
        setTimeout(() => pre.classList.add("is-hidden"), 200);
      }
    }, 100);

    setTimeout(() => pre.classList.add("is-hidden"), 2000);
  })();

  /* ---------------- Custom Cursor (Macro Bokeh Lens) ---------------- */
  (function cursor() {
    if (window.matchMedia("(hover: none)").matches) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
    });

    function loop() {
      rx += (tx - rx) * 0.32;
      ry += (ty - ry) * 0.32;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener("mouseover", (e) => {
      const interactive = e.target.closest("a, button, .filter-chip, input, textarea, select, .product-card, .tilt-card, .insta-tile, .mat-pill, .theme-dot");
      if (interactive) {
        ring.classList.add("is-active");
      } else {
        ring.classList.remove("is-active");
      }
    });
  })();

  /* ---------------- Sticky Nav & Mobile Drawer ---------------- */
  (function navigation() {
    const nav = document.getElementById("siteNav");
    const backBtn = document.getElementById("backToTop");
    
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 20;
      if (nav) {
        nav.classList.toggle("bg-[#0A0B10]/95", scrolled);
        nav.classList.toggle("border-white/10", scrolled);
        nav.classList.toggle("py-3", scrolled);
        nav.classList.toggle("py-4", !scrolled);
      }
      if (backBtn) backBtn.classList.toggle("is-visible", window.scrollY > 600);
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Mobile Navigation Menu Overlay Controller
    const burger = document.getElementById("navBurger");
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("drawerBackdrop");

    function openDrawer() {
      if (!drawer || !backdrop || !burger) return;
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      if (!drawer || !backdrop || !burger) return;
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function toggleDrawer(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!drawer) return;
      const isOpen = drawer.classList.contains("is-open");
      if (isOpen) closeDrawer(); else openDrawer();
    }

    if (burger && drawer) {
      burger.addEventListener("click", toggleDrawer);
    }

    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    document.querySelectorAll("[data-nav-mobile], [data-nav]").forEach(link => {
      link.addEventListener("click", () => closeDrawer());
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  })();

  /* ---------------- Theme Accent Switcher ---------------- */
  (function themeSwitcher() {
    const container = document.getElementById("themeSwitcher");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const dot = e.target.closest(".theme-dot");
      if (!dot) return;

      container.querySelectorAll(".theme-dot").forEach(d => d.classList.remove("active", "opacity-100", "scale-125"));
      dot.classList.add("active", "opacity-100", "scale-125");

      const theme = dot.dataset.theme;
      document.body.setAttribute("data-theme", theme);
    });
  })();

  /* ---------------- Hero Headline Layer Reveal ---------------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      const title = document.getElementById("printedTitle");
      if (title) title.classList.add("is-visible");
    }, 400);
  });

  /* ---------------- Count-up Stats ---------------- */
  (function countUp() {
    const stats = document.querySelectorAll(".stat-num");
    let done = false;

    function run() {
      if (done) return;
      done = true;
      stats.forEach(el => {
        const target = parseFloat(el.dataset.count);
        const isDecimal = target < 1;
        let cur = 0;
        const steps = 40;
        const inc = target / steps;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = isDecimal ? cur.toFixed(1) : Math.floor(cur);
        }, 30);
      });
    }
    setTimeout(run, 800);
  })();

  /* ---------------- SVG Shapes for Product Thumbnails ---------------- */
  const SHAPES = {
    dragon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 70 Q10 50 25 35 Q35 20 50 30 Q65 15 78 28 Q88 38 75 48 Q85 55 78 65 Q65 78 50 68 Q35 82 20 70Z" fill="white" opacity="0.95"/><circle cx="66" cy="34" r="3" fill="#0A0B10"/></svg>`,
    keychain: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="25" r="14" stroke="white" stroke-width="6"/><rect x="42" y="38" width="26" height="46" rx="8" fill="white" opacity="0.95"/></svg>`,
    planter: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 35 L75 35 L65 85 L35 85 Z" fill="white" opacity="0.95"/><rect x="20" y="25" width="60" height="12" rx="3" fill="white"/></svg>`,
    armor: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 15 L70 15 L75 55 Q50 90 25 55 Z" fill="white" opacity="0.95"/><path d="M30 35 L70 35 M28 50 L72 50" stroke="#0A0B10" stroke-width="3"/></svg>`,
    grid: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="30" height="30" rx="4" fill="white" opacity="0.95"/><rect x="55" y="15" width="30" height="30" rx="4" fill="white" opacity="0.6"/><rect x="15" y="55" width="30" height="30" rx="4" fill="white" opacity="0.6"/><rect x="55" y="55" width="30" height="30" rx="4" fill="white" opacity="0.95"/></svg>`,
    chibi: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="35" r="22" fill="white" opacity="0.95"/><rect x="34" y="58" width="32" height="30" rx="14" fill="white" opacity="0.95"/></svg>`,
    tag: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 40 L55 15 L88 45 L48 85 Z" fill="white" opacity="0.95"/><circle cx="60" cy="35" r="5" fill="#0A0B10"/></svg>`,
    helmet: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 55 Q20 15 50 15 Q80 15 80 55 L80 60 L20 60 Z" fill="white" opacity="0.95"/><rect x="30" y="60" width="40" height="15" rx="4" fill="white" opacity="0.7"/></svg>`,
    question: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50" y="68" font-size="60" text-anchor="middle" fill="white" opacity="0.95" font-family="sans-serif">?</text></svg>`
  };

  /* ---------------- Shop Catalog rendering, Filtering, Searching, Sorting ---------------- */
  const shopGrid = document.getElementById("shopGrid");
  let currentProducts = [...PRODUCTS];

  function renderProducts(list) {
    if (!shopGrid) return;
    
    if (list.length === 0) {
      shopGrid.innerHTML = `
        <div class="col-span-full text-center py-16 text-neutral-400">
          <h3 class="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">No prints match your search query</h3>
          <p class="text-sm">Try searching for keychains, dragons, props, or clear the category filter.</p>
        </div>`;
      return;
    }

    shopGrid.innerHTML = list.map(p => `
      <article class="product-card tilt-card group relative bg-[#181B26] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00F5A0]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between" data-category="${p.category}" data-id="${p.id}">
        <div class="product-thumb aspect-square relative flex items-center justify-center overflow-hidden cursor-pointer" style="background: linear-gradient(150deg, ${p.gradient[0]}, ${p.gradient[1]})">
          <span class="absolute top-3 left-3 z-10 font-mono text-[10px] uppercase bg-black/60 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">${p.category}</span>
          ${p.popular ? `<span class="absolute top-3 right-3 z-10 font-mono text-[10px] bg-[#00F5A0] text-neutral-950 font-bold px-2.5 py-0.5 rounded-full shadow-lg z-10">Popular</span>` : ""}
          ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">` : `<div class="thumb-shape w-1/2 h-1/2 relative z-[1] drop-shadow-2xl transition-transform duration-300 group-hover:scale-110">${SHAPES[p.shape] || SHAPES.question}</div>`}
        </div>
        <div class="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 class="font-['Space_Grotesk'] text-base font-bold mb-1 text-white">${p.name}</h3>
            <p class="text-neutral-300 text-xs leading-relaxed mb-4">${p.blurb}</p>
          </div>
          <div class="flex justify-between items-center mt-auto pt-2 border-t border-white/10">
            <span class="font-mono font-bold text-[#00F5A0] text-base">${p.priceDisplay}</span>
            <button type="button" class="btn-open-quickview btn-magnetic text-xs font-semibold text-white border border-white/20 px-3.5 py-1.5 rounded-full hover:bg-[#00F5A0] hover:text-neutral-950 hover:border-[#00F5A0] transition-all cursor-pointer shadow-sm min-h-[36px]" data-product-id="${p.id}">
              Quick View
            </button>
          </div>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".product-card").forEach(c => c.classList.add("is-visible"));
  }
  renderProducts(currentProducts);

  // Render top 4 popular prints on index.html homeFeaturedGrid
  const homeFeaturedGrid = document.getElementById("homeFeaturedGrid");
  if (homeFeaturedGrid) {
    const featured = PRODUCTS.slice(0, 4);
    homeFeaturedGrid.innerHTML = featured.map(p => `
      <article class="product-card tilt-card group relative bg-[#181B26] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00F5A0]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between" data-category="${p.category}" data-id="${p.id}">
        <div class="product-thumb aspect-square relative flex items-center justify-center overflow-hidden cursor-pointer" style="background: linear-gradient(150deg, ${p.gradient[0]}, ${p.gradient[1]})">
          <span class="absolute top-3 left-3 z-10 font-mono text-[10px] uppercase bg-black/60 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">${p.category}</span>
          ${p.popular ? `<span class="absolute top-3 right-3 z-10 font-mono text-[10px] bg-[#00F5A0] text-neutral-950 font-bold px-2.5 py-0.5 rounded-full shadow-lg z-10">Popular</span>` : ""}
          ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">` : `<div class="thumb-shape w-1/2 h-1/2 relative z-[1] drop-shadow-2xl transition-transform duration-300 group-hover:scale-110">${SHAPES[p.shape] || SHAPES.question}</div>`}
        </div>
        <div class="p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 class="font-['Space_Grotesk'] text-base font-bold mb-1 text-white">${p.name}</h3>
            <p class="text-neutral-300 text-xs leading-relaxed mb-4">${p.blurb}</p>
          </div>
          <div class="flex justify-between items-center mt-auto pt-2 border-t border-white/10">
            <span class="font-mono font-bold text-[#00F5A0] text-base">${p.priceDisplay}</span>
            <a href="shop.html" class="btn-magnetic text-xs font-semibold text-white border border-white/20 px-3.5 py-1.5 rounded-full hover:bg-[#00F5A0] hover:text-neutral-950 hover:border-[#00F5A0] transition-all cursor-pointer shadow-sm min-h-[36px]">
              View in Shop
            </a>
          </div>
        </div>
      </article>
    `).join("");
  }

  // Search, Filter & Sort Event Handlers
  const searchInput = document.getElementById("shopSearchInput");
  const filterChips = document.getElementById("shopFilters");
  const sortSelect = document.getElementById("shopSortSelect");

  let activeCategory = "all";
  let searchQuery = "";
  let currentSort = "featured";

  function filterAndSortProducts() {
    let result = PRODUCTS.filter(p => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery) || 
        p.blurb.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (currentSort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    currentProducts = result;
    renderProducts(currentProducts);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterAndSortProducts();
    });
  }

  if (filterChips) {
    filterChips.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;

      filterChips.querySelectorAll(".filter-chip").forEach(c => {
        c.classList.remove("is-active", "bg-white", "text-neutral-950", "font-semibold");
        c.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active", "bg-white", "text-neutral-950", "font-semibold");
      btn.setAttribute("aria-selected", "true");

      activeCategory = btn.dataset.filter;
      filterAndSortProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      filterAndSortProducts();
    });
  }

  /* ---------------- Product Quick View Modal ---------------- */
  (function quickViewModal() {
    const modal = document.getElementById("quickViewModal");
    const closeBtn = document.getElementById("modalCloseBtn");
    if (!modal) return;

    let activeProduct = null;
    let selectedColor = "";
    let quantity = 1;

    function openModal(productId) {
      activeProduct = PRODUCTS.find(p => p.id === productId);
      if (!activeProduct) return;

      quantity = 1;
      selectedColor = activeProduct.colorsAvailable ? activeProduct.colorsAvailable[0] : "#00F5A0";

      document.getElementById("modalTitle").textContent = activeProduct.name;
      document.getElementById("modalPrice").textContent = activeProduct.priceDisplay;
      document.getElementById("modalPrintTime").textContent = `⏱ ${activeProduct.printTime}`;
      document.getElementById("modalDesc").textContent = activeProduct.description;
      document.getElementById("modalDimensions").textContent = activeProduct.dimensions;
      document.getElementById("modalCategoryTag").textContent = activeProduct.category;
      document.getElementById("modalQtyInput").value = quantity;

      // Visual thumbnail image or gradient background & shape
      const visual = document.getElementById("modalVisual");
      visual.style.background = `linear-gradient(150deg, ${activeProduct.gradient[0]}, ${activeProduct.gradient[1]})`;
      
      const iconWrap = document.getElementById("modalIconWrap");
      if (activeProduct.image) {
        iconWrap.className = "w-full h-full";
        iconWrap.innerHTML = `<img src="${activeProduct.image}" alt="${activeProduct.name}" class="w-full h-full object-cover">`;
      } else {
        iconWrap.className = "w-1/2 h-1/2";
        iconWrap.innerHTML = SHAPES[activeProduct.shape] || SHAPES.question;
      }

      // Render color pickers
      const colorContainer = document.getElementById("modalColorOptions");
      colorContainer.innerHTML = (activeProduct.colorsAvailable || ["#00F5A0", "#00D2FF", "#D4AF37"]).map((c, i) => `
        <button type="button" class="color-dot-opt w-7 h-7 rounded-full border-2 border-transparent cursor-pointer transition-transform hover:scale-110 ${i === 0 ? "border-white scale-110" : ""}" data-color="${c}" style="background:${c};" aria-label="Select color ${c}"></button>
      `).join("");

      updateTotalDisplay();
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.style.display = "block";
      }
    }

    function closeModal() {
      if (typeof modal.close === "function") modal.close(); else modal.style.display = "none";
    }

    function updateTotalDisplay() {
      if (!activeProduct) return;
      const unitPrice = activeProduct.price || 0;
      const total = unitPrice * quantity;
      document.getElementById("modalTotalDisplay").textContent = unitPrice > 0 ? `₹${total}` : "Custom Quote";
    }

    // Modal Event Delegation
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-open-quickview, .product-thumb");
      if (btn) {
        const card = btn.closest(".product-card");
        if (card) openModal(card.dataset.id);
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.getElementById("modalColorOptions").addEventListener("click", (e) => {
      const colorBtn = e.target.closest(".color-dot-opt");
      if (!colorBtn) return;
      document.querySelectorAll(".color-dot-opt").forEach(b => b.classList.remove("border-white", "scale-110"));
      colorBtn.classList.add("border-white", "scale-110");
      selectedColor = colorBtn.dataset.color;
    });

    document.getElementById("qtyMinusBtn").addEventListener("click", () => {
      if (quantity > 1) { quantity--; document.getElementById("modalQtyInput").value = quantity; updateTotalDisplay(); }
    });

    document.getElementById("qtyPlusBtn").addEventListener("click", () => {
      if (quantity < 50) { quantity++; document.getElementById("modalQtyInput").value = quantity; updateTotalDisplay(); }
    });

    document.getElementById("modalOrderWaBtn").addEventListener("click", () => {
      if (!activeProduct) return;
      const msg =
`Hi GARVIND! I would like to order:
Item: ${activeProduct.name}
Category: ${activeProduct.category}
Color Choice: ${selectedColor}
Quantity: ${quantity}
Estimated Price: ${activeProduct.price > 0 ? '₹' + (activeProduct.price * quantity) : 'Custom Quote'}`;
      window.open(getWaUrl(msg), "_blank");
      closeModal();
    });

    const modalRazorpayBtn = document.getElementById("modalRazorpayBtn");
    if (modalRazorpayBtn) {
      modalRazorpayBtn.addEventListener("click", () => {
        if (!activeProduct) return;
        const totalAmount = (activeProduct.price || 599) * quantity;
        window.initiateRazorpayPayment({
          amount: totalAmount,
          name: activeProduct.name,
          description: `${quantity}x ${activeProduct.name} (${selectedColor})`,
          onSuccess: (paymentId) => {
            alert(`🎉 Payment Successful! Razorpay Payment ID: ${paymentId}`);
            closeModal();
          }
        });
      });
    }
  })();

  /* ---------------- Instant Price Calculator & Slicing Estimator ---------------- */
  (function calculator() {
    const lInput = document.getElementById("calcLength");
    const wInput = document.getElementById("calcWidth");
    const hInput = document.getElementById("calcHeight");
    const matSelect = document.getElementById("calcMaterial");
    const infillInput = document.getElementById("calcInfill");
    const qtyInput = document.getElementById("calcQty");
    const infillValDisplay = document.getElementById("infillVal");

    const resWeight = document.getElementById("resWeight");
    const resTime = document.getElementById("resTime");
    const resPrice = document.getElementById("resPrice");
    const sendWaBtn = document.getElementById("calcSendWa");

    if (!lInput || !resPrice) return;

    function calculateEstimate() {
      const x = Math.max(1, parseFloat(lInput.value) || 8);
      const y = Math.max(1, parseFloat(wInput.value) || 6);
      const z = Math.max(1, parseFloat(hInput.value) || 5);
      const infill = Math.max(10, parseInt(infillInput.value) || 20);
      const qty = Math.max(1, parseInt(qtyInput.value) || 1);
      const matId = matSelect.value;

      infillValDisplay.textContent = infill;

      const matInfo = MATERIALS.find(m => m.id === matId) || MATERIALS[0];

      // Volume calculation (cm3) with infill factor
      const boundingVolume = x * y * z;
      const shellRatio = 0.25;
      const effectiveVolume = boundingVolume * (shellRatio + (1 - shellRatio) * (infill / 100));

      // Weight calculation (grams)
      const weightPerUnit = Math.round(effectiveVolume * matInfo.density);
      const totalWeight = weightPerUnit * qty;

      // Print time estimation (hours)
      const printHoursPerUnit = (effectiveVolume * 0.08) + (z * 0.15);
      const totalHours = (printHoursPerUnit * qty).toFixed(1);

      // Price estimation (₹)
      const materialCost = totalWeight * matInfo.costPerGram;
      const machineTimeCost = totalHours * 25;
      const baseCost = Math.max(99 * qty, Math.round(materialCost + machineTimeCost));

      resWeight.textContent = `~${totalWeight} g`;
      resTime.textContent = `~${totalHours} hrs`;
      resPrice.textContent = `₹${baseCost}`;

      sendWaBtn.onclick = () => {
        const msg =
`Hi GARVIND! Instant Price Estimator Specs:
Dimensions: ${x}cm x ${y}cm x ${z}cm
Material: ${matInfo.name}
Infill: ${infill}%
Quantity: ${qty}
Est Weight: ~${totalWeight}g
Est Print Time: ~${totalHours}hrs
Est Price: ₹${baseCost}`;
        window.open(getWaUrl(msg), "_blank");
      };
    }

    [lInput, wInput, hInput, matSelect, infillInput, qtyInput].forEach(el => {
      if (el) el.addEventListener("input", calculateEstimate);
    });

    calculateEstimate();
  })();

  /* ---------------- Custom Order Form & Drag and Drop Dropzone ---------------- */
  (function customOrderForm() {
    const form = document.getElementById("customForm");
    const dropzone = document.getElementById("fileDropzone");
    const fileInput = document.getElementById("cf-file");
    const dropContent = document.getElementById("dropzoneContent");
    const previewCard = document.getElementById("filePreviewCard");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const removeBtn = document.getElementById("fileRemoveBtn");

    if (!form || !dropzone) return;

    let attachedFile = null;

    dropzone.addEventListener("click", (e) => {
      if (e.target !== removeBtn) fileInput.click();
    });

    ["dragenter", "dragover"].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzone.classList.add("border-[#00F5A0]", "bg-[#00F5A0]/5");
      });
    });

    ["dragleave", "drop"].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzone.classList.remove("border-[#00F5A0]", "bg-[#00F5A0]/5");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelect(files[0]);
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
    });

    function handleFileSelect(file) {
      attachedFile = file;
      fileName.textContent = file.name;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      fileSize.textContent = `${sizeMB} MB`;

      dropContent.hidden = true;
      previewCard.hidden = false;
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        attachedFile = null;
        fileInput.value = "";
        dropContent.hidden = false;
        previewCard.hidden = true;
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const fileText = attachedFile ? `Attached File: ${attachedFile.name} (${(attachedFile.size / 1024 / 1024).toFixed(2)}MB)` : "No file attached (sending text description)";

      const msg =
`Hi GARVIND! Custom Order Request:
Name: ${data.get("name")}
Contact: ${data.get("contact")}
Category: ${data.get("category")}
Material: ${data.get("material")}
File Status: ${fileText}
Details: ${data.get("description")}`;

      window.open(getWaUrl(msg), "_blank");
    });
  })();

  /* ---------------- Instagram Showcase & Lightbox ---------------- */
  (function instagramShowcase() {
    const grid = document.getElementById("instaGrid");
    const modal = document.getElementById("lightboxModal");
    const closeBtn = document.getElementById("lightboxCloseBtn");
    if (!grid) return;

    grid.innerHTML = INSTA_TILES.map((t, i) => `
      <div class="insta-tile tilt-card aspect-square rounded-xl relative overflow-hidden flex flex-col justify-between p-3 border border-white/10 cursor-pointer transition-all hover:scale-[1.03] hover:border-[#00F5A0]/50 shadow-lg group" data-idx="${i}" style="background: linear-gradient(160deg, ${t.gradient[0]}, ${t.gradient[1]})">
        ${t.image ? `<img src="${t.image}" alt="${t.title}" class="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 group-hover:opacity-90 transition-all duration-500">` : ""}
        <span class="relative z-10 font-mono text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded self-start backdrop-blur-sm">${t.category}</span>
        <p class="relative z-10 text-xs font-semibold text-white drop-shadow-md m-0">${t.title}</p>
      </div>
    `).join("");

    grid.addEventListener("click", (e) => {
      const tile = e.target.closest(".insta-tile");
      if (!tile) return;
      const item = INSTA_TILES[tile.dataset.idx];
      if (!item) return;

      document.getElementById("lightboxTitle").textContent = item.title;
      document.getElementById("lightboxCategory").textContent = `${item.category} · ${item.tag}`;

      const visual = document.getElementById("lightboxVisual");
      visual.style.background = `linear-gradient(160deg, ${item.gradient[0]}, ${item.gradient[1]})`;
      if (item.image) {
        visual.innerHTML = `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded-2xl">`;
      } else {
        visual.innerHTML = "";
      }

      document.getElementById("lightboxLink").href = item.link;

      if (typeof modal.showModal === "function") modal.showModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (typeof modal.close === "function") modal.close();
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    }
  })();

  /* ---------------- Reviews & FAQs ---------------- */
  (function reviewsAndFaqs() {
    const reviewsTrack = document.getElementById("reviewsTrack");
    if (reviewsTrack) {
      reviewsTrack.innerHTML = REVIEWS.map(r => `
        <article class="w-72 sm:w-80 bg-[#181B26] border border-white/10 rounded-2xl p-6 flex-shrink-0 flex flex-col justify-between scroll-snap-align-start tilt-card">
          <div>
            <div class="text-[#ffd700] text-sm mb-3 tracking-widest">${r.stars}</div>
            <p class="text-neutral-200 text-sm leading-relaxed mb-4">"${r.text}"</p>
          </div>
          <div class="font-mono text-xs text-neutral-400">${r.name} · ${r.location}</div>
        </article>
      `).join("");
    }

    const faqList = document.getElementById("faqList");
    if (faqList) {
      faqList.innerHTML = FAQS.map((f, i) => `
        <div class="faq-item group py-1">
          <button class="faq-q w-full text-left bg-none border-none py-5 flex justify-between items-center cursor-pointer font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white min-h-[48px]" data-faq-toggle="${i}" aria-expanded="false">
            <span>${f.q}</span> <span class="plus text-xl text-[#00F5A0] transition-transform duration-300 shrink-0 ml-4">+</span>
          </button>
          <div class="faq-a" id="faq-a-${i}"><p class="text-neutral-300 text-sm pb-6 max-w-2xl leading-relaxed m-0">${f.a}</p></div>
        </div>
      `).join("");

      faqList.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-faq-toggle]");
        if (!btn) return;
        const item = btn.closest(".faq-item");
        const answer = item.querySelector(".faq-a");
        const isOpen = item.classList.contains("is-open");

        faqList.querySelectorAll(".faq-item").forEach(it => {
          it.classList.remove("is-open");
          const qBtn = it.querySelector(".faq-q");
          if (qBtn) qBtn.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    }
  })();

  /* ==========================================================================
     Three.js FULL-PAGE SCROLL-SYNCED 3D PARAMETRIC MATERIALIZATION CANVAS
     ========================================================================== */
  (function fullpageScene() {
    const canvas = document.getElementById("heroCanvas");
    if (!window.THREE || !canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 9);

    function sizeCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Dark liquid reflective build plate
    const buildPlateGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.15, 64);
    const buildPlateMat = new THREE.MeshStandardMaterial({
      color: 0x12141D, metalness: 0.95, roughness: 0.08
    });
    const buildPlate = new THREE.Mesh(buildPlateGeo, buildPlateMat);
    buildPlate.position.y = -2.8;
    scene.add(buildPlate);

    // Glowing laser scanner ring on build plate
    const laserRingGeo = new THREE.RingGeometry(1.6, 3.8, 64);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0, side: THREE.DoubleSide, transparent: true, opacity: 0.35
    });
    const laserRing = new THREE.Mesh(laserRingGeo, laserRingMat);
    laserRing.rotation.x = Math.PI / 2;
    laserRing.position.y = -2.72;
    scene.add(laserRing);

    // Cinematic Lighting
    const key = new THREE.PointLight(0x00f5a0, 3.2, 35);
    key.position.set(6, 5, 6);
    scene.add(key);

    const fill = new THREE.PointLight(0x00d2ff, 2.4, 35);
    fill.position.set(-6, -3, 5);
    scene.add(fill);

    const rim = new THREE.PointLight(0xd4af37, 2.2, 35);
    rim.position.set(0, 6, -6);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const group = new THREE.Group();
    scene.add(group);

    // Intricate Parametric Voronoi / Gyroid Sculpture
    const parametricGeo = new THREE.TorusKnotGeometry(1.5, 0.48, 128, 32, 2, 3);

    // Brushed titanium solid material
    const parametricMat = new THREE.MeshStandardMaterial({
      color: 0x8a92a5, metalness: 0.9, roughness: 0.2, flatShading: false
    });
    const sculptureMesh = new THREE.Mesh(parametricGeo, parametricMat);
    group.add(sculptureMesh);

    // Bioluminescent wireframe particle shell
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0, wireframe: true, transparent: true, opacity: 0.25
    });
    const wireframeMesh = new THREE.Mesh(parametricGeo, wireframeMat);
    wireframeMesh.scale.set(1.02, 1.02, 1.02);
    group.add(wireframeMesh);

    // Microscopic Bioluminescent Particle Swarm
    const particleCount = 320;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05, color: 0x00f5a0, transparent: true, opacity: 0.75
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Interactive Slicer & Material Controls
    const matPills = document.getElementById("heroMaterialPills");
    const layerSlider = document.getElementById("heroLayerSlider");
    const layerValDisplay = document.getElementById("layerVal");
    const statusDisplay = document.getElementById("slicerStatus");

    if (matPills) {
      matPills.addEventListener("click", (e) => {
        const pill = e.target.closest(".mat-pill");
        if (!pill) return;

        matPills.querySelectorAll(".mat-pill").forEach(p => p.classList.remove("active", "text-white", "font-semibold"));
        pill.classList.add("active", "text-white", "font-semibold");

        const matIdx = parseInt(pill.dataset.mat) || 0;
        const matData = MATERIALS[matIdx] || MATERIALS[0];

        parametricMat.color.set(matData.hex);
        key.color.set(matData.hex);

        if (statusDisplay && layerSlider) {
          statusDisplay.textContent = `${matData.name} · ${layerSlider.value}mm`;
        }
      });
    }

    if (layerSlider) {
      layerSlider.addEventListener("input", (e) => {
        const lh = parseFloat(e.target.value);
        if (layerValDisplay) layerValDisplay.textContent = lh.toFixed(2);
        if (statusDisplay && matPills) {
          const activePill = matPills.querySelector(".mat-pill.active");
          const matName = activePill ? activePill.textContent : "PLA";
          statusDisplay.textContent = `${matName} · ${lh.toFixed(2)}mm`;
        }
      });
    }

    // Mouse tilt & orbital camera animation
    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Scroll-synced 3D Transformation Physics
      const sp = globalScrollProgress; // 0.0 to 1.0

      // Calculate target 3D X position (Hero: Right side -> Process: Left side -> Shop: Center -> Calculator: Right)
      const targetX = (window.innerWidth < 768) ? 0 : (2.2 - sp * 4.4 + Math.sin(sp * Math.PI * 2) * 1.5);
      const targetY = Math.sin(t * 1.2) * 0.2 + (sp * 0.5);

      group.position.x += (targetX - group.position.x) * 0.08;
      group.position.y += (targetY - group.position.y) * 0.08;

      // Continuous 360° orbital rotation driven by scroll + time
      group.rotation.y = t * 0.2 + (sp * Math.PI * 4) + mouseX * 0.4;
      group.rotation.x = 0.25 + (sp * Math.PI * 2) + mouseY * 0.3;

      // Laser ring position synced with build plate
      laserRing.position.y = -2.72;
      buildPlate.position.x = group.position.x;
      laserRing.position.x = group.position.x;

      // Particle swarm orbital rotation
      particlePoints.rotation.y = t * 0.06 + sp * 2;

      renderer.render(scene, camera);
    }
    animate();
  })();

})();
