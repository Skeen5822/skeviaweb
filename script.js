const year = String(new Date().getFullYear());
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = year;
});

const plotted = document.querySelectorAll("[data-plotted]");
const plottedValue = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
})
  .format(new Date())
  .toUpperCase();
plotted.forEach((el) => {
  el.textContent = plottedValue;
});

const sheet = document.querySelector(".sheet");
const root = document.documentElement;
const desktopPlot = window.matchMedia("(min-width: 861px)");
let fitFrame = 0;
let resizeWait = 0;
let appliedScale = "";

function applyScale(next) {
  const value = String(next);
  if (appliedScale === value) {
    return;
  }
  appliedScale = value;
  root.style.setProperty("--ui-scale", value);
}

function fitSheet() {
  if (!sheet || !desktopPlot.matches) {
    applyScale("1");
    return;
  }

  if (appliedScale !== "1") {
    applyScale("1");
  }

  const styles = getComputedStyle(sheet);
  const budget =
    window.innerHeight -
    (Number.parseFloat(styles.marginTop) || 0) -
    (Number.parseFloat(styles.marginBottom) || 0);
  const overflow = sheet.scrollHeight - budget;

  if (overflow <= 24) {
    applyScale("1");
    return;
  }

  applyScale(Math.max(0.84, (budget / sheet.scrollHeight) * 0.99));
}

function scheduleFit() {
  cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(fitSheet);
}

function onViewportChange() {
  if (!desktopPlot.matches) {
    applyScale("1");
    return;
  }

  clearTimeout(resizeWait);
  resizeWait = window.setTimeout(scheduleFit, 80);
}

window.addEventListener("resize", onViewportChange, { passive: true });
desktopPlot.addEventListener("change", onViewportChange);
if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleFit);
}
scheduleFit();
