'use strict';

var templatePicture = document.querySelector('template');

var IMAGE_LOAD_TIMEOUT = 10000;

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
    clearTimeout(picturesLoadTimeout);
    element.classList.add('picture-load-failure');
  };
  picturesLoadTimeout = setTimeout(function() {
    pictureImage.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
  return element;
};

module.exports = getPictureElement;
