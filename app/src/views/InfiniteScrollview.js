/*** InfiniteScrollview.js ***
 *  Wayland Woodruff
 *  WaylandWoodruff@gmail.com
 */

define(function(require, exports, module) {
  var ViewSequence  = require('famous/core/ViewSequence');
  var Scrollview    = require('famous/views/Scrollview');
  
  function InfiniteScrollview() {
    Scrollview.apply(this, arguments);
    
    /*  Each time this class is instantiated, this variable needs to be assigned
     *  a function to update node data. The function will be passed two arguments:
     *  1: The node to be updated
     *  2: The current, active node in the scrollview used as a point of reference
     *  3: The index offset (negative means a previous node, positive means a forward node)
     */
    this.updateNodeBuffer = null;
  }
  
  InfiniteScrollview.DEFAULT_OPTIONS = {};
  
  InfiniteScrollview.prototype = Object.create(Scrollview.prototype);
  InfiniteScrollview.prototype.constructor = InfiniteScrollview;
  
  InfiniteScrollview.prototype.render = function render() {
    if (!this._node) return null;

    _normalizeState.call(this);       //  Had to bring in render because this function needed to be modified
    _handleEdge.call(this, this._scroller.onEdge());
    if (this.options.paginated) _handlePagination.call(this);

    return this._scroller.render();
  };
  
  InfiniteScrollview.prototype.oldGoToNextPage = InfiniteScrollview.prototype.goToNextPage;
  InfiniteScrollview.prototype.goToNextPage = function goToNextPage() {
    this.oldGoToNextPage();
    _updateNodeBuffer.call(this);
  };
  
  InfiniteScrollview.prototype.oldGoToPreviousPage = InfiniteScrollview.prototype.goToPreviousPage;
  InfiniteScrollview.prototype.goToPreviousPage = function goToPreviousPage() {
    this.oldGoToPreviousPage();
    _updateNodeBuffer.call(this);
  };
  
  /** @const */
  var TOLERANCE = 0.5;
  
  /** @enum */
  var SpringStates = {
    NONE: 0,
    EDGE: 1,
    PAGE: 2
  };
  
  function _attachAgents() {    //  Copy/Pasted here from Scrollview.js
    if (this._springState) this._physicsEngine.attach([this.spring], this._particle);
    else this._physicsEngine.attach([this.drag, this.friction], this._particle);
  }
  
  function _detachAgents() {    //  Copy/Pasted here from Scrollview.js
    this._springState = SpringStates.NONE;
    this._physicsEngine.detachAll();
  }
  
  function _emitNodeChange(direction) {
    if (this.emitNodeChange) this.emitNodeChange.call(this, direction);
  } //  End _emitNodeChange
  
  function _handleEdge(edgeDetected) {      //  Copy/Pasted here from Scrollview.js
    if (!this._onEdge && edgeDetected) {
      this.sync.setOptions({scale: this.options.edgeGrip});
      if (!this._touchCount && this._springState !== SpringStates.EDGE) {
          _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
      }
    }
    else if (this._onEdge && !edgeDetected) {
      this.sync.setOptions({scale: 1});
      if (this._springState && Math.abs(this.getVelocity()) < 0.001) {
          // reset agents, detaching the spring
          _detachAgents.call(this);
          _attachAgents.call(this);
      }
    }
    this._onEdge = edgeDetected;
  }
  
  function _handlePagination() {      //  Copy/Pasted here from Scrollview.js
    if (!this._needsPaginationCheck) return;
    
    if (this._touchCount) return;
    if (this._springState === SpringStates.EDGE) return;
    
    var velocity = this.getVelocity();
    if (Math.abs(velocity) >= this.options.pageStopSpeed) return;
    
    var position = this.getPosition();
    var velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed;
    
    // parameters to determine when to switch
    var nodeSize = _nodeSizeForDirection.call(this, this._node);
    var positionNext = position > 0.5 * nodeSize;
    var velocityNext = velocity > 0;
    
    if ((positionNext && !velocitySwitch) || (velocitySwitch && velocityNext)) this.goToNextPage();
    else _setSpring.call(this, 0, SpringStates.PAGE);
    
    this._needsPaginationCheck = false;
  }
  
  function _nodeChange(direction) {
    _updateNodeBuffer.call(this);
    if (direction === 'next') direction = 1;
    else if (direction === 'prev') direction = -1;
    else direction = 0
    _emitNodeChange.call(this, direction); 
  } //  End _nodeChange
  
  function _nodeSizeForDirection(node) {    //  Copy/Pasted here from Scrollview.js
    var direction = this.options.direction;
    var nodeSize = (node.getSize() || this._scroller.getSize())[direction];
    if (!nodeSize) nodeSize = this._scroller.getSize()[direction];
    return nodeSize;
  }
  
  function _normalizeState() {    //  Copy/Pasted from Scrollview.js with 2 additions
    var position = this.getPosition();
    var nodeSize = _nodeSizeForDirection.call(this, this._node);
    var nextNode = this._node.getNext();
    
    while (position > nodeSize + TOLERANCE && nextNode) {
      _shiftOrigin.call(this, -nodeSize);
      position -= nodeSize;
      this._scroller.sequenceFrom(nextNode);
      this._node = nextNode;
      _nodeChange.call(this, 'next');     //    <======= Added
      nextNode = this._node.getNext();
      nodeSize = _nodeSizeForDirection.call(this, this._node);
    }
    
    var previousNode = this._node.getPrevious();
    var previousNodeSize;
    
    while (position < -TOLERANCE && previousNode) {
      previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
      this._scroller.sequenceFrom(previousNode);
      this._node = previousNode;
      _nodeChange.call(this, 'prev');     //    <======= Added
      _shiftOrigin.call(this, previousNodeSize);
      position += previousNodeSize;
      previousNode = this._node.getPrevious();
    }
  }
  
  function _setSpring(position, springState) {    //  Copy/Pasted here from Scrollview.js
    var springOptions;
    if (springState === SpringStates.EDGE) {
      this._edgeSpringPosition = position;
     springOptions = {
        anchor: [this._edgeSpringPosition, 0, 0],
        period: this.options.edgePeriod,
       dampingRatio: this.options.edgeDamp
      };
    }
    else if (springState === SpringStates.PAGE) {
     this._pageSpringPosition = position;
      springOptions = {
        anchor: [this._pageSpringPosition, 0, 0],
        period: this.options.pagePeriod,
        dampingRatio: this.options.pageDamp
      };
    }
    
    this.spring.setOptions(springOptions);
    if (springState && !this._springState) {
      _detachAgents.call(this);
      this._springState = springState;
      _attachAgents.call(this);
    }
    this._springState = springState;
  }
  
  function _shiftOrigin(amount) {   //  Copy/Pasted here from Scrollview.js
    this._edgeSpringPosition += amount;
    this._pageSpringPosition += amount;
    this.setPosition(this.getPosition() + amount);
    if (this._springState === SpringStates.EDGE) {
      this.spring.setOptions({anchor: [this._edgeSpringPosition, 0, 0]});
    }
    else if (this._springState === SpringStates.PAGE) {
      this.spring.setOptions({anchor: [this._pageSpringPosition, 0, 0]});
    }
  }
  
  function _updateNodeBuffer() {
    /*  Updates the data in the furthest two nodes from the current index */
    //  Has no effect if not looping
    if (!this._node._.loop) return;
    if (typeof this.updateNodeBuffer !== 'function') return;
    
    var currentIndex  = this._node.getIndex();
    var nodeArray     = this._node._.array;
    var arrayLength   = nodeArray.length;
    var offset        = null;
    var targetIndex   = null;
    
    if (arrayLength < 3) return;
    
    //  Set data for furthest previous node
    offset      = Math.floor(arrayLength / 2);
    targetIndex = currentIndex - offset;
    if (targetIndex < 0) targetIndex += arrayLength;
    if (this.updateNodeBuffer) this.updateNodeBuffer(nodeArray[targetIndex], nodeArray[currentIndex], -offset, targetIndex, currentIndex);
    
    //  Set data for furthest forward node
    offset      = Math.floor((arrayLength - 0.5) / 2);
    targetIndex = currentIndex + offset;
    if (targetIndex >= arrayLength) targetIndex -= nodeArray.length;
    if (this.updateNodeBuffer) this.updateNodeBuffer(nodeArray[targetIndex], nodeArray[currentIndex], offset, targetIndex, currentIndex);
  }
  
  module.exports = InfiniteScrollview;
});
