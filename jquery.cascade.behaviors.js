

/*!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *               CASCADE FRAMEWORK / BEHAVIORS
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *
 * Copyright 2013, John Slegers
 * Released under the MIT license
 * http://jslegers.github.com/cascadeframework/license.html
 *
 *
 * This means you can use Cascade Framework for any project,
 * whether commercial or not.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * 
 * Cascade Framework also contains the following goodies,
 * which all have the same or similar 'permissive licenses :
 *
 *
 *
 *
 * Includes jQuery
 * http://jquery.com/
 * Released under the MIT license
 *
 *
 * Includes jQuery Easing plugin
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Released under the BSD license
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Date: 2013-03-15
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

(function( $, window, document ){
    var methods = {
        run : function( options ) {
            Cascade.run( options );
        },
        collapse : function( options ) {
            var options = $.extend( {
                animate       : false
            }, options);

            var parent = $(this);
            if(options.animate =='up' || options.animate === true){
                var colsection = parent.children('.collapse-section');
                colsection.animate({
                    height: 'toggle'
                }, 150, "easeInCubic");
                colsection.promise().done(function () {
                    parent.addClass('collapsed');
                });
            } else {
                parent.addClass('collapsed');
            }
            return parent;
        },
        uncollapse : function( options ) {
            var options = $.extend( {
                animate       : false
            }, options);

            var parent = $(this);
            if(options.animate =='up' || options.animate === true){
                var colsection = parent.children('.collapse-section');
                parent.removeClass('collapsed');
                colsection.hide().animate({
                    height: 'toggle'
                }, 150, "easeInCubic");
            } else {
                parent.removeClass('collapsed');
            }
            return parent;
        }
    };

    $.fn.cascade = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.run.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Cascade' );
        }
    };
})( jQuery, window, document );

window.Cascade = (function( window, document ) {
    Cascade = {};

    Cascade.collapsible = function ( selector ) {
        return Cascade.behavior(selector, {
            name : 'collapsible',
            active : 'collapsed',
            act : 'collapse',
            undo : 'uncollapse',
            trigger : 'collapse-trigger'
        });
    }

    Cascade.behavior = function ( selector, behavior ) {
        $(selector).addClass(behavior.name);

        $(document).on({
            click: function (event){
                event.preventDefault();
                var parent = $(this);
                while (parent && !parent.hasClass(behavior.name)){
                    parent = parent.parent();
                }
                if(parent) {
                    if(parent.hasClass(behavior.active)){
                        parent.cascade(behavior.undo, {
                            animate:true
                        });
                    } else {
                        parent.cascade(behavior.act, {
                            animate:true
                        });
                    }
                }
            }
        }, selector + ' .' + behavior.trigger);
        return Cascade;
    }

    Cascade.collapse = function ( selector, options ) {
        $(selector).cascade('collapse', options);
        return Cascade;
    }

    Cascade.uncollapse = function ( selector, options ) {
        $(selector).cascade('uncollapse', options);
        return Cascade;
    }

    Cascade.tabs = function ( selector ) {
        $(document)
            .on({
                click: function (e) {
                    var $parent = $(this).parent();
                    $parent.parent().children().removeClass("active");
                    $parent.addClass("active");
                    return false;
                }
            }, selector);
        return Cascade;
    }

    Cascade.tabblocks = function ( selector, options ) {
        $(document)
            .on({
                click: function () {
                    var $tabblock = $(this).closest(options.container);
                    $tabblock.find(options.content).children().addClass("hidden-tab");
                    $($(this).context.hash).removeClass("hidden-tab");
                    $tabblock.find('.tabs li').not('.tab-content .tabs li').removeClass("active");
                    return false;
                }
            }, selector);
        return Cascade;
    }

    defaults = {
        collapsibles        : {
            general         : '.collapsible'
        },
        tabs        : {
            general         : '.tabs a'
        },
        tabblocks        : {
            tabblock        : ['.tab-block .tabs a', {
                container:'.tab-block',
                content:'.tab-content:first'
            }],
            tabblock2d      : ['.tab-block-2d .tabs a', {
                container:'.tab-block-2d',
                content:'.tab-content:first'
            }]
        }
    }

    Cascade.run = function ( options ) {
        var options = $.extend(defaults, options);
        for(var i in options.collapsibles){
            Cascade.collapsible(options.collapsibles[i]);
        }
        for(var i in options.tabblocks){
            Cascade.tabblocks(options.tabblocks[i][0], options.tabblocks[i][1]);
        }
        for(var i in options.tabs){
            Cascade.tabs(options.tabs[i]);
        }

        return Cascade;
    };

    return Cascade;
})(this, this.document);

$(document).ready(function () {
    $(document).cascade();
});