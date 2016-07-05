'use strict';
var utilities = require('./utilities');

var Gallery = function() {

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
      location.hash = '';
      self.hidePhoto();
    }
  };

  var _onCloseClickHandler = function() {
    location.hash = '';
    self.hidePhoto();
  };

  this._onHashChange = function() {
    var currentHash = location.hash;
    var getPhotoUrl = /#photo\/(\S+)/.exec(currentHash);
    if(getPhotoUrl) {
      if(galleryPhoto.some(function(photo) {
        return photo.url === getPhotoUrl[1];
      })) {
        self.showPhoto(getPhotoUrl[1]);
      } else {
        self.hidePhoto();
        location.hash = '';
      }
    } else {
      self.hidePhoto();
    }
  };

  var setActivePhoto = function(activPhoto) {
    galleryPhoto.filter(function(el, i) {
      if(el.url === activPhoto) {
        console.log(activPhoto);
        self.activePhoto = i;
        previewContainer.src = activPhoto;
        likeContainer.innerHTML = el.likes;
        commentContainer.innerHTML = el.comments;
      }
      return self.activePhoto;
    });
/*
    previewContainer.src = galleryPhoto[activPhoto].url;
    likeContainer.innerHTML = galleryPhoto[activPhoto].likes;
    commentContainer.innerHTML = galleryPhoto[activPhoto].comments;
    */
  };
  this.remove = function() {
    previewContainer.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    closePhoto.removeEventListener('click', this._onCloseClickHandler);
  };

  this.showPhoto = function(picture) {
//    this.activePhoto = galleryPhoto.indexOf(picture);
//    setActivePhoto(this.activePhoto);
    setActivePhoto(picture);
    self.galleryContainer.classList.remove('invisible');
    previewContainer.addEventListener('click', _onPhotoClick);
    document.addEventListener('keydown', _onDocumentKeyDown);
    closePhoto.addEventListener('click', _onCloseClickHandler);
  };
  this.hidePhoto = function() {
    self.galleryContainer.classList.add('invisible');
    this.remove();
  };

  window.addEventListener('hashchange', this._onHashChange);

};

module.exports = new Gallery();
