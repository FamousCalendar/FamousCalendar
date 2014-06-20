/*** RowsView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  function RowsView(options) {
    View.apply(this, arguments);
    
    _createRows.call(this);
  }
  
  RowsView.DEFAULT_OPTIONS = {
    scrollView: null,
    timeUnit: 30,
    rowSize: [undefined, 30, 0],
    rowColorDayPrimary: '#FFFF66',
    rowColorDaySecondary: '#FFFF99',
    rowColorNightPrimary: '#BBBBFF',
    rowColorNightSecondary: '#DDDDFF'
  };
  
  RowsView.prototype = Object.create(View.prototype);
  RowsView.prototype.constructor = RowsView;
  RowsView.prototype.getTotalSize = function getTotalSize() {
    var sizeX = this.options.rowSize[0];
    var sizeY = this.options.rowSize[1] * (1440 / this.options.timeUnit);
    var sizeZ = this.options.rowSize[2];
    
    return [sizeX, sizeY, sizeZ];
  };  //  End RowsView.prototype.getTotalSize
  
  function _createRows() {
    //  Get number of rows to create based on time units being used
    var tUnit = this.options.timeUnit;
    var numRows = (1440 / tUnit);   //  number of half-hour segments in 24 hours
    var rowColor = 'FFFFFF';
    
    for (var i = 0; i < numRows; i++) {
      var rowModifier = new StateModifier({
        origin: [0, 0],
        align: [0, 0],
        size: this.options.rowSize,
        transform: Transform.translate(0, (this.options.rowSize[1] * i), 0)
      });
      
      if ((i < (numRows * 0.25)) || (i >= (numRows * 0.75))) {
        if ((i % 2) === 0) {
          rowColor = this.options.rowColorNightPrimary;
        } else {
          rowColor = this.options.rowColorNightSecondary;
        }
      } else {
        if ((i % 2) === 0) {
          rowColor = this.options.rowColorDayPrimary;
        } else {
          rowColor = this.options.rowColorDaySecondary;
        }
      }
      
      var rowSurface = new Surface({
        properties: {
          backgroundColor: rowColor,
          zIndex: -1
        }
      });
      if (this.options.scrollView) rowSurface.pipe(this.options.scrollView);
      
      this.add(rowModifier).add(rowSurface);
    }
  } //  End _createRows
  
  module.exports = RowsView;
});
