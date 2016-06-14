'use strict';
/**
* dataurl - адрес с данными jsonp
* callBackData - функция кэллбэка
*/
/*
function getDataJSP(dataurl, callBackData) {
  var scripts = document.querySelectorAll('script');
  var script = document.createElement('script');
  script.setAttribute('src', dataurl);
  document.body.insertBefore(script, scripts[0]);
  window.__picturesLoadCallback = function(data) {
    callBackData(data);
  };
}
*/
/**
* адрес загрузки данных
* @constant {string}
*/
var URL_LOAD_PICTURES = '//o0.github.io/assets/json/pictures.json';
var filterBlock = document.querySelector('.filters');
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
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();
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
var renderPictures = function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};
getPictures(function(loadedPictures) {
  var pictures = loadedPictures;
  renderPictures(pictures);
});
filterBlock.classList.remove('hidden');
