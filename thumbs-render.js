// thumbs-render.js  ✅ FAST (batch render + lazy images)
(function () {
  const mount = document.getElementById("thumbsMount");
  if (!mount) return;

  const sections = window.THUMBS_SECTIONS || [];
  if (!sections.length) {
    mount.innerHTML = `<div class="videoCard"><h3>لا توجد بيانات</h3><p style="color:var(--muted)">أضف سكاشن داخل thumbs-data.js</p></div>`;
    return;
  }

  // ✅ helper: escape
  const esc = (s) => String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  // ✅ Render skeleton (sections فقط) - بدون كل الكروت
  mount.innerHTML = sections.map((sec, idx) => {
    const sliderId = `thumbSlider_${idx}`;
    const dotsId = `thumbDots_${idx}`;

    return `
      <div class="sectionHead" style="margin-top:10px">
        <h2>${esc(sec.title)}</h2>
        <div class="hint">${esc(sec.hint || "")}</div>
      </div>

      <div class="sliderWrap">
        <div class="slider" id="${sliderId}" aria-label="Thumbnails Slider"></div>

        <div class="sliderNav">
          <button class="navBtn" onclick="slidePrev('${sliderId}')">❯</button>
          <button class="navBtn" onclick="slideNext('${sliderId}')">❮</button>
          <div class="dots" id="${dotsId}"></div>
        </div>
      </div>
    `;
  }).join("");

  // ✅ Generate card HTML (lazy image + fixed size)
  function cardHTML(it) {
    const img = esc(it.img);
    const title = esc(it.title);
    const desc = esc(it.desc);

    let promptBtn = "";
    if (it.promptId) {
      promptBtn = `
        <button class="btnSmall smallOrange"
          data-prompt-id="${esc(it.promptId)}"
          onclick="openPromptById(this)">عرض البرومبت</button>
      `;
    } else {
      promptBtn = `
        <button class="btnSmall smallOrange"
          data-prompt-title="${esc(it.promptTitle || "Prompt")}"
          data-prompt-text="${esc(it.promptText || "")}"
          onclick="openPrompt(this)">عرض البرومبت</button>
      `;
    }

    // ✅ lazy + async decoding لتسريع التحميل
    return `
      <div class="card slide">
        <div class="thumb">
          <img src="${img}" alt=""
            loading="lazy" decoding="async"
            width="680" height="380">
        </div>
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="actions">
          ${promptBtn}
          <a class="btnSmall" href="${img}" target="_blank" rel="noopener">فتح الصورة</a>
        </div>
      </div>
    `;
  }

  // ✅ Render items in batches (مايهنّجش)
  const BATCH_SIZE = 12;   // زوّدها/قللها حسب جهازك (8-16 ممتاز)
  const IDLE_MS = 20;      // فاصل بسيط بين الدُفعات

  sections.forEach((sec, idx) => {
    const sliderId = `thumbSlider_${idx}`;
    const dotsId = `thumbDots_${idx}`;
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const items = sec.items || [];
    let i = 0;

    function renderBatch() {
      const frag = document.createDocumentFragment();
      const end = Math.min(i + BATCH_SIZE, items.length);

      for (; i < end; i++) {
        const wrap = document.createElement("div");
        // نحط HTML للكارد
        wrap.innerHTML = cardHTML(items[i]);
        frag.appendChild(wrap.firstElementChild);
      }

      slider.appendChild(frag);

      // ✅ dots بعد ما يخلص رندر السكشن بالكامل (مرة واحدة)
      if (i >= items.length) {
        if (typeof buildDots === "function") buildDots(sliderId, dotsId);
        return;
      }

      // ✅ كمل دفعة جديدة بعد شوية
      setTimeout(renderBatch, IDLE_MS);
    }

    renderBatch();
  });

})();