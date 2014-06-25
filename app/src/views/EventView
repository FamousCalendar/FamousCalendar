/*** EventView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Settings = require('config/AppSettings');

    // Constructor function for our EventView class
    function EventView(event) {

        // Applies View's constructor function to EventView class
        View.apply(this, arguments);


        //Stub event height
        var hourHeight = 100;

        //Calculate length of event in minutes
        var duration = (parseInt(event.end.slice(0, 2), 10) * 60 + parseInt(event.end.slice(3), 10)) 
            - (parseInt(event.start.slice(0, 2), 10) * 60 + parseInt(event.start.slice(3), 10));

        this.add(new Surface({
            size: [undefined, duration/60 * hourHeight],
            content: '<h>' + event.title + '</h>',
            properties: {
                backgroundColor: '#7201ce',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        }));

        // title : this.titleField.getValue(),
        // date : this.dateField.getValue(),
        // location : this.locationField.getValue(),
        // start : this.startField.getValue(),
        // end : this.endField.getValue()
    }

    // Establishes prototype chain for EventView class to inherit from View
    EventView.prototype = Object.create(View.prototype);
    EventView.prototype.constructor = EventView;

    // Default options for EventView class
    EventView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = EventView;
});
