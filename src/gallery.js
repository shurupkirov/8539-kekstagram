'use strict';
var utilities = require('./utilities');

var Photogallery = function() {

  this.galleryContainer = document.querySelector('.gallery-overlay');
  var previewContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
  var closePhoto = this.galleryContainer.querySelector('.gallery-overlay-close');
  var likeContainer = this.galleryContainer.querySelector('.likes-count');
  var commentContainer = this.galleryContainer.querySelector('.comments-count');
  var galleryPhoto = [];

  var self = this;
  this.activePhoto = 0;
  this.savePictures = function(pictures) {
    if(pictures !== galleryPhoto) {
      galleryPhoto = [];
      galleryPhoto = pictures;
      pictures.forEach(function(pict) {
        var photo = new Image();
        photo.src = pict;
      }, this);
    }
  };

  var _onPhotoClick = function() {
    self.activePhoto += 1;
    if(self.activePhoto === galleryPhoto.length) {
      self.activePhoto = 0;
    }
    setActivePhoto(self.activePhoto);
  };

  var _onDocumentKeyDown = function(evt) {
    if(utilities.isDeactivationEvent(evt)) {
      evt.preventDefault();
      self.hidePhoto();
    }
  };

  var _onCloseClickHandler = function() {
    self.hidePhoto();
  };

  var setActivePhoto = function(activPhoto) {
    previewContainer.src = galleryPhoto[activPhoto].url;
    likeContainer.innerHTML = galleryPhoto[activPhoto].likes;
    commentContainer.innerHTML = galleryPhoto[activPhoto].comments;
  };

  this.showPhoto = function(picture) {
    this.activePhoto = galleryPhoto.indexOf(picture);
    setActivePhoto(this.activePhoto);
    self.galleryContainer.classList.remove('invisible');
    previewContainer.addEventListener('click', _onPhotoClick);
    document.addEventListener('keydown', _onDocumentKeyDown);
    closePhoto.addEventListener('click', _onCloseClickHandler);
  };
  this.hidePhoto = function() {
    self.galleryContainer.classList.add('invisible');
    previewContainer.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    closePhoto.removeEventListener('click', this._onCloseClickHandler);
  };

};

var photoGallery = new Photogallery();
module.exports = {
  showPhoto: photoGallery.showPhoto,
  savePictures: photoGallery.savePictures
};
