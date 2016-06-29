'use strict';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
var filterBlock = document.querySelector('.filters');

/** @type {Array.<Object>} */
//!var pictures = [];

/** @type {Array.<Object>} */
//!var filteredPictures = [];

/** @constant*/
//!var CURRENT_DATE = new Date();
//!CURRENT_DATE = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - 4);
/*
* скрываем при загрузке страницы блок с фильтрами
*/
filterBlock.classList.add('hidden');
/**
* таймаут загрузки картинок
*/
/** @constant {number}*/

//!var IMAGE_LOAD_TIMEOUT = 15000;


//var loaded = require('./loaded');
//var utilities = require('./utilities');
var getPictureElement = require('./get-pictures-element');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  container.appendChild(this.element);
};
module.exports = Picture;


//!var picturesContainer = document.querySelector('.pictures');

/*!var THROTTLE_DELAY = 100;*/
/**
* обработчик позиции на странице
*/
/*!
var setWindowAdd = function() {
  if(utilities.isBottomPage(picturesContainer) && utilities.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};
*/
/*!var optScroll = utilities.throttle(setWindowAdd, THROTTLE_DELAY);*/

/**
* отрисовываем полученные данные в соответствии с template
*/
/*!
var renderPictures = function(picturesar, page, replace) {
  if(replace) {
    picturesContainer.innerHTML = '';
  }
  var frompage = page * PAGE_SIZE;
  var topage = frompage + PAGE_SIZE;
  picturesar.slice(frompage, topage).forEach(function(picture) {
    getPictureElement(picture, picturesContainer, IMAGE_LOAD_TIMEOUT);
  });
};
*/
/**
* фильтрация данныех согласно правилам
*/
/*!
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
*/

/**
* установка checked радиобаттонам для отрисовки активного фильтра
*/
/*!
var setFilterPicture = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  setWindowAdd();
  var activeFilter = filterBlock.checked;
  if(activeFilter) {
    activeFilter.checked = false;
  }
  var filterToActive = document.getElementById(filter);
  filterToActive.checked = true;
};
*/

/**
* выбор по клику активного фильтра из массива кнопок формы фильтров
*/
/*!
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
*/

/**
* функция простановки sup с количеством элементов фильтра
*/
/*!
var setCountFilterPictures = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  var sawCountFilter = document.createElement('sup');
  sawCountFilter.innerHTML = filteredPictures.length;
  var currentFilter = filterBlock.querySelector('input' + '#' + filter + '~label');
  currentFilter.outerHTML = currentFilter.outerHTML + sawCountFilter.outerHTML;
  return filteredPictures.length;
};
*/

/*!
loaded(URL_LOAD_PICTURES, IMAGE_LOAD_TIMEOUT, picturesContainer, function(loadedPictures) {
  pictures = loadedPictures;
  setFilterPictures(true);
  setFilterPicture('filter-popular');
  window.addEventListener('scroll', optScroll);
});
*/
filterBlock.classList.remove('hidden');
