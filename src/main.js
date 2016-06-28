'use strict';
require('./resizer');
require('./upload');
//require('./pictures');

var loaded = require('./loaded');
var Picture = require('./pictures');
var utilities = require('./utilities');

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
var filterBlock = document.querySelector('.filters');

/** @constant*/
var CURRENT_DATE = new Date();
CURRENT_DATE = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - 4);

/*
* скрываем при загрузке страницы блок с фильтрами
*/
filterBlock.classList.add('hidden');

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

//var picturesContainer = document.querySelector('.pictures');

/**
* отрисовываем полученные данные в соответствии с template
*/
var renderPictures = function(picturesar, page, replace) {
  if(replace) {
    picturesContainer.innerHTML = '';
  }
  var frompage = page * PAGE_SIZE;
  var topage = frompage + PAGE_SIZE;
  var container = document.createDocumentFragment();
  picturesar.slice(frompage, topage).forEach(function(picture) {
//    getPictureElement(picture, picturesContainer, IMAGE_LOAD_TIMEOUT);
    renderedPictures.push(new Picture(picture, container));
  });
  picturesContainer.appendChild(container);
};

/**
* обработчик позиции на странице
*/
var setWindowAdd = function() {
  while(utilities.isBottomPage(picturesContainer) && utilities.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
    renderPictures(filterPictures, pageNumber);
    pageNumber++;
  }
};

var optScroll = utilities.throttle(setWindowAdd, THROTTLE_DELAY);
/**
* фильтрация данныех согласно правилам
*/
var getFilteredPictures = function(picturesar, filter) {
  var picturesToFilter = picturesar.slice(0);
  switch(filter) {
    case 'filter-popular':
      break;
    case 'filter-new':
      picturesToFilter.sort(function(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateB - dateA;
      });
/*использование filter вместо цикла for*/
      picturesToFilter = picturesToFilter.filter(function(itemnew) {
        var newdate = Date.parse(itemnew.date) / 1000;
        return newdate > Date.parse(CURRENT_DATE) / 1000;
      });
      break;
    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return a.comments - b.comments;
      });
      break;
  }
  return picturesToFilter;
};

/**
* установка checked радиобаттонам для отрисовки активного фильтра
*/
var setFilterPicture = function(filter) {
  filterPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filterPictures, pageNumber, true);
  setWindowAdd();
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
  for (var i = 0; i < filters.length; i++) {
    var count = setCountFilterPictures(filters[i].id);
    if(count <= 0) {
      filters[i].classList.add('filter-disabled');
      filters[i].setAttribute('disabled', 'disabled');
    }
    filters[i].onclick = function() {
      setFilterPicture(this.id);
    };
  }
};
/**
* функция простановки sup с количеством элементов фильтра
*/
var setCountFilterPictures = function(filter) {
  filterPictures = getFilteredPictures(pictures, filter);
  var sawCountFilter = document.createElement('sup');
  sawCountFilter.innerHTML = filterPictures.length;
  var currentFilter = filterBlock.querySelector('input' + '#' + filter + '~label');
  currentFilter.outerHTML = currentFilter.outerHTML + sawCountFilter.outerHTML;
  return filterPictures.length;
};

loaded(URL_LOAD_PICTURES, IMAGE_LOAD_TIMEOUT, picturesContainer, function(loadedPictures) {
  pictures = loadedPictures;
  setFilterPictures(true);
  setFilterPicture('filter-popular');
  window.addEventListener('scroll', optScroll);
});
