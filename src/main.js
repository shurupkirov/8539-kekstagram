'use strict';

require('./upload/upload');

var gallery = require('./gallery');
var loaded = require('./loaded');
var Picture = require('./pictures/pictures');
var utilities = require('./utilities');
var filterPict = require('./pictures/picture-filter');

var filterBlock = document.querySelector('.filters');

var picturesContainer = document.querySelector('.pictures');

var THROTTLE_DELAY = 100;

/**
* количество картинок на страницу
* @constant {number}
*/
var PAGE_SIZE = 12;

/**
* номер текущей страницы
* {number}
*/
var pageNumber = 0;

/**
* адрес загрузки данных
* @constant {string}
*/
var URL_LOAD_PICTURES = '//o0.github.io/assets/json/pictures.json';

/** @type {Array.<Object>} */
var pictures = [];

/** @type {Array.<Object>} */
var renderedPictures = [];

/** @type {Array.<Object>} */
var filterPictures = [];

/**
* таймаут загрузки картинок
*/
/** @constant {number}*/
var IMAGE_LOAD_TIMEOUT = 15000;

/**
* отрисовываем полученные данные в соответствии с template
*/
var renderPictures = function(picturesar, page) {
  var frompage = page * PAGE_SIZE;
  var topage = frompage + PAGE_SIZE;
  var container = document.createDocumentFragment();
  picturesar.slice(frompage, topage).forEach(function(picture) {
    renderedPictures.push(new Picture(picture, container));
  });
  picturesContainer.appendChild(container);
};

/**
* обработчик позиции на странице
*/
var setWindowAdd = function(reset) {
  if(reset) {
    pageNumber = 0;
    renderedPictures.forEach(function(picture) {
      picture.remove();
    });
    renderedPictures = [];
  }
  while(utilities.isBottomPage(picturesContainer) && utilities.isNextPageAvailable(pictures.length, pageNumber, PAGE_SIZE)) {
    renderPictures(filterPictures, pageNumber);
    pageNumber++;
  }
};

var optScroll = utilities.throttle(setWindowAdd, THROTTLE_DELAY);

/**
* установка checked радиобаттонам для отрисовки активного фильтра
*/
var setFilterPicture = function(filter) {
  filterPictures = filterPict.getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filterPictures, pageNumber);
  setWindowAdd(true);
  gallery.savePictures(filterPictures);
  var activeFilter = filterBlock.checked;
  if(activeFilter) {
    activeFilter.checked = false;
  }
  var filterToActive = document.getElementById(filter);
  filterToActive.checked = true;
};

/**
* выбор по клику активного фильтра из массива кнопок формы фильтров
*/
var setFilterPictures = function() {
  var filters = filterBlock.querySelectorAll('.filters-radio');
  filters.forEach(function(elem) {
    var count = setCountFilterPictures(elem.id);
    if(count <= 0) {
      elem.classList.add('filter-disabled');
      elem.setAttribute('disabled', 'disabled');
    }
    elem.onclick = function() {
      setFilterPicture(this.id);
      localStorage.setItem('lastPicturesFilter', this.id);
    };
  });
};

/**
* функция простановки sup с количеством элементов фильтра
*/
var setCountFilterPictures = function(filter) {
  filterPictures = filterPict.getFilteredPictures(pictures, filter);
  var sawCountFilter = document.createElement('sup');
  sawCountFilter.innerHTML = filterPictures.length;
  var currentFilter = filterBlock.querySelector('input' + '#' + filter + '~label');
  currentFilter.outerHTML = currentFilter.outerHTML + sawCountFilter.outerHTML;
  return filterPictures.length;
};
filterBlock.classList.add('hidden');
loaded(URL_LOAD_PICTURES, IMAGE_LOAD_TIMEOUT, picturesContainer, function(loadedPictures) {
  pictures = loadedPictures;
  setFilterPictures();
  setFilterPicture(localStorage.getItem('lastPicturesFilter') || 'filter-popular');
  if(location.hash !== '') {
    gallery._onHashChange();
  }
  window.addEventListener('scroll', optScroll);
});
filterBlock.classList.remove('hidden');
