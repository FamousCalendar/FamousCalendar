/*** EventDetailsView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var InputSurface = require('famous/surfaces/InputSurface');
    var ScrollView = require('famous/views/Scrollview');
    var Modifier = require('famous/core/Modifier');
    var Utility = require('utilities');
    var Easing = require('famous/transitions/Easing');
    var RenderNode = require('famous/core/RenderNode');
    var Transitionable = require('famous/transitions/Transitionable');
    var EventView = require('views/EventView');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var hUnits = window.innerHeight / 450;
    var wUnits = window.innerWidth / 500;


    //Create repeat selector to access value
    var repeatValue = document.createElement('select');
    repeatValue.innerHTML = '<option value="false">Never</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>';


    function EventDetailsView(event) {

        View.apply(this, arguments);
        
        this.node = new RenderNode({

        });
        
        this.event = event;


        this.back = new Surface({
            size: [undefined, undefined],
            position: [100, 100],
            properties: {
                backgroundColor: '#FAFAFA'
            }
        });
        var backgroundMod = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
        });

        this.node.add(backgroundMod).add(this.back);

        var cancelIcon = new Surface({
          size: [true, true],
          content:'Day',
          properties: {
            color: 'red',
            fontFamily: 'sans-serif',
            cursor: 'pointer'
          }
        });

        var cancelIconModifier = new Modifier({
          align: [0.08, 0.03],
          origin: [0, 0]
        });



        this.node.add(cancelIconModifier).add(cancelIcon);


         var editIcon = new Surface({
          size: [true, true],
          content:'Edit',
          properties: {
            color: 'red',
            fontFamily: 'sans-serif',
            cursor: 'pointer'
          }
        });

        var editIconModifier = new Modifier({
          align: [0.85, 0.03],
          origin: [0, 0]
        });

        this.node.add(editIconModifier).add(editIcon);



        var backIcon = new ImageSurface({
          size: [30, 30],
          content:'content/images/back_arrow.png',
          properties: {
            pointerEvents: 'none',
            zIndex: 3
          }
        });

        var backIconModifier = new Modifier({
          align: [0.045, 0.048],
          origin: [0.5, 0.5],
          transform: Transform.translate(0, 0, 3)
        });

        this.node.add(backIconModifier).add(backIcon);
        //Focus Title Field

        this.header = new Surface({
            content:'Event Details',
            size: [true, undefined],
            properties: {
                textAlign: 'center',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var headerMod = new Modifier({
            origin : [0.5, 0.5],
            align: [0.5, 0.5]
        })

        //TBD: Add Cancel and Done buttons on Header

        this.node.add(headerMod).add(this.header);

        this.titleField = new Surface({
            content: event.title,
            properties: {
                // backgroundColor: 'red'
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var titleFieldModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.1],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(titleFieldModifier).add(this.titleField);



        this.locationField = new Surface({
            content: 'Location: <p>' + event.location + '</p>',
            size: [undefined, true],
            properies: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                lineHeight: '10px'
            }
        });
        var locationModifier = new Modifier({
            align: [0.5, 0.2],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(locationModifier).add(this.locationField);

        this.dateField = new Surface({
            content: event.date,
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red',
                cursor: 'pointer',
                // display: 'block',
                // letterSpacing: '4px',     
                // textShadow: "0 0 2px black",       
                // wordSpacing: '20px'    
            }
        });
        var dateModifier = new Modifier({
            align: [0.5, 0.3],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(dateModifier).add(this.dateField);

        this.startLabel = new Surface({
            content: 'Starts at:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var startLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.38],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(startLabelModifier).add(this.startLabel);

        this.startField = new Surface({
            content: event.start,
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red'
            }
        });
        var startFieldModifier = new Modifier({
            align: [0.5, 0.43],
            transform: Transform.translate(0, 0, 0)
        })
        this.node.add(startFieldModifier).add(this.startField);



        this.endLabel = new Surface({
            content: 'Ends at:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var endLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(endLabelModifier).add(this.endLabel);


        this.endField = new Surface({
            content: event.end,
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red'
            }
        });
        var endFieldModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.55]
        })
        this.node.add(endFieldModifier).add(this.endField);

        this.repeatLabel = new Surface({
            content: 'Repeats:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var repeatLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.63],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(repeatLabelModifier).add(this.repeatLabel);

        this.repeatField = new Surface({
            content: event.repeat,
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var repeatFieldModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.7],
            properties: {
            }
        });
        this.node.add(repeatFieldModifier).add(this.repeatField);

        this.deleteButton = new InputSurface({
            type: 'button',
            size: [undefined, true],
            value: 'Delete',
            properties: {
                backgroundColor: '#FAFAFA',
                color: 'red',
                fontFamily: 'sans-serif',
                cursor: 'pointer'
            }
        });

        //Delete event
        this.deleteButton.on('click', function(){
            Utility.deleteEvent(this.event);
            _outTransition.call(this);
            this._eventOutput.emit('changes');
        }.bind(this));


        //Cancel event creation
        cancelIcon.on('click', function(){
            _outTransition.call(this);
        }.bind(this));

        //Make fields editable
        editIcon.on('click', function(){ 
            editIconModifier.setOpacity(0, {duration: 100});
            titleFieldModifier.setOpacity(0);
            this.titleField = new InputSurface({
                placeholder: event.title,
                value: event.title,
                type: 'text',
                properties: {
                    // backgroundColor: 'red'
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey'
                },
                size: [undefined, true]
            });

            this.node.add(titleFieldModifier).add(this.titleField);
            titleFieldModifier.setOpacity(1);

            locationModifier.setOpacity(0);
            this.locationField = new InputSurface({
                placeholder: event.location,
                value: event.location,
                size: [undefined, true],
                properies: {
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey',
                    lineHeight: '10px'
                }
            });
            
            this.node.add(locationModifier).add(this.locationField);
            locationModifier.setOpacity(1);


            dateModifier.setOpacity(0);
            this.dateField = new InputSurface({
                value: event.date,
                type: 'date',
                size: [undefined, true],
                properties: {
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey',
                    color: 'red',
                    cursor: 'pointer'    
                }
            });

            this.node.add(dateModifier).add(this.dateField);
            dateModifier.setOpacity(1);

            startFieldModifier.setOpacity(0);
            this.startField = new InputSurface({
                placeholder: event.start,
                type: 'time',
                value: event.start,
                size: [undefined, true],
                properties: {
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey',
                    color: 'red'
                }
            });
   
            this.node.add(startFieldModifier).add(this.startField);
            startFieldModifier.setOpacity(1);

            endFieldModifier.setOpacity(0);
            this.endField = new InputSurface({
                value: event.end,
                type: 'time',
                size: [undefined, true],
                properties: {
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey',
                    color: 'red'
                }
            });
           
            this.node.add(endFieldModifier).add(this.endField);
            endFieldModifier.setOpacity(1);

            this.repeatValue = document.createElement('select');
            this.repeatValue.innerHTML = '<option value="false">Never</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>';

            repeatFieldModifier.setOpacity(0);
            this.repeatField = new Surface({
                value: event.repeat,
                content: repeatValue,
                size: [undefined, true],
                properties: {
                    fontFamily: 'sans-serif',
                    borderBottom: '1px solid lightgrey'
                }
            });

            this.node.add(repeatFieldModifier).add(this.repeatField);
            repeatFieldModifier.setOpacity(1);


            var saveIcon = new Surface({
              size: [true, true],
              content:'Save',
              properties: {
                color: 'red',
                fontFamily: 'sans-serif',
                cursor: 'pointer'
              }
            });
            var saveIconModifier = new Modifier({
              align: [0.85, 0.03],
              origin: [0, 0]
            });

            this.node.add(saveIconModifier).add(saveIcon);

            saveIcon.on('click', function(){
                var newEvent = Utility.createEvent.call(this);
                if(newEvent.date.length > 0 && newEvent.start.length > 0 && newEvent.end.length > 0) {
                    Utility.editEvent(this.event, newEvent);
                    _outTransition.call(this);
                    this._eventOutput.emit('changes');
                }else{
                    alert('Please complete event form');
                }
            }.bind(this))
        }.bind(this));


        var saveModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.8]
        });
        this.node.add(saveModifier).add(this.deleteButton);

        this.mainModifier = new Modifier({
            transform: Transform.translate(500 * wUnits, 0, 0)

        });


        this.add(this.mainModifier).add(this.node);


        //ANIMATIONS
        this.mainModifier.setTransform(Transform.translate(0,0,0), { duration: 1100, curve: Easing.inOutExpo});

    }

    // Establishes prototype chain for EventDetailsView class to inherit from View
    EventDetailsView.prototype = Object.create(View.prototype);
    EventDetailsView.prototype.constructor = EventDetailsView;

    // Default options for EventDetailsView class
    EventDetailsView.DEFAULT_OPTIONS = {
    };

    // Define your helper functions and prototype methods here
    function _outTransition(){
        this.mainModifier.setTransform(Transform.translate(500 * wUnits, 0, 0), {duration: 1100, curve: Easing.inOutExpo});
    }

    module.exports = EventDetailsView;
});
