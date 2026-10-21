
  const products = [
  {
    id: 1,
    name: 'Tubería PVC de 1/2 pulgada x 6 m',
    category: 'Tuberías',
    description: 'Tubería de PVC para instalaciones hidráulicas y conducción de agua en viviendas y proyectos de construcción.',
    price: 18000,
    image: 'images/tuberia.webp',
    tag: 'Destacado'
  },
  {
    id: 2,
    name: 'Varilla corrugada de 3/8 pulgada',
    category: 'Construcción',
    description: 'Barra de acero corrugado de 6 metros, utilizada como refuerzo en estructuras de concreto.',
    price: 22000,
    image: 'images/varilla.webp',
    tag: 'Popular'
  },
  {
    id: 3,
    name: 'Teja arquitectónica de 6 m, calibre 30',
    category: 'Construcción',
    description: 'Teja metálica para cubiertas de viviendas, patios, bodegas y estructuras exteriores.',
    price: 80000,
    image: 'images/tejaarq.webp',
    tag: 'Destacado'
  },
  {
    id: 4,
    name: 'Cemento gris Argos de 50 kg',
    category: 'Construcción',
    description: 'Cemento para preparar morteros y concretos destinados a obras, reparaciones y trabajos de albañilería.',
    price: 38000,
    image: 'images/cemento.webp',
    tag: 'Popular'
  },
  {
    id: 5,
    name: 'Tanque de agua de 500 litros',
    category: 'Construcción',
    description: 'Tanque plástico para almacenar agua en viviendas, con capacidad adecuada para el uso doméstico.',
    price: 280000,
    image: 'images/tanque.webp',
    tag: 'Destacado'
  },
  {
    id: 6,
    name: 'Malla eslabonada galvanizada',
    category: 'Construcción',
    description: 'Malla metálica galvanizada para cerramientos de patios, lotes, fincas y espacios industriales.',
    price: 95000,
    image: 'images/malla.webp',
    tag: 'Popular'
  },
  {
    id: 7,
    name: 'Pintura anticorrosiva Ferro',
    category: 'Construcción',
    description: 'Pintura para proteger superficies metálicas contra la corrosión, ideal para rejas, puertas y estructuras de hierro.',
    price: 58000,
    image: 'images/anticorrosivo.webp',
    tag: 'Destacado'
  },
  {
    id: 8,
    name: 'Pegante para PVC de 1/4 de galón',
    category: 'Tuberías',
    description: 'Adhesivo para unir tuberías y accesorios de PVC en instalaciones hidráulicas y reparaciones.',
    price: 18000,
    image: 'images/pegante.webp',
    tag: 'Popular'
  },
  {
    id: 9,
    name: 'Alambre de púas por rollo',
    category: 'Construcción',
    description: 'Alambre resistente para delimitar terrenos, cercar fincas y reforzar cerramientos perimetrales.',
    price: 95000,
    image: 'images/alambre-pua.webp',
    tag: 'Oferta'
  },
  {
    id: 10,
    name: 'Codo PVC de 1/2 pulgada',
    category: 'Tuberías',
    description: 'Accesorio de PVC para cambiar la dirección de una tubería en instalaciones de agua.',
    price: 1500,
    image: 'images/codo.webp',
    tag: 'Popular'
  },
  {
    id: 11,
    name: 'Serrucho manual de 20 pulgadas',
    category: 'Herramientas',
    description: 'Serrucho de mano con hoja de acero dentada, ideal para cortar madera en trabajos de construcción, carpintería y reparaciones.',
    price: 28000,
    image: 'images/serrucho.webp',
    tag: 'Nuevo'
  },
  {
    id: 12,
    name: 'Disco de corte para metal de 4 1/2 pulgadas',
    category: 'Herramientas',
    description: 'Disco abrasivo para cortar perfiles, varillas y otras piezas metálicas con una herramienta compatible.',
    price: 4500,
    image: 'images/disco.webp',
    tag: 'Oferta'
  }
];


let cart = JSON.parse(localStorage.getItem('dacero-cart') || '[]');
let selectedProduct = products[0];
let detailQuantity = 1;

const money = value => '$' + Number(value).toLocaleString('es-CO');
const byId = id => document.getElementById(id);
const WHATSAPP_SALES_NUMBER = '573145139305';

function openWhatsAppMessage(message) {
  const url = `https://wa.me/${WHATSAPP_SALES_NUMBER}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.assign(url);
}


function notify(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function persistCart() {
  localStorage.setItem('dacero-cart', JSON.stringify(cart));
  document.querySelector('.cart-count').textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  renderCart();
}


function productCard(product) {
  return `
    <article class="product-card">
      <span class="product-tag" ${product.tag ? '' : 'hidden'}>${product.tag || ''}</span>
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong class="product-price">${money(product.price)}${product.unit || ''}</strong>
        <div class="product-actions">
          <button class="button button-outline" data-detail="${product.id}">Ver producto</button>
          <button class="button button-primary" data-add="${product.id}" aria-label="Añadir ${product.name} a la solicitud">＋</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeatured() {
  byId('featured-products').innerHTML = products.slice(0, 4).map(productCard).join('');
}

function renderCatalog() {
  let list = [...products];
  const query = (byId('product-search').value || '').toLowerCase().trim();
  const categories = [...document.querySelectorAll('.category-filter:checked')].map(
    input => input.value
  );

  if (query) {
    list = list.filter(product =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(query)
    );
  }

  if (categories.length) {
    list = list.filter(product => categories.includes(product.category));
  }

  const maxPrice = Number(byId('price-range').value);
  list = list.filter(product => product.price <= maxPrice);

  const sort = byId('sort-products').value;

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  }

  byId('results-count').textContent =
    `Mostrando ${list.length} producto${list.length === 1 ? '' : 's'}`;
  byId('catalog-products').innerHTML = list.map(productCard).join('');
  byId('empty-state').hidden = list.length > 0;
}

function showDetail(product) {
  selectedProduct = product;
  detailQuantity = 1;

  byId('detail-category').textContent = product.category;
  byId('detail-eyebrow').textContent = product.category.toUpperCase();
  byId('detail-name').textContent = product.name;
  byId('detail-price').textContent = money(product.price);
  byId('detail-description').textContent = product.description;
  byId('detail-image').src = product.image;
  byId('detail-image').alt = product.name;
  byId('thumb-image').src = product.image;
  byId('detail-size').textContent =
    product.category === 'Tuberías' ? '2 pulgadas' : 'Industrial';
  byId('detail-quantity').textContent = detailQuantity;

  const relatedProducts = products
    .filter(item => item.id !== product.id)
    .slice(0, 4);

  byId('related-products').innerHTML = relatedProducts.map(productCard).join('');

  navigate('detalle');
}


function navigate(page) {
  const target = document.querySelector(`[data-view="${page}"]`);
  if (!target) return;

  document.querySelectorAll('.page').forEach(view => {
    view.classList.remove('active');
  });

  target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  document.querySelector('.main-nav').classList.remove('open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'productos') renderCatalog();
  if (page === 'solicitud') renderCart();
}

document.addEventListener('click', event => {
  const pageLink = event.target.closest('[data-page]');

  if (pageLink) {
    event.preventDefault();
    navigate(pageLink.dataset.page);
    return;
  }

  const categoryButton = event.target.closest('[data-category]');

  if (categoryButton) {
    document.querySelectorAll('.category-filter').forEach(input => {
      input.checked = input.value === categoryButton.dataset.category;
    });

    navigate('productos');
    renderCatalog();
    return;
  }

  const detailButton = event.target.closest('[data-detail]');

  if (detailButton) {
    const product = products.find(
      item => item.id === Number(detailButton.dataset.detail)
    );

    showDetail(product);
    return;
  }

  const addButton = event.target.closest('[data-add]');

  if (addButton) {
    addToCart(Number(addButton.dataset.add), 1);
    notify('Producto añadido a tu solicitud');
    return;
  }

  const quantityButton = event.target.closest('[data-quantity]');

  if (quantityButton) {
    const change = quantityButton.dataset.quantity === 'plus' ? 1 : -1;
    detailQuantity = Math.max(1, detailQuantity + change);
    byId('detail-quantity').textContent = detailQuantity;
    return;
  }

  if (event.target.id === 'add-detail') {
    addToCart(selectedProduct.id, detailQuantity);
    notify('Producto añadido a tu solicitud');
    navigate('solicitud');
  }
});

document.querySelector('.menu-toggle').addEventListener('click', event => {
  const nav = document.querySelector('.main-nav');
  nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', nav.classList.contains('open'));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelector('.main-nav').classList.remove('open');
  }
});


// INICIO DE SOLICITUD Y CARRITO
function addToCart(id, quantity) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }

  persistCart();
}

function changeCart(id, amount) {
  const item = cart.find(row => row.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity < 1) {
    cart = cart.filter(row => row.id !== id);
  }

  persistCart();
}

function renderCart() {
  const container = byId('quote-items');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(row => row.id === item.id);
    return sum + item.quantity * product.price;
  }, 0);

  document.querySelector('.cart-count').textContent = totalItems;
  byId('summary-quantity').textContent =
    `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  byId('summary-total').textContent = money(total);

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        Tu solicitud está vacía.<br>
        <button
          class="button button-outline"
          data-page="productos"
          style="margin-top: 16px"
        >
          Explorar catálogo
        </button>
      </div>
    `;
    return;
  }

  const itemsMarkup = cart.map(item => {
    const product = products.find(row => row.id === item.id);

    return `
      <div class="quote-item">
        <div class="quote-product">
          <img src="${product.image}" alt="">
          <div>
            <strong>${product.name}</strong>
            <small>SKU: DA-${String(product.id).padStart(3, '0')}</small>
          </div>
        </div>

        <span class="quote-unit">${money(product.price)}</span>

        <div class="quote-qty">
          <button
            data-change="${product.id}"
            data-amount="-1"
            aria-label="Reducir cantidad"
          >−</button>
          <span>${item.quantity}</span>
          <button
            data-change="${product.id}"
            data-amount="1"
            aria-label="Aumentar cantidad"
          >＋</button>
        </div>

        <button
          class="quote-remove"
          data-remove="${product.id}"
          aria-label="Eliminar ${product.name}"
        >▤</button>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="quote-head">
      <span>Producto</span>
      <span>Precio unit.</span>
      <span>Cantidad</span>
      <span></span>
    </div>

    ${itemsMarkup}

    <div class="quote-footer">
      <button class="button button-outline" data-page="productos">
        Seguir comprando
      </button>
      <button id="clear-cart">Vaciar lista</button>
    </div>
  `;
}

document.addEventListener('click', event => {
  const changeButton = event.target.closest('[data-change]');

  if (changeButton) {
    changeCart(
      Number(changeButton.dataset.change),
      Number(changeButton.dataset.amount)
    );
    return;
  }

  const removeButton = event.target.closest('[data-remove]');

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);
    cart = cart.filter(item => item.id !== id);
    persistCart();
    return;
  }

  if (event.target.id === 'clear-cart') {
    cart = [];
    persistCart();
    return;
  }

  if (event.target.id === 'send-quote') {
    if (cart.length === 0) {
      notify('Agrega productos a tu solicitud primero');
      return;
    }

    const lines = cart.map(item => {
      const product = products.find(row => row.id === item.id);
      return `• ${product.name} — ${item.quantity} × ${money(product.price)} = ${money(item.quantity * product.price)}`;
    });
    const subtotal = cart.reduce((sum, item) => {
      const product = products.find(row => row.id === item.id);
      return sum + item.quantity * product.price;
    }, 0);
    const notes = byId('quote-notes').value.trim();
    const message = [
      'Hola D-Acero, quiero solicitar una cotización:',
      '',
      ...lines,
      '',
      `Subtotal estimado: ${money(subtotal)}`,
      notes ? `Observaciones: ${notes}` : ''
    ].filter(Boolean).join('\n');
    openWhatsAppMessage(message);
    notify('Se abrió WhatsApp con la cotización lista. Confirma el envío allí.');
  }
});


// INICIO DE FORMULARIOS Y ARRANQUE
document.querySelectorAll('.whatsapp-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    const phone = String(values.get('phone') || '').trim();
    const email = String(values.get('email') || '').trim();
    let message;

    if (form.dataset.formPurpose === 'credit') {
      const documentNumber = String(values.get('document') || '').trim();
      message = [
        'Hola D-Acero, quiero solicitar información para abrir una cuenta de crédito.',
        '',
        `Nombre o razón social: ${name}`,
        `NIT o documento: ${documentNumber}`,
        `Correo: ${email}`,
        `Teléfono: ${phone}`
      ].join('\n');
    } else {
      const enquiry = String(values.get('message') || '').trim();
      message = [
        'Hola D-Acero, tengo una consulta:',
        '',
        `Nombre: ${name}`,
        phone ? `Teléfono: ${phone}` : '',
        `Correo: ${email}`,
        '',
        enquiry
      ].filter(Boolean).join('\n');
    }

    openWhatsAppMessage(message);
    notify('Se abrió WhatsApp con tu mensaje listo. Confirma el envío allí.');
  });
});

byId('product-search').addEventListener('input', renderCatalog);
byId('sort-products').addEventListener('change', renderCatalog);

byId('price-range').addEventListener('input', event => {
  const value = Number(event.currentTarget.value);
  byId('price-range-value').textContent = value >= 300000 ? '$300.000+' : money(value);
  renderCatalog();
});

byId('reset-price').addEventListener('click', () => {
  byId('price-range').value = byId('price-range').max;
  byId('price-range-value').textContent = '$300.000+';
  document.querySelectorAll('.category-filter').forEach(input => { input.checked = false; });
  byId('product-search').value = '';
  renderCatalog();
});

document.querySelectorAll('.category-filter').forEach(input => {
  input.addEventListener('change', renderCatalog);
});

renderFeatured();
document.querySelectorAll('[data-category-count]').forEach(counter => {
  const category = counter.dataset.categoryCount;
  counter.textContent = products.filter(product => product.category === category).length;
});
renderCatalog();
persistCart();





