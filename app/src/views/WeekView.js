define(function(require, exports, module) {
  // import dependencies
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var RenderNode = require('famous/core/RenderNode');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require("famous/views/GridLayout");
  var Transitionable = require('famous/transitions/Transitionable');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function WeekView() {
    View.apply(this, arguments);
  }

  WeekView.prototype = Object.create(View.prototype);
  WeekView.prototype.constructor = WeekView;

  WeekView.DEFAULT_OPTIONS = {
  };

  module.exports = WeekView;
});