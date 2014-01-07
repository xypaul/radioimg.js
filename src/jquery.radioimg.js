;(function ( $, window, document, undefined ) {



    var pluginName = "radioimg",
        dataPlugin = "plugin_" + pluginName, // the name of using in .data()
        incrementId = 0, // used to create the incremental ID
        defaults = {
            name: "radioimg",
            selectedClass: "radioimg-selected",
            class: "radioimg",
            debug: false,
            color: "black",
            initial: "not set",
            data: [{data: "1", img: "http://placehold.it/60x60/35d/fff&text=1"}, {data: "2", img: "http://placehold.it/60x60/35d/fff&text=2"}]
        };   // default options

    var privateMethod = function () {
        return "checked"
    };

    // The actual plugin constructor
    var Plugin = function ( element ) {
        // Plugin instantiation
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {

        init: function ( options ) {

            // Simplify common variables
            var o = this.options;
            var e = this.element;

            // Create unique id
            incrementId += 1;
            this.element.data('id', incrementId);
            o.name = o.name + this.element.data('id'); // Add unique ID to the name

            // Extend options
            $.extend(o, options);


            $.each(o.data, function(i,d){

                // Create input box
                 var input = $('<input>', {
                        'type': 'radio',
                        'name': o.name,
                        'id': o.name + i,
                        'value': d.data
                })

                // Create label with img
                var label = $('<label>', {
                        'for': o.name + i,
                        'html': $('<img>', {
                                    src: d.img,
                                    class: o.class

                        })
                })

                // Check if it should be checked
                if ((o.initial == "not set" && i == 0) ||  (o.initial === d.data)){
                    input.prop("checked", true);
                    label.find('img').addClass(o.selectedClass)
                }

                // Setup trigger event
                input.on("change", function() {
                    event.stopPropagation();

                    var val = $(this).val()
                    e.trigger("change", val);

                    var current_label = $("label[for='"+$(this).attr('id')+"']");
                    current_label.find("img").addClass(o.selectedClass)
                    current_label.siblings().find("img").removeClass(o.selectedClass);

                })

                // Hide radio btn unless set to debug
                if (!o.debug) input.hide();

                // Append items to the dom
                e.append([input,label])

            });

        },

        destroy: function () {
            // unset Plugin data instance
            this.element.data( dataPlugin, null );
        },

        // public get method
        href: function () {
            return this.element.attr( 'href' );
        }
    }

    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * allowing any public function to be called via the jQuery plugin,
     * e.g. $(element).pluginName('functionName', arg1, arg2, ...)
     */
    $.fn[ pluginName ] = function ( arg ) {

        var args, instance;

        // only allow the plugin to be instantiated once
        if (!( this.data( dataPlugin ) instanceof Plugin )) {

            // if no instance, create one
            this.data( dataPlugin, new Plugin( this ) );
        }

        instance = this.data( dataPlugin );

        instance.element = this;

        // Is the first parameter an object (arg), or was omitted,
        // call Plugin.init( arg )
        if (typeof arg === 'undefined' || typeof arg === 'object') {

            if ( typeof instance['init'] === 'function' ) {
                instance.init( arg );
            }

        // checks that the requested public method exists
        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {

            // copy arguments & remove function name
            args = Array.prototype.slice.call( arguments, 1 );

            // call the method
            return instance[arg].apply( instance, args );

        } else {

            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

        }
    };

}(jQuery, window, document));