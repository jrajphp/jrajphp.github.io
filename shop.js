/* ─────────────────────────────────────────────────────────────────────────
   SHOP ITEMS — edit this list to manage the sale page.

   To mark a piece sold:   set  sold: true   (it fades + shows "Sold Out")
   To change a price:      edit mrp / price   (whole rupees, no symbol)
   To add a new piece:     copy a { ... } line, change the fields
   Order on the page = order in this list.
   ──────────────────────────────────────────────────────────────────────── */
const SHOP_ITEMS = [
  { file: 'images/artworks/fineliner-trees-ship.jpg',          title: 'Trees & Ship',        medium: 'Fineliner ink',                size: 'A4 · 21 × 29.7 cm', mrp: 5500, price: 4200, sold: false },
  { file: 'images/artworks/watercolor-cake.jpg',               title: 'Sunday Slice',        medium: 'Watercolor',                   size: 'A5 · 15 × 21 cm',   mrp: 3000, price: 2200, sold: false },
  { file: 'images/artworks/fineliner-mountain1.jpg',           title: 'Mountain Sketch, I',  medium: 'Fineliner · hatching',         size: 'A4 · 21 × 29.7 cm', mrp: 5000, price: 3800, sold: false },
  { file: 'images/artworks/watercolor-cap.jpg',                title: 'Worn Cap',            medium: 'Watercolor',                   size: 'A5 · 15 × 21 cm',   mrp: 2800, price: 2000, sold: true  },
  { file: 'images/artworks/fineliner-longtrees.jpg',           title: 'Tall Pines',          medium: 'Fineliner · pattern',          size: 'A4 · 21 × 29.7 cm', mrp: 4800, price: 3600, sold: false },
  { file: 'images/artworks/fountainpen-shoe.jpg',              title: 'Sole Study',          medium: 'Fountain pen',                 size: 'A5 · 15 × 21 cm',   mrp: 3200, price: 2400, sold: false },
  { file: 'images/artworks/greyink-fountainpen.jpg',           title: 'Grey Wash',           medium: 'Ink pen · soluble ink',        size: 'A5 · 15 × 21 cm',   mrp: 3500, price: 2600, sold: false },
  { file: 'images/artworks/fineliner-mountain2.jpg',           title: 'Mountain Sketch, II', medium: 'Fineliner · hatching',         size: 'A4 · 21 × 29.7 cm', mrp: 5000, price: 3800, sold: false },
  { file: 'images/artworks/pencil-drawing.jpg',                title: 'Sketchbook Studies',  medium: 'Polychromos & acrylic pencils',size: 'A4 · 21 × 29.7 cm', mrp: 6000, price: 4500, sold: false },
  { file: 'images/artworks/watercolor-shoe.jpg',               title: 'Walking Shoe',        medium: 'Watercolor · ink',             size: 'A5 · 15 × 21 cm',   mrp: 3000, price: 2200, sold: true  },
  { file: 'images/artworks/greyink-fountainpen-whitepen.jpg',  title: 'Grey & White',        medium: 'Ink pen · white pen',          size: 'A5 · 15 × 21 cm',   mrp: 3800, price: 2800, sold: false },
  { file: 'images/artworks/watercolor-fountainpen.jpg',        title: 'Wash & Line',         medium: 'Watercolor · fountain pen',    size: 'A4 · 21 × 29.7 cm', mrp: 5500, price: 4200, sold: false },
  { file: 'images/artworks/watercolor_grey_ink.jpg',           title: 'Grey Study',          medium: 'Watercolor & ink',             size: 'A5 · 15 × 21 cm',   mrp: 3200, price: 2400, sold: false },
  { file: 'images/artworks/Fineliner-drawing.jpg',             title: 'Studio Marks',        medium: 'Fineliner ink',                size: 'A5 · 15 × 21 cm',   mrp: 2800, price: 2000, sold: true  },
];

const ENQUIRY_EMAIL = 'fineinkjr@gmail.com';

function inr(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function enquiryLink(it) {
  const subject = `Art enquiry: ${it.title}`;
  const body =
    `Hi jrajan,\n\n` +
    `I'm interested in buying "${it.title}" (${it.medium}, ${it.size}), ` +
    `listed at ${inr(it.price)}.\n\n` +
    `Is this piece still available? Please let me know how to proceed.\n\n` +
    `Thank you.`;
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function pctOff(mrp, price) {
  if (!mrp || mrp <= price) return '';
  return Math.round(((mrp - price) / mrp) * 100) + '% off';
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;

  grid.innerHTML = SHOP_ITEMS.map((it) => {
    const action = it.sold
      ? `<div class="shop-sold-note">No longer available</div>`
      : `<a class="shop-enquire" href="${enquiryLink(it)}">Enquire to buy &rarr;</a>`;

    const off = !it.sold ? pctOff(it.mrp, it.price) : '';

    return `
      <article class="shop-card${it.sold ? ' sold' : ''}">
        <div class="shop-frame">
          <img src="${it.file}" alt="${it.title} — ${it.medium}, ${it.size}, by jrajanarts" loading="lazy" />
          ${it.sold ? '<span class="sold-badge">Sold Out</span>' : ''}
        </div>
        <div class="shop-info">
          <h3 class="shop-title">${it.title}</h3>
          <div class="shop-spec">${it.medium} &middot; ${it.size}</div>
          <div class="shop-price">
            <span class="price-mrp">${inr(it.mrp)}</span>
            <span class="price-now">${inr(it.price)}</span>
            ${off ? `<span class="shop-off">${off}</span>` : ''}
          </div>
          ${action}
        </div>
      </article>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderShop);
