'use strict';

/**
* адрес загрузки данных
* @constant {string}
*/
var URL_LOAD_PICTURES = '//o0.github.io/assets/json/pictures.json';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
var filterBlock = document.querySelector('.filters');

/** @type {Array.<Object>} */
var pictures = [];
/** @constant*/
var CURRENT_DATE = new Date();
CURRENT_DATE = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - 4);
/*
* скрываем при загрузке страницы блок с фильтрами
*/
filterBlock.classList.add('hidden');
/**
* таймаут загрузки картинок
*/
/** @constant {number}*/
var IMAGE_LOAD_TIMEOUT = 10000;

var picturesContainer = document.querySelector('.pictures');
var templatePicture = document.querySelector('template');
var pictureToClone;
if('content' in templatePicture) {
  pictureToClone = templatePicture.content.querySelector('.picture');
} else {
  pictureToClone = templatePicture.querySelector('.picture');
}

/*
* функция клонирования элементов из шаблона
*/
var getPictureElement = function(data, container) {
  var element = pictureToClone.cloneNode(true);
  container.appendChild(element);
  var pictureImage = new Image();
  pictureImage = element.querySelector('img');
  var picturesLoadTimeout;
  pictureImage.onload = function() {
    clearTimeout(picturesLoadTimeout);
    pictureImage.height = 182;
    pictureImage.width = 182;
  };
  pictureImage.src = data.url;
  pictureImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  picturesLoadTimeout = setTimeout(function() {
    pictureImage.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  return element;
};

/**
* получение массива json, добавление класса загрузки картинок
* пока запрос выполняется. Если запрос завершился ошибкой
* или таймаутом - добавляем класс ошибки
*/
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    picturesContainer.classList.add('pictures-failure');
    picturesContainer.classList.remove('pictures-loading');
  };
  xhr.onerror = function() {
    picturesContainer.classList.add('pictures-failure');
    picturesContainer.classList.remove('pictures-loading');
  };
  picturesContainer.classList.add('pictures-loading');
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      picturesContainer.classList.remove('pictures-loading');
    }
  };
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  xhr.open('GET', URL_LOAD_PICTURES);
  xhr.send();
};

/**
* отрисовываем полученные данные в соответствии с template
*/
var renderPictures = function(picturesar) {
  picturesContainer.innerHTML = '';
  picturesar.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

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
      for (var i = 0; i < picturesToFilter.length; i++) {
        var datePictures = Date.parse(picturesToFilter[i].date) / 1000;
        if(datePictures < Date.parse(CURRENT_DATE) / 1000) {
          picturesToFilter.splice(i, picturesToFilter.length);
        }
      }
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
  var filteredPictures = getFilteredPictures(pictures, filter);
  renderPictures(filteredPictures);
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
  console.log(filters);
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
  var filteredPictures = getFilteredPictures(pictures, filter);
  var sawCountFilter = document.createElement('sup');
  sawCountFilter.innerHTML = filteredPictures.length;
  var currentFilter = filterBlock.querySelector('input' + '#' + filter + '~label');
  currentFilter.outerHTML = currentFilter.outerHTML + sawCountFilter.outerHTML;
  return filteredPictures.length;
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
//  renderPictures(pictures);
  setFilterPictures(true);
  setFilterPicture('filter-popular');
});
filterBlock.classList.remove('hidden');
