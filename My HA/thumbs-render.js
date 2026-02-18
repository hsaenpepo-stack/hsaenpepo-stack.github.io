// thumbs-render.js
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

  // ✅ Render section by section
  mount.innerHTML = sections.map((sec, idx) => {
    const sliderId = `thumbSlider_${idx}`;
    const dotsId = `thumbDots_${idx}`;

    const cards = (sec.items || []).map((it) => {
      const img = esc(it.img);
      const title = esc(it.title);
      const desc = esc(it.desc);

      // ✅ زر البرومبت: يا id يا text
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
            data-prompt-title="${esc(it.promptTitle || 'Prompt')}"
            data-prompt-text="${esc(it.promptText || '')}"
            onclick="openPrompt(this)">عرض البرومبت</button>
        `;
      }

      return `
        <div class="card slide">
          <div class="thumb"><img src="${img}" alt=""></div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="actions">
            ${promptBtn}
            <a class="btnSmall" href="${img}" target="_blank">فتح الصورة</a>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="sectionHead" style="margin-top:10px">
        <h2>${esc(sec.title)}</h2>
        <div class="hint">${esc(sec.hint || "")}</div>
      </div>

      <div class="sliderWrap">
        <div class="slider" id="${sliderId}" aria-label="Thumbnails Slider">
          ${cards}
        </div>

        <div class="sliderNav">
          <button class="navBtn" onclick="slidePrev('${sliderId}')">❯</button>
          <button class="navBtn" onclick="slideNext('${sliderId}')">❮</button>
          <div class="dots" id="${dotsId}"></div>
        </div>
      </div>
    `;
  }).join("");

  // ✅ Build dots لكل سلايدر (بدون تهنيج)
  sections.forEach((_, idx) => {
    const sliderId = `thumbSlider_${idx}`;
    const dotsId = `thumbDots_${idx}`;
    if (typeof buildDots === "function") buildDots(sliderId, dotsId);
  });

})();