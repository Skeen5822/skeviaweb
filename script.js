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
