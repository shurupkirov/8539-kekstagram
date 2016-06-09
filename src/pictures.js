'use strict';
var filterBlock = document.querySelector('.filters');
filterBlock.classList.add('.hidden');

var IMAGE_LOAD_TIMEOUT = 5000;

var picturesContainer = document.querySelector('.pictures');
var templatePicture = document.querySelector('template');
var pictureToClone;
if('content' in templatePicture) {
  pictureToClone = templatePicture.content.querySelector('.picture');
} else {
  pictureToClone = templatePicture.querySelector('.picture');
}
var getPictureElement = function(data, container) {
  var element = pictureToClone.cloneNode(true);
  container.appendChild(element);
  var pictureImage = new Image();
  var picturesLoadTimeout;
  pictureImage.onload = function() {
    clearTimeout(picturesLoadTimeout);
    element.height = 182;
    element.width = 182;
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
window.pictures.forEach(function(picture) {
  getPictureElement(picture, picturesContainer);
});
