'use strict';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
//var gallery = require('../gallery');
var getPictureElement = require('./get-pictures-element');
var utilities = require('../utilities');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  this.element.addEventListener('click', this.onPictureClick.bind(this));
  this.element.addEventListener('keydown', this.onPictureKeydown.bind(this));
  container.appendChild(this.element);

};
Picture.prototype.onPictureClick = function(evt) {
  if (evt.target.tagName === 'IMG') {
    evt.preventDefault();
    location.hash = '#photo/' + this.data.url;
  }
};

Picture.prototype.onPictureKeydown = function(evt) {
  if(utilities.isDeactivationEvent(evt)) {
    evt.preventDefault();
    location.hash = '';
  }
};

Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPictureClick.bind(this));
  this.element.removeEventListener('keydown', this.onPictureKeydown.bind(this));
  this.element.parentNode.removeChild(this.element);
};
module.exports = Picture;
