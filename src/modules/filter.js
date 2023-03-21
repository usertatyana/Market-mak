import {getCategory, getGoods} from "./goodsService";
import {renderGoods} from "./renderGoods";
import {startPagination} from "./pagination";
import {hideOverlay, showOverlay} from "./overlay";

const toggleFilter = (filter, catalogFilterBtn, filterTitle) => {
  catalogFilterBtn.addEventListener('click', () => {
    filter.classList.add('filter_show');
    showOverlay();
  });

  filterTitle.addEventListener('click', () => {
      filter.classList.remove('filter_show');
      hideOverlay();
    })
}
export const filter = (goodsList, paginationWrapper) => {
  const filter = document.querySelector('.filter');
  const catalogFilterBtn = document.querySelector('.catalog__filter-btn');
  const category = document.querySelector('#category');
  const filterTitle = document.querySelector('.filter__title');
  toggleFilter(filter, catalogFilterBtn, filterTitle);

  getCategory().then(categoryList => {
    for (const categoryListKey in categoryList) {
      const option = document.createElement('option');
      option.value = categoryListKey;
      option.textContent = categoryList[categoryListKey];
      category.append(option);
    }
  });

  const filterForm = document.querySelector('.filter__form');
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const checkboxes = new Set();
    [...filterForm.elements].forEach(elem => {
      if (elem.type === 'checkbox') {
        checkboxes.add(elem.name);
      }
    })

    const data = {};
    const formData = new FormData(filterForm);

    for (const [name, value] of formData) {
      if (!value) continue;

      if (checkboxes.has(name)) {
        if (Array.isArray(data[name])) {
          data[name].push(value);
        } else {
          data[name] = [value];
        }
      } else {
        data[name] = value;
      }
    }

    goodsList.innerHTML = `
 <div class="goods__preload">
<svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M184.667 6.6665V57.5236M311.81 57.5236L273.667 95.6665M57.5241 57.5236L95.667 95.6665M184.667 362.667V311.809M311.81 311.809L273.667 273.667M57.5241 311.809L95.667 273.667M6.66699 184.667H57.5241M311.81 184.667H362.667" stroke="#FFC700" stroke-width="12.1905" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
  `;

    const url = new URL(location);

    const search = url.searchParams.get('search');

    url.search = '';

    for (const key in data) {
      url.searchParams.set(key, data[key]);
    }

    history.pushState(null, null, url);

    getGoods().then(({goods, pages, page}) => {
      filter.classList.remove('filter_show')
      hideOverlay();
      renderGoods(goodsList, goods);
      startPagination(paginationWrapper, pages, page);
    })

  });
}
