/*Copyright: © 2020 NC Squared Ltd, All Rights Reserved*/
/* globals jQuery: false */

// Initialise jQuery into a new variable to avoid conflicts
window.n2j$ = jQuery.noConflict();

// jQuery selector to get focusable elements
jQuery.extend(jQuery.expr[':'], {
    focusable: function(el, index, selector) {
        // Anchors, as long as they have a href, but not with a tab index of -1
        // Inputs (including select/buttons) as long as they are not hidden, disabled or have tab index of -1
        // Anything else that has a tab index that is not -1
        return n2j$(el).is('a[href]:not([tabindex=-1]), :input[type!=hidden]:not([disabled]):not([tabindex=-1]), [tabindex][tabindex!=-1]');
    }
});

// Setup the namespaces
window.ncsquared = window.ncsquared || {};
ncsquared.constants = ncsquared.constants || {};
ncsquared.maps = ncsquared.maps || {};
ncsquared.sf = ncsquared.sf || {};
ncsquared.ui = ncsquared.ui || {};
ncsquared.ui.components = ncsquared.ui.components || {};
ncsquared.ui.manager = ncsquared.ui.manager || {};
ncsquared.ui.wrappers = ncsquared.ui.wrappers || {};
ncsquared.utils = ncsquared.utils || {};
window.n2 = window.n2 || {};
n2.const = ncsquared.constants;
n2.maps = ncsquared.maps;
n2.sf = ncsquared.sf;

/* globals svg4everybody: false */
ncsquared.createPolyfills = function() {
    // Polyfill for Object.assign function
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            'use strict';
            if (typeof target === 'undefined' || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (typeof source !== 'undefined' && source !== null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    // Polyfill for Object.is function
    if (typeof Object.is !== 'function') {
        Object.is = function(x, y) {
            if (x === y) {
                // Checking that +0 != -0
                return x !== 0 || 1 / x === 1 / y;
            }
            // Checking NaN == NaN
            return x !== x && y !== y; // eslint-disable-line no-self-compare
        };
    }
};

// Create the polyfills
ncsquared.createPolyfills();

// Register the polyfill for displaying SVGs, will only be active in certain browsers
svg4everybody();

ncsquared.constants.SF = {};

// Salesforce field types
n2.const.SF.FIELDS_TYPES = [
    'BOOLEAN',
    'PICKLIST',
    'REFERENCE',
    'MULTIPICKLIST',
    'STRING',
    'TEXTAREA',
    'COMBOBOX',
    'EMAIL',
    'PHONE',
    'URL',
    'ID',
    'DOUBLE',
    'CURRENCY',
    'PERCENT',
    'INTEGER',
    'DATE',
    'DATETIME'
];

// Mapping of field type to operators
n2.const.SF.OPERATORS = {
    'BOOLEAN': ['equals'],
    'PICKLIST': ['equals', 'not equal', 'in'],
    'REFERENCE': ['equals', 'not equal', 'in'],
    'MULTIPICKLIST': ['equals', 'not equal', 'includes', 'does not include'],
    'STRING': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with', 'in'],
    'TEXTAREA': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with', 'in'],
    'COMBOBOX': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with'],
    'EMAIL': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with'],
    'PHONE': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with'],
    'URL': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with'],
    'ID': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal', 'contains', 'starts with', 'ends with'],
    'DOUBLE': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal'],
    'CURRENCY': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal'],
    'PERCENT': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal'],
    'INTEGER': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal'],
    'DATE': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal'],
    'DATETIME': ['equals', 'not equal', 'less than', 'greater than', 'less or equal', 'greater or equal']
};

// Mapping of date periods to friendly names
n2.const.SF.DATE_PERIODS = {
    'YESTERDAY': 'Yesterday',
    'TODAY': 'Today',
    'TOMORROW': 'Tomorrow',
    'LAST_WEEK': 'Last week',
    'THIS_WEEK': 'This week',
    'NEXT_WEEK': 'Next week',
    'LAST_MONTH': 'Last month',
    'THIS_MONTH': 'This month',
    'NEXT_MONTH': 'Next month',
    'LAST_90_DAYS': 'Last 90 days',
    'NEXT_90_DAYS': 'Next 90 days',
    'LAST_QUARTER': 'Last quarter',
    'THIS_QUARTER': 'This quarter',
    'NEXT_QUARTER': 'Next quarter',
    'LAST_YEAR': 'Last year',
    'THIS_YEAR': 'This year',
    'NEXT_YEAR': 'Next year',
    'LAST_N_DAYS': 'Last n days',
    'NEXT_N_DAYS': 'Next n days',
    'LAST_N_WEEKS': 'Last n weeks',
    'NEXT_N_WEEKS': 'Next n weeks',
    'LAST_N_MONTHS': 'Last n months',
    'NEXT_N_MONTHS': 'Next n months',
    'LAST_N_QUARTERS': 'Last n quarters',
    'NEXT_N_QUARTERS': 'Next n quarters',
    'LAST_N_YEARS': 'Last n years',
    'NEXT_N_YEARS': 'Next n years'
};

// Mapping of fiscal date periods to friendly names
n2.const.SF.DATE_PERIODS_FISCAL = {
    'LAST_FISCAL_QUARTER': 'Last fiscal quarter',
    'THIS_FISCAL_QUARTER': 'This fiscal quarter',
    'NEXT_FISCAL_QUARTER': 'Next fiscal quarter',
    'LAST_FISCAL_YEAR': 'Last fiscal year',
    'THIS_FISCAL_YEAR': 'This fiscal year',
    'NEXT_FISCAL_YEAR': 'Next fiscal year',
    'LAST_N_FISCAL_QUARTERS': 'Last n fiscal quarters',
    'NEXT_N_FISCAL_QUARTERS': 'Next n fiscal quarters',
    'LAST_N_FISCAL_YEARS': 'Last n fiscal years',
    'NEXT_N_FISCAL_YEARS': 'Next n fiscal years'
};

// Mapping of operators to a short hand format for display
n2.const.SF.FORMAT_OPERATORS = {
    'equals': 'is',
    'not equal': 'is not',
    'less than': '<',
    'greater than': '>',
    'less or equal': '<=',
    'greater or equal': '>=',
    'in': 'is in'
};

// Operators whose value could be a list
n2.const.SF.LIST_OPERATORS = [
    'in',
    'includes',
    'does not include'
];

// Negative operators that can be disabled via a Salesforce application setting for performance reasons
n2.const.SF.NOT_OPERATORS = [
    'not equal',
    'does not include'
];

/**
 * A utility or helper class related to colours
 * @namespace
 */
ncsquared.utils.ColorUtil = {

    _colorRegex: /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))$/i,
    _colorNameRegex: /^[a-z]+$/i,

    _colorTestElement: null,
    _colorTest: 'rgb(232, 124, 74)',

    /**
     * Tries to convert the RGB syntax <code>rgb(255, 255, 255)</code> to HEX syntax <code>#FFFFFF</code>.
     * If the value is already HEX it will apply upper case, otherwise the value will just be returned
     *
     * @param {string} rgb The value to convert
     * @returns {string} The converted HEX value, or original if it cannot be converted
     */
    rgbToHex: function(rgb) {
        // If not rgb() syntax, return the original, or upper case if hex syntax
        if (typeof rgb !== 'string') {
            return rgb;
        }
        if (rgb.indexOf('rgb(') === -1) {
            return rgb.indexOf('#') === 0 ? rgb.toUpperCase() : rgb;
        }

        // Split the rbg value into parts, but return if not the correct number of parts
        var rgbParts = (rgb.substring(4, rgb.length - 1)).split(',');
        if (rgbParts.length !== 3) {
            return rgb;
        }

        // Convert the parts to HEX and return
        return '#' + ((1 << 24) + (Number(rgbParts[0]) << 16) + (Number(rgbParts[1]) << 8) + Number(rgbParts[2])).toString(16).slice(1).toUpperCase();
    },

    /**
     * Returns whether the given string is a valid HTML/CSS colour - hex, rgb, rgba, hsl, hsla or CSS3 supported colour
     *
     * @param {string} color The colour value to check
     * @returns {boolean} True if a valid colour, otherwise false
     */
    isValidColor: function(color) {
        // Check it's a string
        if (typeof color !== 'string') {
            return false;
        }

        // Check for hex / rbg(a) / hsl(a)
        if (ncsquared.utils.ColorUtil._colorRegex.test(color)) {
            return true;
        }

        // Check that we are valid characters
        if (!ncsquared.utils.ColorUtil._colorNameRegex.test(color)) {
            return false;
        }

        // Create an element to test if it is a valid colour
        if (!ncsquared.utils.ColorUtil._colorTestElement) {
            ncsquared.utils.ColorUtil._colorTestElement = document.createElement('span');
        }
        // Set the colour to our test colour then the provided colour and check if it has changed
        var element = ncsquared.utils.ColorUtil._colorTestElement;
        element.style.color = ncsquared.utils.ColorUtil._colorTest;
        element.style.color = color;
        return element.style.color !== ncsquared.utils.ColorUtil._colorTest;
    }
};

ncsquared.utils.KeyUtil = {};

n2.key = ncsquared.utils.KeyUtil;

n2.key.KEY_BACKSPACE = 8;
n2.key.KEY_TAB = 9;
n2.key.KEY_ENTER = 13;
n2.key.KEY_SHIFT = 16;
n2.key.KEY_CTRL = 17;
n2.key.KEY_ESCAPE = 27;
n2.key.KEY_SPACE = 32;
n2.key.KEY_LEFT = 37;
n2.key.KEY_UP = 38;
n2.key.KEY_RIGHT = 39;
n2.key.KEY_DOWN = 40;
n2.key.KEY_DELETE = 46;

/* globals jQuery: false, Mustache: false */
/**
 * A utility or helper class with UI related functions
 * @namespace
 * @alias n2.ui
 */
ncsquared.utils.UiUtil = {

    _staticRegex: /^static$|^$/,
    _overflowRegex: /auto|scroll/,
    _buttonTags: /BUTTON/,

    /**
     * Returns true if the provided value is a jQuery object
     *
     * @param {*} value The value to check
     * @returns {boolean} true if a jQuery object
     */
    isJQuery: function(value) {
        return value instanceof jQuery;
    },

    /**
     * Renders an HTML template using Mustache, applying some common config
     *
     * @param {string} template The Mustache template
     * @param {Object} [context] The context to apply to the template
     * @param {Object} [partials] Any partials to apply
     * @returns {string} The rendered HTML
     */
    renderTemplate: function(template, context, partials) {
        var wrappedContext = {
            context: context || {},
            sldsIconsPrefix: window.n2__sldsIconsPrefix || '/assets/icons'
        };
        return Mustache.render('{{#context}}' + template + '{{/context}}', wrappedContext, partials);
    },

    /**
     * Gets the root/first scoped element that has the slds-scope class, or the body element
     *
     * @returns {jQuery} The jQuery object of the root element
     */
    getScopedRoot: function() {
        // Return the first if it has slds-scope
        var root = n2j$('.slds-scope').eq(0);
        if (root.length === 0) {
            root = n2j$('body');
        }
        return root;
    },

    /**
     * From the provided element, get the scrollable parent
     *
     * @param {HTMLElement|jQuery} child Object to get teh scrollable parent for
     * @returns {jQuery} The jQuery object of the scrollable parent
     */
    getScrollableParent: function(child) {
        if (!n2.ui.isJQuery(child)) {
            child = n2j$(child);
        }

        var position;
        if (child.length > 0 && (position = child.css('position')) !== 'fixed') {
            var excludeStaticParent = position === 'absolute';
            var scrollParent = child.parents().filter(function() {
                var parent = n2j$(this);
                if (excludeStaticParent && n2.ui._staticRegex.test(parent.css('position'))) {
                    return false;
                }
                return n2.ui._overflowRegex.test(parent.css('overflow') + parent.css('overflow-y') + parent.css('overflow-x'));
            });
            if (scrollParent.length > 0) {
                return scrollParent.eq(0);
            }
        }

        return n2j$(document.scrollingElement || document.documentElement);
    },

    /**
     * For the provided event, return whether the target element is a button target
     *
     * @param {Object} event The key press event
     * @returns {boolean} True if a button target, otherwise false
     */
    isButtonTarget: function(event) {
        return Boolean(event && event.target && n2.ui._buttonTags.test(event.target.tagName));
    }
};

n2.ui = ncsquared.utils.UiUtil;

/**
 * A utility or helper class with general JavaScript functions
 * @namespace
 * @alias n2.util
 */
ncsquared.utils.Util = {

    /**
     * Cached locale setting
     * @type {String}
     * @private
     */
    _locale: null,

    /**
     * Cached time zone setting
     * @type {String}
     * @private
     */
    _timeZone: null,

    /**
     * Returns true if the provided value is null or undefined
     *
     * @param {*} value The value to check
     * @returns {boolean} true if null or undefined
     */
    isNullOrUndefined: function(value) {
        return typeof value === 'undefined' || value === null;
    },

    /**
     * Returns true if the provided value is a function
     *
     * @param {*} value The value to check
     * @returns {boolean} true if a function
     */
    isFunction: function(value) {
        return typeof value === 'function';
    },

    /**
     * Returns true if the provided value is an object, excluding null or an array
     *
     * @param {*} value The value to check
     * @returns {boolean} true if an object
     */
    isObject: function(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    },

    /**
     * Returns true if the provided value is an array
     *
     * @param {*} value The value to check
     * @returns {boolean} true if an array
     */
    isArray: function(value) {
        return Array.isArray(value);
    },

    /**
     * Returns true if the provided value is a string
     *
     * @param {*} value The value to check
     * @returns {boolean} true if a string
     */
    isString: function(value) {
        return typeof value === 'string';
    },

    /**
     * Returns true if the provided value is a number, or a string that can be converted to a valid number
     *
     * @param {*} value The value to check
     * @returns {boolean} true if a valid number
     */
    isNumber: function(value) {
        return (typeof value === 'number' || typeof value === 'string') && !isNaN(value);
    },

    /**
     * Returns true if the provided value is a promise (uses the JQuery syntax)
     *
     * @param {*} value The value to check
     * @returns {boolean} true if a promise
     */
    isPromise: function(value) {
        return !n2.util.isNullOrUndefined(value) && n2.util.isFunction(value.done);
    },

    /**
     * Creates a new promise
     *
     * @returns {Function} a new promise
     */
    promise: function() {
        return n2j$.Deferred();
    },

    /**
     * Perform either a shallow or deep clone on an object, returning a new object
     *
     * @param {Object|Object[]} obj The object or array of objects to clone
     * @param {boolean} [shallow=false] Set to true to perform a shallow clone, otherwise a deep clone will be performed
     * @returns {Object} The cloned object
     */
    clone: function(obj, shallow) {
        if (n2.util.isArray(obj)) {
            return n2.util.map(obj, function(item) {
                return n2.util.clone(item, shallow);
            });
        }

        if (shallow === true) {
            return Object.assign({}, obj);
        }
        return n2j$.extend(true, {}, obj);
    },

    /**
     * Returns the locale of the user's browser, or the overriden n2__locale property if it's been set elsewhere
     *
     * @returns {string} The string representation of the locale in BCP 47 format, eg "en" or "en-US"
     */
    getLocale: function() {
        if (!n2.util.isNullOrUndefined(n2.util._locale)) {
            return n2.util._locale;
        }

        var locale = window.n2__locale;
        if (n2.util.isNullOrUndefined(locale)) {
            locale = navigator.language || navigator.browserLanguage;
        }

        locale = locale.replace(/_/g, '-');
        var separatorIndex = locale.indexOf('-', 3);
        n2.util._locale = separatorIndex === -1 ? locale : locale.substring(0, separatorIndex);
        return n2.util._locale;
    },

    /**
     * Returns the time zone of the user's browser, or the overriden n2__timeZone property if it's been set elsewhere.
     * For older browsers this will return "UTC" unless set manually
     *
     * @returns {string} The string representation of the time zone as either UTC or one recognised in the IANA time zone database, e.g "Europe/London"
     */
    getTimeZone: function() {
        if (!n2.util.isNullOrUndefined(n2.util._timeZone)) {
            return n2.util._timeZone;
        }

        var browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (n2.util.isNullOrUndefined(browserTimeZone)) {
            // IE doesn't support time zones other than UTC; if this value isn't resolved then it indicates the browser can't support other time zone values
            n2.util._timeZone = 'UTC';
        } else if (n2.util.isNullOrUndefined(window.n2__timeZone)) {
            n2.util._timeZone = browserTimeZone;
        } else {
            n2.util._timeZone = window.n2__timeZone;
        }
        return n2.util._timeZone;
    },

    /**
     * Compares a specified property in 2 objects, returning 0, 1 or -1 depending on equality and whether ascending is specified.
     * Can be used for sorting an array of objects.
     *
     * @param {Object} objA First object to compare
     * @param {Object} objB Second object to compare
     * @param {string} property The name of the property from the object to use, can include dot notation
     * @param {boolean} [ascending=true] True if sort should be ascending
     * @returns {number} 0 if equal, 1 if the value in object A is greater than object B, or -1 if less than (inverted if ascending is false)
     */
    compareObjectValues: function(objA, objB, property, ascending) {
        // Get the values from the object
        var valueA = n2.util.getObjectProperty(objA, property);
        var valueB = n2.util.getObjectProperty(objB, property);

        // Check if value A or both values are undefined
        if (n2.util.isNullOrUndefined(valueA)) {
            if (n2.util.isNullOrUndefined(valueB)) {
                return 0;
            }
            valueA = '';
        }

        // If values are a string compare them lower case, if one isn't a string convert it
        var result;
        if (n2.util.isString(valueA)) {
            valueA = valueA.toLowerCase();
            if (n2.util.isNullOrUndefined(valueB)) {
                valueB = '';
            } else if (n2.util.isString(valueB)) {
                valueB = valueB.toLowerCase();
            } else {
                valueB = '' + valueB;
            }
            // Use locale compare for strings
            result = valueA.localeCompare(valueB);
        } else {
            // Compare the values
            result = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
        }

        // Return the result or the inverse if descending
        return n2.util.isNullOrUndefined(ascending) || Boolean(ascending) ? result : -result;
    },

    /**
     * Returns the value of a property in an object
     *
     * @param {Object} obj The object to get the value from
     * @param {string} property The name of the property from the object to retrieve, can include dot notation
     * @returns {*} The value of the property
     */
    getObjectProperty: function(obj, property) {
        if (property.indexOf('.') === -1) {
            return obj[property];
        }
        return n2.util._getObjectPropertyPath(obj, property.split('.'));
    },

    _getObjectPropertyPath: function(obj, properties) {
        return properties.reduce(n2.util.getObjectProperty, obj);
    },

    /**
     * Loops through the given object or array calling the callback Function for each item
     *
     * @param {Object|Array} obj The object or array to iterate over
     * @param {Function} callback The callback to call for each item, called with the arguments <code>({number|string} indexOrPropertyName, {*} value)</code> and with the scope of the value. Return false to exit the loop early
     */
    each: function(obj, callback) {
        var value;
        if (n2.util.isArray(obj)) {
            var length = obj.length;
            for (var i = 0; i < length; i++) {
                value = obj[i];
                if (callback.call(value, i, value) === false) {
                    break;
                }
            }
        } else if (n2.util.isObject(obj)) {
            for (i in obj) {
                value = obj[i];
                if (callback.call(value, i, value) === false) {
                    break;
                }
            }
        }
    },

    /**
     * Loops through the given array backwards calling the callback Function for each item
     *
     * @param {Array} obj The array to iterate over backwards
     * @param {Function} callback The callback to call for each item, called with the arguments <code>({number|string} indexOrPropertyName, {*} value)</code>. Return false to exit the loop early
     */
    eachBackwards: function(obj, callback) {
        var value;
        if (n2.util.isArray(obj)) {
            var start = obj.length - 1;
            for (var i = start; i >= 0; i--) {
                value = obj[i];
                if (callback.call(value, i, value) === false) {
                    break;
                }
            }
        }
    },

    /**
     * Loops recursively through an object or array, calling the provided function on each property
     *
     * @param {Object|Array} obj The object or array to recursively loop through
     * @param {Function} fn The function to call for each property, will be called with the arguments <code>({Object|Array} parent, {*} indexOrKey, {*} value)</code> and can return false if the loop should break
     */
    eachDeep: function(obj, fn) {
        if (n2.util.isObject(obj) || n2.util.isArray(obj)) {
            n2.util.each(obj, function(childIndexOrKey, child) {
                return n2.util._eachDeep(obj, childIndexOrKey, child, fn);
            });
        }
    },

    _eachDeep: function(parent, indexOrKey, value, fn) {
        if (n2.util.isObject(value) || n2.util.isArray(value)) {
            n2.util.each(value, function(childIndexOrKey, child) {
                return n2.util._eachDeep(value, childIndexOrKey, child, fn);
            });
        } else if (fn(parent, indexOrKey, value) === false) {
            return false;
        }
    },

    /**
     * Translates all items in an array to a new array calling the callback Function for each item
     *
     * @param {Array} obj The array to iterate over
     * @param {Function} callback The callback to call for each item, called with the arguments <code>({*} value, {number} index)</code> and should return the translated item. Return null or undefined to remove the item from the resultant array
     * @returns {Array} The translated array
     */
    map: function(obj, callback) {
        return n2j$.map(obj, callback);
    },

    /**
     * Compares two objects to see if they are equal, if an object or array then they need to have the same number of items and all of their items must match
     *
     * @param {*} objA The first object to compare
     * @param {*} objB The second object to compare
     * @returns {boolean} True if both objects are equal, false if they don't or they are both not objects
     */
    equalsDeep: function(objA, objB) {
        // Check if equal
        if (Object.is(objA, objB)) {
            return true;
        }

        var equals = true;
        // Check for object equality
        if (n2.util.isObject(objA) && n2.util.isObject(objB)) {
            // Check same number of keys
            var keysA = Object.keys(objA);
            var keysB = Object.keys(objB);
            if (keysA.length !== keysB.length) {
                return false;
            }

            // Check each key exists and that the values are equal
            n2.util.each(keysA, function(index, key) {
                if (keysB.indexOf(key) === -1) {
                    equals = false;
                    return false;
                }
                if (!n2.util.equalsDeep(objA[key], objB[key])) {
                    equals = false;
                    return false;
                }
            });
            return equals;
        }

        // Check for array equality
        if (n2.util.isArray(objA) && n2.util.isArray(objB)) {
            // Check same length
            if (objA.length !== objB.length) {
                return false;
            }
            // Check each value is the same
            n2.util.each(objA, function(index, valueA) {
                if (!n2.util.equalsDeep(valueA, objB[index])) {
                    equals = false;
                    return false;
                }
            });
            return equals;
        }

        // Otherwise we are different
        return false;
    },

    /**
     * Formats a given value based on the provided format function or string
     *
     * @param {*} value The value to format
     * @param {string|Function} format Either a string of how to format the data, or a function that has the data as the only argument and should return the value. Available options:
     * <ul><li><code>number</code> - If the value is a number, formats the value as per the user's locale. By using the format <code>number:x</code> (where x is a number) you can control the number of decimal places, it defaults to 0</li>
     * <li><code>percent</code> - If the value is a number, formats the value as per the user's locale with a percent symbol at the end. By using the format <code>percent:x</code> (where x is a number) you can control the number of decimal places, it defaults to 0</li>
     * <li><code>currency</code> - If the value is a number, formats the value as per the user's locale as a currency</li>
     * <li><code>date</code> - If the value is a recognised string date, or a number, formats the value as per the user's locale as a date</li>
     * <li><code>datetime</code> - If the value is a recognised string date, or a number, formats the value as per the user's locale and time zone as a date time</li>
     * <li><code>time</code> - If the value is a recognised string date, or a number, formats the value as per the user's locale and time zone as a time</li>
     * <li><code>boolean</code> - Formats the value as either <code>Yes</code> or <code>No</code>. By using the format <code>boolean:x:y</code> x will be the value returned for true and y the value returned for false</li></ul>
     * @returns {string} The formatted value
     */
    formatValue: function(value, format) {
        if (n2.util.isFunction(format)) {
            return format(value);
        }
        var parsedValue;
        var splitFormat = format.split(':');
        switch (splitFormat[0]) {
            case 'number':
            case 'percent':
                var dp = splitFormat.length > 1 && n2.util.isNumber(splitFormat[1]) ? Number(splitFormat[1]) : 0;
                if (n2.util.isNumber(value)) {
                    return Number(value).toLocaleString(n2.util.getLocale(), {
                        minimumFractionDigits: dp,
                        maximumFractionDigits: dp
                    }) + (splitFormat[0] === 'percent' ? '%' : '');
                }
                return value;

            case 'currency':
                var currency = splitFormat.length > 1 ? splitFormat[1] : '';
                if (n2.util.isNumber(value)) {
                    return Number(value).toLocaleString(n2.util.getLocale(), {
                        style: 'currency',
                        currency: currency
                    });
                }
                return value;

            case 'date':
                parsedValue = n2.util.isString(value) ? Date.parse(value) : value;
                if (n2.util.isNumber(parsedValue)) {
                    // Remove IE bi-directional characters
                    return new Date(parsedValue).toLocaleDateString(n2.util.getLocale()).replace(/\u200E/g, '');
                }
                return value;

            case 'datetime':
                parsedValue = n2.util.isString(value) ? Date.parse(value) : value;
                if (n2.util.isNumber(parsedValue)) {
                    // Remove IE bi-directional characters
                    return new Date(parsedValue).toLocaleString(n2.util.getLocale(), {
                        timeZone: n2.util.getTimeZone()
                    }).replace(/\u200E/g, '');
                }
                return value;

            case 'time':
                parsedValue = n2.util.isString(value) ? Date.parse(value) : value;
                if (n2.util.isNumber(parsedValue)) {
                    // Remove IE bi-directional characters
                    return new Date(parsedValue).toLocaleTimeString(n2.util.getLocale(), {
                        timeZone: n2.util.getTimeZone()
                    }).replace(/\u200E/g, '');
                }
                return value;

            case 'boolean':
                if (value && value !== 'false') {
                    return splitFormat.length > 1 ? splitFormat[1] : 'Yes';
                }
                return splitFormat.length > 2 ? splitFormat[2] : 'No';

            default:
                return value;
        }
    },

    /**
     * Returns a boolean from the provided value, defaulting to what is provided.
     * If the default is true then to return true the value can be null/undefined or any truthy value.
     * If the default is false then to return true the value needs to be a true boolean or the text "true"
     *
     * @param {*} value The value to get the boolean from
     * @param {boolean} defaultValue The default if the value null or undefined
     * @returns {boolean} The value as a boolean or the default value
     */
    getDefaultBoolean: function(value, defaultValue) {
        if (defaultValue) {
            return n2.util.isNullOrUndefined(value) ? true : Boolean(value);
        }
        return value === true || value === 'true' || false;
    },

    /**
     * Checks that a config has the given required properties, will throw an error with the details of what is missing
     *
     * @param {Object} config The config to check
     * @param {string[]} properties The list of required properties, can include dot notation to a maximum of 2 levels, with the first level being optional unless suffixed with "*", eg "first*.second".
     * By using the syntax property:type it will also check that the property is of that type
     * @param {string} [name=config] The name to display in messages
     */
    checkRequiredConfig: function(config, properties, name) {
        name = name || 'config';
        if (n2.util.isNullOrUndefined(config)) {
            throw new Error(name + ' is required');
        }
        var missingProperties = [];

        n2.util.each(properties, function(index, property) {
            var propertyPath = property.split('.');
            var propertyName = propertyPath[0].split(':');
            var value = config[propertyName[0].replace('*', '')];

            // Check the first level of the property exists
            if (n2.util.isNullOrUndefined(value)) {
                // If we are only one level then add to array of missing properties
                if (propertyPath.length === 1) {
                    missingProperties.push(propertyName[0]);
                } else {
                    // Otherwise check if we are required and if so add the path to the array of missing
                    if (propertyName[0].indexOf('*') === propertyName[0].length - 1) {
                        missingProperties.push(property.replace('*', ''));
                    }
                }
                // Return true to continue checking the next property
                return true;
            }

            // If we have a second part to the name, check the type
            if (propertyName.length > 1 && !n2.util._checkType(value, propertyName[1])) {
                missingProperties.push('{' + propertyName[1] + '}' + propertyName[0]);
            }

            // Check for the second level
            if (propertyPath.length > 1) {
                propertyName = propertyPath[1].split(':');
                // If the first level was an array, loop through each item checking for the second level property
                if (n2.util.isArray(value)) {
                    n2.util.each(value, function(valueIndex, valueItem) {
                        if (n2.util.isObject(valueItem)) {
                            if (n2.util.isNullOrUndefined(valueItem[propertyName[0]])) {
                                missingProperties.push(propertyPath[0] + '[' + valueIndex + '].' + propertyName[0]);
                            } else if (propertyName.length > 1 && !n2.util._checkType(valueItem[propertyName[0]], propertyName[1])) {
                                // If we have a second part to the name, check the type
                                missingProperties.push(propertyPath[0] + '[' + valueIndex + '].{' + propertyName[1] + '}' + propertyName[0]);
                            }
                        }
                    });
                } else if (n2.util.isObject(value)) {
                    // Otherwise just check the second level property
                    if (n2.util.isNullOrUndefined(value[propertyName[0]])) {
                        missingProperties.push(propertyPath[0] + '.' + propertyName[0]);
                    } else if (propertyName.length > 1 && !n2.util._checkType(value[propertyName[0]], propertyName[1])) {
                        // If we have a second part to the name, check the type
                        missingProperties.push(propertyPath[0] + '.{' + propertyName[1] + '}' + propertyName[0]);
                    }
                }
            }
        });

        // Throw error if there are any missing properties
        if (missingProperties.length > 0) {
            throw new Error('The following ' + name + ' properties are required: ' + missingProperties.join(', '));
        }
    },

    _checkType: function(value, type) {
        switch (type) {
            case 'function':
                return n2.util.isFunction(value);
            case 'array':
                return n2.util.isArray(value);
            case 'object':
                return n2.util.isObject(value);
            case 'number':
                return n2.util.isNumber(value);
            case 'string':
                return n2.util.isString(value);
            default:
                return true;
        }
    }
};

n2.util = ncsquared.utils.Util;

/**
 * A utility or helper class with functions related to calling Heroku. Must be initialised before use using either
 * {@link n2.sf.heroku.initNoAuth} or {@link n2.sf.heroku.initAuth}
 * @namespace
 * @alias n2.sf.heroku
 */
ncsquared.sf.HerokuUtil = {

    /**
     * The base URL to be added to all requests
     * @type {String}
     * @private
     */
    _baseUrl: null,
    /**
     * Whether or not authentication is enabled for request
     * @type {Boolean}
     * @private
     */
    _authEnabled: null,
    /**
     * If authentication is enabled, a function to fetch the authentication header
     * @type {Function}
     * @private
     */
    _fetchAuthHeader: null,
    /**
     * The time difference, in milliseconds, between the server where the authentication headers are created
     * and the client. Used to check the expiry
     * @type {Number}
     * @private
     */
    _serverTimeDifference: null,
    /**
     * The cached authentication headers, but path
     * @type {Object}
     * @private
     */
    _cachedAuthHeaders: null,
    /**
     * The hosting environment identifier which will be appended to the URLs to ensure that any caching is
     * separated per environment, stored as a query parameter name=value string
     * @type {String}
     * @private
     */
    _environmentIdentifier: null,

    /**
     * Initialises the utility without authentication
     *
     * @param {String} baseUrl The base URL to use to call Heroku
     */
    initNoAuth: function(baseUrl) {
        n2.sf.heroku._baseUrl = n2.sf.heroku._cleanUrl(baseUrl);
        n2.sf.heroku._authEnabled = false;
        n2.sf.heroku._setEnvironmentIdentifier();
    },

    /**
     * Initialises the utility with authentication
     *
     * @param {String} baseUrl The base URL to use to call Heroku
     * @param {Function} fetchAuthHeader A function that returns a promise that can be used to fetch a new authentication header, the promise should resolve with the AuthHeader object.
     * The function will be called with the arguments <code>({String} path, {String} type)</code>
     * @param {Number} serverTime The timestamp from the server to work out the difference when checking the expiry
     * @param {Object} [cachedAuthHeaders={}] A cache of any current authentication headers
     */
    initAuth: function(baseUrl, fetchAuthHeader, serverTime, cachedAuthHeaders) {
        n2.sf.heroku._baseUrl = n2.sf.heroku._cleanUrl(baseUrl);
        n2.sf.heroku._authEnabled = true;
        n2.sf.heroku._fetchAuthHeader = fetchAuthHeader;
        n2.sf.heroku._serverTimeDifference = new Date().getTime() - serverTime;
        n2.sf.heroku._cachedAuthHeaders = cachedAuthHeaders || {};
        n2.sf.heroku._setEnvironmentIdentifier();
    },

    /**
     * Removes any configured parameters
     */
    destroy: function() {
        n2.sf.heroku._baseUrl = null;
        n2.sf.heroku._authEnabled = null;
        n2.sf.heroku._fetchAuthHeader = null;
        n2.sf.heroku._serverTimeDifference = null;
        n2.sf.heroku._cachedAuthHeaders = null;
        n2.sf.heroku._environmentIdentifier = null;
    },

    /**
     * Makes a GET call to Heroku to fetch JSON data and returns the promise
     *
     * @param {String} path The path to call on Heroku
     * @returns {Promise} A promise of the call
     */
    get: function(path) {
        return n2.sf.heroku._ajax(path, 'GET');
    },

    /**
     * Makes a POST call to Heroku to send JSON data and returns the promise
     *
     * @param {String} path The path to call on Heroku
     * @param {Object} data The JSON data to send
     * @returns {Promise} A promise of the call
     */
    post: function(path, data) {
        return n2.sf.heroku._ajax(path, 'POST', data);
    },

    /**
     * Makes a call to Heroku for the specified type, either sending or fetching JSON data, returning the promise
     *
     * @param {String} path The path to call on Heroku
     * @param {String} type The method type for the call
     * @param {Object} data The JSON data to send
     * @returns {Promise} A promise from for the call
     * @private
     */
    _ajax: function(path, type, data) {
        // Check we have been initialised
        n2.sf.heroku._checkInitialised();

        // Create the AJAX request
        var request = {
            url: n2.sf.heroku._getUrl(path),
            type: type,
            dataType: 'json'
        };
        if (data) {
            request.data = JSON.stringify(data);
            request.contentType = 'application/json; charset=utf-8';
        }

        // Check whether authentication is needed, and when that resolves make the AJAX call. Wrap in our own promise so one is always returned.
        var result = n2.util.promise();
        var pathForHeader = n2.sf.heroku._resolvePathForHeader(path);
        n2.sf.heroku._checkAuth(pathForHeader, type)
            .done(function(headers) {
                // Add any headers
                if (headers) {
                    request.headers = headers;
                }

                // Make the AJAX call and proxy the result to our promise
                n2j$.ajax(request)
                    .done(function(responseData, status, xhr) {
                        result.resolve(responseData, status, xhr);
                    })
                    .fail(function(xhr, status, error) {
                        // If we fail with a 401 remove the headers from the cache
                        if (n2.sf.heroku._authEnabled && xhr && xhr.status === 401) {
                            delete n2.sf.heroku._cachedAuthHeaders[pathForHeader];
                        }
                        result.reject(xhr, status, n2.sf.heroku._getResponseError(xhr, error));
                    });
            })
            .fail(function(error) {
                // If failure on checking authentication fail the result
                result.reject(null, null, error);
            });

        return result;
    },

    /**
     * Checks whether authentication is needed for the call, and if so, fetches the headers from the cache or
     * uses the initialised promise to get them
     *
     * @param {String} path The path to call on Heroku
     * @param {String} type The method type for the call
     * @returns {Promise} A promise that will resolve with the headers object
     * @private
     */
    _checkAuth: function(path, type) {
        var result = n2.util.promise();
        if (n2.sf.heroku._authEnabled) {
            // If authentication is enabled check to see if we have the details in the cache, and if so, check it is still within the validity window.
            // If either are false then call the provided promise to get refreshed details
            if (!n2.sf.heroku._cachedAuthHeaders.hasOwnProperty(path) || (new Date().getTime() - n2.sf.heroku._serverTimeDifference) > n2.sf.heroku._cachedAuthHeaders[path].AuthExpiry) {
                n2.sf.heroku._fetchAuthHeader(path, type)
                    .done(function(authHeader) {
                        // Cache the new authentication header and return the request headers
                        n2.sf.heroku._cachedAuthHeaders[path] = authHeader;
                        result.resolve(n2.sf.heroku._getHeadersFromAuthHeader(authHeader));
                    })
                    .fail(function(error) {
                        result.reject(error);
                    });
            } else {
                // Return the request headers for the cached authentication header
                result.resolve(n2.sf.heroku._getHeadersFromAuthHeader(n2.sf.heroku._cachedAuthHeaders[path]));
            }
        } else {
            // If authentication is disabled just resolve the promise
            result.resolve();
        }
        return result;
    },

    /**
     * Creates request headers for the provided authentication header
     *
     * @param {Object} authHeader The authentication header to create the request headers for
     * @returns {Object} The request headers
     * @private
     */
    _getHeadersFromAuthHeader: function(authHeader) {
        return {
            'Timestamp': authHeader.AuthTimestamp,
            'Authorization': authHeader.AuthHeader
        };
    },

    /**
     * Resolves the path to be used in the header
     *
     * @param {String} path The path to resolve
     * @returns {String} The resolved path
     * @private
     */
    _resolvePathForHeader: function(path) {
        // When fetching json and geojson files the path in the signature is only expected to be the first part so that signatures don't have to change too often
        if (path.indexOf('/json/') === 0) {
            return '/json/';
        } else if (path.indexOf('/geojson/') === 0) {
            return '/geojson/';
        }

        // Strip off any query parameters
        var index;
        if ((index = path.indexOf('?')) !== -1) {
            return path.substring(0, index);
        }
        return path;
    },

    /**
     * Extracts the error details from the response of the web call if found, or just returns the existing error message
     *
     * @param {Object} xhr The response object
     * @param {String} error The current extracted error
     * @returns {String} The found error message
     * @private
     */
    _getResponseError: function(xhr, error) {
        if (!error && xhr.responseJSON && xhr.responseJSON.message) {
            return xhr.responseJSON.message;
        }
        return error || 'An unknown error occurred';
    },

    /**
     * Checks whether the utility is initialised and if not throws an error
     *
     * @private
     */
    _checkInitialised: function() {
        if (n2.util.isNullOrUndefined(n2.sf.heroku._baseUrl)) {
            throw new Error('HerokuUtil not initialised with a base URL');
        }
    },

    /**
     * Sets the environment identifier query parameter string that can identify the environment so that URLs aren't
     * cached across them which can result in CORS errors
     *
     * @private
     */
    _setEnvironmentIdentifier: function() {
        n2.sf.heroku._environmentIdentifier = 'ei=' + encodeURIComponent(window.location.host);
    },

    /**
     * Cleans a URL to ensure it does not end in a slash
     *
     * @param {String} url The URL to clean
     * @returns {String} The cleaned URL
     * @private
     */
    _cleanUrl: function(url) {
        // Make sure URL does not have a slash at the end
        if (url && url.lastIndexOf('/') === url.length - 1) {
            return url.substring(0, url.length - 1);
        }
        return url;
    },

    /**
     * Takes in a path and returns the full URL
     *
     * @param {String} path The path to the resource
     * @returns {String} The full URL
     * @private
     */
    _getUrl: function(path) {
        // Make sure the path starts with a slash
        if (path.indexOf('/') !== 0) {
            path = '/' + path;
        }

        // Append the environment identifier
        path += (path.indexOf('?') === -1 ? '?' : '&') + n2.sf.heroku._environmentIdentifier;

        // Append the path to the base URL
        return n2.sf.heroku._baseUrl + path;
    }
};

n2.sf.heroku = ncsquared.sf.HerokuUtil;

/**
 * A helper class for lead matching and Salesforce duplicate rules
 * @namespace
 */
ncsquared.sf.LeadMatchingUtil = {

    /**
     * The template for displaying the Salesforce standard rule items
     * @type {String}
     */
    RULE_ITEMS_STANDARD: 'Salesforce standard rule, see <a href="https://help.salesforce.com/articleView?id={{articleId}}" target="_blank">help</a> for more details',

    /**
     * The template for displaying the custom rule items
     * @type {String}
     */
    RULE_ITEMS: '<ol>{{#matchingRuleItems}}' +
        '<li>{{index}}) {{fieldName}} {{#isExactMatch}}matches exactly{{/isExactMatch}}{{^isExactMatch}}fuzzy matches {{matchingMethod}}{{/isExactMatch}}</li>' +
        '{{/matchingRuleItems}}</ol>' +
        '{{#booleanFilter}}<br>Logic: {{booleanFilter}}{{/booleanFilter}}',

    /**
     * Will take an array of duplicate rules as stored in the Salesforce database and enrich them with data from the Metadata API,
     * including the related matching rules
     *
     * @param {Object} duplicateRules A map of duplicate rule full names to an object of the duplicate rule that need enriching with data from the Metadata API
     * @param {String} matchingObjectType The type of object matching rules to filter for
     * @returns {Promise} A promise that will resolve with an array of the duplicate rules or fail with any errors
     */
    getDuplicateRulesMetadata: function(duplicateRules, matchingObjectType) {
        return n2.sf.MetadataUtil.queryRecordMetadata('DuplicateRule', Object.keys(duplicateRules))
            .then(function(duplicateRulesMetadata) {
                var duplicateMatchRules = [];
                var matchingRules = [];

                var processDuplicateRuleMatchingRule = function(matchingRule, duplicateRuleMetadata, foundDuplicateRule) {
                    if (matchingRule.matchRuleSObjectType === matchingObjectType) {
                        foundDuplicateRule = n2.util.clone(foundDuplicateRule);
                        duplicateMatchRules.push(foundDuplicateRule);
                        foundDuplicateRule.description = duplicateRuleMetadata.description;
                        foundDuplicateRule.sortOrder = duplicateRuleMetadata.sortOrder;

                        var matchRuleFullName = matchingRule.matchRuleSObjectType + '.' + matchingRule.matchingRule;
                        foundDuplicateRule.matchRuleFullName = matchRuleFullName;
                        if (matchingRules.indexOf(matchRuleFullName) === -1) {
                            matchingRules.push(matchRuleFullName);
                        }
                    }
                };

                n2.util.each(duplicateRulesMetadata, function(index, duplicateRuleMetadata) {
                    var foundDuplicateRule = duplicateRules[duplicateRuleMetadata.fullName];
                    if (n2.util.isArray(duplicateRuleMetadata.duplicateRuleMatchRules)) {
                        n2.util.each(duplicateRuleMetadata.duplicateRuleMatchRules, function(ruleIndex, matchingRule) {
                            processDuplicateRuleMatchingRule(matchingRule, duplicateRuleMetadata, foundDuplicateRule);
                        });
                    } else {
                        processDuplicateRuleMatchingRule(duplicateRuleMetadata.duplicateRuleMatchRules, duplicateRuleMetadata, foundDuplicateRule);
                    }
                });

                return n2.sf.LeadMatchingUtil._getMatchingRulesMetadata(duplicateMatchRules, matchingRules);
            });
    },

    /**
     * Will get the matching rules metadata from the list of matching rules and populate their details in the provided duplicate matching rules
     *
     * @param {Object[]} duplicateMatchRules An array of objects representing the duplicate rules populated from the metadata
     * @param {String[]} matchingRules An array of names of the matching rules to get
     * @returns {Promise} A promise that will resolve with an array of the duplicate rules
     * @private
     */
    _getMatchingRulesMetadata: function(duplicateMatchRules, matchingRules) {
        return n2.sf.MetadataUtil.queryRecordMetadata('MatchingRule', matchingRules)
            .then(function(matchingRulesMetadata) {
                var processedMatchingRules = {};

                n2.util.each(matchingRulesMetadata, function(index, matchingRuleMetadata) {
                    if (n2.util.isObject(matchingRuleMetadata.matchingRuleItems)) {
                        matchingRuleMetadata.matchingRuleItems = [matchingRuleMetadata.matchingRuleItems];
                    }
                    var matchingRule = {
                        label: matchingRuleMetadata.label,
                        description: matchingRuleMetadata.description,
                        items: n2.sf.LeadMatchingUtil._renderMatchRuleItems(matchingRuleMetadata)
                    };
                    processedMatchingRules[matchingRuleMetadata.fullName] = matchingRule;
                });

                n2.util.each(duplicateMatchRules, function(index, duplicateMatchRule) {
                    var matchingRule = processedMatchingRules[duplicateMatchRule.matchRuleFullName];
                    if (matchingRule) {
                        duplicateMatchRule.matchRuleLabel = matchingRule.label;
                        duplicateMatchRule.matchRuleDescription = matchingRule.description;
                        duplicateMatchRule.matchRuleItems = matchingRule.items;
                    }
                });

                return duplicateMatchRules;
            });
    },

    /**
     * Will generate the HTML for displaying the given matching rule
     *
     * @param {Object} matchingRuleMetadata The matching rule to display
     * @returns {String} The HTML to display for the matching rule
     * @private
     */
    _renderMatchRuleItems: function(matchingRuleMetadata) {
        var standardRuleHelpArticle;
        if (matchingRuleMetadata.fullName.indexOf('Account.Standard_Account_Match_Rule_v') === 0) {
            standardRuleHelpArticle = 'matching_rules_standard_account_rule.htm';
        } else if (matchingRuleMetadata.fullName.indexOf('Contact.Standard_Contact_Match_Rule_v') === 0) {
            standardRuleHelpArticle = 'matching_rules_standard_contact_rule.htm';
        } else if (matchingRuleMetadata.fullName.indexOf('Lead.Standard_Lead_Match_Rule_v') === 0) {
            standardRuleHelpArticle = 'matching_rules_standard_contact_rule.htm';
        }

        if (standardRuleHelpArticle) {
            return n2.ui.renderTemplate(n2.sf.LeadMatchingUtil.RULE_ITEMS_STANDARD, {
                articleId: standardRuleHelpArticle
            });
        }

        n2.util.each(matchingRuleMetadata.matchingRuleItems, function(index, matchingRuleItem) {
            matchingRuleItem.index = index + 1;
            if (matchingRuleItem.matchingMethod === 'Exact') {
                matchingRuleItem.isExactMatch = true;
            }
        });
        return n2.ui.renderTemplate(n2.sf.LeadMatchingUtil.RULE_ITEMS, matchingRuleMetadata);
    }
};

/**
 * A helper class for interacting with the Salesforce Metadata API
 * @namespace
 */
ncsquared.sf.MetadataUtil = {

    /**
     * The template of the query SOAP request
     * @type {String}
     */
    QUERY_REQUEST: '<?xml version="1.0" encoding="utf-8"?>' +
        '<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<env:Header>' +
        '<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' +
        '<urn:sessionId>{{sessionId}}</urn:sessionId>' +
        '</urn:SessionHeader>' +
        '</env:Header>' +
        '<env:Body>' +
        '<readMetadata xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<type>{{type}}</type>' +
        '{{#fullNames}}<fullNames>{{.}}</fullNames>{{/fullNames}}' +
        '</readMetadata>' +
        '</env:Body>' +
        '</env:Envelope>',

    /**
     * The URL of the Salesforce instance to call for Metadata requests
     * @type {String}
     * @private
     */
    _url: null,
    /**
     * The id of the session to use for authentication
     * @type {String}
     * @private
     */
    _sessionId: null,

    /**
     * Initialises the utility
     *
     * @param {String} host The host of the Salesforce instance to call for Metadata requests
     * @param {String} sessionId The id of the session to use for authentication
     */
    init: function(host, sessionId) {
        n2.sf.MetadataUtil._url = 'https://' + host + '/services/Soap/m/45.0';
        n2.sf.MetadataUtil._sessionId = sessionId;
    },

    /**
     * Removes any configured parameters
     */
    destroy: function() {
        n2.sf.MetadataUtil._url = null;
        n2.sf.MetadataUtil._sessionId = null;
    },

    /**
     * Will transform the given XML DOM element into a JS object representation
     *
     * @param {Node|NodeList|HTMLCollection} xml The XML node or list of nodes to convert to JS object
     * @returns {Object|Object[]|String} The converted JS object or array of objects if a list was initially provided, or string if a text node
     */
    xmlToJson: function(xml) {
        if (n2.util.isNumber(xml.length) && n2.util.isFunction(xml.item)) {
            var xmlLength = xml.length;
            var arrayResult = [];
            for (var i = 0; i < xmlLength; i++) {
                arrayResult.push(n2.sf.MetadataUtil.xmlToJson(xml.item(i)));
            };
            return arrayResult;
        }

        if (xml.nodeType === Node.ELEMENT_NODE || xml.nodeType === Node.DOCUMENT_NODE) {
            if (xml.hasChildNodes()) {
                var childLength = xml.childNodes.length;
                if (childLength === 1 && xml.firstChild.nodeType === Node.TEXT_NODE) {
                    return xml.firstChild.nodeValue;
                }

                var result = {};
                for (var j = 0; j < childLength; j++) {
                    var item = xml.childNodes.item(j);
                    var nodeName = item.nodeName;
                    var child = n2.sf.MetadataUtil.xmlToJson(item);
                    if (!n2.util.isNullOrUndefined(child)) {
                        if (result.hasOwnProperty(nodeName)) {
                            if (!n2.util.isArray(result[nodeName])) {
                                var old = result[nodeName];
                                result[nodeName] = [];
                                result[nodeName].push(old);
                            }
                            result[nodeName].push(child);
                        } else {
                            result[nodeName] = child;
                        }
                    }
                }
                return result;
            }
        } else if (xml.nodeType === Node.TEXT_NODE) {
            return xml.nodeValue;
        }
    },

    /**
     * Queries the metadata API for the provided list of record names
     *
     * @param {String} type The object type that is being queried
     * @param {String[]} fullNames An array of full record names to query
     * @returns {Promise} A promise that will resolve with array of records or fail with any errors
     */
    queryRecordMetadata: function(type, fullNames) {
        var util = n2.sf.MetadataUtil;
        // Check we have been initialised
        util._checkInitialised();

        if (fullNames.length === 0) {
            return n2.util.promise().resolve([]);
        }

        var options = {
            url: util._url,
            type: 'POST',
            data: n2.ui.renderTemplate(util.QUERY_REQUEST, {
                sessionId: util._sessionId,
                type: type,
                fullNames: fullNames
            }),
            contentType: 'text/xml',
            dataType: 'xml',
            headers: {
                'SOAPAction': '""'
            }
        };

        var result = n2.util.promise();
        n2j$.ajax(options)
            .done(function(data) {
                var errorsElements = data.getElementsByTagName('errors');
                if (errorsElements && errorsElements.length > 0) {
                    var errors = util.xmlToJson(errorsElements);
                    var errorMessages = n2.util.map(errors, function(error) {
                        return error.message;
                    });
                    result.reject(errorMessages.join(', '));
                } else {
                    var recordsElements = data.getElementsByTagName('records');
                    if (recordsElements && recordsElements.length > 0) {
                        var records = util.xmlToJson(recordsElements);
                        result.resolve(records);
                    } else {
                        result.resolve([]);
                    }
                }
            })
            .fail(function(xhr, status, error) {
                if (xhr.responseXML) {
                    var faults = xhr.responseXML.getElementsByTagName('faultstring');
                    if (faults && faults.length > 0) {
                        error = faults.item(0).firstChild.nodeValue;
                    }
                }
                result.reject(error || xhr.status);
            });
        return result;
    },

    /**
     * Checks whether the utility is initialised and if not throws an error
     *
     * @private
     */
    _checkInitialised: function() {
        if (n2.util.isNullOrUndefined(n2.sf.MetadataUtil._url)) {
            throw new Error('MetadataUtil not initialised with a URL');
        }
    }
};

/* globals sforce:false */
/**
 * A utility or helper class with Salesforce related functions
 * @namespace
 * @alias n2.sf.util
 */
ncsquared.sf.SFUtil = {

    /**
     * The border on the body div in classic page
     * @type {Number}
     */
    BODY_DIV_BORDER: 3,
    /**
     * The padding on the cell and div inside the SLDS table in class page
     * @type {Number}
     */
    CELL_AND_DIV_PADDING: 40,
    /**
     * The cached outer height of the header in classic
     * @type {Number}
     */
    _headerOuterHeight: null,
    /**
     * The cached outer height of the footer in classic
     * @type {Number}
     */
    _footerOuterHeight: null,

    /**
     * Determines whether we are currently in classic mode
     *
     * @returns {boolean} True if in classic mode
     */
    isInClassic: function() {
        return typeof sforce === 'undefined' || typeof sforce.one === 'undefined';
    },

    /**
     * Will navigate to the provided page within Salesforce
     *
     * @param {string} page The name of the page to navigtate to
     * @param {string} [queryParams] Any query parameters to add to the page, in the format <code>param1=value1&param2=value2</code>
     */
    navigate: function(page, queryParams) {
        var url = '/apex/' + page;
        if (queryParams) {
            url += '?' + queryParams;
        }
        if (n2.sf.util.isInClassic()) {
            n2.sf.util._setParentLocation(url);
        } else {
            sforce.one.navigateToURL(url);
        }
    },

    /**
     * Will navigate to the provided object within Salesforce
     *
     * @param {string} objectId The id of the object to navigtate to
     */
    navigateToObject: function(objectId) {
        if (n2.sf.util.isInClassic()) {
            n2.sf.util._setParentLocation('/' + objectId);
        } else {
            sforce.one.navigateToSObject(objectId);
        }
    },

    _setParentLocation: function(url) {
        window.parent.location = url;
    },

    /**
     * Will resize the body to fill the full height of the browser in Salesforce classic
     */
    fullHeightClassic: function() {
        n2.sf.util._headerOuterHeight = n2.sf.util._headerOuterHeight || n2j$('div.bPageHeader').outerHeight();
        n2.sf.util._footerOuterHeight = n2.sf.util._footerOuterHeight || n2j$('div.bPageFooter').outerHeight();

        // Body - Header - Footer - Border of body div
        var height = n2j$('body').outerHeight() - n2.sf.util._headerOuterHeight - n2.sf.util._footerOuterHeight - n2.sf.util.BODY_DIV_BORDER;
        var rootCell = n2j$('td.slds-scope');
        rootCell.closest('table').css('height', height);
        rootCell.find('div.slds-scope').eq(0).css('height', height - n2.sf.util.CELL_AND_DIV_PADDING);
    },

    /**
     * Checks whether we are in classic mode and if so resizes the body to the full height of the browser and attaches the function to the window resize event
     */
    checkFullHeightClassic: function() {
        if (n2.sf.util.isInClassic()) {
            n2.sf.util.fullHeightClassic();
            n2j$(window).resize(n2.sf.util.fullHeightClassic);
        }
    },

    /**
     * Formats the given filters into a human readable string (JUST HANDLES ONE FILTER AT THE MOMENT, NOT LOGIC)
     *
     * @param {Object[]} filters The filters to format
     * @param {string} filters[].name The field name to check against
     * @param {string} filters[].op The operator for the filter
     * @param {string} filters[].val The value to compare against
     * @param {string} filters[].type The data type of the field
     * @param {Object} labels A map of field names to their labels
     * @returns {string} The formatted fuman readable string
     */
    formatFilters: function(filters, labels) {
        labels = n2.util.isObject(labels) ? labels : {};
        if (n2.util.isArray(filters) && filters.length > 0) {
            var filter = filters[0];
            // Add name and resolved operator
            var result = '<i>' + (labels[filter.name] || filter.name || '') + '</i> ' + (n2.const.SF.FORMAT_OPERATORS[filter.op] || filter.op || '') + ' ';

            // Depending on the operator add the value(s)
            if (n2.const.SF.LIST_OPERATORS.indexOf(filter.op) === -1) {
                result += n2.sf.util._getFormattedValue(filter.val, filter.type);
            } else {
                result += '(';
                result += filter.val.split(';').map(function(value) {
                    return n2.sf.util._getFormattedValue(value, filter.type);
                }).join(', ');
                result += ')';
            }
            return result;
        }
        return '';
    },

    _getFormattedValue: function(value, type) {
        if (n2.util.isNullOrUndefined(value)) {
            return '';
        }
        // Format the value based on the type, string values wrap in quotes
        switch (type) {
            case 'DOUBLE':
                return n2.util.formatValue(value, 'number:2');
            case 'CURRENCY':
                // TODO: Can I get the currency code from SF
                return n2.util.formatValue(value, 'number:2');
            case 'PERCENT':
                return n2.util.formatValue(value, 'percent');
            case 'INTEGER':
                return n2.util.formatValue(value, 'number');
            case 'DATE':
            case 'DATETIME':
                return n2.sf.util._getFormattedDatePeriod(value, type);
            case 'BOOLEAN':
                return n2.util.formatValue(value, 'boolean:true:false');
            default:
                return '\'' + value + '\'';
        }
    },

    _getFormattedDatePeriod: function(value, type) {
        var valueSplit = value.split(':');
        var formatted = valueSplit[0];
        // Get the recognised date period, or fallback to a formatted date
        if (n2.const.SF.DATE_PERIODS.hasOwnProperty(formatted)) {
            formatted = n2.const.SF.DATE_PERIODS[formatted];
        } else if (n2.const.SF.DATE_PERIODS_FISCAL.hasOwnProperty(formatted)) {
            formatted = n2.const.SF.DATE_PERIODS_FISCAL[formatted];
        } else {
            return '\'' + n2.util.formatValue(value, type.toLowerCase()) + '\'';
        }

        // Check for variable period
        if (valueSplit.length > 1 && formatted.indexOf(' n ') !== -1) {
            return formatted.replace(' n ', ' ' + valueSplit[1] + ' ');
        }
        return formatted;
    },

    /**
     * Returns the operators for a given field type, excluding those that are provided
     *
     * @param {string} fieldType The field type to get the operators for
     * @param {string[]} [config.excludedOperators] An array of the operators that should be excluded from the list
     * @returns {string[]} The array of operators or null if not valid
     */
    getOperatorsForFieldType: function(fieldType, excludedOperators) {
        var operators = n2.const.SF.OPERATORS[fieldType];
        if (n2.util.isArray(operators) && n2.util.isArray(excludedOperators) && excludedOperators.length > 0) {
            return n2.util.map(operators, function(operator) {
                return excludedOperators.indexOf(operator) === -1 ? operator : null;
            });
        }
        return operators;
    },

    /**
     * Returns the error message from a Salesforce controller event, trying to extract any Heroku messages that may exist
     *
     * @param {String} prefix The prefix to an error message, or the default message if no other error is found
     * @param {Object} event The Salesforce controller event
     * @returns {String} The error message, starting with the prefix, then appending any found message
     */
    getMessageFromEvent: function(prefix, event) {
        // Heroku errors are returned to Salesforce in a DTO, try and extract that from the Salesforce error
        var eventError = n2.util.isNullOrUndefined(event) ? '' : event.message;
        if (eventError && eventError.indexOf('{') === 0) {
            var parsedEvent = JSON.parse(eventError);
            eventError = parsedEvent.message ? parsedEvent.message : parsedEvent.error;
        }
        if (prefix && eventError) {
            return prefix + ': ' + eventError;
        } else if (prefix) {
            return prefix;
        }
        return eventError;
    }
};

n2.sf.util = ncsquared.sf.SFUtil;

/**
 * A utility class for managing components in the page
 *
 * @namespace
 * @alias n2.cm
 */
ncsquared.ui.manager.ComponentManager = {

    // The registered component types
    _types: {},

    // The added components
    _components: {},

    // Those components that are children of others and therefore shouldn't be included in getValues
    _childComponents: [],

    // Those components that were added to a modal dialog
    _modalComponents: [],

    // Those components that were added to a table
    _tableComponents: [],

    // If we are creating a component keep track of the id in case we need it and it's not been set on the component yet
    _currentId: null,

    /**
     * Constructs and adds a component to the collection
     *
     * @param {string} type The type of the component
     * @param {Object} config Any configuration for the component
     * @param {boolean} [child=false] Set to true to register the component as a child component and therefore not incldued in getValues
     * @returns {Object} The created component that has been added to the page
     */
    addComponent: function(type, config, child) {
        // Check for required config
        if (!type || !this._types.hasOwnProperty(type)) {
            throw new Error('Invalid type: ' + type);
        }
        n2.util.checkRequiredConfig(config, ['id', 'selector']);

        // Resolve the id then check if it already exists
        config.id = this._getId(config.id);
        if (this._components.hasOwnProperty(config.id)) {
            throw new Error('Component with id ' + config.id + ' already exists');
        }

        // Initialise the type if not already done
        this._initType(type);

        // Create an instance of the component, storing it in our list
        this._currentId = config.id;
        var component = new this._types[type](config);
        component._n2Id = config.id;
        this._currentId = null;
        this._components[config.id] = component;
        if (child === true) {
            this._childComponents.push(config.id);
        }
        return component;
    },

    /**
     * Destroys a component and removes it from the DOM
     *
     * @param {string|Object} componentOrId The id or component to destroy
     */
    destroyComponent: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component) {
            if (component.destroy) {
                component.destroy();
            }
            delete this._components[component._n2Id];
            var index;
            if ((index = this._childComponents.indexOf(component._n2Id)) !== -1) {
                this._childComponents.splice(index, 1);
            }
            if ((index = this._modalComponents.indexOf(component._n2Id)) !== -1) {
                this._modalComponents.splice(index, 1);
            }
            if ((index = this._tableComponents.indexOf(component._n2Id)) !== -1) {
                this._tableComponents.splice(index, 1);
            }
        }
    },

    /**
     * Destroys all registered components on the page and removes them from the DOM
     */
    destroyComponents: function() {
        n2.util.each(this._components, function(id, component) {
            if (component.destroy) {
                component.destroy();
            }
        });
        this._components = {};
        this._childComponents = [];
        this._modalComponents = [];
        this._tableComponents = [];
    },

    /**
     * Gets the component, if a string is provided it looks up the component in the collection
     * of those added, otherwise it just returns what is provided if it's a component or null if not
     *
     * @param {string|Object} componentOrId If a string, the id of the component, otherwise the component itself
     * @returns {Object} If a string, the found component or null if not found, or if not a string the provided component if it is a component otherwise null
     */
    getComponent: function(componentOrId) {
        if (n2.util.isNullOrUndefined(componentOrId)) {
            return null;
        }

        if (n2.util.isString(componentOrId)) {
            var resolvedId = this._getId(componentOrId);
            return this._components.hasOwnProperty(resolvedId) ? this._components[resolvedId] : null;
        }

        return n2.util.isNullOrUndefined(componentOrId._n2Type) ? null : componentOrId;
    },

    /**
     * Checks whether a component is a parent component or one of the managed components (child, modal or table)
     *
     * @param {string} componentId The id of the component to check
     * @returns {boolean} True if the component is a parent component, otherwise false
     */
    isParentComponent: function(componentId) {
        return this._childComponents.indexOf(componentId) === -1 && this._modalComponents.indexOf(componentId) === -1 && this._tableComponents.indexOf(componentId) === -1;
    },

    /**
     * Returns the value for a component
     *
     * @param {string|Object} componentOrId The id or component to get the value for
     * @param {boolean} [skipValidation=false] Set to true to not perform validation before getting the value
     * @returns {*} The value or null if not found, has no value or the component is in an invalid state
     */
    getValue: function(componentOrId, skipValidation) {
        var component = this.getComponent(componentOrId);
        return component && component.getValue ? component.getValue(skipValidation || false) : null;
    },

    /**
     * Returns the values for all components on the page, excluding those with parents, such as those in tables or modal dialogs
     *
     * @returns {Object} An object containing the component ids (excluding n2__ prefix) and their values
     */
    getValues: function() {
        var values = {};
        var self = this;
        n2.util.each(this._components, function(id, component) {
            if (self.isParentComponent(id) && component.getValue) {
                values[self._cleanId(id)] = component.getValue();
            }
        });
        return values;
    },

    /**
     * Returns the values for all components in a modal dialog
     *
     * @param {string|Object} componentOrId The id or modal component to get the values from
     * @returns {Object} An object containing the component ids (excluding n2__ prefix) and their values
     */
    getModalValues: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        return component && (component._n2Type === 'modal' || component._n2Type === 'modal-wizard') ? component.getValues() : null;
    },

    /**
     * Sets the value for a component
     *
     * @param {string|Object} componentOrId The id or component to set the value for
     * @param {*} value The value to set the component to
     * @param {boolean} [validate=true] True to perform validation, or false to ignore any validation
     */
    setValue: function(componentOrId, value, validate) {
        var component = this.getComponent(componentOrId);
        if (component && component.setValue) {
            component.setValue(value, n2.util.getDefaultBoolean(validate, true));
        }
    },

    /**
     * Validate a component
     *
     * @param {string|Object} componentOrId The id or component to validate
     * @returns {boolean} True if valid or not found has no validate function, otherwise false
     */
    validate: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.validate) {
            return component.validate();
        }
        return true;
    },

    /**
     * Validates all components on the page, excluding those with parents, such as those in tables or modal dialogs,
     * and returns if any of them are invalid
     *
     * @returns {boolean} True if all components are valid, otherwise false
     */
    validateAll: function() {
        var valid = true;
        var self = this;
        n2.util.each(this._components, function(id, component) {
            if (self.isParentComponent(id) && component.validate) {
                if (!component.validate()) {
                    valid = false;
                }
            }
        });
        return valid;
    },

    /**
     * Resets a component, setting it back to the default state
     *
     * @param {string|Object} componentOrId The id or component to reset
     */
    reset: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.reset) {
            component.reset();
        }
    },

    /**
     * Refreshes a component, if the component supports refreshing
     *
     * @param {string|Object} componentOrId The id or component to refresh
     * @param {boolean} [keepCurrent=false] If set to true, and the component supports it, will keep the current value instead of resetting back to the default if one was provided
     */
    refresh: function(componentOrId, keepCurrent) {
        var component = this.getComponent(componentOrId);
        if (component && component.refresh) {
            component.refresh(keepCurrent);
        }
    },

    /**
     * Focuses on a component, if applicable
     *
     * @param {string|Object} componentOrId The id or component to give focus to
     * @returns {boolean} True if there was a component to focus on, otherwise false
     */
    focus: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.focus) {
            return component.focus();
        }
        return false;
    },

    /**
     * Enables a component, if the component supports enabling/disabling
     *
     * @param {string|Object} componentOrId The id or component to enable
     */
    enable: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.enable) {
            component.enable();
        }
    },

    /**
     * Disables a component, if the component supports enabling/disabling
     *
     * @param {string|Object} componentOrId The id or component to disable
     */
    disable: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.disable) {
            component.disable();
        }
    },

    /**
     * Shows a component, if the component supports showing/hiding
     *
     * @param {string|Object} componentOrId The id or component to show
     */
    show: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.show) {
            component.show();
        }
    },

    /**
     * Hides a component, if the component supports showing/hiding
     *
     * @param {string|Object} componentOrId The id or component to hide
     */
    hide: function(componentOrId) {
        var component = this.getComponent(componentOrId);
        if (component && component.hide) {
            component.hide();
        }
    },

    /**
     * Returns the component from a table at the given component column index (zero-based) on the same row as the provided component
     *
     * @param {Object} relativeComponent The component that should be used to determine the table and row to search for
     * @param {number} componentColumnIndex The zero-based column index that the component is in, this index is only concerned with component columns, other columns should be ignored
     * @returns {Object} The found component or null if nothing found
     */
    getTableComponentOnRow: function(relativeComponent, componentColumnIndex) {
        if (!n2.util.isNullOrUndefined(relativeComponent)) {
            var relativeId = relativeComponent._n2Id || this._currentId;
            var index;
            if (!n2.util.isNullOrUndefined(relativeId) && (index = relativeId.lastIndexOf('-component-col-')) !== -1) {
                var id = relativeId.substring(0, index + 15) + componentColumnIndex;
                if (this._tableComponents.indexOf(id) !== -1) {
                    return this._components[id];
                }
            }
        }
        return null;
    },

    /**
     * Returns the data key from a table for the same row as the provided component
     *
     * @param {Object} relativeComponent The component that should be used to determine the table and row to search for
     * @returns {String} The data key or null if nothing found
     */
    getTableDataKeyOnRow: function(relativeComponent) {
        if (!n2.util.isNullOrUndefined(relativeComponent)) {
            var relativeId = relativeComponent._n2Id || this._currentId;
            var index;
            if (!n2.util.isNullOrUndefined(relativeId) && (index = relativeId.lastIndexOf('-component-col-')) !== -1) {
                var row = n2j$('#' + relativeId.substring(0, index));
                if (row.length === 1) {
                    return row.attr('data-key');
                }
            }
        }
        return null;
    },

    /**
     * Register a UI component type
     *
     * @private
     */
    _registerType: function(type, fn) {
        this._types[type] = fn;
    },

    /**
     * Initialises a type, checking if it has already been done
     *
     * @private
     */
    _initType: function(type) {
        var proto = this._types[type].prototype;
        if (!proto.initialised) {
            if (proto.init) {
                proto.init();
            }
            proto.initialised = true;
        }
    },

    /**
     * Gets the id from the provided one, making sure it has a prefix
     *
     * @private
     */
    _getId: function(id) {
        return id.indexOf('n2__') === 0 ? id : 'n2__' + id;
    },

    /**
     * Cleans the id from the provided one, removing the prefix
     *
     * @private
     */
    _cleanId: function(id) {
        return id.indexOf('n2__') === 0 ? id.substring(4) : id;
    },

    /**
     * Adds the given component id to the list of modal components
     *
     * @private
     */
    _registerModalComponent: function(id) {
        this._modalComponents.push(id);
    },

    /**
     * Adds the given component id to the list of table components
     *
     * @private
     */
    _registerTableComponent: function(id) {
        this._tableComponents.push(id);
    }

};

n2.cm = ncsquared.ui.manager.ComponentManager;

ncsquared.ui.Dropdown = {

    _dropdownOpen: false,

    startTemplate: '<div class="slds-dropdown-trigger slds-dropdown-trigger_{{hoverClick}} n2__dropdown">' +
        '<button title="Show More" class="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small" {{&btnAttributes}}>' +
        '<svg class="slds-button__icon slds-button__icon_hint slds-button__icon_small" aria-hidden="true">' +
        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#down" />' +
        '</svg>' +
        '<span class="slds-assistive-text">Show More</span>' +
        '</button>' +
        '<div class="slds-dropdown slds-dropdown_right">' +
        '<ul class="slds-dropdown__list" role="menu">',

    endTemplate: '</ul></div></div>',

    renderStartTemplate: function(hover, btnAttributes) {
        var context = {
            hoverClick: hover ? 'hover' : 'click',
            btnAttributes: btnAttributes
        };
        return n2.ui.renderTemplate(ncsquared.ui.Dropdown.startTemplate, context);
    },

    _init: function() {
        n2j$(document)
            // When clicking elsewhere on the page, if a dropdown is open, close it - as long as we're not clicking inside a dropdown
            .on('click', function(event) {
                if (ncsquared.ui.Dropdown._dropdownOpen && n2j$(event.target).closest('div.n2__dropdown.slds-dropdown-trigger_click, .n2__dropdown-target').length === 0) {
                    ncsquared.ui.Dropdown.closeDropdowns();
                }
            })
            // Show/hide the dropdown menu on click of the button where we have a linked dropdown elsewhere in the DOM
            .on('click', 'div.n2__dropdown.slds-dropdown-trigger_click[data-toggle="n2__dropdown"] > button', function(event) {
                var container = n2j$(this).closest('div.n2__dropdown');
                var target = n2j$('#' + container.attr('data-target'));
                if (target.length > 0) {
                    if (target.hasClass('slds-show')) {
                        // If already shown, hide the dropdown
                        target.addClass('slds-hide').removeClass('slds-show');
                        ncsquared.ui.Dropdown._dropdownOpen = false;
                    } else {
                        // Close all other dropdowns before opening this one
                        ncsquared.ui.Dropdown.closeDropdowns();

                        // Get the position the dropdown should be in from the container, check whether we need to go above or below
                        var offset = container.offset();
                        var top = offset.top + container.outerHeight(true);
                        if (top + target.outerHeight(true) > n2j$(document).outerHeight(true)) {
                            top = offset.top - target.outerHeight(true);
                        }
                        var rootOffset = n2.ui.getScopedRoot().offset();
                        target.css({
                            top: top - rootOffset.top,
                            left: offset.left - rootOffset.left
                        });
                        target.removeClass('slds-hide').addClass('slds-show');
                        if (target.is(':focusable')) {
                            target.focus();
                        } else {
                            target.find(':focusable').eq(0).focus();
                        }
                        ncsquared.ui.Dropdown._dropdownOpen = true;
                    }
                }
            })
            // Show/hide the dropdown menu on click of the button or menu item
            .on('click', 'div.n2__dropdown.slds-dropdown-trigger_click:not([data-toggle="n2__dropdown"]) > button, div.n2__dropdown.slds-dropdown-trigger_click ul.slds-dropdown__list', function(event) {
                var container = n2j$(this).closest('div.n2__dropdown');
                if (container.hasClass('slds-is-open')) {
                    container.removeClass('slds-is-open');
                    ncsquared.ui.Dropdown._dropdownOpen = false;
                } else {
                    // Close all other dropdowns before opening this one
                    ncsquared.ui.Dropdown.closeDropdowns();
                    container.addClass('slds-is-open');
                    ncsquared.ui.Dropdown._dropdownOpen = true;
                }

                // Stop the event bubbling up
                event.stopImmediatePropagation();
            });
    },

    /**
     * Close all dropdowns
     */
    closeDropdowns: function() {
        n2j$('div.n2__dropdown.slds-dropdown-trigger_click').removeClass('slds-is-open');
        n2j$('.n2__dropdown-target').addClass('slds-hide').removeClass('slds-show');
        ncsquared.ui.Dropdown._dropdownOpen = false;
    }
};

// Auto-create handlers on initialisation
ncsquared.ui.Dropdown._init();

ncsquared.ui.Handlers = {

    _init: function() {
        n2j$(document)
            // Listen for enter on anchors that have no href but the role of button or menuitem and fire the click event
            .on('keydown', '.n2__component a[role="button"]:not([href]), .n2__component a[role="menuitem"]:not([href])', function(event) {
                if (event.which === n2.key.KEY_ENTER) {
                    n2j$(this).trigger('click');
                }
            });
    }
};

// Setup handlers on initialisation
ncsquared.ui.Handlers._init();

ncsquared.ui.Help = {

    _nubbinHeight: 10,
    _nubbinLeftOffset: 15,

    triggerTemplate: '{{#help}}<div class="slds-form-element__icon">' +
        '<button class="slds-button slds-button_icon n2__tooltip-trigger" id="{{id}}_help-button" aria-describedby="{{id}}_help">' +
        '<svg class="slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">' +
        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#info" />' +
        '</svg>' +
        '<span class="slds-assistive-text">Help</span>' +
        '</button>' +
        '</div>{{/help}}',

    popupTemplate: '{{#help}}<div class="slds-popover slds-popover_tooltip slds-nubbin_bottom-left slds-fall-into-ground" id="{{id}}_help" role="tooltip" style="position: absolute; top: -1000px; left:-1000px">' +
        '<div class="slds-popover__body slds-text-longform">' +
        '<p>{{help}}</p>' +
        '</div>' +
        '</div>{{/help}}',

    _init: function() {
        n2j$(document)
            // On mouse over the tooltip trigger, show the tooltop
            .on('mouseover', 'button.n2__tooltip-trigger', function(event) {
                var triggerContainer = n2j$(this).parent();
                var target = n2j$('#' + n2j$(this).attr('aria-describedby'));
                if (target.length > 0) {
                    // Start by positioning above the trigger
                    // Get the offset of the container to the trigger as that is what the position will be relative to
                    var triggerOffset = triggerContainer.offset();
                    var containerOffset = triggerContainer.offsetParent().offset();
                    // Calculate the position to be above the trigger
                    var height = target.outerHeight(true);
                    target.css('top', (triggerOffset.top - containerOffset.top - height - ncsquared.ui.Help._nubbinHeight) + 'px');
                    target.css('left', Math.max(0, triggerOffset.left - containerOffset.left - ncsquared.ui.Help._nubbinLeftOffset) + 'px');

                    // If we are off the screen, position below the trigger instead
                    var targetOffset = target.offset();
                    if (targetOffset.top < n2.ui.getScrollableParent(target).offset().top) {
                        target.removeClass('slds-nubbin_bottom-left');
                        target.addClass('slds-nubbin_top-left');
                        target.css('top', (triggerOffset.top - containerOffset.top + triggerContainer.height() + ncsquared.ui.Help._nubbinHeight) + 'px');
                    } else {
                        // Make sure correct classes are added
                        target.addClass('slds-nubbin_bottom-left');
                        target.removeClass('slds-nubbin_top-left');
                    }

                    // Show the tooltip
                    target.addClass('slds-rise-from-ground');
                    target.removeClass('slds-fall-into-ground');
                }
            })
            // On mouse out, hide the tooltip
            .on('mouseout', 'button.n2__tooltip-trigger', function() {
                var target = n2j$('#' + n2j$(this).attr('aria-describedby'));
                if (target.length > 0) {
                    target.removeClass('slds-rise-from-ground');
                    target.addClass('slds-fall-into-ground');
                }
            });
    }
};

// Auto-create handlers on initialisation
ncsquared.ui.Help._init();

/**
 * Can be used to display a message box popup on the current page
 *
 * @namespace
 * @alias n2.message
 */
ncsquared.ui.MessageBox = {

    _id: 'n2___message-box',

    _created: false,

    _handlers: {},

    _currentTheme: '',

    // Valid themes
    _themesRegex: /^success$|^info$|^warning$|^error$/,

    // Valid buttons
    _buttonsRegex: /^ok$|^yesno$/,

    // Valid handlers
    _handlersRegex: /^ok$|^yes$|^no$/,

    _concernedKeys: [
        n2.key.KEY_ESCAPE,
        n2.key.KEY_ENTER
    ],

    backdropTemplate: '<div class="slds-backdrop n2__message-box-backdrop"></div>',

    bodyTemplate: '<section tabindex="-1" class="slds-modal slds-modal_prompt slds-fade-in-open n2__component n2__message-box" role="alertdialog" id="{{id}}" aria-describedby="{{id}}_content" aria-labelledby="{{id}}_heading" aria-modal="true">' +
        '<div tabindex="0" class="slds-modal__container">' +
        '<header class="slds-modal__header slds-theme_{{theme}} slds-theme_alert-texture" id="{{id}}_header">' +
        '<h2 class="slds-text-heading_medium" id="{{id}}_heading">{{heading}}</h2>' +
        '</header>' +
        '<div class="slds-modal__content slds-p-around_medium n2__message-box-content" id="{{id}}_content">{{#html}}{{&text}}{{/html}}{{^html}}{{text}}{{/html}}</div>' +
        '<footer id="{{id}}_footer" class="slds-modal__footer slds-theme_default">' +
        '<button id="{{id}}_footer-ok-button" class="slds-button slds-button_neutral{{^showOK}} slds-hide{{/showOK}} n2__message-box-ok-button" value="ok">OK</button>' +
        '<button id="{{id}}_footer-no-button" class="slds-button slds-button_neutral{{^showYesNo}} slds-hide{{/showYesNo}} n2__message-box-yesno-button" value="no">No</button>' +
        '<button id="{{id}}_footer-yes-button" class="slds-button slds-button_brand{{^showYesNo}} slds-hide{{/showYesNo}} n2__message-box-yesno-button" value="yes">Yes</button>' +
        '</footer>' +
        '</div>' +
        '</section>',

    _init: function() {
        // Add the backdrop to the root element
        n2j$(ncsquared.ui.MessageBox.backdropTemplate).appendTo(n2.ui.getScopedRoot());

        var id = this._id;
        var concernedKeys = this._concernedKeys;
        var self = this;
        var onClick = function(event) {
            // Call the appropriate handler if there is one
            if (self._handlers.hasOwnProperty(event)) {
                self._handlers[event]();
            }

            // Close the dialog
            n2j$('#' + id).removeClass('slds-fade-in-open');
            n2j$('div.n2__message-box-backdrop').removeClass('slds-backdrop_open');
        };

        n2j$(document)
            // On clicking a button handle the event and close the dialog
            .on('click', '#' + id + ' footer.slds-modal__footer > button', function(event) {
                onClick(event.target.value);
            })
            // Handle keydown event
            .on('keydown', function(event) {
                var selector;
                // If it's a key we are concerned about and the modal is open then handle the key event
                if (concernedKeys.indexOf(event.which) !== -1 && (selector = n2j$('#' + id + '.slds-fade-in-open')).length > 0) {
                    switch (event.which) {
                        case n2.key.KEY_ENTER:
                            // If we're pressing enter on a button, allow that to take the event
                            if (n2.ui.isButtonTarget(event)) {
                                return;
                            }

                            onClick(selector.find('footer > button.n2__message-box-ok-button.slds-hide').length === 0 ? 'ok' : 'yes');
                            break;
                        case n2.key.KEY_ESCAPE:
                            onClick(selector.find('footer > button.n2__message-box-ok-button.slds-hide').length === 0 ? 'ok' : 'no');
                            break;
                    }

                    // Prevent the key press from bubbling up
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            });
    },

    /**
     * Shows the message box
     *
     * @param {Object} config Configuration for the message box
     * @param {string} config.text The text to display in the middle of the message box. You can use <code>\n</code> for new lines
     * @param {boolean} [config.html=false] If true the raw HTML will be added to the message box and won't be escaped (TAKE CARE WHEN USING THIS)
     * @param {string} config.heading The text to display in the heading
     * @param {string} [config.theme=error] The theme/colour of the heading, available options are: <code>success</code>, <code>info</code>, <code>warning</code> and <code>error</code>
     * @param {string} [config.buttons=ok] The buttons to display at the bottom of the message box, available options are: <code>ok</code> and <code>yesno</code
     * @param {Object.<string, Function>} [config.handlers] The event handlers for the component which will be called just before the dialog closes, the key is the event name and the value is the function that will be called. Valid events are:
     * <ul><li><code>ok</code>: raised when the ok button is clicked or the enter or canel key is pressed</li>
     * <li><code>yes</code>: raised when the yes button is clicked or the enter key is pressed</li>
     * <li><code>no</code>: raised when the no button is clicked or the canel key is pressed</li></ul>
     */
    show: function(config) {
        // Check required config
        n2.util.checkRequiredConfig(config, ['text', 'heading']);

        // Set the default config values
        config.id = this._id;
        config.html = n2.util.getDefaultBoolean(config.html, false);
        config.theme = this._themesRegex.test(config.theme) ? config.theme : 'error';
        var buttons = this._buttonsRegex.test(config.buttons) ? config.buttons : 'ok';
        config.showOK = buttons === 'ok';
        config.showYesNo = buttons === 'yesno';

        // Show the backdrop
        n2j$('div.n2__message-box-backdrop').addClass('slds-backdrop_open');

        // Store event handlers
        this._handlers = {};
        if (config.handlers) {
            var self = this;
            n2.util.each(config.handlers, function(event, handler) {
                if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                    self._handlers[event] = handler;
                }
            });
        }

        var idSelector = '#' + this._id;
        if (this._created) {
            // If already created, update the text, heading and buttons
            n2j$(idSelector + '_header').removeClass('slds-theme_' + this._currentTheme).addClass('slds-theme_' + config.theme);
            n2j$(idSelector + '_heading').text(config.heading);
            if (config.html) {
                n2j$(idSelector + '_content').html(config.text);
            } else {
                n2j$(idSelector + '_content').text(config.text);
            }
            n2j$(idSelector + '_footer > button').addClass('slds-hide');
            if (config.showOK) {
                n2j$(idSelector + '_footer > button.n2__message-box-ok-button').removeClass('slds-hide');
            } else {
                n2j$(idSelector + '_footer > button.n2__message-box-yesno-button').removeClass('slds-hide');
            }
            n2j$(idSelector).addClass('slds-fade-in-open');
        } else {
            // Otherwise render the component and append to the root element
            var html = n2.ui.renderTemplate(this.bodyTemplate, config);
            n2j$(html).appendTo(n2.ui.getScopedRoot());
            this._created = true;
        }

        // Focus on the dialog
        n2j$(idSelector + ' div.slds-modal__container').focus();

        // Store the current theme for next time
        this._currentTheme = config.theme;
    },

    error: function(message) {
        this.show({
            text: message,
            heading: 'Error'
        });
    }

};

// Add the spinner on initialisation
ncsquared.ui.MessageBox._init();

n2.message = ncsquared.ui.MessageBox;

ncsquared.ui.Reorder = {

    ZONE: 75,
    SCROLL_INCREMENT: 200,
    SCROLL_DURATION: 1000,

    _initialised: false,
    _dragging: false,
    _context: null,

    _init: function() {
        n2j$(document)
            .on('mouseup', ncsquared.ui.Reorder._onMouseUp)
            .on('mousemove', ncsquared.ui.Reorder._onMouseMove)
            .on('keydown', ncsquared.ui.Reorder._onKeyDown);
    },

    _cleanup: function() {
        n2j$(document)
            .off('mouseup', ncsquared.ui.Reorder._onMouseUp)
            .off('mousemove', ncsquared.ui.Reorder._onMouseMove)
            .off('keydown', ncsquared.ui.Reorder._onKeyDown);
    },

    _onMouseUp: function() {
        // Handle mouse up by stopping the dragging
        ncsquared.ui.Reorder.stopDragging();
    },

    _onMouseMove: function(event) {
        // Handle mouse move
        ncsquared.ui.Reorder.drag(event);
    },

    _onKeyDown: function(event) {
        // If dragging and escape is pressed, cancel the drag
        if (event.which === n2.key.KEY_ESCAPE && ncsquared.ui.Reorder._dragging) {
            ncsquared.ui.Reorder.cancelDragging();

            // Prevent the key press from bubbling up
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    },

    /**
     * Returns whether or not a drag is ongoing
     *
     * @returns {boolean} true if currently dragging
     */
    isDragging: function() {
        return ncsquared.ui.Reorder._dragging;
    },

    /**
     * Will start dragging based on the provided config
     *
     * @param {Object} event The mouse down event
     * @param {Object} config The configuration object
     * @param {jQuery} config.item The jQuery item that has been selected to be re-ordered
     * @param {string} config.itemsSelector The selector to query the items for ordering
     * @param {string} config.containerSelector The selector to query the container for the items
     * @param {Function} [config.beforeStart] A function to call before dragging starts, with the context object as an argument, to allow for further setup to be performed
     * @param {Function} [config.beforeEnd] A function to call before dragging ends, with the context object and a flag to say whether it was cancelled as the arguments, to allow for some cleanup to be performed
     */
    startDragging: function(event, config) {
        n2.util.checkRequiredConfig(event, ['clientY'], 'event');
        n2.util.checkRequiredConfig(config, ['item', 'itemsSelector', 'containerSelector']);

        var self = ncsquared.ui.Reorder;
        if (!self._initialised) {
            self._init();
            self._initialised = true;
        }

        // Initialise the context object
        var context = {
            item: config.item,
            itemsSelector: config.itemsSelector,
            containerSelector: config.containerSelector,
            beforeEnd: config.beforeEnd
        };
        self._context = context;

        // Clone the item, then make the original opaque
        context.clonedItem = context.item.clone();
        context.item.css('opacity', '0.3');

        // Calculate the offset of the item and what the starting position is of the mouse
        var offset = context.item.position().top;
        context.startingPosition = event.clientY - offset;

        // Get the scrollable parent and what it's starting scroll position is
        context.scrollableParent = n2.ui.getScrollableParent(context.item);
        context.startingScroll = context.scrollableParent.scrollTop();

        // Get the height of the visible part of the scrollable parent and it's full height
        context.scrollHeight = context.scrollableParent.prop('scrollHeight');
        context.height = context.scrollableParent.outerHeight(true);

        // Calculate the offset of the scrollable parent to the document
        context.scrollPageOffset = context.scrollableParent.offset().top;

        // Work out our current item index in it's container
        var container = context.item.closest(context.containerSelector);
        var items = container.find(context.itemsSelector);
        context.currentIndex = items.index(context.item);
        context.startingIndex = context.currentIndex;

        // Discover the mid-point position of all the items now before we start dragging to calculate when items change places
        self._updateItemPositions(items);

        // Update the id of the cloned item insert into the DOM before the current item
        context.clonedItem.attr('id', context.clonedItem.attr('id') + '-dragging');
        context.clonedItem.insertBefore(context.item);

        // Calculate the min and max position the cloned item can be dragged to relative to the container
        context.minPosition = container.find(context.itemsSelector).position().top;
        context.maxPosition = container.outerHeight(true) - context.item.outerHeight(true) + context.minPosition;

        // Before we make the cloned row absolute positioned to start the dragging, if a beforeStart function was set, call it
        if (n2.util.isFunction(config.beforeStart)) {
            config.beforeStart(context);
        }

        // Set the cloned items initial position and apply the dragging class
        context.clonedItem.css('top', offset).css('position', 'absolute').addClass('n2__dragging');

        // Mark we are now dragging
        self._dragging = true;
    },

    /**
     * Will stop the dragging and leave the re-ordered item in it's current position
     */
    stopDragging: function(cancelled) {
        var self = ncsquared.ui.Reorder;
        if (self._dragging) {
            // Re-show the item
            self._context.item.css('opacity', '');

            // Stop any animations and remove the cloned item
            self._context.scrollableParent.stop(true);
            self._context.clonedItem.remove();

            // Before we cleanup, if a beforeEnd function was set, call it
            if (n2.util.isFunction(self._context.beforeEnd)) {
                self._context.beforeEnd(self._context, cancelled);
            }

            // Mark that we're no longer dragging
            self._dragging = false;
            self._context = null;

            // Cleanup the event handlers
            self._cleanup();
            self._initialised = false;
        }
    },

    /**
     * Will stop the dragging but put the the re-ordered item in it's original position
     */
    cancelDragging: function() {
        var self = ncsquared.ui.Reorder;
        if (self._dragging) {
            if (self._context.startingIndex !== self._context.currentIndex) {
                // If the item has moved, look for the item in the original position
                var container = self._context.item.closest(self._context.containerSelector);
                var itemToMove = container.find(self._context.itemsSelector + ':not(.n2__dragging)').get(self._context.startingIndex);
                // Insert the item before or after, depending on whether we are moving up or down
                self._context.item = self._context.startingIndex > self._context.currentIndex ? self._context.item.insertAfter(itemToMove) : self._context.item.insertBefore(itemToMove);
            }

            // Stop the dragging
            self.stopDragging(true);
        }
    },

    /**
     * To be called on mouse move to update the drag positions
     *
     * @param {Object} event The mouse move event
     */
    drag: function(event) {
        var self = ncsquared.ui.Reorder;
        if (self._dragging) {
            // Find out the current scroll position
            var scrollTop = self._context.scrollableParent.scrollTop();

            // Using the difference between the starting and current mouse position, taking into account of scroll, work out the new position
            var newPosition = -(self._context.startingPosition - event.clientY) + scrollTop - self._context.startingScroll;
            // Ensure we are within the bounds of the parent and update the position of the cloned item
            newPosition = Math.min(self._context.maxPosition, Math.max(self._context.minPosition, newPosition));
            self._context.clonedItem.css('top', newPosition);

            // Check whether we should move to a new position
            self._checkMove(newPosition);

            // Set top and bottom zones for auto-scrolling
            var topZone = self._context.scrollPageOffset + self.ZONE;
            var bottomZone = self._context.scrollPageOffset + self._context.height - self.ZONE;

            // Keep track of the position when we started auto-scrolling
            var autoScrollStartPosition = newPosition;

            // Create function to update position of cloned item whilst scrolling
            var stepFn = function(now, fx) {
                // At each change get the current position of the dragging row and see if it's still the same as the last set position in case it has been changed by another mouse move
                var currentPosition = parseInt(self._context.clonedItem.css('top'), 10);
                if (currentPosition === newPosition) {
                    // If it is still the same, calculate the new position based on what the scroll has changed, making sure we keep within the parent
                    newPosition = autoScrollStartPosition + Number(now.toFixed(0)) - scrollTop;
                    newPosition = Math.min(self._context.maxPosition, Math.max(self._context.minPosition, newPosition));
                    self._context.clonedItem.css('top', newPosition);

                    // Check whether we should move to a new position
                    self._checkMove(newPosition);
                }
            };

            if (event.clientY > bottomZone && self._context.scrollHeight > self._context.height + scrollTop) {
                // If the mouse is in the bottom zone, and we haven't scrolled to the bottom, animate the scroll downwards, stopping any existing scroll
                self._context.scrollableParent.stop(true).animate({
                    scrollTop: scrollTop + self.SCROLL_INCREMENT
                }, {
                    duration: self.SCROLL_DURATION,
                    step: stepFn
                });
            } else if (event.clientY < topZone && scrollTop > 0) {
                // If the mouse is in the top zone animate the scroll upwards, stopping any existing scroll
                self._context.scrollableParent.stop().animate({
                    scrollTop: Math.max(0, scrollTop - self.SCROLL_INCREMENT)
                }, {
                    duration: self.SCROLL_DURATION,
                    step: stepFn
                });
            } else {
                // If the mouse is out of the zones, stop any exisiting animation
                self._context.scrollableParent.stop(true);
            }
        }
    },

    _checkMove: function(newPosition) {
        // Look through the positions to see if we can move up or down, and if so record the new index
        var self = ncsquared.ui.Reorder;
        var newIndex = -1;
        n2.util.each(self._context.positions, function(index, value) {
            if (index > self._context.currentIndex) {
                if (newPosition >= value) {
                    newIndex = index;
                } else {
                    return false;
                }
            } else if (index < self._context.currentIndex) {
                if (newPosition <= value) {
                    newIndex = index;
                    return false;
                }
            }
        });

        // If we should move, find the item that we should replace
        if (newIndex >= 0) {
            var container = self._context.item.closest(self._context.containerSelector);
            var itemToMove = container.find(self._context.itemsSelector + ':not(.n2__dragging)').get(newIndex);
            // Insert the item before or after, depending on whether we are moving up or down
            self._context.item = newIndex > self._context.currentIndex ? self._context.item.insertAfter(itemToMove) : self._context.item.insertBefore(itemToMove);

            // Refresh current index and the positions, fetching them again from the DOM
            self._context.currentIndex = newIndex;
            self._updateItemPositions(self._context.item.closest(self._context.containerSelector).find(self._context.itemsSelector + ':not(.n2__dragging)'));
        }
    },

    _updateItemPositions: function(items) {
        // Store the mid-point position of all the items, apart from the last where we just record the top so that it can be moved to
        var lastIndex = items.length - 1;
        ncsquared.ui.Reorder._context.positions = items.map(function(index) {
            var jItem = n2j$(this);
            return Math.floor(jItem.position().top + (lastIndex === index ? 0 : jItem.outerHeight(true) / 2));
        }).get();
    }
};

/**
 * Manages the main spinner on the page with methods to show and hide it
 *
 * @namespace
 * @alias n2.spinner
 */
ncsquared.ui.Spinner = {

    _count: 0,

    bodyTemplate: '<div class="slds-spinner_container n2__spinner slds-hide">' +
        '<div role="status" class="slds-spinner slds-spinner--large slds-spinner--brand">' +
        '<span class="slds-assistive-text">Loading</span>' +
        '<div class="slds-spinner__dot-a"></div>' +
        '<div class="slds-spinner__dot-b"></div>' +
        '</div>' +
        '</div>',

    _init: function() {
        // Render the spinner and add it to the root element
        n2j$(ncsquared.ui.Spinner.bodyTemplate).appendTo(n2.ui.getScopedRoot());
    },

    /**
     * Shows the spinner component
     */
    show: function() {
        n2j$('div.n2__spinner').removeClass('slds-hide');
        n2.spinner._count++;
    },

    /**
     * Hides the spinner component
     */
    hide: function() {
        n2.spinner._count--;
        if (n2.spinner._count <= 0) {
            n2.spinner._count = 0;
            n2j$('div.n2__spinner').addClass('slds-hide');
        }
    }

};

// Add the spinner on initialisation
ncsquared.ui.Spinner._init();

n2.spinner = ncsquared.ui.Spinner;

/**
 * Can be used to display a toast notification at the top of the current page
 *
 * @namespace
 * @alias n2.toast
 */
ncsquared.ui.Toast = {

    _id: 'n2___toast',

    _created: false,

    _currentTheme: '',

    _timeout: null,

    // Valid themes
    _themesRegex: /^success$|^info$|^warning$|^error$/,

    iconTemplate: '<span class="slds-icon_container slds-icon-utility-{{theme}} slds-m-right_small slds-no-flex slds-align-center" id="{{id}}_icon">' +
        '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#{{theme}}" />' +
        '</svg>' +
        '</span>',

    bodyTemplate: function() {
        return '<div class="slds-notify_container n2__toast n2__toast-hidden" id="{{id}}">' +
            '<div class="slds-notify slds-notify_toast slds-theme_{{theme}}" role="status" id="{{id}}_toast">' +
            '<span class="slds-assistive-text">{{theme}}</span>' +
            this.iconTemplate +
            '<div class="slds-notify__content">' +
            '<h2 class="slds-text-heading_small n2__toast-content" id="{{id}}_content">{{#html}}{{&text}}{{/html}}{{^html}}{{text}}{{/html}}</h2>' +
            '</div>' +
            '<div class="slds-notify__close">' +
            '<button title="Close" class="slds-button slds-button_icon slds-button_icon-inverse" id="{{id}}_close">' +
            '<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">' +
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" />' +
            '</svg>' +
            '<span class="slds-assistive-text">Close</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    },

    _init: function() {
        var id = this._id;
        var self = this;
        n2j$(document)
            // On clicking the close button close the dialog
            .on('click', '#' + id + '_close', function() {
                if (self._timeout) {
                    clearTimeout(self._timeout);
                    self._timeout = null;
                }
                n2j$('#' + id).addClass('n2__toast-hidden');
            });
    },

    /**
     * Shows the toast notification - ONLY ONE AT A TIME IS CURRENTLY SUPPORTED
     *
     * @param {Object} config Configuration for the toast
     * @param {string} config.text The text to display in the toast. You can use <code>\n</code> for new lines
     * @param {boolean} [config.html=false] If true the raw HTML will be added to the toast and won't be escaped (TAKE CARE WHEN USING THIS)
     * @param {string} [config.theme=success] The theme/colour/icon of the toast, available options are: <code>success</code>, <code>info</code>, <code>warning</code> and <code>error</code>
     * @param {number} [config.delay=3000] The delay in milliseconds that the toast is shown before automatically closing, set to <code>0</code> to have no delay
     */
    show: function(config) {
        // Check to see that we're not already shown
        var idSelector = '#' + this._id;
        var foundToast;
        if ((foundToast = n2j$(idSelector)).length > 0 && !foundToast.hasClass('n2__toast-hidden')) {
            return;
        }

        // Check required config
        n2.util.checkRequiredConfig(config, ['text']);

        // Set the default config values
        config.id = this._id;
        config.html = n2.util.getDefaultBoolean(config.html, false);
        config.theme = this._themesRegex.test(config.theme) ? config.theme : 'success';
        config.delay = n2.util.isNumber(config.delay) ? Number(config.delay) : 3000;

        if (this._created) {
            // If already created, update the theme and text
            if (this._currentTheme !== config.theme) {
                n2j$(idSelector + '_toast').removeClass('slds-theme_' + this._currentTheme).addClass('slds-theme_' + config.theme);
                var themeText = n2j$(idSelector + '_toast > span.slds-assistive-text');
                themeText.text(config.theme);
                n2j$(idSelector + '_icon').remove();
                var iconHtml = n2.ui.renderTemplate(this.iconTemplate, config);
                n2j$(iconHtml).insertAfter(themeText);
            }
            if (config.html) {
                n2j$(idSelector + '_content').html(config.text);
            } else {
                n2j$(idSelector + '_content').text(config.text);
            }
        } else {
            // Otherwise render the component and append to the root element
            var html = n2.ui.renderTemplate(this.bodyTemplate(), config);
            n2j$(html).appendTo(n2.ui.getScopedRoot());
            this._created = true;
        }

        // Show toast (using timeout to ensure dom is added before class is removed to enable transition) and add close delay if required
        setTimeout(function() {
            n2j$(idSelector).removeClass('n2__toast-hidden');
        }, 0);
        if (config.delay > 0) {
            var self = this;
            this._timeout = setTimeout(function() {
                n2j$(idSelector).addClass('n2__toast-hidden');
                self._timeout = null;
            }, config.delay);
        }

        // Store the current theme for next time
        this._currentTheme = config.theme;
    }
};

// Setup the handlers on initialisation
ncsquared.ui.Toast._init();

n2.toast = ncsquared.ui.Toast;

ncsquared.ui.Validation = {

    /**
     * Updates the given element as to whether it is valid or not
     */
    updateValid: function(element, valid) {
        if (valid) {
            element.removeClass('slds-has-error');
            element.find('div.slds-form-element__help').addClass('slds-hidden');
        } else {
            element.addClass('slds-has-error');
            element.find('div.slds-form-element__help').removeClass('slds-hidden');
        }
    }
};

/**
 * Creates a new button component - use {@link n2.cm.addComponent} with the type <code>button</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the button component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the button should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.style=neutral] The style of the button, one from <ul><li><code>neutral</code></li><li><code>brand</code></li></li><li><code>success</code></li><li><code>failure</code></li><li><code>link</code></ul>.
 * This will be ignored if there is only an icon and no text
 * @param {string} [config.text] The text to display on the button
 * @param {string} [config.tooltip] The tooltip to display on hover over the button, will default to the <code>text</code> property
 * @param {string} [config.icon] The sprite icon name to display on the button
 * @param {string} [config.iconSprite=action] The sprite name where the icon is from to display on the button
 * @param {string} [config.iconCls] The CSS class to apply to the icon
 * @param {boolean} [config.iconBorder=true] True to show the border around the button when there is an icon and no text
 * @param {boolean} [config.toggle=false] True if the button should be a toggle button, only really works well with an icon and no text
 * @param {boolean} [config.defaultToggle=false] If toggle is enabled whether it defaults to on (true) or off (false)
 * @param {boolean} [config.disabled=false] If true will create the button in a disabled state
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>click</code>: raised when the button is clicked, if a toggle button then the following argument is provided: <code>{booelan} selected</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.Button = function(config) {
    // Set the default config values
    if (n2.util.isNullOrUndefined(config.text)) {
        config.style = 'slds-button_icon';
        if (n2.util.getDefaultBoolean(config.iconBorder, true)) {
            config.style += ' slds-button_icon-border-filled';
        }
    } else if (this._buttonStyles.hasOwnProperty(config.style)) {
        config.style = this._buttonStyles[config.style];
    } else {
        config.style = this._buttonStyles.neutral;
    }
    if (n2.util.isNullOrUndefined(config.tooltip)) {
        config.tooltip = config.text;
    }
    config.iconSprite = config.iconSprite || 'action';
    config.toggle = n2.util.getDefaultBoolean(config.toggle, false);
    config.defaultToggle = config.toggle ? n2.util.getDefaultBoolean(config.defaultToggle, false) : false;
    config.disabled = n2.util.getDefaultBoolean(config.disabled, false);

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    var target = n2j$(html);
    n2j$(config.selector).replaceWith(target);

    // Set variables for selectors
    this.selector = '#' + config.id;

    // Set other variables to use later
    this.defaultToggle = config.defaultToggle;

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        var self = this;
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.Button.prototype._n2Type = 'button';

// Valid button styles and their respective styles
ncsquared.ui.components.Button.prototype._buttonStyles = {
    neutral: 'slds-button_neutral',
    brand: 'slds-button_brand',
    success: 'slds-button_success',
    failure: 'slds-button_destructive',
    link: ''
};

// Valid event handlers
ncsquared.ui.components.Button.prototype._handlersRegex = /^click$/;

ncsquared.ui.components.Button.prototype.bodyTemplate = '<button id="{{id}}" class="slds-button n2__component {{style}}{{#cls}} {{cls}}{{/cls}}{{#defaultToggle}} slds-is-selected{{/defaultToggle}}"{{#tooltip}} title="{{tooltip}}"{{/tooltip}}{{#toggle}} aria-pressed="{{defaultToggle}}"{{/toggle}}{{#disabled}} disabled="disabled"{{/disabled}}>' +
    '{{#icon}}<svg class="slds-button__icon{{#text}} slds-button__icon_left{{/text}}{{#iconCls}} {{iconCls}}{{/iconCls}}" aria-hidden="true" focusable="false">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/{{iconSprite}}-sprite/svg/symbols.svg#{{icon}}" />' +
    '</svg>{{/icon}}' +
    '{{#tooltip}}<span class="slds-assistive-text">{{tooltip}}</span>{{/tooltip}}' +
    '{{#text}}<span id="{{id}}_label">{{text}}</span>{{/text}}' +
    '</button>';

ncsquared.ui.components.Button.prototype.init = function() {
    n2j$(document)
        // On click fire any handlers
        .on('click', 'button.n2__component', function() {
            var button = n2j$(this);
            // If we're a toggle, change the state then fire the event passing in the selected state
            if (!n2.util.isNullOrUndefined(button.attr('aria-pressed'))) {
                var selected = true;
                if (button.hasClass('slds-is-selected')) {
                    button.removeClass('slds-is-selected');
                    button.attr('aria-pressed', false);
                    selected = false;
                } else {
                    button.addClass('slds-is-selected');
                    button.attr('aria-pressed', true);
                }
                n2.cm.getComponent(button.attr('id'))._handleEvent('click', selected);
            } else {
                // Otherwise just fire the event
                n2.cm.getComponent(button.attr('id'))._handleEvent('click');
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Button.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * If a toggle button, resets the button back to the <code>defaultToggle</code> or off if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Button.prototype.reset = function() {
    // If a toggle set to the default value
    var button = n2j$(this.selector);
    if (!n2.util.isNullOrUndefined(button.attr('aria-pressed'))) {
        var isSelected = button.hasClass('slds-is-selected');
        if (isSelected !== this.defaultToggle) {
            if (isSelected) {
                button.removeClass('slds-is-selected');
                button.attr('aria-pressed', false);
            } else {
                button.addClass('slds-is-selected');
                button.attr('aria-pressed', true);
            }
        }
    }
};

/**
 * Gives focus to the button. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Button.prototype.focus = function() {
    n2j$(this.selector).focus();
    return true;
};

/**
 * Enables the button
 */
ncsquared.ui.components.Button.prototype.enable = function() {
    n2j$(this.selector).prop('disabled', '');
};

/**
 * Disables the button
 */
ncsquared.ui.components.Button.prototype.disable = function() {
    n2j$(this.selector).prop('disabled', 'disabled');
};

/**
 * Shows the button
 */
ncsquared.ui.components.Button.prototype.show = function() {
    n2j$(this.selector).removeClass('slds-hide');
};

/**
 * Hides the button so that it is not visible to the user
 */
ncsquared.ui.components.Button.prototype.hide = function() {
    n2j$(this.selector).addClass('slds-hide');
};

ncsquared.ui.components.Button.prototype._handleEvent = function(event, arg) {
    if (this.handlers.hasOwnProperty(event)) {
        if (n2.util.isNullOrUndefined(arg)) {
            this.handlers[event].call(this);
        } else {
            this.handlers[event].call(this, arg);
        }
    }
};

n2.cm._registerType(ncsquared.ui.components.Button.prototype._n2Type, ncsquared.ui.components.Button);

/**
 * Creates a new checkbox component - use {@link n2.cm.addComponent} with the type <code>checkbox</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the checkbox component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the checkbox should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display
 * @param {boolean} [config.displayLabel=true] Whether or not to show the label, if set to false a tooltip of the label will still be included along with assistive text
 * @param {boolean} [config.defaultValue=false] A default value to set the checkbox to
 * @param {boolean} [config.disabled=false] If true will create the checkbox toggle in a disabled state
 * @param {boolean} [config.required=false] Whether or not the checkbox is required, if it is then the <config>defaultValue</config> will be ignored and it will default to an indeterminate state
 * @param {string} [config.requiredError=This field is required] An error message to display when the checkbox is required but no value is provided
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {boolean} [config.stacked=false] When set to true the label will be stacked above the checkbox; used for stacked forms. When set to true ignores the {code}displayLabel{code} config.
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>change</code>: raised when the checkbox value changes, called with the argument: <code>{booelan} checked</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.Checkbox = function(config) {
    // Set the default config values
    config.displayLabel = n2.util.isNullOrUndefined(config.label) ? false : n2.util.getDefaultBoolean(config.displayLabel, true);
    config.defaultValue = n2.util.getDefaultBoolean(config.defaultValue, false);
    config.disabled = n2.util.getDefaultBoolean(config.disabled, false);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    if (config.required) {
        config.defaultValue = false;
    }
    config.requiredError = config.requiredError || 'This field is required';
    config.stacked = n2.util.getDefaultBoolean(config.stacked, false);

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.valueSelector = this.selector + '_checkbox';

    // Set other variables to use later
    this.defaultValue = config.defaultValue;
    this.required = config.required;

    // If required set the indeterminate property as it can only be set via JS
    if (config.required) {
        n2j$(this.valueSelector).prop('indeterminate', true);
    }

    // Add change handler, if provided, per component as it doesn't seem to work with the document selector
    var self = this;
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (event === 'change' && n2.util.isFunction(handler)) {
                n2j$(self.valueSelector).on('change', function() {
                    handler.call(self, n2j$(this).prop('checked'));
                });
            }
        });
    }
};

ncsquared.ui.components.Checkbox.prototype._n2Type = 'checkbox';

ncsquared.ui.components.Checkbox.prototype.bodyTemplate = '<div class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#stacked}}<label class="slds-form-element__label" for="{{id}}_checkbox">{{label}}</label>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/stacked}}' +
    '<div class="slds-form-element__control">' +
    '<span class="slds-checkbox{{#stacked}} slds-checkbox_standalone{{/stacked}}">' +
    '{{#required}}<abbr title="Required" class="slds-required">*</abbr>{{/required}}' +
    '<input class="n2__checkbox" id="{{id}}_checkbox" type="checkbox"{{#defaultValue}} checked{{/defaultValue}}{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}}{{#disabled}} disabled="disabled"{{/disabled}} />' +
    '{{^stacked}}<label class="slds-checkbox__label" for="{{id}}_checkbox"{{#label}} title="{{label}}"{{/label}}>' +
    '<span class="slds-checkbox_faux"></span>' +
    '<span class="slds-form-element__label{{^displayLabel}} slds-assistive-text{{/displayLabel}}">{{#label}}{{label}}{{/label}}{{^label}}Select{{/label}}</span>' +
    '</label>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/stacked}}' +
    '{{#stacked}}<span class="slds-checkbox_faux"></span>{{/stacked}}' +
    '</span>' +
    '{{#required}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>{{/required}}' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.Checkbox.prototype.init = function() {
    n2j$(document)
        // On blur validate the component
        .on('blur', 'div.n2__component input.n2__checkbox', function() {
            n2.cm.validate(n2j$(this).closest('.n2__component').attr('id'));
        })
        // On change validate the component to make sure the required status is correctly updated
        .on('change', 'div.n2__component input.n2__checkbox', function() {
            n2.cm.validate(n2j$(this).closest('.n2__component').attr('id'));
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Checkbox.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of the checkbox or null if indeterminate. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {boolean} The current checked state or null if indeterminate
 */
ncsquared.ui.components.Checkbox.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will set the checkbox to the given checked state and validate, unless requested not to. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {boolean} value Whether to set the checkbox to checked or unchecked
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.Checkbox.prototype.setValue = function(value, validate) {
    // Set the value then trigger a validate
    n2j$(this.valueSelector).prop('checked', n2.util.getDefaultBoolean(value, false)).prop('indeterminate', '');
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate if the checkbox is required and whether it has either been checked or unchecked.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or the checkbox is either checked or unchecked, otherwise false
 */
ncsquared.ui.components.Checkbox.prototype.validate = function() {
    // If required, validate that we have a value
    if (!this.required) {
        return true;
    }

    var valid = n2j$(this.valueSelector).prop('indeterminate') !== true;
    // Update the valid state of the component
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), valid);
    return valid;
};

/**
 * Resets the checkbox back to its initial <config>defaultValue</config> or unchecked if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Checkbox.prototype.reset = function() {
    // Set value to the default
    this.setValue(this.defaultValue || false);
    n2j$(this.valueSelector).prop('indeterminate', this.required || '');
};

/**
 * Gives focus to the checkbox. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Checkbox.prototype.focus = function() {
    n2j$(this.valueSelector).focus();
    return true;
};

/**
 * Enables the checkbox
 */
ncsquared.ui.components.Checkbox.prototype.enable = function() {
    n2j$(this.valueSelector).prop('disabled', '');
};

/**
 * Disables the checkbox
 */
ncsquared.ui.components.Checkbox.prototype.disable = function() {
    n2j$(this.valueSelector).prop('disabled', 'disabled');
};

ncsquared.ui.components.Checkbox.prototype._getValue = function() {
    // Return null if indeterminate, otherwise the checked state
    return n2j$(this.valueSelector).prop('indeterminate') === true ? null : Boolean(n2j$(this.valueSelector).prop('checked'));
};

n2.cm._registerType(ncsquared.ui.components.Checkbox.prototype._n2Type, ncsquared.ui.components.Checkbox);

/**
 * Creates a new checkbox group component - use {@link n2.cm.addComponent} with the type <code>checkbox-group</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the checkbox group component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the checkbox group should be rendered, will be replaced with the HTML for the component
 * @param {stinrg} [config.label] An optional label to display above the checkbox group
 * @param {string[]|Object[]|Function} config.data An array of the available checkboxes or a function that can be called with no arguments to get the checkboxes:
 * <ul><li><code>string[]</code> can be used to return checkboxes whose values and labels are the same</li>
 * <li><code>Object[]</code> can be used to specify the values and labels of the checkboxes (see below)</li>
 * <li><code>Function</code> can be used to return either one of the arrays above or a promise which, when resolved, will provide an array</li></ul>
 * @param {string} config.data[].label The label to display to the user next to the checkbox
 * @param {string} config.data[].value The value that is returned in the <code>getValue</code> method when the checkbox is checked
 * @param {string|string[]} [config.defaultValue] The value(s) of the checkbox that are checked by default, all others are unchecked
 * @param {boolean} [config.sort=true] When set to true will sort the checkboxes alphabetically by label
 * @param {boolean} [config.required=false] Whether or not the checkbox group is required, ie at least one of the checkboxes are checked
 * @param {string} [config.requiredError=This field is required] An error message to display when the checkbox group is required but none are checked
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.CheckboxGroup = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['data', 'data.label', 'data.value']);

    // Set the default config values
    config.sort = n2.util.getDefaultBoolean(config.sort, true);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.requiredError = config.requiredError || 'This field is required';

    // If data is a function call it and see if we get an array response or a promise
    var dataPromise = false;
    if (n2.util.isFunction(config.data)) {
        this.data = config.data;
        var response = config.data.call(this);
        if (n2.util.isPromise(response)) {
            dataPromise = response;
            config.showSpinner = true;
        } else {
            config.data = response;
        }
    }
    // Process the data to get the checkboxes
    this.sort = config.sort;
    config.checkboxes = config.showSpinner ? [] : this._getCheckboxes(config.data, config.defaultValue);
    delete config.data;

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.containerSelector = this.selector + '_group';
    this.valueSelector = this.containerSelector + ' input.n2__checkbox-group';
    this.errorSelector = this.selector + '_error';
    this.spinnerSelector = this.selector + '_spinner';

    // Set other variables to use later, make the default values strings as they will be converted to strings in the DOM anyway
    if (n2.util.isArray(config.defaultValue)) {
        this.defaultValue = n2.util.map(config.defaultValue, function(value) {
            return String(value);
        });
    } else if (!n2.util.isNullOrUndefined(config.defaultValue)) {
        this.defaultValue = String(config.defaultValue);
    }
    this.required = config.required;

    // If the function did return a promise setup call for when resolved to add the checkboxes
    var self = this;
    if (dataPromise) {
        dataPromise.done(function(data) {
            self._addCheckboxes(data, false, self.defaultValue);
        });
    }
};

ncsquared.ui.components.CheckboxGroup.prototype._n2Type = 'checkbox-group';

ncsquared.ui.components.CheckboxGroup.prototype.checkboxTemplate = '{{#checkboxes}}<div class="slds-checkbox">' +
    '<input class="n2__checkbox-group" id="{{id}}_checkbox-{{index}}" type="checkbox" value="{{value}}"{{#checked}} checked{{/checked}}{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}} />' +
    '<label class="slds-checkbox__label" for="{{id}}_checkbox-{{index}}" title="{{label}}">' +
    '<span class="slds-checkbox_faux"></span>' +
    '<span class="slds-form-element__label">{{label}}</span>' +
    '</label>' +
    '</div>{{/checkboxes}}';

ncsquared.ui.components.CheckboxGroup.prototype.bodyTemplate = '<fieldset class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#label}}<legend class="slds-form-element__legend slds-form-element__label" for="{{id}}_group">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</legend>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/label}}' +
    '<div class="slds-form-element__control" id="{{id}}_group">' +
    ncsquared.ui.components.CheckboxGroup.prototype.checkboxTemplate +
    '<div class="slds-spinner_container{{^showSpinner}} slds-hide{{/showSpinner}}" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    '{{#required}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>{{/required}}' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</fieldset>';

ncsquared.ui.components.CheckboxGroup.prototype.init = function() {
    n2j$(document)
        // On change validate the component
        .on('change', 'fieldset.n2__component input.n2__checkbox-group', function() {
            n2.cm.validate(n2j$(this).closest('.n2__component').attr('id'));
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.CheckboxGroup.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the values of the checked checkboxes or null if required and none are checked. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string[]} The values of the current checked checkboxes or null if required and none are checked
 */
ncsquared.ui.components.CheckboxGroup.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will set the checkboxes to checked for the given values, all others will be set to unchecked. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string|string[]} value The value or values of the checkboxes that should be checked
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.CheckboxGroup.prototype.setValue = function(value, validate) {
    // Set the checked state of the checkboxes then trigger a validate
    var valueIsArray = n2.util.isArray(value);
    n2j$(this.valueSelector).each(function(index, checkbox) {
        if (valueIsArray ? value.indexOf(checkbox.value) === -1 : value !== checkbox.value) {
            n2j$(checkbox).prop('checked', '');
        } else {
            n2j$(checkbox).prop('checked', true);
        }
    });
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate if the checkbox group is required and if at least one item has been checked.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or at least one item has been checked, otherwise false
 */
ncsquared.ui.components.CheckboxGroup.prototype.validate = function() {
    // If required, validate that we have at least one checked
    if (!this.required) {
        return true;
    }

    var valid = n2j$(this.valueSelector).is(':checked');
    // Update the valid state of the component
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), valid);
    return valid;
};

/**
 * Resets the checkbox group back to its initial <config>defaultValue</config> or all unchecked if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.CheckboxGroup.prototype.reset = function() {
    // Set value to the default and then set to valid
    this.setValue(this.defaultValue || [], false);
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Refreshes the checkbox group by calling the <code>data</code> function if it was provided to create a new list of checkboxes. Use {@link n2.cm.refresh} instead of this method directly
 *
 * @param {boolean} [keepCurrent=false] Set to true to keep the current value otherwise reverts back to the <code>defaultValue</code>
 */
ncsquared.ui.components.CheckboxGroup.prototype.refresh = function(keepCurrent) {
    // If the data was provided as a function, add the mask
    if (n2.util.isFunction(this.data)) {
        n2j$(this.spinnerSelector).removeClass('slds-hide');

        // If keeping current but we have no current checkboxes then assume this is the first delayed load and we want to use the default
        var resetValue = keepCurrent === true && n2j$(this.valueSelector).length > 0 ? this._getValue() : this.defaultValue;

        // Call the function and either add the checkboxes straight away or hook it into the promise done
        var response = this.data();
        if (response && n2.util.isPromise(response)) {
            var self = this;
            response.done(function(data) {
                self._addCheckboxes(data, true, resetValue);
            });
        } else {
            this._addCheckboxes(response, true, resetValue);
        }

        // Set to valid
        ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
    }
};

/**
 * Gives focus to the first checkbox. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.CheckboxGroup.prototype.focus = function() {
    // Focus on the first checkbox
    n2j$(this.valueSelector).eq(0).focus();
    return true;
};

ncsquared.ui.components.CheckboxGroup.prototype._getCheckboxes = function(data, defaultValue) {
    var defaultIsArray = n2.util.isArray(defaultValue);
    // Check that the data is an array, and fail if not and we are not waiting for a promise response
    if (n2.util.isArray(data)) {
        var checkboxes = [];
        n2.util.each(data, function(index, checkbox) {
            var newCheckbox;
            if (n2.util.isString(checkbox)) {
                newCheckbox = {
                    label: checkbox,
                    value: checkbox
                };
            } else {
                newCheckbox = checkbox;
            }
            newCheckbox.index = index;

            // Set if this is the default value
            newCheckbox.checked = defaultIsArray ? defaultValue.indexOf(newCheckbox.value) !== -1 : defaultValue === newCheckbox.value;
            checkboxes.push(newCheckbox);
        });

        // If required, sort the items
        if (this.sort) {
            checkboxes.sort(function(a, b) {
                return n2.util.compareObjectValues(a, b, 'label');
            });
        }

        return checkboxes;
    }

    throw new Error('data must by an array');
};

ncsquared.ui.components.CheckboxGroup.prototype._addCheckboxes = function(data, cleanFirst, defaultValue) {
    // If requested, remove the existing checkbxoes
    if (cleanFirst) {
        n2j$(this.containerSelector + ' > div.slds-checkbox').remove();
    }

    // Get the new HTML for the checkboxes and append them to the control
    var checkboxes = this._getCheckboxes(data, defaultValue);
    var checkboxesHtml = n2.ui.renderTemplate(this.checkboxTemplate, {
        checkboxes: checkboxes
    });
    n2j$(checkboxesHtml).prependTo(this.containerSelector);

    // Remove the spinner
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

ncsquared.ui.components.CheckboxGroup.prototype._getValue = function() {
    // Return values of those checked
    return n2j$(this.valueSelector + ':checked').map(function(index, checkbox) {
        return checkbox.value;
    }).get();
};

n2.cm._registerType(ncsquared.ui.components.CheckboxGroup.prototype._n2Type, ncsquared.ui.components.CheckboxGroup);

/**
 * Creates a new checkbox toggle component - use {@link n2.cm.addComponent} with the type <code>checkbox-toggle</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the checkbox toggle component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the checkbox toggle should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display
 * @param {string} [config.onLabel] The label to display when on (true)
 * @param {string} [config.offLabel] The label to display when off (fakse)
 * @param {boolean} [config.defaultValue=false] A default value to set the checkbox toggle to
 * @param {boolean} [config.disabled=false] If true will create the checkbox toggle in a disabled state
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>change</code>: raised when the checkbox toggle value changes, called with the argument: <code>{booelan} checked</code></li>
 * <li><code>load</code>: raised when the component has first finished loading, called with the argument: <code>{booelan} checked</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.CheckboxToggle = function(config) {
    // Set the default config values
    config.defaultValue = n2.util.getDefaultBoolean(config.defaultValue, false);
    config.disabled = n2.util.getDefaultBoolean(config.disabled, false);

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.valueSelector = this.selector + '_checkbox';

    // Set other variables to use later
    this.defaultValue = config.defaultValue;

    // Add change handler, if provided, per component as it doesn't seem to work with the document selector
    var self = this;
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (n2.util.isFunction(handler)) {
                if (event === 'change') {
                    n2j$(self.valueSelector).on('change', function() {
                        handler.call(self, n2j$(this).prop('checked'));
                    });
                } else if (event === 'load') {
                    // Call the load handler
                    handler.call(self, self.defaultValue);
                }
            }
        });
    }
};

ncsquared.ui.components.CheckboxToggle.prototype._n2Type = 'checkbox-toggle';

ncsquared.ui.components.CheckboxToggle.prototype.bodyTemplate = '<div class="slds-form-element n2__checkbox-toggle n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '<div class="slds-form-element__control">' +
    '<label class="slds-checkbox_toggle slds-grid">' +
    '{{#label}}<span class="slds-form-element__label slds-m-bottom_none">{{label}}</span>{{/label}}' +
    '<input class="n2__checkboxToggle" id="{{id}}_checkbox" type="checkbox"{{#defaultValue}} checked{{/defaultValue}} aria-describedby="{{id}}_container"{{#disabled}} disabled="disabled"{{/disabled}} />' +
    '<span class="slds-checkbox_faux_container" id="{{id}}_container" aria-live="assertive">' +
    '<span class="slds-checkbox_faux"></span>' +
    '{{#onLabel}}<span class="slds-checkbox_on">{{onLabel}}</span>{{/onLabel}}' +
    '{{#offLabel}}<span class="slds-checkbox_off">{{offLabel}}</span>{{/offLabel}}' +
    '</span>' +
    ncsquared.ui.Help.triggerTemplate +
    '</label>' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.CheckboxToggle.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of the checkbox toggle. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @returns {boolean} The current toggle state
 */
ncsquared.ui.components.CheckboxToggle.prototype.getValue = function() {
    return Boolean(n2j$(this.valueSelector).prop('checked'));
};

/**
 * Will set the checkbox toggle to the given checked state. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {boolean} value Whether to set the checkbox toggle to checked or unchecked
 */
ncsquared.ui.components.CheckboxToggle.prototype.setValue = function(value) {
    // Set the value then trigger a validate
    n2j$(this.valueSelector).prop('checked', n2.util.getDefaultBoolean(value, false));
};

/**
 * Resets the checkbox toggle back to its initial <config>defaultValue</config> or unchecked if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.CheckboxToggle.prototype.reset = function() {
    // Set value to the default
    this.setValue(this.defaultValue || false);
};

/**
 * Gives focus to the checkbox toggle. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.CheckboxToggle.prototype.focus = function() {
    n2j$(this.valueSelector).focus();
    return true;
};

/**
 * Enables the checkbox toggle
 */
ncsquared.ui.components.CheckboxToggle.prototype.enable = function() {
    n2j$(this.valueSelector).prop('disabled', '');
};

/**
 * Disables the checkbox toggle
 */
ncsquared.ui.components.CheckboxToggle.prototype.disable = function() {
    n2j$(this.valueSelector).prop('disabled', 'disabled');
};

n2.cm._registerType(ncsquared.ui.components.CheckboxToggle.prototype._n2Type, ncsquared.ui.components.CheckboxToggle);

/**
 * Creates a new colour picker component - use {@link n2.cm.addComponent} with the type <code>color</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the colour picker
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the picker should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display in the control
 * @param {string[]|Object[]} config.colors The array of colours that can be selected, either a string array of CSS defined colours or an object with colours and names
 * @param {string} [config.colors[].name] The name of the colour
 * @param {string} config.colors[].color The CSS defined colour
 * @param {string} [config.defaultColor] The default colour
 * @param {boolean} [config.required=false] Whether or not the colour is required
 * @param {string} [config.requiredError=This field is required] An error message to display when a colour is required but not provided
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.ColorPicker = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['colors', 'colors.color']);

    // Set the default config values and process the colours
    var colors = [];
    n2.util.each(config.colors, function(index, color) {
        var cssColor = n2.util.isString(color) ? color : color.color;
        colors.push({
            name: n2.util.isObject(color) && !n2.util.isNullOrUndefined(color.name) ? color.name : cssColor,
            color: cssColor,
            isDefault: config.defaultColor && config.defaultColor === cssColor
        });
    });
    config.colors = colors;
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.requiredError = config.requiredError || 'This field is required';

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);
    // Create the HTML for the dropdown and append it to the root element
    html = n2.ui.renderTemplate(this.dropdownTemplate, config);
    n2j$(html).appendTo(n2.ui.getScopedRoot());

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.elementSelector = this.selector + ' div.slds-form-element';
    this.valueSelector = this.selector + '_input';
    this.errorSelector = this.selector + '_error';
    this.dropdownSelector = this.selector + '_selector';

    // Set other variables to use later
    this.defaultColor = config.defaultColor;
    this.required = config.required;
    this.requiredError = config.requiredError;
};

ncsquared.ui.components.ColorPicker.prototype._n2Type = 'color';

ncsquared.ui.components.ColorPicker.prototype._concernedKeys = [
    n2.key.KEY_ESCAPE,
    n2.key.KEY_ENTER,
    n2.key.KEY_LEFT,
    n2.key.KEY_RIGHT
];

ncsquared.ui.components.ColorPicker.prototype._invalidColorMessage = 'Please enter a valid CSS color';

ncsquared.ui.components.ColorPicker.prototype.bodyTemplate = '<div class="slds-color-picker n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '<div class="slds-form-element slds-color-picker__summary">' +
    '{{#label}}<label class="slds-form-element__label slds-color-picker__summary-label" for="{{id}}_input">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</label>{{/label}}' +
    ncsquared.ui.Help.triggerTemplate +
    // Start form control
    '<div class="slds-form-element__control">' +
    '<div class="slds-dropdown-trigger slds-dropdown-trigger_click n2__dropdown" data-toggle="n2__dropdown" data-target="{{id}}_selector">' +
    '<button class="slds-button slds-color-picker__summary-button slds-button_icon slds-button_icon-more" id="{{id}}_button" title="Choose color">' +
    '<span class="slds-swatch"{{#defaultColor}} style="background-color: {{defaultColor}};{{/defaultColor}}">' +
    '<span class="slds-assistive-text">{{#defaultColor}}{{defaultColor}}{{/defaultColor}}</span>' +
    '</span>' +
    // Space before element needed for styling
    ' <svg class="slds-button__icon slds-button__icon_small slds-m-left_xx-small" aria-hidden="true" focusable="false">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#down" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Choose a color.</span>' +
    '</button>' +
    // Space before element needed for styling
    ' <div class="slds-color-picker__summary-input">' +
    '<input class="slds-input" id="{{id}}_input" type="text"{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}} value="{{#defaultColor}}{{defaultColor}}{{/defaultColor}}"/>' +
    '</div>' +
    '</div>' +
    '</div>' +
    // End form control
    '<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.ColorPicker.prototype.dropdownTemplate = '<section class="slds-dropdown slds-color-picker__selector slds-hide n2__color-picker n2__dropdown-target" role="dialog" aria-describedby="{{id}}_selector-body" id="{{id}}_selector" aria-label="Choose a color" data-target="{{id}}" tabindex="0">' +
    '<div class="slds-popover__body" id="{{id}}_selector-body">' +
    '<ul class="slds-color-picker__swatches" role="listbox" id="{{id}}_selector-list">' +
    '{{#colors}}' +
    '<li class="slds-color-picker__swatch{{#isDefault}} selected{{/isDefault}}" role="presentation">' +
    '<a tabindex="-1" class="slds-color-picker__swatch-trigger" role="option" title="{{name}}">' +
    '<span class="slds-swatch" style="background-color: {{color}};"><span class="slds-assistive-text">{{name}}</span></span>' +
    '</a>' +
    '</li>' +
    '{{/colors}}' +
    '</ul>' +
    '</div>' +
    '<footer class="slds-popover__footer">' +
    '<div class="slds-color-picker__selector-footer">' +
    '<button class="slds-button slds-button_neutral" value="cancel" id="{{id}}_selector-cancel-button">Cancel</button>' +
    '<button class="slds-button slds-button_brand" value="ok" id="{{id}}_selector-ok-button">Done</button>' +
    '</div>' +
    '</footer>' +
    '</section>';

ncsquared.ui.components.ColorPicker.prototype.init = function() {
    n2j$(document)
        // On blur of the input set the value to update the swatch and validate
        .on('blur', 'div.slds-color-picker.n2__component div.slds-color-picker__summary-input input', function(event) {
            n2.cm.setValue(n2j$(this).closest('.n2__component').attr('id'), event.target.value);
        })
        // On opening the dropdown highligh the current colour
        .on('click', 'div.slds-color-picker.n2__component button.slds-color-picker__summary-button', function() {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._updateDropdownSelection();
        })
        // Mark colour as selected on click
        .on('click', 'section.n2__color-picker a.slds-color-picker__swatch-trigger', function() {
            var selectorList = n2j$(this).closest('ul.slds-color-picker__swatches');
            selectorList.find('li.slds-color-picker__swatch').removeClass('selected');
            n2j$(this).closest('li.slds-color-picker__swatch').addClass('selected');
        })
        // Handle cancel and done buttons in picker
        .on('click', 'section.n2__color-picker div.slds-color-picker__selector-footer > button', function(event) {
            var selector = n2j$(this).closest('section.slds-color-picker__selector');
            if (event.target.value === 'ok') {
                ncsquared.ui.components.ColorPicker.prototype._updateSelection(selector);
            }
            ncsquared.ui.Dropdown.closeDropdowns();
        })
        // Handle keydown event
        .on('keydown', function(event) {
            var selector;
            // If it's a key we are concerned about and the colour picker dropdown is open then handle the key event
            if (ncsquared.ui.components.ColorPicker.prototype._concernedKeys.indexOf(event.which) !== -1 && (selector = n2j$('section.n2__color-picker.slds-show')).length > 0) {
                switch (event.which) {
                    case n2.key.KEY_ENTER:
                        // If we're pressing enter on a button, allow that to take the event
                        if (n2.ui.isButtonTarget(event)) {
                            return;
                        }

                        ncsquared.ui.components.ColorPicker.prototype._updateSelection(selector);
                        ncsquared.ui.Dropdown.closeDropdowns();
                        break;
                    case n2.key.KEY_ESCAPE:
                        ncsquared.ui.Dropdown.closeDropdowns();
                        break;
                    case n2.key.KEY_LEFT:
                        ncsquared.ui.components.ColorPicker.prototype._selectPrevious(selector);
                        break;
                    case n2.key.KEY_RIGHT:
                        ncsquared.ui.components.ColorPicker.prototype._selectNext(selector);
                        break;
                }

                // Prevent the key press from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.ColorPicker.prototype.destroy = function() {
    n2j$(this.selector).remove();
    n2j$(this.dropdownSelector).remove();
};

/**
 * Will return the value of the colour textbox or null if required and no colour is set. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string} The current colour of the textbox  or null if required and no colour is set
 */
ncsquared.ui.components.ColorPicker.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will set the color picker to the provided color string and validate, unless requested not to. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string} value The color value to set the picker to, can be RGB, HEX or W3C color format
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.ColorPicker.prototype.setValue = function(value, validate) {
    // Convert the colour to hex and then update the summary controls with that colour
    var color = ncsquared.utils.ColorUtil.rgbToHex(value);
    var picker = n2j$(this.selector);
    var summary = picker.find('div.slds-color-picker__summary');
    summary.find('button > span.slds-swatch').css('background-color', color);
    summary.find('button > span.slds-swatch > span.slds-assistive-text').text(color);
    summary.find('div.slds-color-picker__summary-input input').val(color);

    // Trigger the validation
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate the the color selected is valid and if required that a color has been selected.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if any color selected is valid and either it is not required or a color has been selected, otherwise false
 */
ncsquared.ui.components.ColorPicker.prototype.validate = function() {
    // If required, validate that we have a value
    var value = this._getValue();
    var valid = this.required ? Boolean(value && value.length > 0) : true;
    var message = this.requiredError;

    // If valid and we have a value, check it is a valid colour
    if (valid && value.length > 0) {
        valid = ncsquared.utils.ColorUtil.isValidColor(value);
        if (!valid) {
            message = this._invalidColorMessage;
        }
    }

    // Update the error message and valid state of the component
    n2j$(this.errorSelector).text(message);
    ncsquared.ui.Validation.updateValid(n2j$(this.elementSelector), valid);
    return valid;
};

/**
 * Resets the color picker back to its initial <config>defaultValue</config> or empty if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.ColorPicker.prototype.reset = function() {
    // Set value to the default and then set to valid
    this.setValue(this.defaultColor || '', false);
    ncsquared.ui.Validation.updateValid(n2j$(this.elementSelector), true);
};

/**
 * Gives focus to the color picker text box. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.ColorPicker.prototype.focus = function() {
    n2j$(this.valueSelector).focus();
    return true;
};

ncsquared.ui.components.ColorPicker.prototype._getValue = function() {
    return n2j$(this.valueSelector).val();
};

ncsquared.ui.components.ColorPicker.prototype._updateSelection = function(selector) {
    // Get the new colour and update the value in the component
    var color = selector.find('li.slds-color-picker__swatch.selected span.slds-swatch').css('background-color');
    if (color) {
        n2.cm.setValue(selector.attr('data-target'), color, true);
    }
};

ncsquared.ui.components.ColorPicker.prototype._updateDropdownSelection = function() {
    // Update the dropdown with the selected colour in case we are set via the API or text has been entered manually
    var selectorList = n2j$(this.dropdownSelector).find('ul.slds-color-picker__swatches');
    var color = ncsquared.utils.ColorUtil.rgbToHex(n2j$(this.valueSelector).val());
    if (color) {
        var selectedColor = selectorList.find('li.slds-color-picker__swatch:contains("' + color + '")');
        if (!selectedColor.hasClass('selected')) {
            selectorList.find('li.slds-color-picker__swatch').removeClass('selected');
            selectedColor.addClass('selected');
        }
    } else {
        selectorList.find('li.slds-color-picker__swatch').removeClass('selected');
    }
};

ncsquared.ui.components.ColorPicker.prototype._selectPrevious = function(selector) {
    // Select the previous selected colour, or the first
    var selected = selector.find('li.slds-color-picker__swatch.selected');
    if (selected.length > 0) {
        if (selected.prev().length > 0) {
            selected.removeClass('selected').prev().addClass('selected');
        }
    } else {
        selector.find('li.slds-color-picker__swatch:first').addClass('selected');
    }
};

ncsquared.ui.components.ColorPicker.prototype._selectNext = function(selector) {
    // Select the next selected colour, or the first
    var selected = selector.find('li.slds-color-picker__swatch.selected');
    if (selected.length > 0) {
        if (selected.next().length > 0) {
            selected.removeClass('selected').next().addClass('selected');
        }
    } else {
        selector.find('li.slds-color-picker__swatch:first').addClass('selected');
    }
};

n2.cm._registerType(ncsquared.ui.components.ColorPicker.prototype._n2Type, ncsquared.ui.components.ColorPicker);

/**
 * Creates a new data table component - use {@link n2.cm.addComponent} with the type <code>data-table</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the data table
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the picker should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] An optional label to display above the table
 * @param {Function} config.data A function to retrieve the data, will be called with the arguments <code>({number} page, {number} rowsPerPage, {string} sortColumn, {boolean} sortAscending, {Function} callback)</code>.
 * Once the data is retrieved the callback function should be called with <code>({Object[]} data, {number} [totalRows], {boolean} [clearSelected])</code>.
 * If paging is disabled then <code>config.rowsPerPage</code> will be <code>-1</code>.
 * While the function is being called the data table will be masked and will be unmasked once the callback is called.
 * @param {string} [config.key=id] The key to retrieve the id of the row from the returned data
 * @param {boolean} [config.paging=true] If true will show the paging toolbar at the bottom of the table
 * @param {Number} [config.defaultRowsPerPage=10] When paging is enabled will set the default rows per page size, available options are 10, 25, 50 and 100
 * @param {boolean} [config.reorder=false] If true will add a column as the first column to allow rows to be re-ordered. Setting this to <code>true</code> will override <code>config.paging</code> setting it to <code>false</code>
 * and will disable column sorting. The <code>config.sortColumn</code> config should be set to the column that defines the order
 * @param {boolean} [config.selection=false] Set to true to add a column of checkboxes as the first column (after re-order), when using the getValue function the selected row id's will be returned
 * @param {boolean} [config.rowNumbers=false] Set to true to add a column which will contain the current row number, the number will be updated on re-order, addition or deletion of a row, and will continue across pages
 * @param {boolean} [config.storeData=false] Set to true to store the data locally so that the appropriate row can be provided as an argument with the actions
 * @param {Object[]} config.columns An array of columns
 * @param {string} config.columns[].name The name of the column, used to retrieve the data from the returned data set - can include dot notation
 * @param {string} config.columns[].title The title of the column to display in the heading
 * @param {string|Function} [config.columns[].format] Either a string of how to format the data, or a function that is called with the arguments <config>({*} data, {Object} row)</config> and should return the value to display, see {@link n2.util.formatValue} for more details
 * @param {Function} [config.columns[].formatTooltip] A function to format the text in the tooltip when hovering of the data, will be called with the arguments <code>({String} tooltip, {String} formattedData, {Object} row)</code> and should return the formatted tooltip
 * @param {boolean} [config.columns[].sortable=true] Whether or not the column can be sorted; will be disabled if <code>config.reorder</code> is set to <code>true</code>
 * @param {Function} [config.columns[].action] If the column has an associated action, will turn the data into a link, and when clicked this function will be called with the arguments <code>({*} rowId, {number} rowNumber </code>(for the current page)<code>, {Object} rowData)</code>, the last argument only if <code>config.storeData</code> was set
 * @param {Object} [config.columns[].component] If specified the column will display a component instead of the data content, if set <code>config.action</code> setting will be ignored
 * @param {string} config.columns[].component.type The type of the component to create
 * @param {Object} config.columns[].component.config The configuration of the component to create, <code>id</code> and <code>selector</code> will automatically be added so aren't needed and the data for the column will be set as the <code>defaultValue</code>
 * @param {boolean} [config.columns[].html=false] If true the raw HTML will be added to the page and won't be escaped (TAKE CARE WHEN USING THIS)
 * @param {string} [config.columns[].width] A string of a css width (number and units) to set on the column
 * @param {boolean} [config.columns[].alignRight=false] Set to true to align the data contents of the column to the right
 * @param {boolean} [config.columns[].wrap=false] Set to true to wrap the data contents of the column
 * @param {string} [config.sortColumn] The default sort column in the data; the name of the column
 * @param {string} [config.sortAscending=true] The sort order when a default sort column is provided
 * @param {Object[]} [config.actions] An array of actions to add as a menu in the last column
 * @param {string} config.actions[].title The title of the action to display in the menu
 * @param {Function} config.actions[].action The function to call when the menu item is clicked, this function will be called with the arguments <code>({*} rowId, {number} rowNumber </code>(for the current page)<code>, {Object} rowData)</code>, the last argument only if <code>config.storeData</code> was set
 * @param {Function} [config.actions[].visible] The function to call to decide whether this action is shown for the current row, this function will be called with the arguments <code>({*} rowId, {Object} rowData)</code>, the last argument only if <code>config.storeData</code> was set
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>reordered</code>: raised when the rows of the table are reordered, called with no arguments
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label, will only appear if label is also specified
 * @param {string|Function} [config.rowCls] A string of classes to apply to each table row, or a function that returns a string of CSS classes to apply to the table row that is called with the arguments <config>({Object} row)</config>. Requires <code>config.storeData</code> to be set to use a function
 * @param {string} [config.cls] A string of CSS classes to apply to the table element
 */
ncsquared.ui.components.DataTable = function DataTable(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['data', 'columns', 'columns.name', 'columns.title', 'actions.title', 'actions.action']);

    // Set the default config values
    config.key = config.key || 'id';
    config.reorder = n2.util.getDefaultBoolean(config.reorder, false);
    if (config.reorder) {
        config.paging = false;
    } else {
        config.paging = n2.util.getDefaultBoolean(config.paging, true);
    }
    if (config.paging) {
        config.defaultRowsPerPage = n2.util.isNumber(config.defaultRowsPerPage) && this._rowsPerPageValues.indexOf(Number(config.defaultRowsPerPage)) !== -1 ? Number(config.defaultRowsPerPage) : 10;
    }
    config.selection = n2.util.getDefaultBoolean(config.selection, false);
    config.rowNumbers = n2.util.getDefaultBoolean(config.rowNumbers, false);
    config.storeData = n2.util.getDefaultBoolean(config.storeData, false);
    config.sortColumn = config.sortColumn || '';
    config.sortAscending = n2.util.getDefaultBoolean(config.sortAscending, true);

    // Set the default config values for each column
    var self = this;
    this.componentsConfig = {};
    n2.util.each(config.columns, function(index, column) {
        column.index = index;
        if (config.reorder) {
            column.sortable = false;
        } else {
            column.sortable = n2.util.getDefaultBoolean(column.sortable, true);
        }

        column.isComponent = n2.util.isObject(column.component);
        if (column.isComponent) {
            // Ignore actions or HTML setting if a component
            column.isAction = false;
            column.html = false;

            // Check required config of the group
            n2.util.checkRequiredConfig(column, ['component.type', 'component.config'], 'column[' + index + ']');
            config.hasComponents = true;

            // Store the component config, set the name so that the placeholder can be created in the HTML, then delete the config as it's not needed in the templating
            var componentId = 'component-col-' + index;
            column.componentId = componentId;
            column.component.config.__type = column.component.type;
            self.componentsConfig[componentId] = column.component.config;
            delete column.component;
        } else {
            column.isAction = n2.util.isFunction(column.action);
            if (column.isAction) {
                // If there is an action, bind the function to the column class that will be generated
                n2j$(document).on('click', 'table#' + config.id + '_table a.' + config.id + '_table_body-col-' + index + '-action', function() {
                    var link = n2j$(this);
                    var key = link.attr('data-key');
                    var row = link.closest('tr');
                    column.action(key, link.closest('tbody').find('tr').index(row) + 1, self.storedData[key]);
                });
            }
            column.html = n2.util.getDefaultBoolean(column.html, false);
        }

        // Set some sort config to aid the template rendering
        column.sortOrder = 'none';
        if (column.name === config.sortColumn) {
            column.sorted = true;
            column.sortOrder = config.sortAscending ? 'ascending' : 'descending';
            column.sortDescending = !config.sortAscending;
        }
    });
    config.columnCount = config.columns.length;
    if (config.reorder) {
        config.columnCount++;
    }
    if (config.selection) {
        config.columnCount++;
    }
    if (config.rowNumbers) {
        config.columnCount++;
    }

    // Set the default config values for actions
    config.hasActions = Boolean(config.actions && config.actions.length > 0);
    if (config.hasActions) {
        // If there is an action, bind the function to the action class that will be generated
        n2.util.each(config.actions, function(index, action) {
            action.index = index;
            n2j$(document).on('click', 'table#' + config.id + '_table a.' + config.id + '_table_body-action-' + index, function() {
                var link = n2j$(this);
                var key = link.attr('data-key');
                var row = link.closest('tr');
                action.action(key, link.closest('tbody').find('tr').index(row) + 1, self.storedData[key]);
            });
            if (n2.util.isFunction(action.visible)) {
                action.isVisible = function() {
                    return action.visible.call(self, self.config.dataKey, self.storedData[self.config.dataKey]);
                };
            } else {
                action.isVisible = true;
            }
        });
        config.columnCount++;
    }

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.headerSelector = this.selector + '_table_header';
    this.bodySelector = this.selector + '_table_body';
    this.footerSelector = this.selector + '_footer';
    this.spinnerSelector = this.selector + '_spinner';

    // Set other variables to use later, and store the config so that it can be used when refreshing the data
    this.config = {
        id: config.id,
        key: config.key,
        reorder: config.reorder,
        selection: config.selection,
        rowNumbers: config.rowNumbers,
        columns: config.columns,
        hasComponents: config.hasComponents,
        hasActions: config.hasActions,
        actions: config.actions
    };
    if (n2.util.isFunction(config.rowCls)) {
        this.config.rowClsFn = config.rowCls;
    } else {
        this.config.rowCls = config.rowCls;
    }
    this.data = config.data;
    this.storeData = config.storeData;
    this.storedData = {};
    this.paging = config.paging;
    this.page = 1;
    this.rowsPerPage = config.paging ? config.defaultRowsPerPage : -1;
    this.rowIndexOffset = 0;
    this.sortColumn = config.sortColumn;
    this.sortAscending = config.sortAscending;
    this.originalSortColumn = config.sortColumn;
    this.originalSortAscending = config.sortAscending;
    this.otherSelectedRows = [];

    // Load the data
    this._getData();

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.DataTable.prototype._n2Type = 'data-table';

// Valid event handlers
ncsquared.ui.components.DataTable.prototype._handlersRegex = /^reordered$/;

// Available options for the rows per page
ncsquared.ui.components.DataTable.prototype._rowsPerPageValues = [10, 25, 50, 100];

// Add relative position to the outer div so the the dragging position is correct across browsers
ncsquared.ui.components.DataTable.prototype.bodyTemplate = '<div class="n2__component slds-is-relative" id="{{id}}">' +
    '{{#label}}<label class="slds-form-element__label" for="{{id}}_table">{{label}}</label>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/label}}' +
    '<table class="slds-table slds-table_bordered slds-table_fixed-layout n2__table{{#cls}} {{cls}}{{/cls}}" id="{{id}}_table" role="grid">' +
    // Start table header
    '<thead id="{{id}}_table_header">' +
    '<tr class="slds-line-height_reset">' +
    // Start re-order column, if requested
    '{{#reorder}}<th class="slds-text-align_right n2__table-column-reorder" scope="col">' +
    '</th>{{/reorder}}' +
    // End re-order column, start selection column, if requested
    '{{#selection}}<th class="slds-text-align_right n2__table-column-action" scope="col">' +
    '<div class="slds-th__action slds-th__action_form">' +
    '<span class="slds-checkbox" id="{{id}}_table_header-select-all">' +
    '<input id="{{id}}_table_header-select-all_checkbox" class="n2__table-select-all" type="checkbox" />' +
    '<label class="slds-checkbox__label" for="{{id}}_table_header-select-all_checkbox" title="Select all rows">' +
    '<span class="slds-checkbox_faux"></span>' +
    '<span class="slds-form-element__label slds-assistive-text">Select all rows</span>' +
    '</label>' +
    '</span>' +
    '</div>' +
    '</th>{{/selection}}' +
    // End selection column, start row numbers column, if requested
    '{{#rowNumbers}}<th class="slds-text-align_right n2__table-column-rownum" scope="col">' +
    '</th>{{/rowNumbers}}' +
    // End row numbers column, start data columns array
    '{{#columns}}' +
    // If sortable
    '{{#sortable}}<th class="slds-is-sortable{{#sorted}} slds-is-sorted{{/sorted}}{{^sortDescending}} slds-is-sorted_asc{{/sortDescending}}" aria-label="{{title}}" aria-sort="{{sortOrder}}" data-target="{{name}}" scope="col" id="{{id}}_table_header-col-{{index}}"{{#width}} style="width: {{width}};"{{/width}}>' +
    '<a class="slds-th__action slds-text-link_reset{{#alignRight}} slds-float_right{{/alignRight}}" role="button" tabindex="0">' +
    '<span class="slds-assistive-text">Sort by: {{title}}</span>' +
    '<span title="{{title}}" class="slds-truncate">{{title}}</span>' +
    '<div class="slds-icon_container">' +
    '<svg class="slds-icon slds-icon_x-small slds-icon-text-default slds-is-sortable__icon" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#arrowdown" />' +
    '</svg>' +
    '</div>' +
    '</a>' +
    '<span class="slds-assistive-text" aria-live="assertive" aria-atomic="true">Sorted {{sortOrder}}</span>' +
    '</th>{{/sortable}}' +
    // If not sortable
    '{{^sortable}}<th aria-label="{{title}}" scope="col" id="{{id}}_table_header-col-{{index}}"{{#width}} style="width: {{width}};"{{/width}}>' +
    '<div title="{{title}}" class="slds-truncate{{#alignRight}} slds-text-align_right{{/alignRight}}">{{title}}</div>' +
    '</th>{{/sortable}}' +
    '{{/columns}}' +
    // End data columns array, start actions, if any
    '{{#hasActions}}<th class="n2__table-column-action" scope="col" id="{{id}}_table_header-actions">' +
    '<span class="slds-assistive-text">Actions</span>' +
    '</th>{{/hasActions}}' +
    // End actions
    '</tr>' +
    '</thead>' +
    // End table header, start table body and dummy row for initital padding
    '<tbody id="{{id}}_table_body">' +
    '<tr><td colspan="{{columnCount}}">&nbsp;</td></tr>' +
    '</tbody>' +
    // End table body
    '</table>' +
    // End table, start paging footer
    '<div id="{{id}}_footer" class="slds-grid slds-p-horizontal_medium n2__table-footer"></div>' +
    // Start spinner
    '<div class="slds-spinner_container" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    // End spinner
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.DataTable.prototype.rowTemplate = '<tr class="slds-hint-parent n2__table-row{{#rowCls}} {{rowCls}}{{/rowCls}}" id="{{id}}_table_body_row-{{rowIndex}}" data-key="{{dataKey}}">' +
    // Start re-order column, if requested
    '{{#reorder}}<td class="slds-text-align_right" role="gridcell">' +
    '<div class="slds-icon_container n2__table-reorder-arrows">' +
    '<button class="slds-button slds-button_icon slds-button_icon-xx-small n2__table-reorder-up" title="Move Up" aria-label="Move Up">' +
    '<svg class="slds-icon slds-icon_xx-small slds-icon-text-default" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#arrowup" />' +
    '</svg>' +
    '</button>' +
    '<button class="slds-button slds-button_icon slds-button_icon-xx-small n2__table-reorder-down" title="Move Down" aria-label="Move Down">' +
    '<svg class="slds-icon slds-icon_xx-small slds-icon-text-default" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#arrowdown" />' +
    '</svg>' +
    '</button>' +
    '</div>' +
    '<div class="slds-icon_container n2__table-reorder-handle">' +
    '<svg class="slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#threedots_vertical" />' +
    '</svg>' +
    '</div>' +
    '</td>{{/reorder}}' +
    // End re-order column, start selection column, if requested
    '{{#selection}}<td scope="row" class="slds-text-align_right" role="gridcell">' +
    '<span class="slds-checkbox" id="{{id}}_table_body_row-{{rowIndex}}-select-row">' +
    '<input id="{{id}}_table_body_row-{{rowIndex}}-select-row_checkbox" class="n2__table-select-row" type="checkbox" data-key="{{dataKey}}"{{#selected}} checked{{/selected}} />' +
    '<label class="slds-checkbox__label" for="{{id}}_table_body_row-{{rowIndex}}-select-row_checkbox" title="Select row">' +
    '<span class="slds-checkbox_faux"></span>' +
    '<span class="slds-form-element__label slds-assistive-text">Select row</span>' +
    '</label>' +
    '</span>' +
    '</td>{{/selection}}' +
    // End selection column, start row numbers column
    '{{#rowNumbers}}<td role="gridcell" id="{{id}}_table_body_row-{{rowIndex}}-rownum">' +
    '<div class="slds-truncate n2__data-table-row-number"></div>' +
    '</td>{{/rowNumbers}}' +
    // End row numbers column, start data columns array
    '{{#columns}}' +
    // If component
    '{{#isComponent}}<td id="{{id}}_table_body_row-{{rowIndex}}-col-{{index}}" class="n2__data-table-component" data-component="{{id}}_table_body_row-{{rowIndex}}-{{componentId}}" data-name="{{name}}">' +
    '<span id="{{id}}_table_body_row-{{rowIndex}}-{{componentId}}"></span>' +
    // Generate the component instance
    '{{generateComponent}}' +
    '</td>{{/isComponent}}' +
    '{{^isComponent}}' +
    // If action data
    '{{#isAction}}<th scope="row" id="{{id}}_table_body_row-{{rowIndex}}-col-{{index}}">' +
    '<div title="{{dataTitle}}" class="slds-truncate{{#alignRight}} slds-text-align_right{{/alignRight}}{{#wrap}} slds-cell-wrap{{/wrap}}"><a class="{{id}}_table_body-col-{{index}}-action" data-key="{{dataKey}}" role="button" tabindex="0">{{#html}}{{&data}}{{/html}}{{^html}}{{data}}{{/html}}</a></div>' +
    '</th>{{/isAction}}' +
    // If standard data
    '{{^isAction}}<td role="gridcell" id="{{id}}_table_body_row-{{rowIndex}}-col-{{index}}">' +
    '<div title="{{dataTitle}}" class="slds-truncate{{#alignRight}} slds-text-align_right{{/alignRight}}{{#wrap}} slds-cell-wrap{{/wrap}}">{{#html}}{{&data}}{{/html}}{{^html}}{{data}}{{/html}}</div>' +
    '</td>{{/isAction}}' +
    '{{/isComponent}}' +
    '{{/columns}}' +
    // End data columns array, start actions, if any
    '{{#hasActions}}<td role="gridcell" id="{{id}}_table_body_row-{{rowIndex}}-actions">' +
    ncsquared.ui.Dropdown.renderStartTemplate(false) +
    '{{#actions}}{{#isVisible}}' +
    '<li class="slds-dropdown__item" role="presentation">' +
    '<a class="{{id}}_table_body-action-{{index}}" data-key="{{dataKey}}" role="menuitem" tabindex="0">' +
    '<span class="slds-truncate" title="{{title}}">{{title}}</span>' +
    '</a>' +
    '</li>' +
    '{{/isVisible}}{{/actions}}' +
    ncsquared.ui.Dropdown.endTemplate +
    '</td>{{/hasActions}}' +
    // End actions
    '</tr>';

ncsquared.ui.components.DataTable.prototype.footerTemplate = '<div><select class="slds-select n2__table-rows-per-page">' +
    '{{#pageOptions}}<option{{#selected}} selected{{/selected}}>{{value}}</option>{{/pageOptions}}' +
    '</select><span> rows per page</span></div>' +
    '{{#selection}}<div class="n2__table-selected n2__text-center-button"><span class="n2__table-selected-count">{{selectedCount}} selected</span>{{#hasPages}} <a class="n2__table-deselect-all">(Deselect all)</a>{{/hasPages}}</div>{{/selection}}' +
    '<div class="slds-align_absolute-center">{{#hasPages}}' +
    '<button class="slds-button slds-button_brand n2__table-previous-button"{{^previous}} disabled{{/previous}} title="Previous page">Previous</button>' +
    '<button class="slds-button slds-button_brand n2__table-next-button"{{^next}} disabled{{/next}} title="Next page">Next</button>' +
    '{{/hasPages}}</div>' +
    '<div class="n2__text-center-button"><span class="n2__table-paging-label">Page {{page}} of {{totalPages}}</span></div>';

ncsquared.ui.components.DataTable.prototype.init = function() {
    n2j$(document)
        // When changing the selection box in the header select/un-select all rows
        .on('change', 'table.n2__table > thead input.n2__table-select-all', function(event) {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._updateAllRowsSelection(event.target.checked);
        })
        // When changing the selection boxes in the row update the header one and count label
        .on('change', 'table.n2__table > tbody input.n2__table-select-row', function(event) {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._updateSelected();
        })
        // Handle sorting on header click
        .on('click', 'table.n2__table > thead th.slds-is-sortable > a', function() {
            // Update the classes and attributes
            var column = n2j$(this).closest('th');
            var header = column.closest('thead');
            var sortDescending = column.attr('aria-sort') === 'ascending';
            var sortOrder = sortDescending ? 'descending' : 'ascending';
            header.find('th.slds-is-sortable').attr('aria-sort', 'none').removeClass('slds-is-sorted').addClass('slds-is-sorted_asc');
            header.find('th.slds-is-sortable > span.slds-assistive-text').text('Sorted none');
            column.attr('aria-sort', sortOrder).addClass('slds-is-sorted');
            column.find('> span.slds-assistive-text').text('Sorted ' + sortOrder);
            if (sortDescending) {
                column.removeClass('slds-is-sorted_asc');
            }

            // Perform the sort
            n2.cm.getComponent(header.closest('div.n2__component').attr('id'))._sort(column.attr('data-target'), !sortDescending);
        })
        // Handle moving a row up
        .on('click', 'table.n2__table > tbody > tr button.n2__table-reorder-up', function() {
            var row = n2j$(this);
            n2.cm.getComponent(row.closest('div.n2__component').attr('id'))._moveUp(row.closest('tr').attr('id'));
        })
        // Handle moving a row down
        .on('click', 'table.n2__table > tbody > tr button.n2__table-reorder-down', function() {
            var row = n2j$(this);
            n2.cm.getComponent(row.closest('div.n2__component').attr('id'))._moveDown(row.closest('tr').attr('id'));
        })
        // Handle mouse down on the reorder handle and if not already dragging, start
        .on('mousedown', 'table.n2__table > tbody > tr div.n2__table-reorder-handle', function(event) {
            if (!ncsquared.ui.Reorder.isDragging()) {
                ncsquared.ui.Reorder.startDragging(event, {
                    item: n2j$(this).closest('tr'),
                    itemsSelector: 'tr',
                    containerSelector: 'tbody',
                    beforeStart: ncsquared.ui.components.DataTable.prototype._beforeReorderStart,
                    beforeEnd: ncsquared.ui.components.DataTable.prototype._beforeReorderEnd
                });
            }
        })
        // Handle refreshing data when the rows per page is changed
        .on('change', 'div.n2__component div.n2__table-footer select.n2__table-rows-per-page', function(event) {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._updateRowsPerPage(event.target.value);
        })
        // Handle refreshing data when the previous page button is clicked
        .on('click', 'div.n2__component div.n2__table-footer button.n2__table-previous-button', function() {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._previous();
        })
        // Handle refreshing data when the next page button is clicked
        .on('click', 'div.n2__component div.n2__table-footer button.n2__table-next-button', function() {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._next();
        })
        // Handle clearing all selections on deselect click
        .on('click', 'div.n2__component div.n2__table-footer a.n2__table-deselect-all', function() {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._deselectAll();
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.DataTable.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Depending on the configuration of the table will return different values:
 * <ul><li>If only <code>selection</code> is enabled then the keys of those rows that are selected, across all pages, will be returned in an oject with a <code>key</code> property</li>
 * <li>If <code>reorder</code> is enabled then all of the rows are included with their <code>key</code> and <code>index</code> (one based)</li>
 * <li>If any components are included in the data table then they are included with the property key being the name of the column and the value the current value of the component. If the component is required and it fails validation then this method will return null</li></ul>
 * The data is returned sorted alphabetically by key. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {Object[]} The current state of the data table
 * @returns {string} <code>key</code> The key of the row as defined by the value of the <code>key</code> configuration property
 * @returns {number} <code>[index]</code> If <code>reorder</code> is enabled then the row number (one-based) of the row
 * @returns {*} <code>[*]</code> Any components that exist in the row will appear in the return object having the key as the name of the column and the value as the current value of the component
 */
ncsquared.ui.components.DataTable.prototype.getValue = function() {
    // Return an array of all the rows containing the key and, if reorder is enabled, the index (1-based)
    // If selection is enabled, only include rows that are selected unless reorder is also enabled
    var self = this;
    var invalid = false;
    var value = n2j$(this.bodySelector + ' > tr').map(function(index, row) {
        var obj = {
            key: row.getAttribute('data-key')
        };
        if (self.config.reorder) {
            obj.index = index + 1;
        }
        // Get the values of the checkboxes, if we're only selecting then only return those items that are selected
        if (self.config.selection) {
            var selected = n2j$(row).find('input.n2__table-select-row').prop('checked');
            if (self.config.reorder || self.config.hasComponents) {
                obj.selected = selected;
            } else {
                if (!selected) {
                    return null;
                }
            }
        }
        if (self.config.hasComponents) {
            n2j$(row).find('td.n2__data-table-component').each(function(index, column) {
                var id = column.getAttribute('data-component');
                if (n2.cm.validate(id)) {
                    obj[column.getAttribute('data-name')] = n2.cm.getValue(id, true);
                } else {
                    invalid = true;
                }
            });
        }
        return obj;
    }).get();

    // If some components are invalid then return null
    if (invalid) {
        return null;
    }

    // Append any other row selections to the array, this should only be populated if selection is enabled and reorder is disabled
    if (this.otherSelectedRows.length > 0) {
        n2.util.each(this.otherSelectedRows, function(index, row) {
            value.push({
                key: row
            });
        });
    }

    // Sort the result set
    value.sort(function(a, b) {
        return n2.util.compareObjectValues(a, b, 'key');
    });

    return value;
};

/**
 * Will validate any components within the data table.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if there are no components or all components are valid, otherwise false
 */
ncsquared.ui.components.DataTable.prototype.validate = function() {
    // If we have components, loop through them all to check if they are valid
    var valid = true;
    if (this.config.hasComponents) {
        n2j$(this.bodySelector + ' > tr').map(function(index, row) {
            n2j$(row).find('td.n2__data-table-component').each(function(index, column) {
                if (!n2.cm.validate(column.getAttribute('data-component'))) {
                    valid = false;
                }
            });
        });
    }

    return valid;
};

/**
 * Resets the data table group back to the first page and original sort settings then refreshes the data. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.DataTable.prototype.reset = function() {
    // On reset, go back to the first page and original sort
    this.page = 1;
    this.sortColumn = this.originalSortColumn;
    this.sortAscending = this.originalSortAscending;
    this._getData();
};

/**
 * Refreshes the data table group by calling the <code>data</code> function if it was provided to new rows. Use {@link n2.cm.refresh} instead of this method directly
 */
ncsquared.ui.components.DataTable.prototype.refresh = function() {
    // Trigger a refresh of the data
    this._getData();
};

/**
 * If paging is disabled, will add the provided data as a new row to the data table
 *
 * @param {Object} data The data that will be used to render the new row
 */
ncsquared.ui.components.DataTable.prototype.addRow = function(data) {
    if (!this.paging && n2.util.isObject(data)) {
        // Mask the table, add the row, then unmask
        this.mask();
        this._generateRows([data], 1, false);
        this._updateRowNumbers();
        this.unmask();
    }
};

/**
 * If paging is disabled, will remove the given row from the data table
 *
 * @param {number} rowNumber The number of the row to remove (one-based)
 */
ncsquared.ui.components.DataTable.prototype.removeRow = function(rowNumber) {
    if (!this.paging && n2.util.isNumber(rowNumber)) {
        // Mask the table, remove the row and stored data, then unmask
        this.mask();
        var row = n2j$(this.bodySelector + ' > tr').eq(Number(rowNumber - 1));
        if (this.config.hasComponents) {
            row.find('td.n2__data-table-component').each(function(index, column) {
                n2.cm.destroyComponent(column.getAttribute('data-component'));
            });
        }
        row.remove();
        var key;
        if (this.storeData && !n2.util.isNullOrUndefined((key = row.attr('data-key'))) && this.storedData.hasOwnProperty(key)) {
            delete this.storedData[key];
        }
        this._updateRowNumbers();
        this.unmask();
    }
};

/**
 * Returns the count of the number of visible rows
 *
 * @returns {number} The number of visible rows in the data table
 */
ncsquared.ui.components.DataTable.prototype.getRowCount = function() {
    return n2j$(this.bodySelector + ' > tr.n2__table-row').length;
};

/**
 * Will return the components that exist on a given row number, or null if none are found
 *
 * @param {number} rowNumber The number of the row to get the components for (one-based)
 * @returns {Object[]} An array of the components on the requested row
 */
ncsquared.ui.components.DataTable.prototype.getComponentsOnRow = function(rowNumber) {
    if (this.config.hasComponents) {
        var components = n2j$(this.bodySelector + ' > tr').eq(rowNumber - 1).find('td.n2__data-table-component').map(function(index, column) {
            return n2.cm.getComponent(column.getAttribute('data-component'));
        });
        if (components.length > 0) {
            return components;
        }
    }
    return null;
};

/**
 * Mask the table with a spinner
 */
ncsquared.ui.components.DataTable.prototype.mask = function() {
    // Mask the table
    n2j$(this.spinnerSelector).removeClass('slds-hide');
};

/**
 * Unmask the table
 */
ncsquared.ui.components.DataTable.prototype.unmask = function() {
    // Unmask the table
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

ncsquared.ui.components.DataTable.prototype._getData = function() {
    if (n2.util.isFunction(this.data)) {
        // Show the mask
        this.mask();

        // Store the selected rows for later use
        if (this.config.selection) {
            var selectedRows = n2j$(this.bodySelector + ' input.n2__table-select-row:checked').map(function(index, checkbox) {
                return checkbox.getAttribute('data-key');
            }).get();
            this.otherSelectedRows = selectedRows.concat(this.otherSelectedRows);
        }

        var self = this;
        // Get the data from the data function then generate the rows
        this.data(this.page, this.rowsPerPage, this.sortColumn, this.sortAscending, function(data, totalRows, clearSelected) {
            // If requested, clear the stored selected rows so they aren't selected when generating
            if (clearSelected) {
                self.otherSelectedRows = [];
            }

            // Destroy any existing components
            if (self.components) {
                n2.util.each(self.components, function(index, component) {
                    n2.cm.destroyComponent(component);
                });
                self.components = [];
            }

            // Generate the new rows and footer
            self._generateRows(data, totalRows, true);
            self._updateRowNumbers();
            self._generateFooter();

            // Update the selected header
            self._updateSelected(true);

            // Hide the mask
            self.unmask();
        });
    }
};

ncsquared.ui.components.DataTable.prototype._generateRows = function(data, totalRows, clearExisting) {
    // If paging is enabled, set a default for total rows if not provided and calculate the total pages
    if (this.paging) {
        totalRows = n2.util.isNullOrUndefined(totalRows) ? data.length : totalRows;
        this.totalPages = Math.max(1, Math.ceil(totalRows / this.rowsPerPage));
    }

    // If requested, clear the existing variables and rows
    if (clearExisting) {
        this.storedData = {};
        this.components = [];
        this.rowIndexOffset = 0;
        n2j$(this.bodySelector).empty();
    }

    var html = '';
    var self = this;
    var componentsToCreate = [];
    // For each row in the data, add the functions to retrieve the data then render the HTML
    n2.util.each(data, function(index, row) {
        self.config.rowIndex = index + self.rowIndexOffset;
        // Get the display data, caching items by index, and formatting where a function exists
        var cache = {};
        self.config.data = function() {
            if (cache.hasOwnProperty(this.index)) {
                return cache[this.index];
            }

            var value = n2.util.getObjectProperty(row, this.name);
            if (n2.util.isFunction(this.format)) {
                value = this.format(value, row);
            } else if (!n2.util.isNullOrUndefined(this.format)) {
                value = n2.util.formatValue(value, this.format);
            }
            cache[this.index] = value;
            return value;
        };

        // If a format tooltip function exists use that to get the tooltip data, otherwise fall back to the main data function
        self.config.dataTitle = function() {
            if (n2.util.isFunction(this.formatTooltip)) {
                return this.formatTooltip(n2.util.getObjectProperty(row, this.name), self.config.data.call(this), row);
            }
            return self.config.data.call(this);
        };

        // Get the key data for use in actions
        self.config.dataKey = n2.util.getObjectProperty(row, self.config.key);

        // Determine whether this row has already been selected
        self.config.selected = false;
        if (self.config.selection) {
            var selectedIndex = self.otherSelectedRows.indexOf(self.config.dataKey);
            if (selectedIndex !== -1) {
                self.config.selected = true;
                // If it is selected remove it from the array to leave only non-displayed ones
                self.otherSelectedRows.splice(selectedIndex, 1);
            }
        }

        // If the row class config is a function, call it
        if (self.config.rowClsFn) {
            self.config.rowCls = self.config.rowClsFn.call(this, row);
        }

        // Create function to create component configuration for creation after the HTML is added
        self.config.generateComponent = function() {
            var config = n2.util.clone(self.componentsConfig[this.componentId]);
            config.id = self.config.id + '_table_body_row-' + (index + self.rowIndexOffset) + '-' + this.componentId;
            config.selector = '#' + config.id;
            config.defaultValue = self.config.data.call(this);
            componentsToCreate.push(config);
            return '';
        };

        // Store the data if requested
        if (self.storeData) {
            self.storedData[self.config.dataKey] = row;
        }

        // Render the HTML for the row and add it to the string
        html += n2.ui.renderTemplate(self.rowTemplate, self.config);
    });

    // Clear the table body then add the new HTML
    n2j$(this.bodySelector).append(html);

    // Add all the components, storing them for later use
    n2.util.each(componentsToCreate, function(index, component) {
        var comp = n2.cm.addComponent(component.__type, component);
        self.components.push(comp);

        // Register it with the component manager as a table component
        n2.cm._registerTableComponent(comp._n2Id);
    });

    // Store the number of rows we have added so that if we add more rows the offset can be maintained
    this.rowIndexOffset += data.length;
};

ncsquared.ui.components.DataTable.prototype._generateFooter = function() {
    if (this.paging) {
        // Create an array of the available row per page options, marking the selected one
        var self = this;
        var pageOptions = n2.util.map(this._rowsPerPageValues, function(value) {
            return {
                value: value,
                selected: value === self.rowsPerPage
            };
        });
        // Create the footer HTML based on page information
        var html = n2.ui.renderTemplate(this.footerTemplate, {
            pageOptions: pageOptions,
            previous: this.page > 1,
            next: this.page < this.totalPages,
            page: this.page,
            totalPages: this.totalPages,
            hasPages: this.totalPages > 1,
            selection: this.config.selection,
            selectedCount: this._getSelectedCount()
        });
        // Clear the table footer then add the new HTML
        n2j$(this.footerSelector).empty().append(html);
    }
};

ncsquared.ui.components.DataTable.prototype._updateRowNumbers = function() {
    if (this.config.rowNumbers) {
        var start = 1;
        if (this.paging) {
            start += ((this.page - 1) * this.rowsPerPage);
        }
        n2j$(this.bodySelector + ' div.n2__data-table-row-number').each(function(index, row) {
            n2j$(row).text(index + start);
        });
    }
};

ncsquared.ui.components.DataTable.prototype._getSelectedCount = function() {
    return n2j$(this.bodySelector + ' input.n2__table-select-row:checked').length + this.otherSelectedRows.length;
};

ncsquared.ui.components.DataTable.prototype._updateSelected = function(ignoreFooter) {
    var checked = n2j$(this.bodySelector + ' input.n2__table-select-row:checked').length;
    var selectAll = n2j$(this.headerSelector + ' input.n2__table-select-all');
    if (checked === 0) {
        selectAll.prop('indeterminate', '').prop('checked', '');
    } else if (checked === n2j$(this.bodySelector + ' tr').length) {
        selectAll.prop('indeterminate', '').prop('checked', true);
    } else {
        selectAll.prop('indeterminate', true).prop('checked', '');
    }

    if (!ignoreFooter) {
        n2j$(this.footerSelector + ' span.n2__table-selected-count').text((checked + this.otherSelectedRows.length) + ' selected');
    }
};

ncsquared.ui.components.DataTable.prototype._updateAllRowsSelection = function(selected) {
    n2j$(this.bodySelector + ' input.n2__table-select-row').prop('checked', selected);
    this._updateSelected();
};

ncsquared.ui.components.DataTable.prototype._deselectAll = function() {
    this.otherSelectedRows = [];
    n2j$(this.bodySelector + ' input.n2__table-select-row').prop('checked', false);
    this._updateSelected();
};

ncsquared.ui.components.DataTable.prototype._previous = function() {
    // Update to the previous page then get the data again
    this.page = Math.max(1, this.page - 1);
    this._getData();
};

ncsquared.ui.components.DataTable.prototype._next = function() {
    // Update to the next page then get the data again
    this.page = Math.min(this.totalPages, this.page + 1);
    this._getData();
};

ncsquared.ui.components.DataTable.prototype._sort = function(sortColumn, sortAscending) {
    // Update the sort variables then get the data again
    this.sortColumn = sortColumn;
    this.sortAscending = sortAscending;
    this._getData();
};

ncsquared.ui.components.DataTable.prototype._updateRowsPerPage = function(rowsPerPage) {
    // Update the rows per page, and if valid, get the data again
    rowsPerPage = Number(rowsPerPage);
    if (this._rowsPerPageValues.indexOf(rowsPerPage) !== -1) {
        this.rowsPerPage = rowsPerPage;
        this.page = 1;
        this._getData();
    }
};

ncsquared.ui.components.DataTable.prototype._moveUp = function(rowId) {
    // Move the given row to before the previous row
    var row = n2j$('#' + rowId);
    if (row.length > 0) {
        var previousRow = row.prev();
        if (previousRow.length > 0) {
            row.insertBefore(previousRow);
            this._handleReordered();
        }
    }
};

ncsquared.ui.components.DataTable.prototype._moveDown = function(rowId) {
    // Move the given row to after the next row
    var row = n2j$('#' + rowId);
    if (row.length > 0) {
        var nextRow = row.next();
        if (nextRow.length > 0) {
            row.insertAfter(nextRow);
            this._handleReordered();
        }
    }
};

ncsquared.ui.components.DataTable.prototype._beforeReorderStart = function(context) {
    // Before the cloned item is absolute positioned, loop through the columns setting the width manually to ensure they are correct
    context.clonedItem.find('td,th').each(function(index, column) {
        var jColumn = n2j$(column);
        jColumn.css({
            'width': jColumn.outerWidth(),
            'max-width': jColumn.outerWidth()
        });
    });

    // Add the classes to the table to prevent selection and hover styles while dragging
    context.item.closest('table').addClass('n2__no-selection slds-no-row-hover');
};

ncsquared.ui.components.DataTable.prototype._beforeReorderEnd = function(context, cancelled) {
    // Remove the override styles on the table
    context.item.closest('table').removeClass('n2__no-selection slds-no-row-hover');

    // Trigger the reordered event if we weren't cancelled
    if (!cancelled) {
        n2.cm.getComponent(context.item.closest('div.n2__component').attr('id'))._handleReordered();
    }
};

ncsquared.ui.components.DataTable.prototype._handleReordered = function() {
    // Update the row numbers
    this._updateRowNumbers();
    // Call the event handler if one exists
    if (this.handlers.hasOwnProperty('reordered')) {
        this.handlers['reordered'].call(this);
    }
};

n2.cm._registerType(ncsquared.ui.components.DataTable.prototype._n2Type, ncsquared.ui.components.DataTable);

/**
 * Creates a new input component - use {@link n2.cm.addComponent} with the type <code>input</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the input component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the input should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display
 * @param {string} [config.type=text] The type of input, allowed values follow the W3C spec
 * @param {string} [config.placeholder] Any placeholder text to display
 * @param {string} [config.defaultValue] A default value to display in the input
 * @param {string} [config.icon] The sprite icon name to display on the input
 * @param {string} [config.iconSprite=action] The sprite name where the icon is from to display on the input
 * @param {string} [config.iconCls] The CSS class to apply to the icon
 * @param {boolean} [config.showClear=false] If set to true a clear button will be displayed to the right of the input
 * @param {boolean} [config.disabled=false] If true will create the input in a disabled state
 * @param {boolean} [config.required=false] Whether or not the input is required
 * @param {string} [config.requiredError=This field is required] An error message to display when the input is required but no value is provided
 * @param {Function} [config.validation] A function the will perform validation on blur, will be called with the value as the only argument and should return <code>true</code> if valid
 * and a <code>string</code> message if not valid. If <code>required</code> is also set to true, that will be checked first before calling this function
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>type</code>: raised when the a key is pressed in the input or the clear button pressed, called with the argument: <code>{string} value</code></li>
 * <li><code>change</code>: raised when the input changes on blur or the clear button is pressed, called with the argument: <code>{string} value or null if invalid</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.Input = function(config) {
    // Set the default config values
    config.type = config.type || 'text';
    config.iconSprite = config.iconSprite || 'action';
    config.showClear = n2.util.getDefaultBoolean(config.showClear, false);
    if (!n2.util.isNullOrUndefined(config.icon)) {
        if (config.showClear) {
            config.formIconClass = 'slds-input-has-icon slds-input-has-icon_left-right';
        } else {
            config.formIconClass = 'slds-input-has-icon slds-input-has-icon_left';
        }
    } else if (config.showClear) {
        config.formIconClass = 'slds-input-has-icon slds-input-has-icon_right';
    }
    config.disabled = n2.util.getDefaultBoolean(config.disabled, false);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.error = config.requiredError || 'This field is required';
    var hasValidation = n2.util.isFunction(config.validation);
    config.hasErrorMessage = config.required || hasValidation;
    // Make sure default value is correct for certain input types
    if (config.type === 'number' && !n2.util.isNumber(config.defaultValue)) {
        delete config.defaultValue;
    }

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.valueSelector = this.selector + '_input';
    this.errorSelector = this.selector + '_error';

    // Set other variables to use later
    this.defaultValue = config.defaultValue;
    this._previousValue = config.defaultValue || '';
    this._disabled = config.disabled;
    this._hidden = false;
    this.required = config.required;
    this.requiredError = config.requiredError;
    this.hasValidation = hasValidation;
    this.validation = this.hasValidation ? config.validation : null;

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        var self = this;
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });

        // For the type event add class to input so we're not always listing to key presses
        if (this.handlers.hasOwnProperty('type')) {
            n2j$(self.valueSelector).addClass('n2__input-type');
        }
    }
};

ncsquared.ui.components.Input.prototype._n2Type = 'input';

// Valid event handlers
ncsquared.ui.components.Input.prototype._handlersRegex = /^type$|^change$/;

ncsquared.ui.components.Input.prototype.bodyTemplate = '<div class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#label}}<label class="slds-form-element__label" for="{{id}}_input">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</label>{{/label}}' +
    ncsquared.ui.Help.triggerTemplate +
    '<div class="slds-form-element__control{{#formIconClass}} {{formIconClass}}{{/formIconClass}}">' +
    '{{#icon}}<svg id="{{id}}_icon" class="slds-icon slds-input__icon slds-input__icon_left slds-icon-text-default{{#iconCls}} {{iconCls}}{{/iconCls}}" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/{{iconSprite}}-sprite/svg/symbols.svg#{{icon}}" />' +
    '</svg>{{/icon}}' +
    '<input class="slds-input n2__input" id="{{id}}_input"{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}} type="{{type}}"{{#placeholder}} placeholder="{{placeholder}}"{{/placeholder}}{{#defaultValue}} value="{{defaultValue}}"{{/defaultValue}}{{#disabled}} disabled="disabled"{{/disabled}} />' +
    '{{#showClear}}<button id="{{id}}_clear-button" class="slds-input__icon slds-input__icon_right slds-button slds-button_icon n2__input-clear"{{#disabled}} disabled="disabled"{{/disabled}}>' +
    '<svg class="slds-button__icon slds-icon-text-light" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#clear" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Clear</span>' +
    '</button>{{/showClear}}' +
    '</div>' +
    '{{#hasErrorMessage}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{error}}</div>{{/hasErrorMessage}}' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.Input.prototype.init = function() {
    n2j$(document)
        // On blur validate the component (by calling getValue) and raise the change event
        .on('blur', 'div.n2__component input.n2__input', function() {
            var container = n2j$(this).closest('.n2__component');
            var component = n2.cm.getComponent(container.attr('id'));
            var val = n2.cm.getValue(component);
            component._handleEvent('change', val);
        })
        // On clicking clear, clear the input and call the type event
        .on('click', 'div.n2__component button.n2__input-clear', function() {
            var container = n2j$(this).closest('.n2__component');
            var component = n2.cm.getComponent(container.attr('id'));
            n2.cm.setValue(component, '', false);
            ncsquared.ui.Validation.updateValid(container, true);
            var val = component._getValue();
            component._handleEvent('type', val);
            component._handleEvent('change', val);
        })
        // On key up, when listing for the type event, call the event handler
        .on('keyup', 'div.n2__component input.n2__input.n2__input-type', function() {
            var component = n2.cm.getComponent(n2j$(this).closest('.n2__component').attr('id'));
            component._handleEvent('type', component._getValue());
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Input.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of the input or null if required but there is no value. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string} The current value of the input or null if required but there is no value
 */
ncsquared.ui.components.Input.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will set the input to the provided value and validate, unless requested not to. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string} value The value to set the input to
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.Input.prototype.setValue = function(value, validate) {
    // Set the value then trigger a validate
    n2j$(this.valueSelector).val(value);
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate if the input is required and whether a value has been provided and also any other custom validation passes.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or a value is provided and any custom validation passes, otherwise false
 */
ncsquared.ui.components.Input.prototype.validate = function() {
    // If disabled, hidden or not required and we have no validation, return valid
    if (this._disabled || this._hidden || (!this.required && !this.hasValidation)) {
        return true;
    }

    // If required, validate that we have a value
    var value = this._getValue();
    var valid = this.required ? Boolean(value && value.length > 0) : true;
    var message = this.requiredError;

    // If valid and we have a function, call it
    if (valid && n2.util.isFunction(this.validation)) {
        var response = this.validation(value);
        if (response !== true) {
            valid = false;
            message = response;
        }
    }

    // Update the error message and valid state of the component
    n2j$(this.errorSelector).text(message);
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), valid);
    return valid;
};

/**
 * Resets the intput back to its initial <config>defaultValue</config> or empty if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Input.prototype.reset = function() {
    // Set value to the default and then set to valid
    this.setValue(this.defaultValue || '', false);
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Gives focus to the input. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Input.prototype.focus = function() {
    n2j$(this.valueSelector).focus();
    return true;
};

/**
 * Enables the input
 */
ncsquared.ui.components.Input.prototype.enable = function() {
    this._disabled = false;
    n2j$(this.valueSelector).prop('disabled', '');
    n2j$(this.selector + ' button.n2__input-clear').prop('disabled', '');
};

/**
 * Disables the input
 */
ncsquared.ui.components.Input.prototype.disable = function() {
    this._disabled = true;
    n2j$(this.valueSelector).prop('disabled', 'disabled');
    n2j$(this.selector + ' button.n2__input-clear').prop('disabled', 'disabled');
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Shows the input
 */
ncsquared.ui.components.Input.prototype.show = function() {
    this._hidden = false;
    n2j$(this.selector).removeClass('slds-hide');
};

/**
 * Hides the input so that it is not visible to the user
 */
ncsquared.ui.components.Input.prototype.hide = function() {
    this._hidden = true;
    n2j$(this.selector).addClass('slds-hide');
};

ncsquared.ui.components.Input.prototype._getValue = function() {
    return n2j$(this.valueSelector).val();
};

ncsquared.ui.components.Input.prototype._handleEvent = function(event, arg) {
    if (this.handlers.hasOwnProperty(event)) {
        if (event === 'change') {
            if (this._previousValue === arg) {
                return;
            }
            this._previousValue = arg;
        }
        this.handlers[event].call(this, arg);
    }
};

n2.cm._registerType(ncsquared.ui.components.Input.prototype._n2Type, ncsquared.ui.components.Input);

/**
 * Creates a new modal dialog - use {@link n2.cm.addComponent} with the type <code>modal</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the modal dialog
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the modal is to be triggered from, normally a button
 * @param {string} config.bodySelector The selector of the body of the dialog, the modal dialog will then be wrapped around it
 * @param {string} [config.size=small] The size of the modal: <code>small</code>, <code>medium</code> or <code>large</code>
 * @param {string} [config.heading] The text to display in the header, if none provided the header will be hidden
 * @param {string} [config.headingDescription] The text to display under the header to provide more context
 * @param {string} [config.headingIcon] The sprite icon name to display in the heading
 * @param {string} [config.headingIconSprite=action] The sprite name where the icon is from to display in the heading
 * @param {string} [config.headingIconCls] The CSS class to apply to the icon in the heading
 * @param {string|boolean} [config.cancelButton=Cancel] The text of the cancel button, or false if it should be hidden
 * @param {string|boolean} [config.okButton=OK] The text of the ok button, or false if it should be hidden
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>show</code>: raised when the modal is shown, after the components have been reset, called with no arguments</li>
 * <li><code>ok</code>: raised when the ok button is clicked, after validation has been performed on all of the components within the modal, called with no arguments. If the handler returns a promise then reject it to keep the dialog open or resolve it to close the dialog</li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the modal element
 */
ncsquared.ui.components.Modal = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['bodySelector']);

    // Set the default config values
    config.size = this._sizeRegex.test(config.size) ? config.size : '';
    config.headingIconSprite = config.headingIconSprite || 'action';
    config.showCancel = config.cancelButton !== false;
    config.cancelButton = config.cancelButton || 'Cancel';
    config.showOK = config.okButton !== false;
    config.okButton = config.okButton || 'OK';
    config.showFooter = config.showCancel || config.showOK;

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.contentSelector = this.selector + '_content';
    this.headingSelector = this.selector + '_heading';
    this.spinnerSelector = this.selector + '_spinner,' + this.selector + '_spinner-footer';

    // Create the HTML, insert it after the body and then move the body into the modal
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    var body = n2j$(config.bodySelector);
    var target = n2j$(html);
    target.insertAfter(body);
    var bodyDom = body.detach();
    bodyDom.appendTo(this.contentSelector);

    // Add the attributes to the modal trigger
    n2j$(config.selector).attr('data-toggle', 'n2__modal').attr('data-target', config.id);

    // Set other variables to use later
    this.hasHeading = Boolean(config.heading);
    this.heading = config.heading;

    // Collect components in the modal
    this.components = {};
    var self = this;
    body.find('.n2__component').each(function() {
        var id = this.getAttribute('id');
        var component = n2.cm.getComponent(id);
        if (!n2.util.isNullOrUndefined(component) && n2.cm.isParentComponent(id)) {
            self.components[id] = component;

            // Register it with the component manager
            n2.cm._registerModalComponent(id);
        }
    });

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.Modal.prototype._n2Type = 'modal';

// Valid modal sizes, ignore small as that is the empty default
ncsquared.ui.components.Modal.prototype._sizeRegex = /^medium$|^large$/;

// Valid event handlers
ncsquared.ui.components.Modal.prototype._handlersRegex = /^show$|^ok$/;

ncsquared.ui.components.Modal.prototype._concernedKeys = [
    n2.key.KEY_ESCAPE,
    n2.key.KEY_ENTER
];

ncsquared.ui.components.Modal.prototype.bodyTemplate = '<section tabindex="-1" class="slds-modal n2__component n2__modal{{#size}} slds-modal_{{size}}{{/size}}{{#cls}} {{cls}}{{/cls}}" role="dialog" id="{{id}}" aria-describedby="{{id}}_content"{{#heading}} aria-labelledby="{{id}}_heading"{{/heading}} aria-modal="true">' +
    '<div class="slds-modal__container">' +
    '<header class="slds-modal__header{{^heading}} slds-modal__header_empty{{/heading}}">' +
    '<button title="Close" class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" data-dismiss="n2__modal">' +
    '<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Close</span>' +
    '</button>' +
    '{{#heading}}<div class="slds-media slds-media_center slds-has-flexi-truncate">' +
    '{{#headingIcon}}<div class="slds-media__figure" id="{{id}}_heading-icon">' +
    '<svg class="slds-icon{{#headingIconCls}} {{headingIconCls}}{{/headingIconCls}}" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/{{headingIconSprite}}-sprite/svg/symbols.svg#{{headingIcon}}" />' +
    '</svg>' +
    '</div>{{/headingIcon}}' +
    '<div class="slds-media__body">' +
    '<h2 class="slds-text-heading_medium slds-hyphenate" id="{{id}}_heading">{{heading}}</h2>' +
    '{{#headingDescription}}<p class="slds-m-top_x-small" id="{{id}}_heading-description">{{headingDescription}}</p>{{/headingDescription}}' +
    '</div>' +
    '</div>{{/heading}}' +
    '</header>' +
    // Position relative to ensure we are the scrollable parent
    '<div class="slds-modal__content slds-p-around_medium slds-is-relative" id="{{id}}_content">' +
    '<div class="slds-spinner_container slds-hide" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    // Position relative to ensure the scrollable container fills the space
    '{{#showFooter}}<footer id="{{id}}_footer" class="slds-modal__footer slds-is-relative">' +
    '{{#showCancel}}<button id="{{id}}_footer-cancel-button" class="slds-button slds-button_neutral n2__modal-cancel-button" data-dismiss="n2__modal">{{cancelButton}}</button>{{/showCancel}}' +
    '{{#showOK}}<button id="{{id}}_footer-ok-button" class="slds-button slds-button_brand n2__modal-ok-button">{{okButton}}</button>{{/showOK}}' +
    '<div class="slds-spinner_container slds-hide" id="{{id}}_spinner-footer"></div>' +
    '</footer>{{/showFooter}}' +
    '</div>' +
    '</section>';

ncsquared.ui.components.Modal.prototype.init = function() {
    // Append the backdrop div to the root element
    n2j$('<div class="slds-backdrop n2__modal-backdrop"></div>').appendTo(n2.ui.getScopedRoot());

    // On clicking the ok button, validate there are no errors and if there aren't close the dialog
    var onOk = function(modal) {
        var component = n2.cm.getComponent(modal.attr('id'));
        component._mask();
        if (n2.cm.validate(component)) {
            // Call the event handler, if a promise is returned return that one instead of ours
            var eventResult = component._handleEvent('ok');
            if (n2.util.isPromise(eventResult)) {
                eventResult
                    .done(function() {
                        component._unmask();
                        onClose(modal);
                    })
                    .fail(function() {
                        component._unmask();
                    });
            } else {
                component._unmask();
                onClose(modal);
            }
        } else {
            component._unmask();
        }
    };

    // On click of a dismiss button, hide the modal dialog, needs to be after the button click event so validation can prevent closure
    var onClose = function(modal) {
        modal.removeClass('slds-fade-in-open');
        n2j$('div.n2__modal-backdrop').removeClass('slds-backdrop_open');
    };

    n2j$(document)
        // On click of a trigger, show the modal dialog
        .on('click', '[data-toggle="n2__modal"]', function() {
            var id = n2j$(this).attr('data-target');
            var target = n2j$('#' + id);
            if (target.length > 0) {
                var component = n2.cm.getComponent(id);
                n2.cm.reset(component);
                component._handleEvent('show');

                n2j$('div.n2__modal-backdrop').addClass('slds-backdrop_open');
                target.addClass('slds-fade-in-open');
                n2.cm.focus(component);
            }
        })
        // On clicking the ok button, validate there are no errors and if not close the dialog
        .on('click', 'section.n2__modal footer.slds-modal__footer button.n2__modal-ok-button', function() {
            onOk(n2j$(this).closest('.slds-modal'));
        })
        // On click of a dismiss button, hide the modal dialog, needs to be after the button click event so validation can prevent closure
        .on('click', 'section.n2__modal [data-dismiss="n2__modal"]', function() {
            onClose(n2j$(this).closest('.slds-modal'));
        })
        // Handle keydown event
        .on('keydown', function(event) {
            var modal;
            // If it's a key we are concerned about and the modal is open then handle the key event
            if (ncsquared.ui.components.Modal.prototype._concernedKeys.indexOf(event.which) !== -1 && (modal = n2j$('section.n2__modal.slds-modal.slds-fade-in-open')).length > 0) {
                switch (event.which) {
                    case n2.key.KEY_ENTER:
                        // If we're pressing enter on a button, allow that to take the event
                        if (n2.ui.isButtonTarget(event)) {
                            return;
                        }

                        onOk(modal);
                        break;
                    case n2.key.KEY_ESCAPE:
                        onClose(modal);
                        break;
                }

                // Prevent the key press from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Modal.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of all of the components in the modal. Use {@link n2.cm.getModalValues} instead of this method directly
 *
 * @returns {Object} An object containing the component ids (excluding n2__ prefix) and their values
 */
ncsquared.ui.components.Modal.prototype.getValues = function() {
    var values = {};
    n2.util.each(this.components, function(id, component) {
        if (component.getValue) {
            values[n2.cm._cleanId(id)] = component.getValue();
        }
    });
    return values;
};

/**
 * Will validate all components in the modal.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if all components are valid, otherwise false
 */
ncsquared.ui.components.Modal.prototype.validate = function() {
    var valid = true;
    n2.util.each(this.components, function(id, component) {
        if (!n2.cm.validate(component)) {
            valid = false;
        }
    });
    return valid;
};

/**
 * Resets the modal heading back to the default and resets all of the components in the modal. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Modal.prototype.reset = function() {
    // Reset the heading back to default
    if (this.hasHeading) {
        n2j$(this.headingSelector).text(this.heading);
    }
    // Reset each component
    n2.util.each(this.components, function(id, component) {
        n2.cm.reset(component);
    });
};

/**
 * Gives focus to the first component that accepts focus. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True if focus was given to one of the components, otherwise false
 */
ncsquared.ui.components.Modal.prototype.focus = function() {
    var focused = false;
    n2.util.each(this.components, function(id, component) {
        if (n2.cm.focus(component)) {
            focused = true;
            return false;
        }
    });
    return focused;
};

/**
 * Shows the modal dialog to the user and masks the rest of the page
 *
 * @param {Function} callback A function that is called after resetting the dialog but before the dialog is shown so that any additional setup can be performed
 */
ncsquared.ui.components.Modal.prototype.show = function(callback) {
    this.reset();
    if (n2.util.isFunction(callback)) {
        callback();
    }

    n2j$('div.n2__modal-backdrop').addClass('slds-backdrop_open');
    n2j$(this.selector).addClass('slds-fade-in-open');
    this.focus();
};

/**
 * If a heading was originally set will override that with a new heading
 *
 * @param {string} heading Text to set as the new heading
 */
ncsquared.ui.components.Modal.prototype.setHeading = function(heading) {
    if (this.hasHeading) {
        n2j$(this.headingSelector).text(heading || '');
    }
};

ncsquared.ui.components.Modal.prototype._handleEvent = function(event) {
    if (this.handlers.hasOwnProperty(event)) {
        return this.handlers[event].call(this);
    }
};

ncsquared.ui.components.Modal.prototype._mask = function() {
    n2j$(this.spinnerSelector).removeClass('slds-hide');
};

ncsquared.ui.components.Modal.prototype._unmask = function() {
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

n2.cm._registerType(ncsquared.ui.components.Modal.prototype._n2Type, ncsquared.ui.components.Modal);

/**
 * Creates a new modal wizard dialog - use {@link n2.cm.addComponent} with the type <code>modal-wizard</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the modal wizard dialog
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the modal wizard is to be triggered from, normally a button
 * @param {string} config.bodySelector The selector of the body of the dialog that contains all the steps as children (and should contain no other content), the modal wizard dialog will then be wrapped around it
 * @param {Object[]} config.steps The configuration for the steps within the wizard
 * @param {string} config.steps[].name The name of the step, displayed in the progress indicator
 * @param {string} config.steps[].selector The selector of the step body, relative to <code>config.bodySelector</code>
 * @param {string} [config.size=small] The size of the modal wizard: <code>small</code>, <code>medium</code> or <code>large</code>
 * @param {string} [config.heading] The text to display in the header, if none provided the header will be hidden
 * @param {string} [config.headingDescription] The text to display under the header to provide more context
 * @param {string} [config.headingIcon] The sprite icon name to display in the heading
 * @param {string} [config.headingIconSprite=action] The sprite name where the icon is from to display in the heading
 * @param {string} [config.headingIconCls] The CSS class to apply to the icon in the heading
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>show</code>: raised when the modal wizard is shown, after the components have been reset, called with no arguments</li>
 * <li><code>showStep</code>: raised when a step is shown, called with the arguments <code>({number} stepNumber, {number} [previousStep]). If the handler returns a promise then the step won't be ready until after the promise has resolved</code></li>
 * <li><code>finish</code>: raised when the finish button is clicked, after validation has been performed on all of the components within the modal wizard, called with no arguments. If the handler returns a promise then reject it to keep the dialog open or resolve it to close the dialog</li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the modal wizard element
 */
ncsquared.ui.components.ModalWizard = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['bodySelector:string', 'steps:array', 'steps.name:string', 'steps.selector:string']);

    // Set the default config values
    config.size = this._sizeRegex.test(config.size) ? config.size : '';
    config.headingIconSprite = config.headingIconSprite || 'action';
    n2.util.each(config.steps, function(index, step) {
        step.stepNumber = index + 1;
    });

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.contentSelector = this.selector + '_content';
    this.headingSelector = this.selector + '_heading';
    this.backSelector = this.selector + '_footer-back-button';
    this.nextSelector = this.selector + '_footer-next-button';
    this.finishSelector = this.selector + '_footer-finish-button';
    this.progressSelector = this.selector + '_progress';
    this.spinnerSelector = this.selector + '_spinner,' + this.selector + '_spinner-footer';
    this.stepSelectors = [];
    this.stepNames = [];

    // Create the HTML, insert it after the body and then move the body into the modal wizard
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    var body = n2j$(config.bodySelector);
    var target = n2j$(html);
    target.insertAfter(body);
    var bodyDom = body.detach();
    bodyDom.prependTo(this.contentSelector);

    // Add the attributes to the modal wizard trigger
    n2j$(config.selector).attr('data-toggle', 'n2__modal-wizard').attr('data-target', config.id);

    // Set other variables to use later
    this.hasHeading = Boolean(config.heading);
    this.heading = config.heading;
    this.stepsLastIndex = Math.max(0, config.steps.length - 1);
    this.currentIndex = 0;

    // Collect components in the modal wizard and hide all steps as on show the first will be displayed
    this.components = [];
    var self = this;
    n2.util.each(config.steps, function(index, step) {
        self.stepSelectors.push(self.contentSelector + ' ' + step.selector);
        self.stepNames.push(step.name);
        var stepBody = body.find(step.selector);
        stepBody.addClass('slds-hide');

        // Collect the components per step
        var stepComponents = {};
        self.components.push(stepComponents);
        stepBody.find(' .n2__component').each(function() {
            var id = this.getAttribute('id');
            var component = n2.cm.getComponent(id);
            if (!n2.util.isNullOrUndefined(component) && n2.cm.isParentComponent(id)) {
                stepComponents[id] = component;

                // Register it with the component manager
                n2.cm._registerModalComponent(id);
            }
        });
    });

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.ModalWizard.prototype._n2Type = 'modal-wizard';

// Valid modal wizard sizes, ignore small as that is the empty default
ncsquared.ui.components.ModalWizard.prototype._sizeRegex = /^medium$|^large$/;

// Valid event handlers
ncsquared.ui.components.ModalWizard.prototype._handlersRegex = /^show$|^showStep$|^finish$/;

ncsquared.ui.components.ModalWizard.prototype._concernedKeys = [
    n2.key.KEY_ESCAPE,
    n2.key.KEY_ENTER
];

ncsquared.ui.components.ModalWizard.prototype.bodyTemplate = '<section tabindex="-1" class="slds-modal n2__component n2__modal-wizard{{#size}} slds-modal_{{size}}{{/size}}{{#cls}} {{cls}}{{/cls}}" role="dialog" id="{{id}}" aria-describedby="{{id}}_content"{{#heading}} aria-labelledby="{{id}}_heading"{{/heading}} aria-modal="true">' +
    '<div class="slds-modal__container">' +
    '<header class="slds-modal__header{{^heading}} slds-modal__header_empty{{/heading}}">' +
    '<button title="Close" class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" data-dismiss="n2__modal-wizard">' +
    '<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Close</span>' +
    '</button>' +
    '{{#heading}}<div class="slds-media slds-media_center slds-has-flexi-truncate">' +
    '{{#headingIcon}}<div class="slds-media__figure" id="{{id}}_heading-icon">' +
    '<svg class="slds-icon{{#headingIconCls}} {{headingIconCls}}{{/headingIconCls}}" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/{{headingIconSprite}}-sprite/svg/symbols.svg#{{headingIcon}}" />' +
    '</svg>' +
    '</div>{{/headingIcon}}' +
    '<div class="slds-media__body">' +
    '<h2 class="slds-text-heading_medium slds-hyphenate" id="{{id}}_heading">{{heading}}</h2>' +
    '{{#headingDescription}}<p class="slds-m-top_x-small" id="{{id}}_heading-description">{{headingDescription}}</p>{{/headingDescription}}' +
    '</div>' +
    '</div>{{/heading}}' +
    '</header>' +
    // Position relative to ensure we are the scrollable parent
    '<div class="slds-modal__content slds-p-around_medium slds-is-relative" id="{{id}}_content">' +
    '<div class="slds-spinner_container slds-hide" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    // Position relative to ensure the scrollable container fills the space
    '<footer id="{{id}}_footer" class="slds-modal__footer slds-modal__footer_directional slds-is-relative">' +
    '<div class="slds-grid">' +
    '<button id="{{id}}_footer-back-button" class="slds-button slds-button_neutral n2__modal-wizard-back-button slds-hidden">Back</button>' +
    '<div class="n2__progress-wrapper">' +
    '<div id="{{id}}_progress" class="slds-progress slds-progress_shade">' +
    '<ol class="slds-progress__list">' +
    '{{#steps}}' +
    '<li class="slds-progress__item" data-name="{{name}}">' +
    '<button class="slds-button slds-progress__marker" title="{{name}}" data-step="{{stepNumber}}">' +
    '<svg class="slds-button__icon slds-hide" aria-hidden="true">' +
    '<use xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#success"></use>' +
    '</svg>' +
    '<span class="slds-assistive-text">{{name}}</span>' +
    '</button>' +
    '</li>' +
    '{{/steps}}' +
    '</ol>' +
    '<div class="slds-progress-bar slds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" role="progressbar">' +
    '<span class="slds-progress-bar__value" style="width: 0%;">' +
    '<span class="slds-assistive-text">Progress: 0%</span>' +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<button id="{{id}}_footer-next-button" class="slds-button slds-button_brand n2__modal-wizard-next-button slds-hide">Next</button>' +
    '<button id="{{id}}_footer-finish-button" class="slds-button slds-button_brand n2__modal-wizard-finish-button slds-hide">Finish</button>' +
    '</div>' +
    '<div class="slds-spinner_container slds-hide" id="{{id}}_spinner-footer"></div>' +
    '</footer>' +
    '</div>' +
    '</section>';

ncsquared.ui.components.ModalWizard.prototype.init = function() {
    // Append the backdrop div to the root element
    n2j$('<div class="slds-backdrop n2__modal-wizard-backdrop"></div>').appendTo(n2.ui.getScopedRoot());

    // On clicking the finish button, validate there are no errors and if there aren't close the dialog
    var onFinish = function(modal) {
        var component = n2.cm.getComponent(modal.attr('id'));
        component._mask();
        if (n2.cm.validate(component)) {
            // Call the event handler, if a promise is returned return that one instead of ours
            var eventResult = component._handleEvent('finish');
            if (n2.util.isPromise(eventResult)) {
                eventResult
                    .done(function() {
                        component._unmask();
                        onClose(modal);
                    })
                    .fail(function() {
                        component._unmask();
                    });
            } else {
                component._unmask();
                onClose(modal);
            }
        } else {
            component._unmask();
        }
    };

    // On click of a dismiss button, hide the modal wizard dialog, needs to be after the button click event so validation can prevent closure
    var onClose = function(modal) {
        modal.removeClass('slds-fade-in-open');
        n2j$('div.n2__modal-wizard-backdrop').removeClass('slds-backdrop_open');
    };

    n2j$(document)
        // On click of a trigger, show the modal wizard dialog
        .on('click', '[data-toggle="n2__modal-wizard"]', function() {
            var id = n2j$(this).attr('data-target');
            var target = n2j$('#' + id);
            if (target.length > 0) {
                var component = n2.cm.getComponent(id);
                n2.cm.reset(component);
                component._handleEvent('show');

                n2j$('div.n2__modal-wizard-backdrop').addClass('slds-backdrop_open');
                target.addClass('slds-fade-in-open');
                n2.cm.focus(component);
            }
        })
        // On clicking the finish button, validate there are no errors and if not close the dialog
        .on('click', 'section.n2__modal-wizard footer.slds-modal__footer button.n2__modal-wizard-finish-button', function() {
            onFinish(n2j$(this).closest('.slds-modal'));
        })
        // On clicking the next button, trigger to go to the next step
        .on('click', 'section.n2__modal-wizard footer.slds-modal__footer button.n2__modal-wizard-next-button', function() {
            var modal = n2j$(this).closest('.slds-modal');
            n2.cm.getComponent(modal.attr('id')).nextStep();
        })
        // On clicking the back button, trigger to go to the previous step
        .on('click', 'section.n2__modal-wizard footer.slds-modal__footer button.n2__modal-wizard-back-button', function() {
            var modal = n2j$(this).closest('.slds-modal');
            n2.cm.getComponent(modal.attr('id')).previousStep();
        })
        // On click of a dismiss button, hide the modal wizard dialog, needs to be after the button click event so validation can prevent closure
        .on('click', 'section.n2__modal-wizard [data-dismiss="n2__modal-wizard"]', function() {
            onClose(n2j$(this).closest('.slds-modal'));
        })
        // On click of the progress buttons go to that step
        .on('click', 'section.n2__modal-wizard footer.slds-modal__footer li.slds-progress__item.slds-is-completed > button', function() {
            var button = n2j$(this);
            var modal = button.closest('.slds-modal');
            n2.cm.getComponent(modal.attr('id')).goToStep(button.attr('data-step'));
        })
        // Handle keydown event
        .on('keydown', function(event) {
            var modal;
            // If it's a key we are concerned about and the modal wizard is open then handle the key event
            if (ncsquared.ui.components.ModalWizard.prototype._concernedKeys.indexOf(event.which) !== -1 && (modal = n2j$('section.n2__modal-wizard.slds-modal.slds-fade-in-open')).length > 0) {
                switch (event.which) {
                    case n2.key.KEY_ENTER:
                        // If we're pressing enter on a button, allow that to take the event
                        if (n2.ui.isButtonTarget(event)) {
                            return;
                        }

                        // If the finish button is hidden trigger to go to the next step otherwise trigger the finish process
                        if (modal.find('footer.slds-modal__footer button.n2__modal-wizard-finish-button').hasClass('slds-hide')) {
                            n2.cm.getComponent(modal.attr('id')).nextStep();
                        } else {
                            onFinish(modal);
                        }
                        break;
                    case n2.key.KEY_ESCAPE:
                        onClose(modal);
                        break;
                }

                // Prevent the key press from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.ModalWizard.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of all of the components in all of the pages of the modal wizard. Use {@link n2.cm.getModalValues} instead of this method directly
 *
 * @returns {Object} An object containing the component ids (excluding n2__ prefix) and their values
 */
ncsquared.ui.components.ModalWizard.prototype.getValues = function() {
    var values = {};
    n2.util.each(this.components, function(index, stepComponents) {
        n2.util.each(stepComponents, function(id, component) {
            if (component.getValue) {
                values[n2.cm._cleanId(id)] = component.getValue();
            }
        });
    });
    return values;
};

/**
 * Will validate all components in the current step of the modal wizard.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if all components in the current step are valid, otherwise false
 */
ncsquared.ui.components.ModalWizard.prototype.validate = function() {
    var valid = true;
    n2.util.each(this.components[this.currentIndex], function(id, component) {
        if (!n2.cm.validate(component)) {
            valid = false;
        }
    });
    return valid;
};

/**
 * Resets all of the components in each step of the modal wizard. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.ModalWizard.prototype.reset = function() {
    // Reset each component
    n2.util.each(this.components, function(index, stepComponents) {
        n2.util.each(stepComponents, function(id, component) {
            n2.cm.reset(component);
        });
    });
    // Reset back to the first page
    this.currentIndex = 0;
    this._updateSteps();
};

/**
 * Gives focus to the first component in the current step that accepts focus. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True if focus was given to one of the components, otherwise false
 */
ncsquared.ui.components.ModalWizard.prototype.focus = function() {
    var focused = false;
    n2.util.each(this.components[this.currentIndex], function(id, component) {
        if (n2.cm.focus(component)) {
            focused = true;
            return false;
        }
    });
    return focused;
};

/**
 * Shows the modal wizard to the user and masks the rest of the page
 *
 * @param {Function} callback A function that is called after resetting the wizard but before the wizard is shown so that any additional setup can be performed
 */
ncsquared.ui.components.ModalWizard.prototype.show = function(callback) {
    this.reset();
    if (n2.util.isFunction(callback)) {
        callback();
    }

    n2j$('div.n2__modal-wizard-backdrop').addClass('slds-backdrop_open');
    n2j$(this.selector).addClass('slds-fade-in-open');
    this.focus();
};

/**
 * Progresses the wizard onto the next step
 */
ncsquared.ui.components.ModalWizard.prototype.nextStep = function() {
    this.goToStep(this.currentIndex + 2);
};

/**
 * Moves the wizard back the previous steps
 */
ncsquared.ui.components.ModalWizard.prototype.previousStep = function() {
    this.goToStep(this.currentIndex);
};

/**
 * Moves the wizard to the given step, which has to either be one of the previous stpes or the next step. Will validate before moving to the next step
 *
 * @param {number} stepNumber The step to move to, either one of the previous steps or the next step
 */
ncsquared.ui.components.ModalWizard.prototype.goToStep = function(stepNumber) {
    if (n2.util.isNumber(stepNumber)) {
        var stepIndex = Number(stepNumber) - 1;
        // Go to the given step if it's valid (any previous or next), validate if it's the next step
        if (stepIndex >= 0 && stepIndex <= this.stepsLastIndex && (stepIndex < this.currentIndex || stepIndex === this.currentIndex + 1)) {
            if (stepIndex < this.currentIndex || this.validate()) {
                var previousStep = this.currentIndex + 1;
                this.currentIndex = stepIndex;
                this._updateSteps(previousStep);
            }
        }
    }
};

ncsquared.ui.components.ModalWizard.prototype._updateSteps = function(previousStep) {
    // Mask the control
    this._mask();

    // Update the buttons
    if (this.currentIndex === 0) {
        n2j$(this.backSelector).addClass('slds-hidden');
    } else {
        n2j$(this.backSelector).removeClass('slds-hidden');
    }
    if (this.currentIndex === this.stepsLastIndex) {
        n2j$(this.nextSelector).addClass('slds-hide');
        n2j$(this.finishSelector).removeClass('slds-hide');
    } else {
        n2j$(this.nextSelector).removeClass('slds-hide');
        n2j$(this.finishSelector).addClass('slds-hide');
    }

    // Show the correct step
    var self = this;
    n2.util.each(this.stepSelectors, function(index, stepSelector) {
        if (self.currentIndex === index) {
            n2j$(stepSelector).removeClass('slds-hide');
        } else {
            n2j$(stepSelector).addClass('slds-hide');
        }
    });

    // Update the step progress items
    n2j$(this.progressSelector + ' li.slds-progress__item').each(function(index, item) {
        var progressItem = n2j$(item);
        var name = progressItem.attr('data-name');
        if (self.currentIndex > index) {
            progressItem.removeClass('slds-is-active').addClass('slds-is-completed');
            progressItem.find('button').addClass('slds-button_icon slds-button_icon slds-progress__marker_icon').attr('title', name + ' - Completed');
            progressItem.find('svg').removeClass('slds-hide');
            progressItem.find('span').text(name + ' - Completed');
        } else if (self.currentIndex === index) {
            progressItem.addClass('slds-is-active').removeClass('slds-is-completed');
            progressItem.find('button').removeClass('slds-button_icon slds-button_icon slds-progress__marker_icon').attr('title', name);
            progressItem.find('svg').addClass('slds-hide');
            progressItem.find('span').text(name + ' - Active');
        } else {
            progressItem.removeClass('slds-is-active slds-is-completed');
            progressItem.find('button').removeClass('slds-button_icon slds-button_icon slds-progress__marker_icon').attr('title', name);
            progressItem.find('svg').addClass('slds-hide');
            progressItem.find('span').text(name);
        }
    });

    // Update the progress summary
    var completed = Math.round((this.currentIndex / this.stepsLastIndex) * 100);
    if (!n2.util.isNumber(completed)) {
        completed = 0;
    }
    var progressBar = n2j$(this.progressSelector + ' div.slds-progress-bar');
    progressBar.attr('aria-valuenow', completed);
    progressBar.find('span.slds-progress-bar__value').css('width', completed + '%');
    progressBar.find('span.slds-assistive-text').text('Progress: ' + completed + '%');

    // Update the heading with the step name
    if (this.hasHeading) {
        var stepName = this.stepNames[this.currentIndex];
        if (n2.util.isString(stepName) && stepName.length > 0) {
            n2j$(this.headingSelector).text(this.heading + ' > ' + stepName);
        } else {
            n2j$(this.headingSelector).text(this.heading);
        }
    }

    // Fire the show event
    var args = [this.currentIndex + 1];
    if (!n2.util.isNullOrUndefined(previousStep) && n2.util.isNumber(previousStep)) {
        args.push(Number(previousStep));
    }
    var eventResponse = this._handleEvent('showStep', args);
    if (n2.util.isPromise(eventResponse)) {
        eventResponse.done(function() {
            // Unmask the modal and focus on the step
            self._unmask();
            self.focus();
        });
    } else {
        // Unmask the modal and focus on the step
        this._unmask();
        this.focus();
    }
};

ncsquared.ui.components.ModalWizard.prototype._handleEvent = function(event, args) {
    if (this.handlers.hasOwnProperty(event)) {
        if (n2.util.isNullOrUndefined(args)) {
            return this.handlers[event].call(this);
        } else {
            return this.handlers[event].apply(this, args);
        }
    }
};

ncsquared.ui.components.ModalWizard.prototype._mask = function() {
    n2j$(this.spinnerSelector).removeClass('slds-hide');
};

ncsquared.ui.components.ModalWizard.prototype._unmask = function() {
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

n2.cm._registerType(ncsquared.ui.components.ModalWizard.prototype._n2Type, ncsquared.ui.components.ModalWizard);

/**
 * Creates a new pill list - use {@link n2.cm.addComponent} with the type <code>pill-list</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the pill list
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the list should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display
 * @param {string[]|Object[]} [config.defaultValue] Any existing pills to be shown on render, if an Object then the <code>config.pillLabelKey</code> config is used to determine the label to display
 * Duplicates will be removed where the object or string (ignoring case) already exists, with the first instance being used
 * @param {string} [config.pillLabelKey=label] The property to use when an Object is used in the <code>config.defaultValue</code> or add handler to determine the label to display in the pill
 * @param {string|string[]} [config.delimiter=;] The delimiter(s) for pills that when pasting or entering data will create individual pills. Tab and carriage return will always create a new pill, and to have no other
 * delimiter set the property to an empty array
 * @param {boolean} [config.ignoreDelimiterInQuotes=true] If true then on paste will treat a delimiter that is within quotes as plain text and quotes will be also kept
 * @param {boolean} [config.readOnly=false] If set to true new pills cannot be added and existing ones cannot be deleted
 * @param {boolean} [config.required=false] Whether or not the pill list is required
 * @param {string} [config.requiredError=This field is required] An error message to display when the pill list is required but no value is provided
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {string} [config.minHeight] An optional minimum height that the pill list container is set to
 * @param {boolean} [config.showClear=false] If true a clear all button is shown to remove all of the pills
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>add</code>: raised when a new pill is added to the pill list, called with the argument: <code>{string[]} labels</code>.
 * Response should be of the format {{pills:string[]|Object[], [message]:string}} where the <code>pills</code> property contains the resolved pills using the same structure as <code>config.defaultValue</code>, or a promise that resolves to that structure, and the optional <code>message</code> property can include a message that will be displayed under the pill list</li>
 * <li><code>change</code>: raised when the pill list changes, called with the argument: <code>{string[]|Object[]} value or null if invalid</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.PillList = function(config) {
    // Set the default config values and process the pills
    config.pillLabelKey = config.pillLabelKey || 'label';
    config.ignoreDelimiterInQuotes = n2.util.getDefaultBoolean(config.ignoreDelimiterInQuotes, true);
    config.readOnly = n2.util.getDefaultBoolean(config.readOnly, false);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.requiredError = config.requiredError || 'This field is required';
    config.showClear = n2.util.getDefaultBoolean(config.showClear, false);

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.controlSelector = this.selector + '_control';
    this.listSelector = this.selector + '_listbox';
    this.listItemSelector = this.listSelector + ' > li.n2__pill-item';
    this.editInputSelector = this.selector + '_edit-input';
    this.editInputItemSelector = this.selector + '_edit-input-item';
    this.messageSelector = this.selector + '_message';
    this.messageDuplicatesSelector = this.selector + '_message-duplicates';
    this.spinnerSelector = this.selector + '_spinner';

    // Set other variables to use later
    this.pillLabelKey = config.pillLabelKey;
    this.defaultValue = this._removeDuplicatePills(config.defaultValue);
    this.ignoreDelimiterInQuotes = config.ignoreDelimiterInQuotes;
    this.readOnly = config.readOnly;
    this.required = config.required;

    // Set the delimeter
    this.setDelimiter(config.delimiter);

    // Add the pills setting the first pill's tabindex
    if (this.defaultValue.length > 0) {
        this._addPills(this.defaultValue, true, false);
    }

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        var self = this;
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.PillList.prototype._n2Type = 'pill-list';

// Valid event handlers
ncsquared.ui.components.PillList.prototype._handlersRegex = /^add$|^change$/;

ncsquared.ui.components.PillList.prototype._concernedKeys = [
    n2.key.KEY_BACKSPACE,
    n2.key.KEY_DELETE,
    n2.key.KEY_LEFT,
    n2.key.KEY_RIGHT
];

ncsquared.ui.components.PillList.prototype._internalSeparator = '¬';

ncsquared.ui.components.PillList.prototype.bodyTemplate = '<div class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '<div class="slds-grid">' +
    '{{#label}}<label class="slds-form-element__label" for="{{id}}_input">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</label>{{/label}}' +
    ncsquared.ui.Help.triggerTemplate +
    '{{#showClear}}<div class="slds-col slds-text-align_right"><a id="{{id}}_clear-pills" class="n2__pill-list-clear">Clear All</a></div>{{/showClear}}' +
    '</div>' +
    '<div class="slds-form-element__control" id="{{id}}_control">' +
    '<div class="slds-pill_container slds-is-relative{{^readOnly}} n2__pill-list-container-editable{{/readOnly}}"{{#minHeight}} style="min-height: {{minHeight}}"{{/minHeight}}>' +
    '<ul class="slds-listbox slds-listbox_horizontal" role="listbox" aria-label="Selected Options:" aria-orientation="horizontal" id="{{id}}_listbox"{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}}>' +
    '{{^readOnly}}' +
    '<li class="slds-listbox-item" id="{{id}}_edit-input-item" role="presentation">' +
    '<input type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" id="{{id}}_edit-input" class="n2__pill-list-input">' +
    '</li>' +
    '{{/readOnly}}' +
    '</ul>' +
    '<div class="slds-spinner_container slds-hide" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '{{#required}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>{{/required}}' +
    '</div>' +
    '<div class="slds-form-element__help slds-hide n2__pill-list-message" id="{{id}}_message"></div>' +
    '<div class="slds-form-element__help slds-hide" id="{{id}}_message-duplicates"></div>' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.PillList.prototype.pillsTemplate = '{{#pills}}' +
    '<li class="slds-listbox-item n2__pill-item" role="presentation">' +
    '<span class="slds-pill" role="option" aria-selected="true">' +
    '<span title="{{.}}" class="slds-pill__label">{{.}}</span>' +
    '{{^readOnly}}' +
    '<span title="Remove" class="slds-icon_container slds-pill__remove">' +
    '<svg class="slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Press delete or backspace to remove</span>' +
    '</span>' +
    '{{/readOnly}}' +
    '</span>' +
    '</li>' +
    '{{/pills}}';

ncsquared.ui.components.PillList.prototype.init = function() {
    n2j$(document)
        // Focus on the item
        .on('click', 'div.n2__component li.n2__pill-item > span.slds-pill', function(event) {
            var pill = n2j$(this);
            var component = n2.cm.getComponent(pill.closest('div.n2__component').attr('id'));
            component._focusPill(pill.closest('li.n2__pill-item'));

            // Prevent the click from bubbling up
            event.preventDefault();
            event.stopImmediatePropagation();
        })
        // Remove the pill when the remove icon is clicked
        .on('click', 'div.n2__component span.slds-pill__remove', function(event) {
            var pill = n2j$(this);
            var component = n2.cm.getComponent(pill.closest('div.n2__component').attr('id'));
            component._removePill(pill.closest('li.n2__pill-item'));

            // Prevent the click from bubbling up
            event.preventDefault();
            event.stopImmediatePropagation();
        })
        // When clicking on the div when editable put focus into the text box
        .on('click', 'div.n2__component div.n2__pill-list-container-editable', function() {
            n2j$(this).find('input').focus();
        })
        // When clicking on the clear all button remove all pills
        .on('click', 'div.n2__component a.n2__pill-list-clear', function() {
            n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'))._clearPills();
        })
        // Handle key down events on the pill
        .on('keydown', 'div.n2__component li.n2__pill-item > span.slds-pill', function(event) {
            // If it's a key we are concerned about handle the event
            if (ncsquared.ui.components.PillList.prototype._concernedKeys.indexOf(event.which) !== -1) {
                var pill = n2j$(this);
                var component = n2.cm.getComponent(pill.closest('div.n2__component').attr('id'));

                switch (event.which) {
                    case n2.key.KEY_BACKSPACE:
                    case n2.key.KEY_DELETE:
                        // Remove the pill
                        component._removePill(pill.closest('li.n2__pill-item'));
                        break;

                    case n2.key.KEY_LEFT:
                        // Move to the previous key
                        component._focusPill(pill.closest('li.n2__pill-item').prev());
                        break;

                    case n2.key.KEY_RIGHT:
                        // Move to the next key
                        component._focusPill(pill.closest('li.n2__pill-item').next());
                        break;
                }

                // Prevent the click from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        })
        // Handle key down events in the input
        .on('keydown', 'div.n2__component input.n2__pill-list-input', function(event) {
            var input = n2j$(this);
            var getComponent = function() {
                return n2.cm.getComponent(input.closest('div.n2__component').attr('id'));
            };
            var delimiter = false;

            if (n2.key.KEY_BACKSPACE === event.which) {
                // On backspace in the text box, when there's no value focus on the last pill
                if (event.target.value.length === 0) {
                    var component = getComponent();
                    component._focusPill(component._getLastPill());

                    // Prevent the key press from bubbling up
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            } else if (n2.key.KEY_ENTER === event.which || n2.key.KEY_TAB === event.which || (delimiter = input.attr('data-delimiters').split(ncsquared.ui.components.PillList.prototype._internalSeparator).indexOf(event.key) !== -1)) {
                // Add pill when pressing enter or tab or delimiter key when there is a value
                if (event.target.value.length !== 0) {
                    // Reset the text box before adding the labels to make sure the value isn't re-used
                    var value = event.target.value;
                    event.target.value = '';
                    getComponent()._addLabels([value], true);

                    // Prevent the key press from bubbling up
                    event.preventDefault();
                    event.stopImmediatePropagation();
                } else if (delimiter) {
                    // If we've just pressed the delmiter prevent the key press from bubbling up and registering
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            }
        })
        // On leaving the text box add any text as a pill, if no value in the text box and not disabled then validate
        .on('blur', 'div.n2__component input.n2__pill-list-input', function(event) {
            var component = n2.cm.getComponent(n2j$(this).closest('div.n2__component').attr('id'));
            if (event.target.value.length > 0) {
                component._addLabels([event.target.value]);
                event.target.value = '';
            } else if (!event.target.disabled) {
                n2.cm.validate(component);
            }
        })
        // On paste to the input add the content as pills
        .on('paste', 'div.n2__component input.n2__pill-list-input', function(event) {
            var input = n2j$(this);
            var component = n2.cm.getComponent(input.closest('div.n2__component').attr('id'));
            var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            if (clipboardData && clipboardData.getData) {
                var data = event.target.value + clipboardData.getData('text');
                event.target.value = '';
                component._pasteLabels(data);
            }
            // Prevent the key press from bubbling up
            event.preventDefault();
            event.stopImmediatePropagation();
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.PillList.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the values of the pills or null if required but there are no values. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string[]|Object[]} An array of the pills, either as strings or objects depending on the configuration of the component
 */
ncsquared.ui.components.PillList.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will clear any existing pills and add the provided pills to the list. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string|string[]|Object[]} value The pills to add to the list, use a string to add a single label, or if an Object then the <code>config.pillLabelKey</code> config is used to determine the label to display.
 * Duplicates will be removed where the object or string (ignoring case) already exists, with the first instance being used
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.PillList.prototype.setValue = function(value, validate) {
    // Remove any existing pills, clean, then add the provided ones
    if (n2.util.isString(value)) {
        value = [value];
    }
    if (n2.util.isArray(value)) {
        this._clearPills();
        value = this._removeDuplicatePills(value);
        // Add the pills which will trigger the validation
        this._addPills(value, true, validate);
    }
};

/**
 * Will validate if the pill list is required one pill has been added.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or at least one pill has been added, otherwise false
 */
ncsquared.ui.components.PillList.prototype.validate = function() {
    // If required, validate that we have a value
    if (!this.required) {
        return true;
    }

    var valid = n2j$(this.listItemSelector).length > 0;
    // Update the valid state of the component
    ncsquared.ui.Validation.updateValid(n2j$(this.controlSelector), valid);
    return valid;
};

/**
 * Resets the pill list back to its initial <config>defaultValue</config> or empty if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.PillList.prototype.reset = function() {
    // Remove any existing pills, add the defaults, hide any messages then set to valid
    n2j$(this.listItemSelector).remove();
    if (this.defaultValue.length > 0) {
        this._addPills(this.defaultValue, true, false);
    }
    this._hideMessages();
    ncsquared.ui.Validation.updateValid(n2j$(this.controlSelector), true);
};

/**
 * Gives focus to the create pills if not readonly. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True if focus was given, otherwise false
 */
ncsquared.ui.components.PillList.prototype.focus = function() {
    if (this.readOnly) {
        // If read only don't focus
        return false;
    }
    // Focus on the edit input
    n2j$(this.editInputSelector).focus();
    return true;
};

/**
 * Sets the delimiter on the component that when pasting or entering data will create individual pills
 *
 * @param {string|string[]} [config.delimiter=;] The delimiter(s) for pills that when pasting or entering data will create individual pills. Tab and carriage return will always create a new pill, and to have no other
 * delimiter pass in an empty array
 */
ncsquared.ui.components.PillList.prototype.setDelimiter = function(delimiter) {
    // Not relevant if read only
    if (this.readOnly) {
        return;
    }

    // Set the delimiter property to an array
    this.delimiters = n2.util.isArray(delimiter) ? delimiter : [delimiter || ';'];

    // Add the delimiters to the dom so it can be easily accessed by the handlers when typing
    n2j$(this.editInputSelector).attr('data-delimiters', this.delimiters.join(this._internalSeparator));

    // Create a regex so we can use it to split strings later, make sure we escape special characters
    var reservedChars = ['[', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '{', '}'];
    var delimitersForRegex = n2.util.map(this.delimiters, function(delimiter) {
        if (reservedChars.indexOf(delimiter) === -1) {
            return delimiter;
        }
        return '\\' + delimiter;
    });
    // Append the internal separator to the delimiters used in the regex as we use that to recognise new line and tab characters
    delimitersForRegex.push(this._internalSeparator);
    this.delimitersRegex = new RegExp(delimitersForRegex.join('|'));
};

ncsquared.ui.components.PillList.prototype._getValue = function() {
    return n2j$(this.listItemSelector).map(function() {
        return n2j$(this).data('n2__pill');
    }).get();
};

ncsquared.ui.components.PillList.prototype._removeDuplicatePills = function(pills) {
    var resolvedPills = [];
    var self = this;
    if (n2.util.isArray(pills)) {
        // Create a new array of the pills, removing any duplicates or those with no labels
        n2.util.each(pills, function(index, pill) {
            // Resolve the label from the pill
            var resolvedLabel = n2.util.isObject(pill) ? pill[self.pillLabelKey] : pill;
            resolvedLabel = resolvedLabel || '';

            if (resolvedLabel.length > 0 && !self._checkMatches(resolvedPills, pill, resolvedLabel)) {
                resolvedPills.push(pill);
            }
        });
    }
    return resolvedPills;
};

ncsquared.ui.components.PillList.prototype._pasteLabels = function(data) {
    // Replace carriage returns and tabs with the internal delimiter character
    data = data.replace(/([\r]?\n)|(\t)/g, this._internalSeparator);

    if (this.ignoreDelimiterInQuotes) {
        // If ignoring delimiter in quotes we need to go through the data and manually split it
        var labels = [];
        var currentLabel = '';
        var inQuotes = false;
        var dataLength = data.length;
        var character;
        for (var i = 0; i < dataLength; i++) {
            character = data[i];
            if (character === '"') {
                inQuotes = !inQuotes;
            } else if (this._internalSeparator === character || (!inQuotes && this.delimiters.indexOf(character) !== -1)) {
                labels.push(currentLabel);
                currentLabel = '';
            } else {
                currentLabel += character;
            }
        };

        // Add the final label if there is content then add the labels to the control
        if (currentLabel.length > 0) {
            labels.push(currentLabel);
        }
        this._addLabels(labels, true);
    } else {
        // If not ignoring delimiter in quotes just split the data and add the labels
        this._addLabels(data.split(this.delimitersRegex), true);
    }
};

ncsquared.ui.components.PillList.prototype._addLabels = function(labels, focusOnInput) {
    // Hide any existing messages
    this._hideMessages();

    var pills = [];
    var lablesToCheck = [];
    var self = this;
    // Loop through the labels checking if any are duplicates in this set then adding them to an array
    n2.util.each(labels, function(index, label) {
        label = label.trim();
        var labelToCheck = label.toLowerCase();
        if (label.length > 0 && lablesToCheck.indexOf(labelToCheck) === -1) {
            pills.push(label);
            lablesToCheck.push(labelToCheck);
        }
    });
    if (pills.length === 0) {
        return;
    }

    // If we add an add handler, call it and check the response
    if (n2.util.isFunction(this.handlers.add)) {
        var addResponse = this.handlers.add.call(this, pills);
        // If the response is a promise, add the pills after it's resolved, otherwise assume the response is the processed pills and add them now
        if (!n2.util.isNullOrUndefined(addResponse)) {
            if (n2.util.isPromise(addResponse)) {
                // Mask the component while we wait then unmask on completion
                self._mask();
                addResponse.done(function(response) {
                    self._addPills(response.pills);
                    self._addMessage(response.message);
                    self._unmask();
                    if (focusOnInput) {
                        n2j$(self.editInputSelector).focus();
                    }
                });
            } else {
                this._addPills(addResponse.pills);
                this._addMessage(addResponse.message);
            }
        }
    } else {
        // If no add handler, use the labels as the pills
        this._addPills(pills);
        this._addMessage();
    }

    // Focus on the input if requested, for promises it will also be done after unmasking
    if (focusOnInput) {
        n2j$(self.editInputSelector).focus();
    }
};

ncsquared.ui.components.PillList.prototype._addPills = function(pills, focusFirst, validate) {
    var labels = [];
    var pillData = [];
    var duplicates = [];
    var self = this;

    // Fetch the existing pills to compare duplicates against
    var existing = n2j$(this.listItemSelector).map(function(index, item) {
        return n2j$(item).data('n2__pill');
    }).get();

    // Loop through the pills, extracting the lables and checking for label content and duplicates
    n2.util.each(pills, function(index, pill) {
        // Resolve the label from the pill
        var resolvedLabel = n2.util.isObject(pill) ? pill[self.pillLabelKey] : pill;
        resolvedLabel = resolvedLabel || '';

        // Check we have content and that if it already exists in this list then add it to an array for generating the HTML and add the original to an array to attach as data to the pills
        if (resolvedLabel.length > 0) {
            if (self._checkMatches(existing, pill, resolvedLabel)) {
                if (duplicates.indexOf(resolvedLabel) === -1) {
                    duplicates.push(resolvedLabel);
                }
            } else if (!self._checkMatches(pillData, pill, resolvedLabel)) {
                labels.push(resolvedLabel);
                pillData.push(pill);
            }
        }
    });
    // If we have duplicates add a message to inform the user
    if (duplicates.length > 0) {
        n2j$(this.messageDuplicatesSelector).text('The following items were not added as they already existed: "' + duplicates.join('", "') + '"').removeClass('slds-hide');
    }
    // If there are no labels no need to continue
    if (labels.length === 0) {
        return;
    }

    // Generate the HTML
    var html = n2.ui.renderTemplate(this.pillsTemplate, {
        pills: labels,
        readOnly: this.readOnly
    });

    // Store the original count of items
    var count = n2j$(this.listItemSelector).length;

    // Add the new pills to the end of the list, taking into account the edit input
    if (this.readOnly) {
        n2j$(this.listSelector).append(html);
    } else {
        n2j$(this.editInputItemSelector).before(html);
    }

    // Iterate through the list items adding the data
    n2j$(this.listItemSelector).each(function(index, item) {
        if (index >= count) {
            n2j$(item).data('n2__pill', pillData[index - count]);
        }
    });

    // Update the tab index to the new last pill, or first pill if requested
    this._focusPill(focusFirst ? this._getFirstPill() : this._getLastPill(), true);

    // Validate to either remove an error or check we are still valid
    var valid = true;
    if (validate !== false) {
        valid = this.validate();
    }

    // Call the change handler if provided
    if (this.handlers && this.handlers.hasOwnProperty('change')) {
        this.handlers['change'].call(this, valid ? this._getValue() : null);
    }
};

ncsquared.ui.components.PillList.prototype._removePill = function(listitem) {
    // Remove the listitem from the DOM if it is not readonly and focus on the previous pill, the first pill or the input
    if (!this.readOnly && n2.ui.isJQuery(listitem) && listitem.length > 0) {
        var toFocus = listitem.prev();
        listitem.remove();
        if (toFocus.length === 0) {
            toFocus = this._getFirstPill();
        }

        if (toFocus.length === 0) {
            n2j$(this.editInputSelector).focus();
        } else {
            this._focusPill(toFocus);
        }

        // Remove any existing messages
        this._hideMessages();

        // Call the change handler if provided
        if (this.handlers.hasOwnProperty('change')) {
            this.handlers['change'].call(this, this._getValue());
        }
    }
};

ncsquared.ui.components.PillList.prototype._clearPills = function() {
    // Remove all current pills then clear the messages
    n2j$(this.listItemSelector).remove();
    this._hideMessages();
};

ncsquared.ui.components.PillList.prototype._focusPill = function(listitem, ignoreFocus) {
    if (n2.ui.isJQuery(listitem) && listitem.length > 0 && listitem.hasClass('n2__pill-item')) {
        // Remove tabindex for all pills then focus on the given one
        listitem.closest('.slds-listbox').find('span.slds-pill').removeAttr('tabindex');
        var pill = listitem.find('span.slds-pill');
        pill.attr('tabindex', 0);
        if (ignoreFocus !== true) {
            // Only focus if not requested to ignore
            pill.focus();
        }
    }
};

ncsquared.ui.components.PillList.prototype._getFirstPill = function() {
    return n2j$(this.listItemSelector).first();
};

ncsquared.ui.components.PillList.prototype._getLastPill = function() {
    return n2j$(this.listItemSelector).last();
};

ncsquared.ui.components.PillList.prototype._hideMessages = function() {
    n2j$(this.messageSelector).addClass('slds-hide');
    n2j$(this.messageDuplicatesSelector).addClass('slds-hide');
};

ncsquared.ui.components.PillList.prototype._addMessage = function(message) {
    // Show or hide the provided message
    if (n2.util.isNullOrUndefined(message) || message.length === 0) {
        n2j$(this.messageSelector).addClass('slds-hide');
    } else {
        n2j$(this.messageSelector).text(message).removeClass('slds-hide');
    }
};

ncsquared.ui.components.PillList.prototype._checkMatches = function(existing, pill, resolvedLabel) {
    var found = false;
    if (n2.util.isArray(existing) && existing.length > 0) {
        var isObject = n2.util.isObject(pill);
        var pillLabelKey = this.pillLabelKey;
        resolvedLabel = resolvedLabel.toLowerCase();

        // Look through the existing ones to see if we can find a match
        n2.util.each(existing, function(index, existingPill) {
            if (n2.util.isObject(existingPill)) {
                // If we're both objects, check equality of the whole object
                if (isObject && n2.util.equalsDeep(existingPill, pill)) {
                    found = true;
                    return false;
                } else if (!isObject && existingPill.hasOwnProperty(pillLabelKey) && resolvedLabel === existingPill[pillLabelKey].toLowerCase()) {
                    // Otherwise if the existing one is an object and the new pill check the labels match
                    found = true;
                    return false;
                }
            } else if (resolvedLabel === existingPill.toLowerCase()) {
                // Otherwise if the existing is not an object check that the labels match
                found = true;
                return false;
            }
        });
    }
    return found;
};

ncsquared.ui.components.PillList.prototype._mask = function() {
    n2j$(this.editInputSelector).prop('disabled', 'disabled');
    n2j$(this.spinnerSelector).removeClass('slds-hide');
};

ncsquared.ui.components.PillList.prototype._unmask = function() {
    n2j$(this.editInputSelector).prop('disabled', '');
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

n2.cm._registerType(ncsquared.ui.components.PillList.prototype._n2Type, ncsquared.ui.components.PillList);

/**
 * Creates a new radio group component - use {@link n2.cm.addComponent} with the type <code>radio-group</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the radio group component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the radio group should be rendered, will be replaced with the HTML for the component
 * @param {stinrg} [config.label] An optional label to display above the radio group
 * @param {string[]|Object[]|Function} config.data An array of the available radio buttons or a function that can be called with no arguments to get the radio buttons:
 * <ul><li><code>string[]</code> can be used to return radio buttons whose values and labels are the same</li>
 * <li><code>Object[]</code> can be used to specify the values and labels of the radio buttons (see below)</li>
 * <li><code>Function</code> can be used to return either one of the arrays above or a promise which, when resolved, will provide an array</li></ul>
 * @param {string} config.data[].label The label to display to the user next to the radio button
 * @param {string} config.data[].value The value that is returned in the <code>getValue</code> method when the radio button is checked
 * @param {string} [config.defaultValue] The value of the radio button that should be checked by default
 * @param {boolean} [config.sort=true] When set to true will sort the radio buttons alphabetically by label
 * @param {boolean} [config.required=false] Whether or not the radio group is required, ie one of the radio buttons must be checked
 * @param {string} [config.requiredError=This field is required] An error message to display when the radio group is required but none are checked
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.RadioGroup = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['data', 'data.label', 'data.value']);

    // Set the default config values
    config.sort = n2.util.getDefaultBoolean(config.sort, true);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.requiredError = config.requiredError || 'This field is required';

    // If data is a function call it and see if we get an array response or a promise
    var dataPromise = false;
    if (n2.util.isFunction(config.data)) {
        this.data = config.data;
        var response = config.data.call(this);
        if (n2.util.isPromise(response)) {
            dataPromise = response;
            config.showSpinner = true;
        } else {
            config.data = response;
        }
    }
    // Process the data to get the radio buttons
    this.sort = config.sort;
    config.radioButtons = config.showSpinner ? [] : this._getRadioButtons(config.data, config.defaultValue);
    delete config.data;

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.containerSelector = this.selector + '_group';
    this.valueSelector = this.containerSelector + ' input.n2__radio-group';
    this.errorSelector = this.selector + '_error';
    this.spinnerSelector = this.selector + '_spinner';

    // Set other variables to use later, make the default value a string as it will be converted to strings in the DOM anyway
    if (!n2.util.isNullOrUndefined(config.defaultValue)) {
        this.defaultValue = String(config.defaultValue);
    }
    this.required = config.required;

    // If the function did return a promise setup call for when resolved to add the radio buttons
    var self = this;
    if (dataPromise) {
        dataPromise.done(function(data) {
            self._addRadioButtons(data, false, self.defaultValue);
        });
    }
};

ncsquared.ui.components.RadioGroup.prototype._n2Type = 'radio-group';

ncsquared.ui.components.RadioGroup.prototype.radioButtonTemplate = '{{#radioButtons}}<div class="slds-radio">' +
    '<input class="n2__radio-group" id="{{id}}_radio-{{index}}" name="{{id}}_radio" type="radio" value="{{value}}"{{#checked}} checked{{/checked}}{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}} />' +
    '<label class="slds-radio__label" for="{{id}}_radio-{{index}}" title="{{label}}">' +
    '<span class="slds-radio_faux"></span>' +
    '<span class="slds-form-element__label">{{label}}</span>' +
    '</label>' +
    '</div>{{/radioButtons}}';

ncsquared.ui.components.RadioGroup.prototype.bodyTemplate = '<fieldset class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#label}}<legend class="slds-form-element__legend slds-form-element__label" for="{{id}}_group">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</legend>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/label}}' +
    '<div class="slds-form-element__control" id="{{id}}_group">' +
    ncsquared.ui.components.RadioGroup.prototype.radioButtonTemplate +
    '<div class="slds-spinner_container{{^showSpinner}} slds-hide{{/showSpinner}}" id="{{id}}_spinner">' +
    '<div class="slds-spinner slds-spinner_small" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '</div>' +
    '{{#required}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>{{/required}}' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</fieldset>';

ncsquared.ui.components.RadioGroup.prototype.init = function() {
    n2j$(document)
        // On change validate the component
        .on('change', 'fieldset.n2__component input.n2__radio-group', function() {
            n2.cm.validate(n2j$(this).closest('.n2__component').attr('id'));
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.RadioGroup.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the value of the selected radio button or null if required and none are selected. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string} The value of the selected radio button or null if required and none are selected
 */
ncsquared.ui.components.RadioGroup.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue() || '';
    }
    return null;
};

/**
 * Will select the radio button with the given value and unselect all others. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string} value The value of the radio button to select
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.RadioGroup.prototype.setValue = function(value, validate) {
    // Set the checked state of the radio buttons then trigger a validate
    n2j$(this.valueSelector).each(function(index, radioButton) {
        if (value === radioButton.value) {
            n2j$(radioButton).prop('checked', true);
        } else {
            n2j$(radioButton).prop('checked', '');
        }
    });
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate if the radio group is required and if one item has been selected.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or one item has been selected, otherwise false
 */
ncsquared.ui.components.RadioGroup.prototype.validate = function() {
    // If required, validate that we have at least one checked
    if (!this.required) {
        return true;
    }

    var valid = n2j$(this.valueSelector).is(':checked');
    // Update the valid state of the component
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), valid);
    return valid;
};

/**
 * Resets the radio button back to its initial <config>defaultValue</config> or all unselected if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.RadioGroup.prototype.reset = function() {
    // Set value to the default and then set to valid
    this.setValue(this.defaultValue, false);
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Refreshes the radio group by calling the <code>data</code> function if it was provided to create a new list of radio buttons. Use {@link n2.cm.refresh} instead of this method directly
 *
 * @param {boolean} [keepCurrent=false] Set to true to keep the current value otherwise reverts back to the <code>defaultValue</code>
 */
ncsquared.ui.components.RadioGroup.prototype.refresh = function(keepCurrent) {
    // If the data was provided as a function, add the mask
    if (n2.util.isFunction(this.data)) {
        n2j$(this.spinnerSelector).removeClass('slds-hide');

        // If keeping current but we have no current radio buttons then assume this is the first delayed load and we want to use the default
        var resetValue = keepCurrent === true && n2j$(this.valueSelector).length > 0 ? this._getValue() : this.defaultValue;

        // Call the function and either add the radio buttons straight away or hook it into the promise done
        var response = this.data();
        if (response && n2.util.isPromise(response)) {
            var self = this;
            response.done(function(data) {
                self._addRadioButtons(data, true, resetValue);
            });
        } else {
            this._addRadioButtons(response, true, resetValue);
        }

        // Set to valid
        ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
    }
};

/**
 * Gives focus to the first readio button. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.RadioGroup.prototype.focus = function() {
    // Focus on the first radio button
    n2j$(this.valueSelector).eq(0).focus();
    return true;
};

ncsquared.ui.components.RadioGroup.prototype._getRadioButtons = function(data, defaultValue) {
    // Check that the data is an array, and fail if not and we are not waiting for a promise response
    if (n2.util.isArray(data)) {
        var radioButtons = [];
        n2.util.each(data, function(index, radioButton) {
            var newRadioButton;
            if (n2.util.isString(radioButton)) {
                newRadioButton = {
                    label: radioButton,
                    value: radioButton
                };
            } else {
                newRadioButton = radioButton;
            }
            newRadioButton.index = index;

            // Set if this is the default value
            newRadioButton.checked = defaultValue === newRadioButton.value;
            radioButtons.push(newRadioButton);
        });

        // If required, sort the items
        if (this.sort) {
            radioButtons.sort(function(a, b) {
                return n2.util.compareObjectValues(a, b, 'label');
            });
        }

        return radioButtons;
    }

    throw new Error('data must by an array');
};

ncsquared.ui.components.RadioGroup.prototype._addRadioButtons = function(data, cleanFirst, defaultValue) {
    // If requested, remove the existing checkbxoes
    if (cleanFirst) {
        n2j$(this.containerSelector + ' > div.slds-radio').remove();
    }

    // Get the new HTML for the radio buttons and append them to the control
    var radioButtons = this._getRadioButtons(data, defaultValue);
    var radioButtonsHtml = n2.ui.renderTemplate(this.radioButtonTemplate, {
        radioButtons: radioButtons
    });
    n2j$(radioButtonsHtml).prependTo(this.containerSelector);

    // Remove the spinner
    n2j$(this.spinnerSelector).addClass('slds-hide');
};

ncsquared.ui.components.RadioGroup.prototype._getValue = function() {
    // Return value of the first checked
    return n2j$(this.valueSelector + ':checked').eq(0).val();
};

n2.cm._registerType(ncsquared.ui.components.RadioGroup.prototype._n2Type, ncsquared.ui.components.RadioGroup);

/**
 * Creates a new select component - use {@link n2.cm.addComponent} with the type <code>select</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the select component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the select should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] The label to display
 * @param {string[]|Object[]|Function} config.data An array of the available options or a function that can be called with no arguments to get the options:
 * <ul><li><code>string[]</code> can be used to return options whose values and labels are the same</li>
 * <li><code>Object[]</code> can be used to specify the values and labels of the options (see below)</li>
 * <li><code>Function</code> can be used to return either one of the arrays above or a promise which, when resolved, will provide an array. If <code>null/undefined</code> is returned then the select will remain disabled</li></ul>
 * @param {string} config.data[].label The label to display to the user in the dropdown
 * @param {string} config.data[].value The value that is returned in the <code>getValue</code> method when the option is selected
 * @param {boolean} [config.multiselect=false] Whether or not multiple selections can be made
 * @param {string} [config.placeholder] Any placeholder text to display, will not be used if a <code>defaultValue</code> is also provided or <code>multiselect</code> is enabled
 * @param {string|string[]} [config.defaultValue] A default item to select, or an array of default items if a multiselect
 * @param {boolean} [config.sort=true] When set to true will sort the options alphabetically by label
 * @param {boolean} [config.required=false] Whether or not the select is required
 * @param {string} [config.requiredError=This field is required] An error message to display when the select is required but no value is provided
 * @param {string} [config.requiredOption=--Please select--] The label of the empty option to show when the select is required
 * @param {string} [config.emptyOption=] The lable of the empty option to show when the select is not required
 * @param {boolean} [config.disabled=false] If true will create the select in a disabled state
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>change</code>: raised when the select option changes, called with the argument: <code>{string|string[]} value or null if invalid</code></li>
 * <li><code>load</code>: raised when the component has first finished loading, called with the argument: <code>{string|string[]} value or null if nothing was selected by default</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.Select = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['data', 'data.label', 'data.value']);

    // Set the default config values
    config.multiselect = n2.util.getDefaultBoolean(config.multiselect, false);
    config.sort = n2.util.getDefaultBoolean(config.sort, true);
    config.required = n2.util.getDefaultBoolean(config.required, false);
    config.requiredError = config.requiredError || 'This field is required';
    config.requiredOption = config.requiredOption || '--Please select--';
    config.emptyOption = config.emptyOption || '';
    if (!n2.util.isNullOrUndefined(config.defaultValue)) {
        delete config.placeholder;
    }
    // If not multiselect just use the first item if default value is an array
    if (!config.multiselect && n2.util.isArray(config.defaultValue) && config.defaultValue.length > 0) {
        config.defaultValue = config.defaultValue[0];
    }
    config.disabled = n2.util.getDefaultBoolean(config.disabled, false);
    this._disabled = config.disabled;

    // If data is a function call it and see if we get a null response, array response or a promise
    var dataPromise = false;
    var awaitingData = false;
    if (n2.util.isFunction(config.data)) {
        this.data = config.data;
        var response = config.data.call(this);
        if (n2.util.isNullOrUndefined(response)) {
            awaitingData = true;
            config.disabled = true;
        } else if (n2.util.isPromise(response)) {
            dataPromise = response;
            awaitingData = true;
            config.disabled = true;
            config.showSpinner = true;
        } else {
            config.data = response;
        }
    }

    // Resolve the data options if we're not waiting for the data
    this.sort = config.sort;
    config.options = awaitingData ? [] : this._getOptions(config.data, config.defaultValue);
    delete config.data;

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.valueSelector = this.selector + '_select';
    this.errorSelector = this.selector + '_error';
    this.spinnerSelector = this.selector + '_spinner';

    // Set other variables to use later
    this.defaultValue = config.defaultValue;
    this._hidden = false;
    this.required = config.required;

    // Add change handler, if provided, per component as it doesn't seem to work with the document selector
    var self = this;
    var loadHandler;
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (n2.util.isFunction(handler)) {
                if (event === 'change') {
                    n2j$(self.valueSelector).on('change', function() {
                        handler.call(self, self.getValue());
                    });
                } else if (event === 'load') {
                    // Store load handler
                    loadHandler = handler;
                }
            }
        });
    }

    // If the function did return a promise setup call for when resolved to add the options
    if (dataPromise) {
        dataPromise.done(function(data) {
            self._addOptions(data, false, self.defaultValue);
            if (loadHandler) {
                loadHandler.call(self, self._getValue());
            }
        });
    } else if (loadHandler) {
        loadHandler.call(this, this._getValue());
    }
};

ncsquared.ui.components.Select.prototype._n2Type = 'select';

ncsquared.ui.components.Select.prototype.optionsTemplate = '{{#options}}<option class="n2__select-option" value="{{value}}"{{#selected}} selected{{/selected}}>{{label}}</option>{{/options}}';

ncsquared.ui.components.Select.prototype.emptyOptionTemplate = '<option value="" class="n2__select-option-empty" disabled selected hidden></option>';

ncsquared.ui.components.Select.prototype.bodyTemplate = '<div class="slds-form-element n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#label}}<label class="slds-form-element__label" for="{{id}}_select">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</label>{{/label}}' +
    ncsquared.ui.Help.triggerTemplate +
    '<div class="slds-form-element__control">' +
    // With multiselect we don't want the container
    '{{^multiselect}}<div class="slds-select_container">{{/multiselect}}' +
    '<select class="slds-select n2__select" id="{{id}}_select"{{#required}} aria-describedby="{{id}}_error" required="required"{{/required}}{{#disabled}} disabled{{/disabled}}{{#multiselect}} multiple="multiple"{{/multiselect}}>' +
    // Ignore placeholders if we have multiselect enabled
    '{{^multiselect}}' +
    // Add in the placeholder as a non-selectable option
    '{{#placeholder}}<option value="" class="n2__select-option-empty" disabled selected hidden>{{placeholder}}</option>{{/placeholder}}' +
    // If we have no placeholder or default value add in an empty non-selectable option
    '{{^placeholder}}{{^defaultValue}}' + ncsquared.ui.components.Select.prototype.emptyOptionTemplate + '{{/defaultValue}}{{/placeholder}}' +
    // Add in an empty option that can be selected
    '<option class="n2__select-option-empty" value="n2__empty">{{#required}}{{requiredOption}}{{/required}}{{^required}}{{emptyOption}}{{/required}}</option>' +
    '{{/multiselect}}' +
    // Add in the options
    ncsquared.ui.components.Select.prototype.optionsTemplate +
    '</select>' +
    '<div class="slds-spinner slds-spinner_x-small{{^showSpinner}} slds-hide{{/showSpinner}}" id="{{id}}_spinner" role="status">' +
    '<span class="slds-assistive-text">Loading</span>' +
    '<div class="slds-spinner__dot-a"></div>' +
    '<div class="slds-spinner__dot-b"></div>' +
    '</div>' +
    '{{^multiselect}}</div>{{/multiselect}}' +
    '</div>' +
    '{{#required}}<div class="slds-form-element__help slds-hidden" id="{{id}}_error">{{requiredError}}</div>{{/required}}' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.components.Select.prototype.init = function() {
    n2j$(document)
        // On blur validate the component
        .on('blur', 'div.n2__component select.n2__select', function() {
            n2.cm.validate(n2j$(this).closest('.n2__component').attr('id'));
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Select.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Will return the current selected value of the select or null if nothing is selected.
 * When <code>multiselect</code> is enabled then it will return null if required and nothing is selected, otherwise an array of the selected values. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string|string[]} The current selected value or values or null if nothing is selected
 */
ncsquared.ui.components.Select.prototype.getValue = function(skipValidation) {
    // If we're invalid return null
    if (skipValidation || this.validate()) {
        return this._getValue();
    }
    return null;
};

/**
 * Will select the option with the given value, or if <code>multiselect</code> is enabled the given values. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string|string[]} value The value, or values, of the options to select
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.components.Select.prototype.setValue = function(value, validate) {
    // Set the value then trigger a validate
    n2j$(this.valueSelector).val(value);
    if (validate !== false) {
        this.validate();
    }
};

/**
 * Will validate if the select is required and at least one item has been selected.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or at least one item has been selected, otherwise false
 */
ncsquared.ui.components.Select.prototype.validate = function() {
    // If disabled, hidden or not required, return valid
    if (this._disabled || this._hidden || !this.required) {
        return true;
    }

    var value = this._getValue();
    var valid = Boolean(value && value.length > 0);
    // Update the valid state of the component
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), valid);
    return valid;
};

/**
 * Resets the select back to its initial <config>defaultValue</config> or nothing selected if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Select.prototype.reset = function() {
    // Set value to the default and then set to valid
    this.setValue(this.defaultValue || '', false);
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Refreshes the select by calling the <code>data</code> function if it was provided to create a new set of options. Use {@link n2.cm.refresh} instead of this method directly
 *
 * @param {boolean} [keepCurrent=false] Set to true to keep the current value otherwise reverts back to the <code>defaultValue</code>
 */
ncsquared.ui.components.Select.prototype.refresh = function(keepCurrent) {
    // If the data was provided as a function, add the mask
    if (n2.util.isFunction(this.data)) {
        var disabled = n2j$(this.valueSelector).prop('disabled') === true;
        n2j$(this.valueSelector).prop('disabled', 'disabled');
        n2j$(this.spinnerSelector).removeClass('slds-hide');

        // Store the current value so we can trigger change after refresh if value changes, and the value we should be set to
        var currentValue = this._getValue();
        // If keeping current but we are already disabled then assume this is the first delayed load and we want to use the default
        var resetValue = keepCurrent === true && !disabled ? currentValue : this.defaultValue;

        // Call the function and either add the options straight away or hook it into the promise done
        var response = this.data();
        if (response && n2.util.isPromise(response)) {
            var self = this;
            response.done(function(data) {
                self._addOptions(data, true, resetValue);
                if (self._getValue() !== currentValue) {
                    n2j$(self.valueSelector).trigger('change');
                }
            });
        } else {
            this._addOptions(response, true, resetValue);
            if (this._getValue() !== currentValue) {
                n2j$(this.valueSelector).trigger('change');
            }
        }

        // Set to valid
        ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
    }
};

/**
 * Gives focus to the select. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Select.prototype.focus = function() {
    n2j$(this.valueSelector).focus();
    return true;
};

/**
 * Enables the select
 */
ncsquared.ui.components.Select.prototype.enable = function() {
    this._disabled = false;
    n2j$(this.valueSelector).prop('disabled', '');
};

/**
 * Disables the select
 */
ncsquared.ui.components.Select.prototype.disable = function() {
    this._disabled = true;
    n2j$(this.valueSelector).prop('disabled', 'disabled');
    ncsquared.ui.Validation.updateValid(n2j$(this.selector), true);
};

/**
 * Shows the select
 */
ncsquared.ui.components.Select.prototype.show = function() {
    this._hidden = false;
    n2j$(this.selector).removeClass('slds-hide');
};

/**
 * Hides the select so that it is not visible to the user
 */
ncsquared.ui.components.Select.prototype.hide = function() {
    this._hidden = true;
    n2j$(this.selector).addClass('slds-hide');
};

ncsquared.ui.components.Select.prototype._getOptions = function(data, defaultValue) {
    var defaultIsArray = n2.util.isArray(defaultValue);
    // Check that the data is an array, and fail if not and we are not waiting for a promise response
    if (n2.util.isArray(data)) {
        var options = [];
        n2.util.each(data, function(index, option) {
            var newOption;
            if (n2.util.isString(option)) {
                newOption = {
                    label: option,
                    value: option
                };
            } else {
                newOption = option;
            }

            // Set if this is the default value
            newOption.selected = defaultIsArray ? defaultValue.indexOf(newOption.value) !== -1 : defaultValue === newOption.value;
            options.push(newOption);
        });

        // If required, sort the items
        if (this.sort) {
            options.sort(function(a, b) {
                return n2.util.compareObjectValues(a, b, 'label');
            });
        }

        return options;
    }

    throw new Error('data must by an array');
};

ncsquared.ui.components.Select.prototype._addOptions = function(data, cleanFirst, defaultValue) {
    // If requested, remove the existing options
    if (cleanFirst) {
        n2j$(this.valueSelector + ' > option.n2__select-option').remove();
    }

    // If we have no data just hide the spinner
    if (n2.util.isNullOrUndefined(data)) {
        n2j$(this.spinnerSelector).addClass('slds-hide');
    } else {
        // Get the new HTML for the options and append them to the control
        var options = this._getOptions(data, defaultValue);
        var optionsHtml = n2.ui.renderTemplate(this.optionsTemplate, {
            options: options
        });
        n2j$(optionsHtml).appendTo(this.valueSelector);

        // Remove the spinner/disabled flags
        if (!this._disabled) {
            n2j$(this.valueSelector).prop('disabled', '');
        }
        n2j$(this.spinnerSelector).addClass('slds-hide');
    }
};

ncsquared.ui.components.Select.prototype._getValue = function() {
    // If we're the non-required option return null
    var value = n2j$(this.valueSelector).val();
    return value === 'n2__empty' ? null : value;
};

n2.cm._registerType(ncsquared.ui.components.Select.prototype._n2Type, ncsquared.ui.components.Select);

/**
 * Creates a new tabs component - use {@link n2.cm.addComponent} with the type <code>tabs</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the tabs component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the tabs should be rendered, will be replaced with the HTML for the component
 * @param {Object[]} config.tabs The configuration for the tabs
 * @param {string} config.tabs[].label The label to display in the tab heading
 * @param {string} config.tabs[].selector The selector for the content that is to be included in the tab body
 * @param {string} [config.tabs[].icon] An optional icon to show before the label in the tab heading
 * @param {string} config.tabs[].icon.title The title to apply to the icon in the tab heading
 * @param {string} config.tabs[].icon.icon The sprite icon name to display in the tab heading
 * @param {string} [config.tabs[].icon.iconSprite=action] The sprite name where the icon is from to display in the tab heading
 * @param {string} [config.tabs[].icon.iconCls] The CSS class to apply to the icon in the tab heading
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>show</code>: raised when a tab is clicked on, apart from the first tab shown on load, called with the argument: <code>{string} label</code></li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root tabs element
 */
ncsquared.ui.components.Tabs = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['tabs', 'tabs.label', 'tabs.selector']);

    // Set the default config values
    n2.util.each(config.tabs, function(index, tab) {
        tab.index = index;
        tab.selected = index === 0;
        if (!n2.util.isNullOrUndefined(tab.icon)) {
            n2.util.checkRequiredConfig(tab.icon, ['title', 'icon'], 'tabs[' + index + '].icon');
            tab.icon.iconSprite = tab.icon.iconSprite || 'action';
        }
    });

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;

    // Move the tabs content into the tabs using the selectors
    var tabs = n2j$(this.selector);
    n2.util.each(config.tabs, function(index, tab) {
        var content = n2j$(tab.selector);
        if (content.length > 0) {
            tabs.find('div#' + config.id + '_tab-' + index + '_content').append(content);
        }
    });

    // Set other variables to use later
    this.id = config.id;

    // Store event handlers
    this.handlers = {};
    if (config.handlers) {
        var self = this;
        n2.util.each(config.handlers, function(event, handler) {
            if (self._handlersRegex.test(event) && n2.util.isFunction(handler)) {
                self.handlers[event] = handler;
            }
        });
    }
};

ncsquared.ui.components.Tabs.prototype._n2Type = 'tabs';

ncsquared.ui.components.Tabs.prototype._concernedKeys = [
    n2.key.KEY_LEFT,
    n2.key.KEY_RIGHT
];

// Valid event handlers
ncsquared.ui.components.Tabs.prototype._handlersRegex = /^show$/;

ncsquared.ui.components.Tabs.prototype.bodyTemplate = '<div class="slds-tabs_scoped n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '<ul class="slds-tabs_scoped__nav" role="tablist">' +
    '{{#tabs}}<li class="slds-tabs_scoped__item{{#selected}} slds-is-active{{/selected}}" role="presentation">' +
    '<a class="slds-tabs_scoped__link" role="tab"{{#selected}} tabindex="0" aria-selected="true"{{/selected}} aria-controls="{{id}}_tab-{{index}}_content" data-key="{{index}}" id="{{id}}_tab-{{index}}">' +
    '{{#icon}}<div class="slds-icon_container" title="{{title}}">' +
    '<svg class="slds-icon slds-icon_x-small{{#iconCls}} {{iconCls}}{{/iconCls}}" aria-hidden="true">' +
    '<use xlink:href="{{sldsIconsPrefix}}/{{iconSprite}}-sprite/svg/symbols.svg#{{icon}}"></use>' +
    '</svg>' +
    '<span class="slds-assistive-text">{{title}}</span>' +
    '</div>{{/icon}}' +
    '<span class="slds-truncate{{#icon}} slds-p-left_x-small{{/icon}}" title="{{label}}">{{label}}</span></a>' +
    '</li>{{/tabs}}' +
    '</ul>' +
    '{{#tabs}}' +
    '<div id="{{id}}_tab-{{index}}_content" class="slds-tabs_scoped__content {{#selected}}slds-show{{/selected}}{{^selected}}slds-hide{{/selected}}" role="tabpanel" aria-labelledby="{{id}}_tab-{{index}}"></div>' +
    '{{/tabs}}' +
    '</div>';

ncsquared.ui.components.Tabs.prototype.init = function() {
    n2j$(document)
        // On click open the tab
        .on('click', 'div.n2__component.slds-tabs_scoped > ul > li > a.slds-tabs_scoped__link', function() {
            var link = n2j$(this);
            n2.cm.getComponent(link.closest('div.n2__component').attr('id'))._showTab(link.attr('id'));
        })
        // Handle keydown event on the tab anchor
        .on('keydown', 'div.n2__component.slds-tabs_scoped > ul > li > a.slds-tabs_scoped__link', function(event) {
            var selectedTab;
            // If it's a key we are concerned about and the selected tab has focus then handle the key event
            if (ncsquared.ui.components.Tabs.prototype._concernedKeys.indexOf(event.which) !== -1 && (selectedTab = n2j$(this)).is(':focus')) {
                var parent = selectedTab.closest('ul');
                var size = parent.find('li').length;
                var currentIndex = Number(selectedTab.attr('data-key'));
                var newIndex;

                // Find out which tab to go to next
                if (event.which === n2.key.KEY_LEFT) {
                    newIndex = currentIndex === 0 ? (size - 1) : (currentIndex - 1);
                } else {
                    newIndex = (currentIndex + 1) === size ? 0 : (currentIndex + 1);
                }

                // Show the new tab
                var id = parent.closest('div.n2__component').attr('id');
                n2.cm.getComponent(id)._showTab(id + '_tab-' + newIndex);

                // Prevent the key press from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Tabs.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Resets back to showing the first tab. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.components.Tabs.prototype.reset = function() {
    // Show the first tab
    this._showTab(this.id + '_tab-0', true);
};

/**
 * Gives focus to the selected tab. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Tabs.prototype.focus = function() {
    n2j$(this.selector + ' ul > li > a[aria-selected="true"]').focus();
    return true;
};

ncsquared.ui.components.Tabs.prototype._showTab = function(linkId, suppressEvent) {
    // Remove the current selections
    var tabs = n2j$(this.selector);
    tabs.find('li.slds-tabs_scoped__item').removeClass('slds-is-active');
    tabs.find('a.slds-tabs_scoped__link').attr('tabindex', null).attr('aria-selected', null);
    tabs.find('div.slds-tabs_scoped__content').removeClass('slds-show').addClass('slds-hide');

    // Select the new tab
    var newLink = tabs.find('a#' + linkId);
    newLink.closest('li.slds-tabs_scoped__item').addClass('slds-is-active');
    newLink.attr('tabindex', '0').attr('aria-selected', true);
    tabs.find('div#' + linkId + '_content').addClass('slds-show').removeClass('slds-hide');

    // Focus on the new tab before firing the event in case the caller wants to change focus
    this.focus();

    // Fire the show event if needed
    if (!suppressEvent && this.handlers.hasOwnProperty('show')) {
        this.handlers['show'].call(this, newLink.find('span.slds-truncate').text());
    }
};

n2.cm._registerType(ncsquared.ui.components.Tabs.prototype._n2Type, ncsquared.ui.components.Tabs);

/**
 * Creates a new tree component - use {@link n2.cm.addComponent} with the type <code>tree</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the tree component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the tree should be rendered, will be replaced with the HTML for the component
 * @param {Object[]} config.groups The groups of items to display in the tree
 * @param {string} [config.groups[].heading] The heading for the group
 * @param {Object[]} config.groups[].items The items to display in the tree
 * @param {string} config.groups[].items[].label The label to display for the item
 * @param {Object[]} [config.groups[].items[].items] The nested child items to display in the tree, has the same config options as <code>config.groups[].items</code>
 * @param {string} [config.groups[].items[].selected] Whether or not that tree item is selected, only relevant if there are no child items.
 * If <code>config.multiselect</code> is disabled only the first will be selected on load
 * @param {string} [config.groups[].items[].expanded] Whether or not that tree item is expanded, only relevant if there are child items
 * @param {string} [config.groups[].items[].disabled] Whether or not that tree item is disabled and cannot be selected, only relevant if there are no child items
 * @param {Function} [config.groups[].items[].action] A function to be called when the item is clicked or selection with enter or spacebar, only relevant if there are no child items. Will be called with the argument <code>selected</code>
 * @param {boolean} [config.multiselect=false] Whether or not multi-select is supported
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.components.Tree = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['groups', 'groups.items']);

    // Set the default config values
    config.multiselect = n2.util.getDefaultBoolean(config.multiselect, false);

    // Set other variables to use later
    this.multiselect = config.multiselect;
    this.handlers = {};

    // Setup the items ready for rendering
    var self = this;
    var hasSelection = false;
    n2.util.each(config.groups, function(index, group) {
        // Check required config of the group
        n2.util.checkRequiredConfig(group, ['items.label'], 'group[' + index + ']');
        var result = self._setupItems(group.items, 1, index, -1, hasSelection);
        hasSelection = hasSelection || result.anyChildSelected;
        group.groupIndex = index;
    });
    // After processing the groups, if nothing has been selected, ensure the first item is given focus
    if (config.groups.length > 0 && config.groups[0].items.length > 0 && !hasSelection) {
        config.groups[0].items[0].focused = true;
    }

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config, {
        items: this.itemsTemplate
    });
    n2j$(config.selector).replaceWith(html);

    // Set variables for selectors
    this.selector = '#' + config.id;
};

ncsquared.ui.components.Tree.prototype._n2Type = 'tree';

ncsquared.ui.components.Tree.prototype._concernedKeys = [
    n2.key.KEY_ENTER,
    n2.key.KEY_SPACE,
    n2.key.KEY_UP,
    n2.key.KEY_DOWN,
    n2.key.KEY_LEFT,
    n2.key.KEY_RIGHT
];

ncsquared.ui.components.Tree.prototype.bodyTemplate = '<div class="slds-tree_container slds-scrollable_y n2__component n2__tree{{#multiselect}} n2__tree-multi-select{{/multiselect}}{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#groups}}' +
    '{{#heading}}<h4 class="slds-text-title_caps" id="{{id}}_tree_group-{{groupIndex}}-heading">{{heading}}</h4>{{/heading}}' +
    '<ul class="slds-tree" role="tree" aria-labelledby="{{id}}_tree_group-{{groupIndex}}-heading">' +
    '{{> items}}' +
    '</ul>' +
    '{{/groups}}' +
    '</div>';

ncsquared.ui.components.Tree.prototype.itemsTemplate = '{{#items}}' +
    '<li{{#focused}} tabindex="0"{{/focused}}{{#selected}} aria-selected="true"{{/selected}} role="treeitem" aria-level="{{level}}"{{#hasItems}} aria-expanded="{{expanded}}"{{/hasItems}} ' +
    'class="n2__tree-item {{#hasItems}}n2__tree-item-parent{{/hasItems}}{{^hasItems}}n2__tree-item-leaf{{/hasItems}}{{#disabled}} n2__tree-item-disabled{{/disabled}}" id="{{id}}_tree_group-{{groupIndex}}-item-{{runningIndex}}" data-key="{{groupIndex}}-{{runningIndex}}">' +
    '<div class="slds-tree__item">' +
    '<button tabindex="-1" title="Expand {{label}}" class="slds-button slds-button_icon slds-m-right_x-small{{^hasItems}} slds-is-disabled{{/hasItems}}" aria-hidden="true">' +
    '<svg class="slds-button__icon slds-button__icon_small" aria-hidden="true">' +
    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#chevronright" />' +
    '</svg>' +
    '<span class="slds-assistive-text">Expand {{label}}</span>' +
    '</button>' +
    '<span class="slds-has-flexi-truncate">' +
    '<span title="{{label}}" class="slds-tree__item-label slds-truncate">{{label}}</span>' +
    '</span>' +
    '</div>' +
    '{{#hasItems}}<ul role="group">' +
    '{{> items}}' +
    '</ul>{{/hasItems}}' +
    '</li>' +
    '{{/items}}';

ncsquared.ui.components.Tree.prototype.init = function() {
    var ctrlDown = false;
    n2j$(document)
        // Keep track of the ctrl pressed state
        .on('keydown', function(event) {
            if (!ctrlDown && event.which === n2.key.KEY_CTRL) {
                ctrlDown = true;
            }
        })
        .on('keyup', function(event) {
            if (ctrlDown && event.which === n2.key.KEY_CTRL) {
                ctrlDown = false;
            }
        })
        // When clicking on an expandable item, switch the expanded flag
        .on('click', 'div.n2__tree li.n2__tree-item-parent', function(event) {
            var item = n2j$(this);
            item.closest('ul.slds-tree').find('li.n2__tree-item').attr('tabindex', null);
            item.attr('aria-expanded', item.attr('aria-expanded') === 'true' ? 'false' : 'true').attr('tabindex', '0');

            // Prevent the click from bubbling up to container nodes
            event.preventDefault();
            event.stopImmediatePropagation();
        })
        // When clicking on an item, de-select everything else, select or de-select it depending on if it was already selected and trigger an event
        .on('click', 'div.n2__tree li.n2__tree-item-leaf', function(event) {
            var item = n2j$(this);
            n2.cm.getComponent(item.closest('div.n2__tree').attr('id'))._selectItem(item, ctrlDown);

            // Prevent the click from bubbling up to container nodes
            event.preventDefault();
            event.stopImmediatePropagation();
        })
        // Handle key presses on the nodes
        .on('keydown', 'div.n2__tree li.n2__tree-item', function(event) {
            if (ncsquared.ui.components.Tree.prototype._concernedKeys.indexOf(event.which) !== -1) {
                var item = n2j$(this);
                var container = item.closest('div.n2__tree');
                switch (event.which) {
                    case n2.key.KEY_ENTER:
                        // If we are on a leaf node fire the action
                        if (item.hasClass('n2__tree-item-leaf')) {
                            n2.cm.getComponent(container.attr('id'))._fireAction(item.attr('data-key'), item.attr('aria-selected') === 'true');
                        }
                        break;
                    case n2.key.KEY_SPACE:
                        // If we are on a leaf node select the item
                        if (item.hasClass('n2__tree-item-leaf')) {
                            n2.cm.getComponent(container.attr('id'))._selectItem(item, ctrlDown);
                        }
                        break;
                    case n2.key.KEY_DOWN:
                        // Move down to the next item
                        n2.cm.getComponent(container.attr('id'))._moveDown(item, ctrlDown);
                        break;
                    case n2.key.KEY_UP:
                        // Move up to the previous item
                        n2.cm.getComponent(container.attr('id'))._moveUp(item, ctrlDown);
                        break;
                    case n2.key.KEY_LEFT:
                        if (item.hasClass('n2__tree-item-parent') && item.attr('aria-expanded') === 'true') {
                            // If we are a parent and expanded, collapse
                            item.attr('aria-expanded', 'false');
                        } else {
                            // Otherwise find the nearest parent and collapse the node, moving to that item
                            var parent = item.parent().closest('li.n2__tree-item-parent');
                            if (parent.length > 0 && parent.attr('aria-expanded') === 'true') {
                                parent.attr('aria-expanded', 'false');
                                n2.cm.getComponent(container.attr('id'))._selectItem(parent, ctrlDown, true);
                            }
                        }
                        break;
                    case n2.key.KEY_RIGHT:
                        // If we are collapsed, expand the node and move down to the next item
                        if (item.attr('aria-expanded') === 'false') {
                            item.attr('aria-expanded', 'true');
                            n2.cm.getComponent(container.attr('id'))._moveDown(item, ctrlDown);
                        }
                        break;
                }

                // Prevent the key press from bubbling up
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
};

/**
 * Destroys the component and removes it from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.components.Tree.prototype.destroy = function() {
    n2j$(this.selector).remove();
};

/**
 * Gives focus to the first or previously focused tree item. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.components.Tree.prototype.focus = function() {
    n2j$(this.selector + ' li.n2__tree-item[tabindex="0"]').focus();
    return true;
};

ncsquared.ui.components.Tree.prototype._setupItems = function(items, level, groupIndex, runningIndex, hasSelection) {
    var self = this;
    var anyChildSelected = false;
    // Loop through the items setting the index, level and runningIndex on each item
    n2.util.each(items, function(index, item) {
        item.index = index;
        item.level = level;
        runningIndex += 1;
        item.runningIndex = runningIndex;

        // If there are sub items, setup those items as well
        if (item.hasOwnProperty('items')) {
            var result = self._setupItems(item.items, level + 1, groupIndex, item.runningIndex, hasSelection || anyChildSelected);
            runningIndex = result.runningIndex;
            // If a child item was selected keep track of it as any parents will need expanding
            anyChildSelected = result.anyChildSelected || anyChildSelected;
            // Mark item to be expanded if config says so or if a child was selected
            item.expanded = item.expanded || result.anyChildSelected;
            // Mark that we have items and set selected and disabled to false as parents can't be selected
            item.hasItems = true;
            item.selected = false;
            item.disabled = false;
        } else {
            // If there are no items, mark that is the case
            item.hasItems = false;
            // Register any action with the handlers against this items key
            if (n2.util.isFunction(item.action)) {
                self.handlers[groupIndex + '-' + item.runningIndex] = item.action;
            }
        }
        // Delete the action property as it's not neede
        delete item.action;

        // If this item should be selected..
        if (item.selected) {
            if (!self.multiselect && (hasSelection || anyChildSelected)) {
                // If multi-select is disabled and either we already have a sibling/parent selection, or a child selection, don't select this item
                item.selected = false;
            } else if (!hasSelection && !anyChildSelected) {
                // If there has not yet been any selections then mark this item as the one in focus and record we have had a selection
                item.focused = true;
                anyChildSelected = true;
            } else {
                // If there has been other selection just make sure we record there is a selection to return
                anyChildSelected = true;
            }
        }
    });

    return {
        anyChildSelected: anyChildSelected,
        runningIndex: runningIndex
    };
};

ncsquared.ui.components.Tree.prototype._moveDown = function(item, ctrlDown) {
    // Get all the items that are at the root or under expanded parent nodes
    var items = n2j$(this.selector + ' ul.slds-tree > li, ' + this.selector + ' li[aria-expanded="true"] > ul > li');
    // Get the current index, then move to the next if available
    var index = items.index(item);
    if (items.length > (index + 1)) {
        this._selectItem(items.eq(index + 1), ctrlDown, true);
    }
};

ncsquared.ui.components.Tree.prototype._moveUp = function(item, ctrlDown) {
    // Get all the items that are at the root or under expanded parent nodes
    var items = n2j$(this.selector + ' ul.slds-tree > li, ' + this.selector + ' li[aria-expanded="true"] > ul > li');
    // Get the current index, then move to the previous if available
    var index = items.index(item);
    if (items.length > 0 && index > 0) {
        this._selectItem(items.eq(index - 1), ctrlDown, true);
    }
};

ncsquared.ui.components.Tree.prototype._selectItem = function(item, ctrlDown, navigateOnly) {
    // Record if we are currently selected
    var wasSelected = item.attr('aria-selected') === 'true';
    // If we are enabled, not navigation only and don't have multi-select, or if we are multi-select without pressing ctrl, deselect all items, but always clear the current tabindex
    var treeItems = n2j$(this.selector + ' li.n2__tree-item');
    var isItemEnabled = !item.hasClass('n2__tree-item-disabled');
    if (isItemEnabled) {
        if ((!navigateOnly && !this.multiselect) || (!ctrlDown && this.multiselect)) {
            treeItems.attr('aria-selected', null);
        }
    }
    treeItems.attr('tabindex', null);

    // Set tabindex to current item, and if a leaf, select the item; unless we are disabled, not navigate only or multi-select without pressing ctrl in which case just tabindex changes
    item.attr('tabindex', '0');
    if (item.hasClass('n2__tree-item-leaf') && isItemEnabled && (!navigateOnly || (!ctrlDown && this.multiselect))) {
        item.attr('aria-selected', wasSelected ? null : 'true');

        // Fire the event if not navigation
        if (!navigateOnly) {
            this._fireAction(item.attr('data-key'), !wasSelected);
        }
    }

    // Focus on the item so we can continue keyboard interactions
    item.focus();
};

ncsquared.ui.components.Tree.prototype._fireAction = function(key, selected) {
    // Fire the given action if there is a handler for it
    if (this.handlers.hasOwnProperty(key)) {
        this.handlers[key](selected);
    }
};

n2.cm._registerType(ncsquared.ui.components.Tree.prototype._n2Type, ncsquared.ui.components.Tree);

/**
 * Creates a new date period picker component that allows for multiple components to be defined but only one is shown at any one time - use {@link n2.cm.addComponent} with the type <code>date-period-picker</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the date period picker component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the date period picker should be rendered, will be replaced with the HTML for the component
 * @param {string|string[]} [config.defaultValue] A default item to select
 * @param {boolean} [config.required=false] Whether or not the date period is required
 * @param {string} [config.requiredError=This field is required] An error message to display when the date period is required but no value is provided
 * @param {string[]} [config.includeFiscalPeriods=true] Set to <code>true</code> to include the fiscal periods in the list or <code>false</code> to exclude them
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Events are called in the scope of the component. Valid events are:
 * <ul><li><code>change</code>: raised when the date period picker changes, called with the argument: <code>{string} value or null if invalid</code></li>
 */
ncsquared.ui.wrappers.DatePeriodPicker = function(config) {
    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Set the default config values
    var defaultSelect;
    var defaultInput;
    if (!n2.util.isNullOrUndefined(config.defaultValue)) {
        if (config.defaultValue.indexOf(':') === -1) {
            defaultSelect = config.defaultValue;
        } else {
            var split = config.defaultValue.split(':');
            defaultSelect = split[0];
            defaultInput = split[1];
        }
    }
    var required = n2.util.getDefaultBoolean(config.required, false);
    var requiredError = config.requiredError || 'This field is required';
    var includeFiscalPeriods = n2.util.getDefaultBoolean(config.includeFiscalPeriods, true);

    // Get the data
    var data = n2.util.map(n2.const.SF.DATE_PERIODS, function(label, value) {
        return {
            label: label,
            value: value
        };
    });
    if (includeFiscalPeriods) {
        n2.util.each(n2.const.SF.DATE_PERIODS_FISCAL, function(value, label) {
            data.push({
                label: label,
                value: value
            });
        });
    }

    // Get the change handler if it was provided
    var changeHandler;
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (n2.util.isFunction(handler)) {
                if (event === 'change') {
                    changeHandler = handler;
                }
            }
        });
    }

    // Create the components
    var self = this;
    this.selectPeriod = n2.cm.addComponent('select', {
        id: config.id + '_select',
        selector: '#' + config.id + '_select',
        defaultValue: defaultSelect,
        required: required,
        requiredError: requiredError,
        data: data,
        handlers: {
            'change': function(value) {
                if (n2.util.isNullOrUndefined(value) || value.indexOf('_N_') === -1) {
                    n2j$(self.inputSelector).addClass('slds-hidden');
                } else {
                    n2j$(self.inputSelector).removeClass('slds-hidden');
                }

                // Call the change handler if provided
                if (changeHandler) {
                    changeHandler.call(self, self.getValue());
                }
            }
        },
        cls: 'slds-col slds-col_padded_right slds-size_2-of-3'
    }, true);
    this.inputPeriod = n2.cm.addComponent('input', {
        id: config.id + '_input',
        selector: '#' + config.id + '_input',
        type: 'number',
        defaultValue: defaultInput,
        required: true,
        requiredError: 'A number is required',
        validation: function(value) {
            return ncsquared.ui.wrappers.DatePeriodPicker.prototype._periodRegex.test(value) ? true : 'Needs a whole number > 0';
        },
        cls: 'slds-col slds-size_1-of-3' + (n2.util.isNullOrUndefined(defaultInput) ? ' slds-hidden' : ''),
        handlers: {
            'change': function() {
                // Call the change handler if provided
                if (changeHandler) {
                    changeHandler.call(self, self.getValue());
                }
            }
        }
    }, true);

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.inputSelector = this.selector + '_input';
};

ncsquared.ui.wrappers.DatePeriodPicker.prototype._n2Type = 'date-period-picker';

ncsquared.ui.wrappers.DatePeriodPicker.prototype._periodRegex = /^[1-9][0-9]*$/;

ncsquared.ui.wrappers.DatePeriodPicker.prototype.bodyTemplate = '<div class="slds-grid n2__component n2__date-period-picker" id="{{id}}">' +
    '<span id="{{id}}_select"></span>' +
    '<span id="{{id}}_input"></span>' +
    '</div>';

/**
 * Destroys the components and removes them from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.destroy = function() {
    // Destroy all child components then clear up our HTML
    n2.cm.destroyComponent(this.selectPeriod);
    n2.cm.destroyComponent(this.inputPeriod);
    n2j$(this.selector).remove();
};

/**
 * Will return the selected date period or null if one is required and not selected, or the period is not provided. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {string} The selected date period or null if one is required and not selected, or the period of time is not provided
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.getValue = function(skipValidation) {
    var value = n2.cm.getValue(this.selectPeriod, skipValidation);
    if (!n2.util.isNullOrUndefined(value) && !n2j$(this.inputSelector).hasClass('slds-hidden')) {
        var numValue = n2.cm.getValue(this.inputPeriod, skipValidation);
        if (n2.util.isNumber(numValue)) {
            return value + ':' + numValue;
        }
        // Return null if we need a period and one isn't provided
        return null;
    }
    return value;
};

/**
 * Will set date period picker to the given value. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string} value The value to set the date period to
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.setValue = function(value) {
    if (n2.util.isNullOrUndefined(value) || value.indexOf(':') === -1) {
        n2.cm.setValue(this.selectPeriod, value);
    } else {
        var split = value.split(':');
        n2.cm.setValue(this.selectPeriod, split[0]);
        n2.cm.setValue(this.inputPeriod, split[1]);
    }
};

/**
 * Will validate if the date period is required and one is selected and, if relevant, a period of time has been entered.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if a period of time is required it has been entered and that the selected period is not required or an item has been selected, otherwise false
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.validate = function() {
    // Validate both components
    var selectValid = n2.cm.validate(this.selectPeriod);
    var inputValid = true;
    if (!n2j$(this.inputSelector).hasClass('slds-hidden')) {
        inputValid = n2.cm.validate(this.inputPeriod);
    }
    return Boolean(selectValid && inputValid);
};

/**
 * Resets the date period picker back to its initial <config>defaultValue</config> or empty if not provided. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.reset = function() {
    // Reset both components
    n2.cm.reset(this.selectPeriod);
    n2.cm.reset(this.inputPeriod);
};

/**
 * Gives focus to the date period picker. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True that focus was given
 */
ncsquared.ui.wrappers.DatePeriodPicker.prototype.focus = function() {
    // Focus on the select component
    return n2.cm.focus(this.selectPeriod);
};

n2.cm._registerType(ncsquared.ui.wrappers.DatePeriodPicker.prototype._n2Type, ncsquared.ui.wrappers.DatePeriodPicker);

/**
 * Creates a new logic filters component that allows for multiple components to be defined but only one is shown at any one time - use {@link n2.cm.addComponent} with the type <code>logic-filters</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the logic filters component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the logic filters should be rendered, will be replaced with the HTML for the component
 * @param {string} [config.label] An optional label to display above the table
 * @param {Function} config.data A function to retrieve the logic filters data, will be called with the arguments <code>({Function} callback)</code>.
 * Once the data is retrieved the callback function should be called with <code>({Object[]} data)</code>
 * @param {Function} config.dataFieldsList A function to retrieve the options for the lists of fields, should return either an array of objects with the additional property <code>type</code> over the those needed for the {@link ncsquared.ui.components.Select}, or a promise that will resolve with the array of objects
 * @param {Function} config.dataValuesList A function to retrieve the options for the lists of values, see {@link ncsquared.ui.components.Select} <code>config.data</code> property for more information on the format of the Function.
 * Will be called with the arguments <code>({string} fieldName, {string} fieldType, {string} operator)</code>
 * @param {string[]} [config.excludedOperators] An array of the operators that should be excluded from the list
 * @param {string[]} [config.includeFiscalPeriods=true] Set to <code>true</code> to include the fiscal periods in the date period list or <code>false</code> to exclude them
 * @param {number} [config.maxRows=20] The maximum number of rows of filters that can be added
 * @param {boolean} [config.required=false] If required there must be at least one record, the user will then not be able to delete that record
 * @param {string} [config.help] A helpful message to display in a tooltip next to the label, will only appear if label is also specified
 * @param {Object.<string, Function>} [config.handlers] The event handlers for the component, the key is the event name and the value is the function that will be called. Valid events are:
 * <ul><li><code>change</code>: raised when the logic filter data changes, called with in the scope and with the arguments of the underlying component change event</li></ul>
 * @param {string} [config.cls] A string of CSS classes to apply to the root form element
 */
ncsquared.ui.wrappers.LogicFilters = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['data:function', 'dataFieldsList:function', 'dataValuesList:function']);

    // Set the default config values
    config.includeFiscalPeriods = n2.util.getDefaultBoolean(config.includeFiscalPeriods, true);
    config.maxRows = n2.util.isNumber(config.maxRows) ? config.maxRows : 20;
    config.required = n2.util.getDefaultBoolean(config.required, false);

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Create the HTML for the delete icon
    var deleteIcon = n2.ui.renderTemplate(this.deleteTemplate);

    // Wrap the fields service in our own function so that we can get the field to data types map, cache the result until refresh/reset so it isn't continually called
    var self = this;
    var originalDataFieldsList = config.dataFieldsList;
    this.fieldsListResponse = null;
    config.dataFieldsList = function() {
        if (n2.util.isNullOrUndefined(self.fieldsListResponse)) {
            self.fieldsListResponse = originalDataFieldsList.call(self);
            self.fieldsAndTypes = {};
            if (n2.util.isPromise(self.fieldsListResponse)) {
                // If a promise was returned, return a promise to a new select data function, resolved after we process the fields
                self.fieldsListResponse.done(function(response) {
                    n2.util.each(response, function(index, field) {
                        self.fieldsAndTypes[field.value] = field.type;
                    });
                });
            } else {
                n2.util.each(self.fieldsListResponse, function(index, field) {
                    self.fieldsAndTypes[field.value] = field.type;
                });
            }
        }
        return self.fieldsListResponse;
    };

    // Set other variables to use later
    this.required = config.required;
    this.maxRows = config.maxRows;

    // Set variables for selectors
    this.selector = '#' + config.id;
    this.inputLogicWrapperSelector = this.selector + '_input-logic-wrapper';

    // Store the change handler if it was provided, keep track of in refresh so that we don't trigger change during initial population
    var changeHandler;
    this._inRefresh = false;
    if (config.handlers) {
        n2.util.each(config.handlers, function(event, handler) {
            if (n2.util.isFunction(handler)) {
                if (event === 'change') {
                    changeHandler = function(value) {
                        if (!self._inRefresh) {
                            handler.call(this, value);
                        }
                    };
                }
            }
        });
    }

    // Create the components
    // If we're allowing more than one row, add the logic box, do this first so that we can set the value if needed
    if (config.maxRows > 1) {
        this.inputLogic = n2.cm.addComponent('input', {
            id: config.id + '_input-logic',
            selector: '#' + config.id + '_input-logic',
            label: 'Filter logic',
            validation: function(value) {
                // Only validate if our data table has been created, we'll call validate later if it hasn't
                if (!n2.util.isNullOrUndefined(self.dataTableFilter)) {
                    return self._validateLogic(value, self.dataTableFilter.getRowCount());
                }
                return true;
            },
            help: 'Determine how the filter rows should be grouped using AND, OR and parenthesis \'(\' \')\'. By default all rows will be grouped using AND so if you want all rows to be required then you do not need filter logic.',
            cls: 'slds-size_1-of-1 slds-large-size_2-of-3 slds-x-large-size_1-of-2',
            handlers: {
                'change': changeHandler
            }
        }, true);
    }
    this.dataTableFilter = n2.cm.addComponent('data-table', {
        id: config.id + '_table',
        selector: '#' + config.id + '_table',
        paging: false,
        rowNumbers: true,
        columns: [{
            name: 'name',
            title: 'Field',
            sortable: false,
            component: {
                type: 'select',
                config: {
                    required: true,
                    data: config.dataFieldsList,
                    handlers: {
                        'change': function(value) {
                            // When field changes, set the value of the hidden type
                            n2.cm.setValue(n2.cm.getTableComponentOnRow(this, 1), self.fieldsAndTypes[value]);
                            // Set the operator to empty so that nothing is selected and then refresh the data to get the operators for the new field
                            var operator = n2.cm.getTableComponentOnRow(this, 2);
                            n2.cm.setValue(operator, '', false);
                            self._doRefresh(operator, true);
                            // Hide the value components as the operator won't be selected but it doesn't trigger the change event
                            n2.cm.getTableComponentOnRow(this, 3).hideComponents();

                            // Call the change handler if provided
                            if (changeHandler) {
                                changeHandler.call(this, value);
                            }
                        },
                        'load': function(value) {
                            // When field is loaded, set the value of the hidden type and refresh the operators to get them for a selected field (if one is already selected)
                            n2.cm.setValue(n2.cm.getTableComponentOnRow(this, 1), self.fieldsAndTypes[value]);
                            self._doRefresh(n2.cm.getTableComponentOnRow(this, 2));
                        }
                    }
                }
            }
        }, {
            name: 'type',
            title: '',
            sortable: false,
            width: '0',
            component: {
                type: 'select',
                config: {
                    required: true,
                    data: n2.const.SF.FIELDS_TYPES,
                    cls: 'slds-hide'
                }
            }
        }, {
            name: 'op',
            title: 'Operator',
            sortable: false,
            component: {
                type: 'select',
                config: {
                    required: true,
                    sort: false,
                    data: function() {
                        // Get the operators for the selected field
                        var type = self.fieldsAndTypes[n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 0), true)];
                        return n2.sf.util.getOperatorsForFieldType(type, config.excludedOperators);
                    },
                    handlers: {
                        'change': function(value) {
                            // When operator changes, if we have a value show the appropriate value component, otherwise hide them
                            var switchable = n2.cm.getTableComponentOnRow(this, 3);
                            var type = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 1), true);
                            self._showSwitchableComponent(switchable, self._determineSwitchableComponent(value, type), true);

                            // Call the change handler if provided
                            if (changeHandler) {
                                changeHandler.call(this, value);
                            }
                        },
                        'load': function(value) {
                            // When operator first load, if we have a value show the appropriate value component, otherwise hide them
                            var switchable = n2.cm.getTableComponentOnRow(this, 3);
                            var type = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 1), true);
                            self._showSwitchableComponent(switchable, self._determineSwitchableComponent(value, type), false);
                        }
                    }
                }
            }
        }, {
            name: 'val',
            title: 'Value',
            sortable: false,
            component: {
                type: 'switchable',
                config: {
                    defaultShown: function() {
                        // Find out what component should be shown by default from the type and operator
                        var type = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 1), true);
                        var operator = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 2), true);
                        return self._determineSwitchableComponent(operator, type);
                    },
                    components: [{
                        type: 'select',
                        config: {
                            required: true,
                            data: [{
                                label: 'False',
                                value: 'false'
                            }, {
                                label: 'True',
                                value: 'true'
                            }],
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'input',
                        config: {
                            cls: 'n2__required-padding',
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'input',
                        config: {
                            required: true,
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'input',
                        config: {
                            type: 'number',
                            cls: 'n2__required-padding',
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'input',
                        config: {
                            type: 'number',
                            required: true,
                            requiredError: 'This field is required as a number',
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'select',
                        config: {
                            data: function() {
                                var fieldName = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 0), true);
                                var fieldType = self.fieldsAndTypes[fieldName];
                                var operator = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 2), true);
                                return config.dataValuesList(fieldName, fieldType, operator);
                            },
                            cls: 'n2__required-padding',
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'select',
                        config: {
                            required: true,
                            multiselect: true,
                            data: function() {
                                var fieldName = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 0), true);
                                var fieldType = self.fieldsAndTypes[fieldName];
                                var operator = n2.cm.getValue(n2.cm.getTableComponentOnRow(this, 2), true);
                                return config.dataValuesList(fieldName, fieldType, operator);
                            },
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'date-period-picker',
                        config: {
                            includeFiscalPeriods: config.includeFiscalPeriods,
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'date-period-picker',
                        config: {
                            required: true,
                            includeFiscalPeriods: config.includeFiscalPeriods,
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }, {
                        type: 'pill-list',
                        config: {
                            required: true,
                            handlers: {
                                'change': changeHandler
                            }
                        }
                    }]
                }
            }
        }, {
            name: '',
            title: '',
            sortable: false,
            format: function() {
                return deleteIcon;
            },
            formatTooltip: function() {
                return 'Delete filter';
            },
            html: true,
            width: '3rem',
            action: function(id, rowNumber) {
                self.dataTableFilter.removeRow(rowNumber);
                self._checkRowCount();
                self._updateLogicInput(false, rowNumber);

                // Call the change handler if provided
                if (changeHandler) {
                    changeHandler.call(self.dataTableFilter);
                }
            }
        }],
        data: function() {
            var callback = arguments[4];
            config.data(function(resolvedData) {
                // Check data is as per required
                n2.util.checkRequiredConfig(resolvedData, ['filters:array']);

                // Remove any rows over the maximum
                var filters = resolvedData.filters;
                if (filters.length > config.maxRows) {
                    filters.splice(config.maxRows);
                } else if (filters.length === 0 && config.required) {
                    // If we're required and have no data, add an empty one
                    filters.push({});
                }
                callback(filters);

                // Load the logic string if there is one
                if (!n2.util.isNullOrUndefined(resolvedData.logic) && config.maxRows > 1) {
                    self.inputLogic.setValue(resolvedData.logic);
                }

                // Enable or disable the add button, this will be skipped if the table is not yet constructed
                self._checkRowCount();
            });
        },
        cls: 'n2__logic-filters slds-no-row-hover' + (config.required ? ' n2__logic-filters-required' : '')
    }, true);

    // If we're not required or allowing more than one row, show the add button
    if (!config.required || config.maxRows > 1) {
        this.btnAdd = n2.cm.addComponent('button', {
            id: config.id + '_btn-add',
            selector: '#' + config.id + '_btn-add',
            text: 'Add Filter Row',
            disabled: true,
            handlers: {
                'click': function() {
                    // Add an empty row and focus on the first component
                    self.dataTableFilter.addRow({});
                    var rowCount = self.dataTableFilter.getRowCount();
                    var components = self.dataTableFilter.getComponentsOnRow(rowCount);
                    if (components.length > 0) {
                        n2.cm.focus(components[0]);
                    }
                    self._checkRowCount();
                    self._updateLogicInput(true, rowCount);

                    // Call the change handler if provided
                    if (changeHandler) {
                        changeHandler.call(this);
                    }
                }
            }
        }, true);

        // Enable or disable the add button, if the data is returned later it will also be updated then
        this._checkRowCount();
    }

    // If we have logic validate it now, if the data is returned later it will also be updated then
    if (config.maxRows > 1) {
        this.inputLogic.validate();
    }
};

ncsquared.ui.wrappers.LogicFilters.prototype._n2Type = 'logic-filters';

ncsquared.ui.wrappers.LogicFilters.prototype._toggleTypes = /^BOOLEAN$/;
ncsquared.ui.wrappers.LogicFilters.prototype._numberTypes = /^DOUBLE$|^CURRENCY$|^PERCENT$|^INTEGER$/;
ncsquared.ui.wrappers.LogicFilters.prototype._pickerTypes = /^PICKLIST$|^REFERENCE$/;
ncsquared.ui.wrappers.LogicFilters.prototype._multiPickerTypes = /^MULTIPICKLIST$/;
ncsquared.ui.wrappers.LogicFilters.prototype._dateTypes = /^DATE$|^DATETIME$/;

ncsquared.ui.wrappers.LogicFilters.prototype._equalOperators = /^equals$|^not equal$/;

ncsquared.ui.wrappers.LogicFilters.prototype._componentBoolean = 1;
ncsquared.ui.wrappers.LogicFilters.prototype._componentText = 2;
ncsquared.ui.wrappers.LogicFilters.prototype._componentTextRequired = 3;
ncsquared.ui.wrappers.LogicFilters.prototype._componentNumber = 4;
ncsquared.ui.wrappers.LogicFilters.prototype._componentNumberRequired = 5;
ncsquared.ui.wrappers.LogicFilters.prototype._componentSingleSelect = 6;
ncsquared.ui.wrappers.LogicFilters.prototype._componentMultiSelect = 7;
ncsquared.ui.wrappers.LogicFilters.prototype._componentDate = 8;
ncsquared.ui.wrappers.LogicFilters.prototype._componentDateRequired = 9;
ncsquared.ui.wrappers.LogicFilters.prototype._componentPills = 10;

ncsquared.ui.wrappers.LogicFilters.prototype._wordRegex = /\b/;

ncsquared.ui.wrappers.LogicFilters.prototype._spaceRegex = /\s/g;

ncsquared.ui.wrappers.LogicFilters.prototype._joinRegex = /^and$|^or$/i;

ncsquared.ui.wrappers.LogicFilters.prototype._openBracketRegex = /^\(+$/g;

ncsquared.ui.wrappers.LogicFilters.prototype._closeBracketRegex = /^\)+$/g;

ncsquared.ui.wrappers.LogicFilters.prototype.bodyTemplate = '<div class="slds-form-element__group n2__component{{#cls}} {{cls}}{{/cls}}" id="{{id}}">' +
    '{{#label}}<label class="slds-form-element__label" for="{{id}}_table">{{#required}}<abbr title="Required" class="slds-required">*</abbr> {{/required}}{{label}}</label>' +
    ncsquared.ui.Help.triggerTemplate +
    '{{/label}}' +
    '<div class="slds-form-element__row">' +
    '<span id="{{id}}_table"></span>' +
    '</div>' +
    '<div class="slds-form-element__row slds-m-top_small">' +
    '<span id="{{id}}_btn-add"></span>' +
    '</div>' +
    '<div class="slds-form-element__row slds-m-top_small" id="{{id}}_input-logic-wrapper">' +
    '<span id="{{id}}_input-logic"></span>' +
    '</div>' +
    ncsquared.ui.Help.popupTemplate +
    '</div>';

ncsquared.ui.wrappers.LogicFilters.prototype.deleteTemplate = '<svg class="slds-icon slds-icon_x-small slds-icon-text-error"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" /></svg>';

/**
 * Destroys the components and removes them from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.wrappers.LogicFilters.prototype.destroy = function() {
    // Destroy all child components then clear up our HTML
    n2.cm.destroyComponent(this.dataTableFilter);
    n2.cm.destroyComponent(this.btnAdd);
    n2j$(this.selector).remove();
};

/**
 * Will return the filter values and associated logic value or null if any validation has failed. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {Object} The selected filters and logic
 * @returns {string} <code>logic</code> If more than one row can be added then the value of the logic field
 * @returns {Object} <code>filters</code> The selected filters
 * @returns {string} <code>filters.name</code> The name of the field in the filter
 * @returns {string} <code>filters.type</code> The type of the field in the filter
 * @returns {string} <code>filters.op</code> The operator selected for the filter
 * @returns {string} <code>filters.val</code> The value add for the filter
 */
ncsquared.ui.wrappers.LogicFilters.prototype.getValue = function() {
    // If required and we have no rows return null
    if (this.required && this.dataTableFilter.getRowCount() === 0) {
        return null;
    }

    // Get the value from the table, and depending on max rows, include the logic
    var filters = n2.cm.getValue(this.dataTableFilter);
    // Look for value arrays and instead return delimeted string, also remove the key field as it's not needed
    if (!n2.util.isNullOrUndefined(filters)) {
        n2.util.each(filters, function(index, filter) {
            delete filter.key;
            if (n2.util.isArray(filter.val)) {
                filter.val = filter.val.join(';');
            }
        });

        var result = {
            filters: filters
        };
        // If we have logic, add that to the response
        if (this.maxRows > 1) {
            result.logic = n2.cm.getValue(this.inputLogic);
        }
        return result;
    }
    return null;
};

/**
 * Will validate if required there is at least one row and that all the components within the filters are valid.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if it is not required or at least one row has been added and that all components within the filters are valid, otherwise false
 */
ncsquared.ui.wrappers.LogicFilters.prototype.validate = function() {
    if (this.required && this.dataTableFilter.getRowCount() === 0) {
        return false;
    }
    return n2.cm.validate(this.dataTableFilter);
};

/**
 * Resets the filters and logic by calling the data method again. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.wrappers.LogicFilters.prototype.reset = function() {
    // Remove the cached fields list and reset the table, which will cause the logic text to be updated
    this.fieldsListResponse = null;
    n2.cm.reset(this.dataTableFilter);
};

/**
 * Refreshes the filters and logic by calling the data method again. Use {@link n2.cm.refresh} instead of this method directly
 */
ncsquared.ui.wrappers.LogicFilters.prototype.refresh = function() {
    // Remove the cached fields list and refresh the table, which will cause the logic text to be updated
    this.fieldsListResponse = null;
    n2.cm.refresh(this.dataTableFilter);
};

/**
 * Gives focus to the first component on the last row. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True if focus was given, otherwise false
 */
ncsquared.ui.wrappers.LogicFilters.prototype.focus = function() {
    // Focus on the first component in the last row
    var components = this.dataTableFilter.getComponentsOnRow(this.dataTableFilter.getRowCount());
    if (components && components.length > 0) {
        return n2.cm.focus(components[0]);
    }
    return false;
};

/**
 * Checks whether or not the add row button should be enabled or disabled, and the input logic hidden,
 * based on the number of rows
 *
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._checkRowCount = function() {
    // Check if the add rows button should be enabled
    if (!n2.util.isNullOrUndefined(this.dataTableFilter) && !n2.util.isNullOrUndefined(this.btnAdd)) {
        var rowCount = this.dataTableFilter.getRowCount();
        if (rowCount >= this.maxRows) {
            this.btnAdd.disable();
        } else {
            this.btnAdd.enable();
        }

        // Show or hide the logic input based on the row count
        if (this.maxRows > 1) {
            if (rowCount > 1) {
                n2j$(this.inputLogicWrapperSelector).removeClass('slds-hide');
            } else {
                n2j$(this.inputLogicWrapperSelector).addClass('slds-hide');
            }
        }
    }
};

/**
 * Updates the logic input when a row is either added or removed
 *
 * @param {Boolean} addition True if this is adding rows, false if removing them
 * @param {Number} rowNumber The number of the row that is being added or removed
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._updateLogicInput = function(addition, rowNumber) {
    if (this.maxRows > 1) {
        var currentLogic = this.inputLogic.getValue(true);
        // Only need to update the logic if we currently have a value or if this is our first row
        if (currentLogic.length > 0 || (addition && rowNumber === 1)) {
            // Get the updated logic and update the input with the new value
            var updatedLogic = this._getUpdatedLogic(currentLogic, addition, rowNumber);
            this.inputLogic.setValue(updatedLogic);
        }
    }
};

/**
 * Updates the provided logic when a row is either added or removed
 *
 * @param {String} currentLogic The existing logic to be updated
 * @param {Boolean} addition True if this is adding rows, false if removing them
 * @param {Number} rowNumber The number of the row that is being added or removed
 * @returns {String} The updated logic with the provided row included or removed
 *
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._getUpdatedLogic = function(currentLogic, addition, rowNumber) {
    if (addition) {
        // For an addition, append row to the end with an AND, unless this is our first row
        currentLogic += (currentLogic.trim().length === 0 ? '' : ' AND ') + rowNumber;
    } else {
        // For a removal, split the logic by words and remove any spaces
        var logicParts = currentLogic.split(ncsquared.ui.wrappers.LogicFilters.prototype._wordRegex);
        var spaceRegex = ncsquared.ui.wrappers.LogicFilters.prototype._spaceRegex;
        logicParts = n2.util.map(logicParts, function(part) {
            part = part.replace(spaceRegex, '');
            if (part.length > 0) {
                return part;
            }
        });

        // Update the logic parts with the necessary changes
        logicParts = ncsquared.ui.wrappers.LogicFilters.prototype._updateLogicParts(logicParts, rowNumber);

        // Clean the updated logic parts
        logicParts = ncsquared.ui.wrappers.LogicFilters.prototype._cleanUpdatedLogicParts(logicParts, rowNumber);

        // Join remaining parts together and remove extra spaces around branckets
        currentLogic = logicParts.join(' ').replace('( ', '(').replace(' )', ')');
    }

    return currentLogic;
};

/**
 * Updates and returns the provided array of logic parts when a row is removed
 *
 * @param {String[]} logicParts The array of logic parts to be updated
 * @param {Number} rowNumber The number of the row that is being removed
 * @returns {String[]} The updated logic parts
 *
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._updateLogicParts = function(logicParts, rowNumber) {
    // Get the index of our current row then work out what to do with it
    var index = logicParts.indexOf(String(rowNumber));
    var joinRegex = ncsquared.ui.wrappers.LogicFilters.prototype._joinRegex;
    if (index === 0) {
        if (logicParts.length === 1) {
            // First and only condition
            logicParts = [];
        } else if (joinRegex.test(logicParts[index + 1])) {
            // First condition with join after
            logicParts.splice(index, 2);
        } else {
            // First condition but can't find join
            logicParts.splice(index, 1);
        }
    } else if (index > 0) {
        if (logicParts.length > (index + 1) && joinRegex.test(logicParts[index + 1])) {
            // Condition with join after
            logicParts.splice(index, 2);
        } else if (joinRegex.test(logicParts[index - 1])) {
            // Condition with join before
            logicParts.splice(index - 1, 2);
        } else {
            // Condition but can't find join
            logicParts.splice(index, 1);
        }
    }
    return logicParts;
};

/**
 * Returns a cleansed version of the provided array of logic parts when a row is removed, removing
 * any unnecessary brackets and updating the remaining numbers
 *
 * @param {String[]} logicParts The array of logic parts to be updated
 * @param {Number} rowNumber The number of the row that has been removed
 * @returns {String[]} The cleansed logic parts
 *
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._cleanUpdatedLogicParts = function(logicParts, rowNumber) {
    // Clean up the logic, removing unnecessary brackets and updating numbers
    var indexToRemove = null;
    return n2.util.map(logicParts, function(part, index) {
        if (indexToRemove === index) {
            // Remove closing bracked when ready
            indexToRemove = null;
            return null;
        }
        if (n2.util.isNumber(part) && Number(part) > rowNumber) {
            // Update numbers after our current row to new row numbers
            return String(Number(part) - 1);
        } else if (part === '(' && logicParts.length > (index + 2) && logicParts[index + 2] === ')') {
            // Remove brackets around single numbers
            indexToRemove = index + 2;
            return null;
        }
        return part;
    });
};

/**
 * Validates that the given logic matches the required criteria for logic
 *
 * @param {String} value The logic value to validate
 * @param {Number} rowCount The current row count of the filters table
 * @returns {Boolean|String} True if the logic is valid or the error string to display in the input control
 *
 * @private
 */
ncsquared.ui.wrappers.LogicFilters.prototype._validateLogic = function(value, rowCount) {
    // Only validate if we have a value
    if (value.length > 0) {
        var logicParts = value.split(ncsquared.ui.wrappers.LogicFilters.prototype._wordRegex);
        var bracketCount = 0;
        var rows = {};
        for (var i = 1; i <= rowCount; i++) {
            rows[String(i)] = {};
        }
        var expectRow = true;
        var expectJoin = false;
        var spaceRegex = ncsquared.ui.wrappers.LogicFilters.prototype._spaceRegex;
        var joinRegex = ncsquared.ui.wrappers.LogicFilters.prototype._joinRegex;
        var openBracketRegex = ncsquared.ui.wrappers.LogicFilters.prototype._openBracketRegex;
        var closeBracketRegex = ncsquared.ui.wrappers.LogicFilters.prototype._closeBracketRegex;
        var unexpectedWord = false;
        var rowNumberInvalid = false;

        n2.util.each(logicParts, function(index, part) {
            // Get rid of all spaces
            part = part.replace(spaceRegex, '');
            if (part.length > 0) {
                if (openBracketRegex.test(part)) {
                    // Increase the open bracket count
                    bracketCount = bracketCount + part.length;
                } else if (closeBracketRegex.test(part)) {
                    // Decrease the open bracket count
                    bracketCount = bracketCount - part.length;
                } else if (expectRow && n2.util.isNumber(part)) {
                    // If we're expecting a row check we have a number then mark that we're expecting a join
                    expectRow = false;
                    expectJoin = true;
                    // Check the number is valid
                    if (Number(part) > rowCount || Number(part) <= 0) {
                        rowNumberInvalid = part;
                        return false;
                    }
                    delete rows[part];
                } else if (expectJoin && joinRegex.test(part)) {
                    // If we're expected a join check we are one then mark that we're expecting a row number
                    expectRow = true;
                    expectJoin = false;
                } else {
                    // Otherwise it is unexpected
                    unexpectedWord = true;
                    return false;
                }
            }
        });

        // Return any errors
        var rowKeys;
        if (unexpectedWord || expectRow) {
            return 'The filter logic must contain the filter condition row numbers separated by either an \'AND\' or an \'OR\'';
        } else if (rowNumberInvalid !== false) {
            return 'The filter logic contains the filter condition ' + rowNumberInvalid + ' which is not one of the condition row numbers';
        } else if ((rowKeys = Object.keys(rows)).length > 0) {
            return 'All filter condition row numbers must be included in the filter logic: ' + rowKeys.join(', ') + (rowKeys.length === 1 ? ' is' : ' are') + ' missing';
        } else if (bracketCount !== 0) {
            return 'There is a mismatch between the number of opening and closing parenthesis';
        }
    }
    return true;
};

ncsquared.ui.wrappers.LogicFilters.prototype._determineSwitchableComponent = function(operator, type) {
    if (n2.util.isNullOrUndefined(operator)) {
        return 0;
    }
    if (this._toggleTypes.test(type)) {
        return this._componentBoolean;
    } else if (this._numberTypes.test(type)) {
        return this._equalOperators.test(operator) ? this._componentNumber : this._componentNumberRequired;
    } else if (this._pickerTypes.test(type)) {
        if (operator === 'in') {
            return this._componentMultiSelect;
        } else {
            return this._componentSingleSelect;
        }
    } else if (this._multiPickerTypes.test(type)) {
        return this._componentMultiSelect;
    } else if (this._dateTypes.test(type)) {
        return this._equalOperators.test(operator) ? this._componentDate : this._componentDateRequired;
    } else if (operator === 'in') {
        return this._componentPills;
    } else if (this._equalOperators.test(operator)) {
        return this._componentText;
    }
    return this._componentTextRequired;
};

ncsquared.ui.wrappers.LogicFilters.prototype._showSwitchableComponent = function(switchable, component, keepCurrent) {
    if (!n2.util.isNullOrUndefined(switchable)) {
        if (component === 0) {
            switchable.hideComponents();
        } else {
            switchable.showComponent(component);
            this._doRefresh(switchable, keepCurrent);
        }
    }
};

ncsquared.ui.wrappers.LogicFilters.prototype._doRefresh = function(component, keepCurrent) {
    var inRefresh = this._inRefresh;
    this._inRefresh = true;
    n2.cm.refresh(component, keepCurrent);
    this._inRefresh = inRefresh;
};

n2.cm._registerType(ncsquared.ui.wrappers.LogicFilters.prototype._n2Type, ncsquared.ui.wrappers.LogicFilters);

/**
 * Creates a new switchable component that allows for multiple components to be defined but only one is shown at any one time - use {@link n2.cm.addComponent} with the type <code>switchable</code> to add the component to the page
 *
 * @constructor
 * @param {Object} config Configuration for the switchable component
 * @param {string} config.id The ID of the component
 * @param {string} config.selector The selector where the switchable should be rendered, will be replaced with the HTML for the component
 * @param {Object[]} config.components The components that form part of the switchable
 * @param {string} config.components[].type The type of the component
 * @param {Object} config.components[].config The configuration of the component to create, <code>id</code> and <code>selector</code> will automatically be added so aren't needed
 * @param {number|Function} [config.defaultShown] The number of the component (one-based) that should be shown by default, or a Function that takes no arguments and returns the number. Function will be called in the scope of the component.
 * @param {*} [config.defaultValue] The default value for the component that is shown by default
 * @param {string} [config.defaultValueDelimiter=;] The delimiter that is used to split the <code>defaultValue</code> for known components that accept arrays
 */
ncsquared.ui.wrappers.Switchable = function(config) {
    // Check required config
    n2.util.checkRequiredConfig(config, ['components', 'components.type', 'components.config']);

    // Set the default config values
    this.currentIndex = -1;
    if (n2.util.isNumber(config.defaultShown)) {
        this.currentIndex = config.defaultShown - 1;
    } else if (n2.util.isFunction(config.defaultShown)) {
        var result = config.defaultShown.call(this);
        if (n2.util.isNumber(result)) {
            this.currentIndex = result - 1;
        }
    }
    if (this.currentIndex >= 0 && (this.currentIndex + 1) > config.components.length) {
        this.currentIndex = -1;
    }
    config.defaultValueDelimiter = config.defaultValueDelimiter || ';';

    // Get the components and add the ids and selectors, working out which one should be shown
    var self = this;
    var componentsToAdd = [];
    config.placeholders = [];
    n2.util.each(config.components, function(index, component) {
        component.config.id = config.id + '-' + index;
        component.config.selector = '#' + config.id + '-' + index + '-component';

        // If we don't have a default value on the component config, use the one from the main config
        if (n2.util.isNullOrUndefined(component.config.defaultValue) && !n2.util.isNullOrUndefined(config.defaultValue)) {
            // If we know the defaultValue should be an array, check it is
            if (!n2.util.isArray(config.defaultValue) && (component.type === 'pill-list' || component.config.multiselect === true)) {
                component.config.defaultValue = config.defaultValue.split(config.defaultValueDelimiter);
            } else {
                component.config.defaultValue = config.defaultValue;
            }
        }
        componentsToAdd.push(component);

        // Add the id to the placeholders for rendering the HTML
        config.placeholders.push({
            id: component.config.id,
            shown: self.currentIndex === index
        });
    });
    delete config.components;

    // Create the HTML and replace the existing element
    var html = n2.ui.renderTemplate(this.bodyTemplate, config);
    n2j$(config.selector).replaceWith(html);

    // Create the components
    this.components = [];
    n2.util.each(componentsToAdd, function(index, component) {
        self.components.push(n2.cm.addComponent(component.type, component.config, true));
    });

    // Set variables for selectors
    this.selector = '#' + config.id;
};

ncsquared.ui.wrappers.Switchable.prototype._n2Type = 'switchable';

ncsquared.ui.wrappers.Switchable.prototype.bodyTemplate = '<div class="n2__component n2__switchable" id="{{id}}">' +
    '{{#placeholders}}<div id="{{id}}-wrapper" class="n2__switchable-wrapper{{^shown}} slds-hide{{/shown}}"><div id="{{id}}-component"></div></div>{{/placeholders}}' +
    '</div>';

/**
 * Destroys the components and removes them from the DOM. Use {@link n2.cm.destroyComponent} instead of this method directly
 */
ncsquared.ui.wrappers.Switchable.prototype.destroy = function() {
    // Destroy all components then clear up our HTML
    n2.util.each(this.components, function(index, component) {
        n2.cm.destroyComponent(component);
    });
    n2j$(this.selector).remove();
};

/**
 * Will return the value of the current visible component or null if none is displayed. Use {@link n2.cm.getValue} instead of this method directly
 *
 * @param {booelan} [skipValidation=false] Set to true to skip any validation before getting the value
 * @returns {*} The value of the current visible component
 */
ncsquared.ui.wrappers.Switchable.prototype.getValue = function(skipValidation) {
    // Get the value from the current shown component
    if (this.currentIndex !== -1) {
        return n2.cm.getValue(this.components[this.currentIndex], skipValidation);
    }
    return null;
};

/**
 * Will set the current visible component to the provided value. Use {@link n2.cm.setValue} instead of this method directly
 *
 * @param {string} value The value to set the current visible component to
 * @param {booelan} [validate=false] Set to true to skip validation after setting the value
 */
ncsquared.ui.wrappers.Switchable.prototype.setValue = function(value, validate) {
    // Set the value on the current shown component
    if (this.currentIndex !== -1) {
        n2.cm.setValue(this.components[this.currentIndex], value, validate);
    }
};

/**
 * Will validate that the current visible component is valid.
 * If validation fails a message will be displayed under the component. Use {@link n2.cm.validate} instead of this method directly
 *
 * @returns {booelan} True if the current visible component is valid, otherwise false
 */
ncsquared.ui.wrappers.Switchable.prototype.validate = function() {
    // Validate the current shown component
    if (this.currentIndex !== -1) {
        return n2.cm.validate(this.components[this.currentIndex]);
    }
    return true;
};

/**
 * Resets the current visible component. Use {@link n2.cm.reset} instead of this method directly
 */
ncsquared.ui.wrappers.Switchable.prototype.reset = function() {
    // Reset the current shown component
    if (this.currentIndex !== -1) {
        n2.cm.reset(this.components[this.currentIndex]);
    }
};

/**
 * Refreshes the current visible component. Use {@link n2.cm.refresh} instead of this method directly
 *
 * @param {boolean} [keepCurrent=false] Set to true to keep the current value otherwise reverts back to the <code>defaultValue</code>
 */
ncsquared.ui.wrappers.Switchable.prototype.refresh = function(keepCurrent) {
    // Refresh the current shown component
    if (this.currentIndex !== -1) {
        n2.cm.refresh(this.components[this.currentIndex], keepCurrent);
    }
};

/**
 * Gives focus to the current visible component. Use {@link n2.cm.focus} instead of this method directly
 *
 * @returns {boolean} True if focus was given, otherwise false
 */
ncsquared.ui.wrappers.Switchable.prototype.focus = function() {
    // Focus on the current shown component
    if (this.currentIndex !== -1) {
        return n2.cm.focus(this.components[this.currentIndex]);
    }
    return false;
};

/**
 * Show the component at a given position and hide all other components
 *
 * @param {number} position The position of the component in the original configuration (one-based)
 */
ncsquared.ui.wrappers.Switchable.prototype.showComponent = function(position) {
    // Shows the component at the given position
    if (position > 0 && position <= this.components.length) {
        this.hideComponents();
        this.currentIndex = position - 1;
        n2j$(this.selector + ' div.n2__switchable-wrapper').eq(this.currentIndex).removeClass('slds-hide');
    }
};

/**
 * Hides all components
 */
ncsquared.ui.wrappers.Switchable.prototype.hideComponents = function() {
    // Hide all components
    n2j$(this.selector + ' div.n2__switchable-wrapper').addClass('slds-hide');
};

n2.cm._registerType(ncsquared.ui.wrappers.Switchable.prototype._n2Type, ncsquared.ui.wrappers.Switchable);
