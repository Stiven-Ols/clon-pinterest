// Link Active class
const links = document.querySelectorAll('.nav_link');

links.forEach((link) => {
  link.addEventListener('mouseenter', () => {
    if (!link.classList.contains('active')) {
      // Elimina la clase 'active' de todos los demás elementos
      links.forEach((el) => el.classList.remove('active'));
      link.classList.add('active');
    }
  });
  link.addEventListener('mouseleave', () => {
    link.classList.remove('active');
  });
});



// api pexels
const imagesWrapper = document.querySelector('.boxes');
const loadMoreBtn = document.querySelector('.btn');
const searchInput = document.querySelector('.search_box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = lightBox.querySelector('.closeBtn');
const downloadImgBtn = lightBox.querySelector('.downloadBtn');

// API Key, paginations, searchTerm variables
const apiKey = 'xdo6QpIHFjuq5Bf8295tJZfiHwRXfSqkTTlab7IAT3fc3g7FEiL8ohyW';
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  // Convertir el img recibido en blob, crear su enlace de descarga y descargarlo
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
  }).catch(() => alert('Error al descargar la imagen!'));
}

const showLightBox = (name, img) => {
  // Agregamos lightbox y configuramos img source, name
  lightBox.querySelector('img').src = img;
  lightBox.querySelector('span').innerText = name;
  downloadImgBtn.setAttribute('data-img', img)
  lightBox.classList.add('show');
  document.body.overflow = "hidden";
}

const hidenLightBox = () => {
  lightBox.classList.remove('show');
  document.body.overflow = "auto";
}

const generateHTML = (images) => {
  // Hacer li de todas las imágenes obtenidas y añadirlas al sobre de imágenes existente.
  imagesWrapper.innerHTML += images.map(img => 
    `<div class="box" onclick="showLightBox('${img.photographer}', '${img.src.large2x}')">
      <img src="${img.src.large2x}" alt="img">
      <div class="photographer flex items-center gap-1">
        <img src="./img/user.png" alt="photographer">
        <span>${img.photographer}</span>
      </div>
      <div class="details">
        <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.9"
            stroke="currentColor" data-slot="icon" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>
    </div>`
  ).join('');
}

const getImages = (apiURL) => {
  // Feching images by API call with authorization header
  loadMoreBtn.innerText = 'Cargando...';
  loadMoreBtn.classList.add('disabled');
  fetch(apiURL, {
    headers: {Authorization: apiKey}
  }).then(res => res.json()).then(data => {
    generateHTML(data.photos);
    loadMoreBtn.innerText = 'Cargar más';
    loadMoreBtn.classList.remove('disabled');
  }).catch(() => alert('Error al cargar las imagenes'))
}

const loadMoreImages = () => {
  currentPage++; //imcrementamos currentPage en 1
  // Si searchTerm tiene algún valor entonces llama a la API con el término de búsqueda sino llama a la API por defecto
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
}

const loadSearchImages = (e) => {
  // Si el valor del input está vací0, establece el searchTerm en null y vuelve a partir de aquí
  if (e.target.value === '') return searchTerm = null;
  // si se presiona enter, actualiza currentPage, searchTerm y llama a getImages
  if (e.key === 'Enter') {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = '';
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
  }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hidenLightBox);
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));