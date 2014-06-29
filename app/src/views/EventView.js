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

    // Constructor function for our EventView class
    function EventView(event) {

        // Applies View's constructor function to EventView class
        View.apply(this, arguments);


        //Stub event height
        var hourHeight = 60;

        //Calculate length of event in minutes
        var duration = (parseInt(event.end.slice(0, 2), 10) * 60 + parseInt(event.end.slice(3), 10)) 
            - (parseInt(event.start.slice(0, 2), 10) * 60 + parseInt(event.start.slice(3), 10));


        var eventSize = new Transitionable(0);
        var eventOpacity = new Transitionable(0);


        this.eventSurface = new Surface({
            size: [window.outerWidth/2, duration/60 * hourHeight],
            content: '<h>' + event.title + '</h>',
            properties: {
                backgroundColor: '#7201ce',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });


        var eventModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function(){
                var x = /*window.innerWidth/2*/ 1 + (1 * eventSize.get());
                var y = /*duration/60 * hourHeight*/1 + ((window.outerHeight/(duration/60 * hourHeight)) * eventSize.get());
                return Transform.scale(x, y, 6);
            }.bind(this)
        });

        // this.eventSurface.setSize(function(){return eventSize.get()});

        // eventModifier.sizeFrom(Transform.scale(eventSize.get()).bind(this));

        this.add(eventModifier).add(this.eventSurface);


        this.eventSurface.on('click', function(){
            //expand
            console.log(eventModifier);
            // eventModifier.setTransform(Transform.translate(0, 0, 1000), {duration: 1000, curve: Easing.inExpo});
            eventSize.set(.99, {duration: 1000, curve: Easing.inExpo});
            this.eventSurface.setContent('<div class="eventDetails"><h>' + 
                event.title + '</h><p>' + event.date + 
                '</p><p>' + event.location + '</p>' + '</div>');
            // eventModifier.setTransform({
            //     Transform.translate()
            // })
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
