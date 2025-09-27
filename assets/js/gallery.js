const galleryImages = Array.from(document.querySelectorAll('.gallery__item img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeButton = document.querySelector('.lightbox__close');
let currentIndex = 0;

const showImage = (index) => {
  if (!galleryImages.length) return;
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  const { src, alt } = galleryImages[currentIndex];
  lightboxImg.src = src;
  lightboxImg.alt = alt;
};

const openLightbox = (index) => {
  showImage(index);
  lightbox.classList.add('is-visible');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (closeButton) {
    closeButton.focus();
  }
};

const closeLightbox = () => {
  lightbox.classList.remove('is-visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
  img.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
  img.setAttribute('tabindex', '0');
});

if (closeButton) {
  closeButton.addEventListener('click', closeLightbox);
}

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-visible')) return;

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowRight') {
    showImage(currentIndex + 1);
  } else if (event.key === 'ArrowLeft') {
    showImage(currentIndex - 1);
  }
});
