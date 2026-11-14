/* =====================================================================
   START SCREEN — GSU Panther logo, then the team's names one by one
   =====================================================================
   The names come from MADE_BY in data/settings.js. Each name slides in
   from the left, stays a moment and slides out to the right. After the
   last name the start screen fades away. Click, tap or press any key
   to skip it.
   ===================================================================== */

const LOGO_INTRO_MS = 700; // time for the logo to pop in before the first name
const NAME_MS = 1000; // how long each name is on screen

function playSplash() {
  const splash = $("splash");
  const nameBox = $("splashName");
  let next = 0;
  let timer = null;
  let finished = false;

  function showNextName() {
    if (next >= MADE_BY.length) return hideSplash();
    nameBox.textContent = MADE_BY[next++];
    nameBox.classList.remove("show");
    void nameBox.offsetWidth; // lets the slide animation start again for the new name
    nameBox.classList.add("show");
    timer = setTimeout(showNextName, NAME_MS);
  }

  function hideSplash() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    document.removeEventListener("keydown", hideSplash);
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 700);
  }

  nameBox.style.animationDuration = NAME_MS + "ms";
  splash.addEventListener("click", hideSplash);
  document.addEventListener("keydown", hideSplash);
  timer = setTimeout(showNextName, LOGO_INTRO_MS);
}
