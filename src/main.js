import iziToast from 'izitoast';
import Notiflix from 'notiflix';
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
// import renderingMarkup from './js/renderingMarkup';
// import smoothScroll from './js/smoothScroll';
// import APIService from './js/APIService';
import axios from "axios";

const refs = {
  form: document.querySelector('#search-form'),
  buttonLoadMore: document.querySelector('.load-more'),
  galleryImages: document.querySelector('.gallery'),
  linkToStartPage: document.querySelector('.start-page')
};

const searchService = new APIService;
const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '34728091-aad7c1a347ba4d65085b0c300';

export default class APIService {
    constructor() {
        this.page = 1,
        this.searchQuery = '';
    }

    resetPage() {
        this.page = 1
    }

    updatePage() {
        this.page += 1
    }

    updateSearchQuery() {
        this.searchQuery = refs.form.elements.searchQuery.value.trim();
    }

    async searchImages() {
       const response = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
       return response
    }
}

refs.form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    refs.buttonLoadMore.classList.remove('visually-button');
    refs.linkToStartPage.classList.remove('visually-link');
    refs.galleryImages.innerHTML = '';
    searchService.resetPage();
    searchService.updateSearchQuery();
    
    try {
        searchService.searchImages().then(({ data }) => {
            renderingMarkup(data);

            if (data.hits.length === 0) {
              iziToast.show({
                message: 'Sorry, there are no images matching your search query. Please try again.',
              position: topCenter,
            messageColor: orange
          });              
          return
            }
            
            if (searchService.page === 1) {
              iziToast.show({
                message: 'Hooray! We found ${data.totalHits} images.',
              position: topCenter,
            messageColor: "red"
          });
              
            }
            
            if (searchService.page === Math.ceil(data.totalHits/40)) {
              iziToast.show({
                message: 'Were sorry, but youve reached the end of search results.',
              position: top,
            messageColor: navy
          });                refs.buttonLoadMore.classList.remove('visually-button');
            }
            smoothScroll();
            refs.buttonLoadMore.classList.add('visually-button');
            refs.linkToStartPage.classList.add('visually-link');
            searchService.updatePage()
        }).catch(error => console.log(error));
    } catch (error) {
        console.log(error.message)
    }
    
})

refs.buttonLoadMore.addEventListener('click', () => {
    try {
        searchService.searchImages().then(({ data }) => {
            renderingMarkup(data);
            smoothScroll();

            if (searchService.page === Math.ceil(data.totalHits/40)) {
                iziToast.show({
                  message: 'Were sorry, but youve reached the end of search results.',
                position: top,
              messageColor: navy
            });
                refs.buttonLoadMore.classList.remove('visually-button');
            }

            searchService.updatePage()
        }).catch(error => console.log(error));
    } catch (error) {
        console.log(error.message)
    }
})

let gallery = new SimpleLightbox('.gallery a');

export default function renderingMarkup(images) {
    
    const markup = images.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
       return `<a class="photo" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320 height=200/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div></a>`
    }).join('');
   
    refs.galleryImages.insertAdjacentHTML('beforeend', markup);
    gallery.refresh();
}

export default function smoothScroll() {
  const { height: cardHeight } = document
   .querySelector(".gallery")
             .firstElementChild.getBoundingClientRect();
         
     window.scrollBy({
   top: cardHeight * 2,
   behavior: "smooth",
 });
 }