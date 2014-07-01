/*** EventView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Settings = require('config/AppSettings');
    var Transitionable = require('famous/transitions/Transitionable');
    var Modifier = require('famous/core/Modifier');
    var Easing = require('famous/transitions/Easing');
    var EventDetails = require('views/EventDetailsView');
    var AppSettings = require('config/AppSettings');

    // Constructor function for our EventView class
    function EventView(event) {

        // Applies View's constructor function to EventView class
        View.apply(this, arguments);

        this.event = event;

        //Stub event height
        var hourHeight = 60;

        //Calculate length of event in minutes
        var duration = (parseInt(event.end.slice(0, 2), 10) * 60 + parseInt(event.end.slice(3), 10)) 
            - (parseInt(event.start.slice(0, 2), 10) * 60 + parseInt(event.start.slice(3), 10));


        var eventSize = new Transitionable(0);
        var eventOpacity = new Transitionable(0);


        this.eventSurface = new Surface({
            size: [(window.outerWidth - AppSettings.timelineView.getTimebarWidth() - 20), duration/60 * hourHeight],
            content: '<h3>' + event.title + '</h3><p>Where: ' + event.location + '</p>',
            opacity: 0.5,
            properties: {
                backgroundColor: '#CCCCCC',//'#7201ce',
                lineHeight: '10px',
                marginTop: '0px',
                overflow: 'hidden',
                paddingLeft: '4px',
                // boxShadow: '5px 5px 3px -3px',
                fontSize: '13px',
                //color: '#686675',
                color: 'black',
                fontFamily: 'sans-serif',
                borderLeft: '2px solid gray'
            }
        });


        var eventModifier = new Modifier({
            origin: [0.5, 0],
            align: [0.578, 0],
            opacity: 0.75
        });

        this.add(eventModifier).add(this.eventSurface);


        this.eventSurface.on('click', function(){
            this._eventOutput.emit('showDetails', this);
            console.log('in EventView');
        }.bind(this));

    }

    // Establishes prototype chain for EventView class to inherit from View
    EventView.prototype = Object.create(View.prototype);
    EventView.prototype.constructor = EventView;

    // Default options for EventView class
    EventView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = EventView;
});
