'use strict';
var utilities = require('./utilities');

var Gallery = function() {

  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.previewContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.closePhoto = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.likeContainer = this.galleryContainer.querySelector('.likes-count');
  this.commentContainer = this.galleryContainer.querySelector('.comments-count');
  this.galleryPhoto = [];
  this.galleryPhotoSrc = [];
  this.activePhoto = 0;

  this.savePictures = this.savePictures.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this.remove = this.remove.bind(this);
  this._onHashChange = this._onHashChange.bind(this);

  window.addEventListener('hashchange', this._onHashChange);

};

Gallery.prototype.savePictures = function(pictures) {
  if(pictures !== this.galleryPhoto) {
    this.galleryPhoto = [];
    this.galleryPhoto = pictures;
    pictures.forEach(function(pict) {
      this.galleryPhotoSrc.push(pict.url);
    }, this);
  }
};

Gallery.prototype._onPhotoClick = function() {
  this.activePhoto += 1;
  if(this.activePhoto === this.galleryPhoto.length) {
    this.activePhoto = 0;
  }
  var nextPhoto = this.galleryPhoto[this.activePhoto].url;
  location.hash = '#photo/' + nextPhoto;
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if(utilities.isDeactivationEvent(evt)) {
    evt.preventDefault();
    location.hash = '';
  }
};

Gallery.prototype._onCloseClickHandler = function() {
  location.hash = '';
};

Gallery.prototype.showPhoto = function(picture) {
  this.setActivePhoto(picture);
  this.galleryContainer.classList.remove('invisible');
  this.previewContainer.addEventListener('click', this._onPhotoClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.closePhoto.addEventListener('click', this._onCloseClickHandler);
};

Gallery.prototype.hidePhoto = function() {
  this.galleryContainer.classList.add('invisible');
  this.remove();
};

Gallery.prototype.remove = function() {
  this.previewContainer.removeEventListener('click', this._onPhotoClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.closePhoto.removeEventListener('click', this._onCloseClickHandler);
};

Gallery.prototype.setActivePhoto = function(activPhoto) {
  this.activePhoto = this.galleryPhotoSrc.indexOf(activPhoto);
  this.previewContainer.src = this.galleryPhoto[this.activePhoto].url;
  this.likeContainer.innerHTML = this.galleryPhoto[this.activePhoto].likes;
  this.commentContainer.innerHTML = this.galleryPhoto[this.activePhoto].comments;
};

Gallery.prototype._onHashChange = function() {
  var currentHash = location.hash;
  var getPhotoUrl = /#photo\/(\S+)/.exec(currentHash);
  if(getPhotoUrl) {
    if(this.galleryPhoto.some(function(photo) {
      return photo.url === getPhotoUrl[1];
    })) {
      this.showPhoto(getPhotoUrl[1]);
    } else {
      location.hash = '';
    }
  } else {
    this.hidePhoto();
    location.hash = '';
  }
};


module.exports = new Gallery();
