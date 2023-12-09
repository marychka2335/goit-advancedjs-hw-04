import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39809199-e4207359de0c1fdcee2eb8a85';

async function fetchImages(query, page, perPage) {
  const params = new URLSearchParams({
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
    query: query,
  });

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${params}`);
  return response.data;
}

export { fetchImages };