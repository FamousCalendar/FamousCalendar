/*** RowsView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  function RowsView() {
    View.apply(this, arguments);
  }
  
  RowsView.DEFAULT_OPTIONS = {};
  
  RowsView.prototype = Object.create(View.prototype);
  RowsView.prototype.constructor = RowsView;
  
  module.exports = RowsView;
});
