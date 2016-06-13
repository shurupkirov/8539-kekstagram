'use strict';
/**
* dataurl - адрес с данными jsonp
* callBackData - функция кэллбэка
*/
function getDataJSP(dataurl, callBackData) {
  var scripts = document.querySelectorAll('script');
  var script = document.createElement('script');
  script.setAttribute('src', dataurl);
  document.body.insertBefore(script, scripts[0]);
  window.__picturesLoadCallback = function(data) {
    callBackData(data);
  };
}
var filterBlock = document.querySelector('.filters');
filterBlock.classList.add('hidden');
/**
* таймаут загрузки картинок
*/
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
getDataJSP('//up.htmlacademy.ru/assets/js_intensive/jsonp/pictures.js', function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
});
filterBlock.classList.remove('hidden');
