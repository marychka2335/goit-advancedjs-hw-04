import iziToast from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api.js';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;
let simpleLightboxInstance;
const perPage = 40;

loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (currentQuery === '') {
    iziToast.warning({
      message: 'The search string cannot be empty. Please specify your search query.',
      messageColor: 'white',
      backgroundColor: 'navy',
      timeout: 3000,
      position: 'topLeft'
  },)
    return;
  }

  try {
    const response = await fetchImages(currentQuery, currentPage, perPage);

if(currentQuery === 0 || response.totalHits === 0) {
    iziToast.warning({
        message: 'Sorry, there are no images matching your search query. Please try again.',
        messageColor: 'white',
        backgroundColor: 'navy',
        timeout: 3000,
        position: 'topLeft'
    },);
      
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
      simpleLightboxInstance = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      }).refresh();
      iziToast.info({message: `Hooray! We found ${response.totalHits} images.`,
      messageColor: 'white',
        backgroundColor: 'navy',
        timeout: 3000,
        position: 'topLeft'},);

      if (response.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    handleFetchError(error);
  } finally {
    searchForm.reset();
  }
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        id,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
            <div class="gallery-item" id="${id}">
              <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
              </div>
            </div>
          </a>`;
      }
    )
    .join('');
}

async function handleLoadMore() {
  currentPage += 1;
  simpleLightboxInstance.destroy();

  try {
    const response = await fetchImages(currentQuery, currentPage, perPage);
    gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
    simpleLightboxInstance = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    }).refresh();

    const totalDisplayedImages =
      gallery.querySelectorAll('.gallery__link').length;
    const totalPages = Math.ceil(data.totalHits / 40);

    if (totalDisplayedImages < response.totalHits) {
      loadMoreBtn.disabled = false;
      scrollToNextGalleryPage();
    } else {
      iziToast.warning({
        message: 'We are sorry, but you have reached the end of search results.',
        messageColor: 'white',
        backgroundColor: 'navy',
        timeout: 3000,
        position: 'bottomLeft'
    },);
      loadMoreBtn.classList.add('is-hidden');
    }
  } 
  
  catch (onError) {
   }
}

const scrollToNextGalleryPage = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};