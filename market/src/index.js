import './index.html';
import './card.html';
import './cart.html';
import './index.scss';

import Swiper, {Thumbs, Scrollbar} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import {startPagination} from "./modules/pagination";
import {getGoods, getGoodsCategoryItem, getGoodsItem, getGoodsList} from "./modules/goodsService";
import {renderGoods} from "./modules/renderGoods";
import {renderItem} from "./modules/renderItem";
import {filter} from "./modules/filter";
import {cartControl, renderCart} from "./modules/cartControl";
import {serviceCounter} from "./modules/counterControl";
import {renderRecommended} from "./modules/renderRecommended";
import {searchWithoutReload} from "./modules/search";


try {
  const goodsList = document.querySelector('.goods__list');

  if (goodsList) {

    const paginationWrapper = document.querySelector('.pagination');

    filter(goodsList, paginationWrapper);
    searchWithoutReload(goodsList, paginationWrapper);


    goodsList.innerHTML = `
 <div class="goods__preload">
<svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M184.667 6.6665V57.5236M311.81 57.5236L273.667 95.6665M57.5241 57.5236L95.667 95.6665M184.667 362.667V311.809M311.81 311.809L273.667 273.667M57.5241 311.809L95.667 273.667M6.66699 184.667H57.5241M311.81 184.667H362.667" stroke="#FFC700" stroke-width="12.1905" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
  `;
    getGoods().then(({goods, pages, page}) => {
      renderGoods(goodsList, goods);
      startPagination(paginationWrapper, pages, page);
      cartControl({
        wrapper: goodsList,
        classAdd: 'goods-item__to-cart',
        classDelete: 'goods-item__to-cart_remove',
      })
    })
  }
} catch (e) {
  console.warn(e);
}

try {
  const card = document.querySelector('.card');

  if (card) {
    const recommended = document.querySelector('.recommended');
    const pageURL = new URL(location);
    const id = +pageURL.searchParams.get('id');

    const preload = document.createElement('div');
    preload.className = 'preload';
    preload.innerHTML = `
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M184.667 6.6665V57.5236M311.81 57.5236L273.667 95.6665M57.5241 57.5236L95.667 95.6665M184.667 362.667V311.809M311.81 311.809L273.667 273.667M57.5241 311.809L95.667 273.667M6.66699 184.667H57.5241M311.81 184.667H362.667" stroke="#FFC700" stroke-width="12.1905" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `;

    card.append(preload);

    serviceCounter({
      wrapper: '.card__count',
      number: '.card__number',
      selectorDec: '.card__btn-dec',
      selectorInc: '.card__btn-inc',
    })

    getGoodsItem(id).then(item => {
      renderItem(item);
      cartControl({
        classAdd: 'card__add-cart',
        classCount: 'card__number',
      })
      preload.remove();
      return item.category;
    }).then(category => {
      return getGoodsCategoryItem(category)
    }).then(data => {
      renderRecommended(recommended, data, id);
    })
  }
} catch (e) {
  console.warn(e)
}

try {
  const cart = document.querySelector('.cart');

  if (cart) {
    const cartGoods = localStorage.getItem('cart-ts') ?
      JSON.parse(localStorage.getItem('cart-ts')) :
      {};

    const list = Object.keys(cartGoods);

    if (list.length) {
      const preload = document.createElement('div');
      preload.className = 'preload';
      preload.innerHTML = `
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M184.667 6.6665V57.5236M311.81 57.5236L273.667 95.6665M57.5241 57.5236L95.667 95.6665M184.667 362.667V311.809M311.81 311.809L273.667 273.667M57.5241 311.809L95.667 273.667M6.66699 184.667H57.5241M311.81 184.667H362.667" stroke="#FFC700" stroke-width="12.1905" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `;

      cart.append(preload);

      getGoodsList(list).then(goods => {
        renderCart(goods, cartGoods);
        cartControl();
        preload.remove();
      })
    }
  }

} catch (e) {
  console.warn(e);
}


new Swiper('.recommended__carousel', {
  spaceBetween: 30,
  slidesPerView: 4,
});
