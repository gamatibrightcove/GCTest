/*Copyright: © 2020 NC Squared Ltd, All Rights Reserved*/
ncsquared.maps.Breadcrumb = {

    /**
     * Update the breadcrumb panel based on the current stored breadcrumb
     */
    updatePanel: function() {
        var length = n2.maps.Context.breadcrumb.length - 1;
        n2.util.each(n2.maps.Context.breadcrumb, function(index, item) {
            item.index = index;
            item.last = index === length;
        });
        var html = n2.ui.renderTemplate(n2.maps.HTML.HTML_BREADCRUMB, n2.maps.Context.breadcrumb);
        n2j$(n2.maps.Context.config.breadcrumb).html(html);
    },

    /**
     * Gets the current breadcrumb item, ie the last one
     */
    getCurrentItem: function() {
        return n2.maps.Context.breadcrumb[n2.maps.Context.breadcrumb.length - 1];
    },

    /**
     * Gets the current length of the breadcrumb
     */
    length: function() {
        return n2.maps.Context.breadcrumb.length;
    },

    /**
     * Load the data from the given breadcrumb index by updating the stored breadcrumb and re-loading the data
     */
    loadFromBreadcrumb: function(index) {
        n2.maps.Context.breadcrumb = n2.maps.Context.breadcrumb.slice(0, Number(index) + 1);
        n2.maps.Features.loadGeoJsonData();
    },

    /**
     * Resets the breadcrumb back to the default World
     */
    reset: function() {
        n2.maps.Context.breadcrumb = n2.maps.Context.breadcrumb.slice(0, 1);
    },

    /**
     * Add an item to the breadcrumb
     */
    addItem: function(id, type) {
        // Get the current item so we can keep track of parents
        var currentItem = n2.maps.Breadcrumb.getCurrentItem();
        // Resolve the item name
        var name = id;
        if (n2.maps.Constants.ZOOM_TYPE_COUNTRY === currentItem.type) {
            name = n2.maps.Context.mappingData.countryNames[id] || id;
        } else if (n2.maps.Constants.ZOOM_TYPE_STATE === currentItem.type) {
            name = n2.maps.Context.mappingData.stateNames[id] || id;
        } else {
            name = id;
        }
        // Add the item
        n2.maps.Context.breadcrumb.push({
            name: name,
            id: id,
            type: type,
            typeDescription: n2.maps.Constants.ZOOM_TYPE_DESCRIPTIONS[type],
            country: currentItem.country || id,
            parentType: currentItem.type,
            stateParent: currentItem.stateParent || currentItem.type === n2.maps.Constants.ZOOM_TYPE_STATE
        });
    }
};

ncsquared.maps.Constants = {};

// URL to the services
n2.maps.Constants.GEOJSON_URL = '/geojson/';
n2.maps.Constants.COMBINE_URL = '/maps/v1/combine';

// Zoom levels
n2.maps.Constants.ZOOM_TYPE_COUNTRY = 'C';
n2.maps.Constants.ZOOM_TYPE_STATE = 'S';
n2.maps.Constants.ZOOM_TYPE_POSTAL = 'P';
n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL = 'P2';
n2.maps.Constants.ZOOM_TYPE_PHONE = 'T';
n2.maps.Constants.ZOOM_TYPES = [
    n2.maps.Constants.ZOOM_TYPE_COUNTRY,
    n2.maps.Constants.ZOOM_TYPE_STATE,
    n2.maps.Constants.ZOOM_TYPE_POSTAL,
    n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL,
    n2.maps.Constants.ZOOM_TYPE_PHONE
];
n2.maps.Constants.ZOOM_TYPE_DESCRIPTIONS = (function() {
    var descriptions = {};
    descriptions[n2.maps.Constants.ZOOM_TYPE_COUNTRY] = 'Country';
    descriptions[n2.maps.Constants.ZOOM_TYPE_STATE] = 'State/Province';
    descriptions[n2.maps.Constants.ZOOM_TYPE_POSTAL] = 'Zip/Postal Summary';
    descriptions[n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL] = 'Zip/Postal';
    descriptions[n2.maps.Constants.ZOOM_TYPE_PHONE] = 'Phone';
    return descriptions;
}());
n2.maps.Constants.ZOOM_COUNTRIES = {
    'AUS': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_STATE,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL,
                children: [{
                    type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
                }]
            }]
        }]
    },
    'CAN': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_STATE,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
            }]
        }]
    },
    'DEU': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_POSTAL,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
            }]
        }]
    },
    'FRA': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_POSTAL,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
            }]
        }]
    },
    'GBR': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_POSTAL,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
            }]
        }, {
            type: n2.maps.Constants.ZOOM_TYPE_STATE
        }]
    },
    'USA': {
        children: [{
            type: n2.maps.Constants.ZOOM_TYPE_STATE,
            children: [{
                type: n2.maps.Constants.ZOOM_TYPE_POSTAL,
                children: [{
                    type: n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL
                }]
            }]
        }]
    }
};
n2.maps.Constants.ZOOM_COUNTRIES_TYPES = (function() {
    var countries = {};
    n2.util.each(n2.maps.Constants.ZOOM_COUNTRIES, function(countryName, countryConfig) {
        var types = [];
        countries[countryName] = types;
        n2.util.eachDeep(countryConfig, function(parent, indexOrKey, value) {
            if (indexOrKey === 'type') {
                types.push(value);
            }
        });
    });
    return countries;
}());

// Bounds
n2.maps.Constants.DEFAULT_BOUNDS = {
    'north': 67,
    'south': -35,
    'east': 147,
    'west': -132
};
n2.maps.Constants.COUNTRY_BOUNDS = {
    'USA': {
        'north': 49.85,
        'south': 23.90,
        'east': -58.59,
        'west': -129.56
    },
    'CAN': {
        'north': 70.99,
        'south': 47.94,
        'east': -55.08,
        'west': -140.33
    }
};

// Styles
n2.maps.Constants.STYLE_DEFAULT = {
    strokeColor: '#808080',
    strokeWeight: 1,
    strokeOpacity: 0.6,
    fillOpacity: 0.1
};
n2.maps.Constants.STYLE_HOVER = {
    strokeWeight: 4
};
n2.maps.Constants.STYLE_ZOOMABLE = {
    strokeColor: '#4BC076',
    strokeWeight: 2,
    strokeOpacity: 1
};
n2.maps.Constants.STYLE_SELECTED = {
    fillColor: '#0000FF',
    fillOpacity: 0.5
};
n2.maps.Constants.STYLE_SELECTED_OTHER = {
    fillColor: '#000000',
    fillOpacity: 0.5,
    clickable: false
};
n2.maps.Constants.TERRITORY_COLORS = [{
    name: 'Beetroot',
    color: '#AD1457'
}, {
    name: 'Cherry Blossom',
    color: '#D81B60'
}, {
    name: 'Tomato',
    color: '#D50000'
}, {
    name: 'Flamingo',
    color: '#E67C73'
}, {
    name: 'Tangerine',
    color: '#F4511E'
}, {
    name: 'Pumpkin',
    color: '#EF6C00'
}, {
    name: 'Mango',
    color: '#F09300'
}, {
    name: 'Banana',
    color: '#F6BF26'
}, {
    name: 'Citron',
    color: '#E4C441'
}, {
    name: 'Avocado',
    color: '#C0CA33'
}, {
    name: 'Pistachio',
    color: '#7CB342'
}, {
    name: 'Sage',
    color: '#33B679'
}, {
    name: 'Basil',
    color: '#0B8043'
}, {
    name: 'Eucalyptus',
    color: '#009688'
}, {
    name: 'Peacock',
    color: '#039BE5'
}, {
    name: 'Cobalt',
    color: '#4285F4'
}, {
    name: 'Blueberry',
    color: '#3F51B5'
}, {
    name: 'Lavender',
    color: '#7986CB'
}, {
    name: 'Wisteria',
    color: '#B39DDB'
}, {
    name: 'Amethyst',
    color: '#9E69AF'
}, {
    name: 'Grape',
    color: '#8E24AA'
}, {
    name: 'Cocoa',
    color: '#795548'
}, {
    name: 'Graphite',
    color: '#616161'
}, {
    name: 'Birch',
    color: '#A79B8E'
}];

// Select item click delay
n2.maps.Constants.CLICK_DELAY = 300;

// Max amount of territories before we stop showing the summary shapes
n2.maps.Constants.MAX_TERRITORIES_FOR_SUMMARY = 500;

// Import regexes
n2.maps.Constants.REGEX_A = /[ãâäàåáÀÁÂÃÄÅ]/g;
n2.maps.Constants.REGEX_E = /[éèêëÈÉÊË]/g;
n2.maps.Constants.REGEX_I = /[ïîìíÌÍÎÏ]/g;
n2.maps.Constants.REGEX_O = /[ôöòõóÒÓÔÕÖ]/g;
n2.maps.Constants.REGEX_U = /[ûùúüÙÚÛÜ]/g;
n2.maps.Constants.REGEX_C = /[çÇ]/g;
n2.maps.Constants.REGEX_N = /[ñÑ]/g;
n2.maps.Constants.REGEX_AND = /&/g;
n2.maps.Constants.REGEX_SPACE = /-/g;
n2.maps.Constants.REGEX_OTHER = /[^a-zA-Z\d\s]/g;
n2.maps.Constants.REGEX_MULTIPLE_SPACES = /\s+/g;
n2.maps.Constants.REGEX_USA_ZIP = /^(\d{3}|\d{5})$/;
n2.maps.Constants.REGEX_USA_ZIP_SUMMARY = /^\d{3}$/;
n2.maps.Constants.REGEX_CAN_POSTAL = /^[a-zA-Z]\d[a-zA-Z]$/;
n2.maps.Constants.REGEX_GBR_POSTAL = /^[a-zA-Z][a-hA-Hj-yJ-Y]?(\d[a-zA-Z\d]?)?$/;
n2.maps.Constants.REGEX_GBR_POSTAL_SUMMARY = /^[a-zA-Z][a-hA-Hj-yJ-Y]?$/;
n2.maps.Constants.REGEX_FRA_POSTAL = /^(\d{2}|2[abAB]|\d{5})$/;
n2.maps.Constants.REGEX_FRA_POSTAL_SUMMARY = /^(\d{2}|2[abAB])$/;
n2.maps.Constants.REGEX_DEU_POSTAL = /^(\d{2}|\d{5})$/;
n2.maps.Constants.REGEX_DEU_POSTAL_SUMMARY = /^(\d{2})$/;
n2.maps.Constants.REGEX_AUS_NZL_POSTAL = /^(\d{2}|\d{4})$/;
n2.maps.Constants.REGEX_AUS_NZL_POSTAL_SUMMARY = /^(\d{2})$/;

// Import
n2.maps.Constants.IMPORT_TYPE_AUTODETECT = '-';
n2.maps.Constants.IMPORT_STATE_COUNTRIES = [
    'USA', 'CAN', 'AUS', 'GBR'
];
n2.maps.Constants.IMPORT_POSTAL = {
    'USA': {
        regex: n2.maps.Constants.REGEX_USA_ZIP,
        regexSummary: n2.maps.Constants.REGEX_USA_ZIP_SUMMARY,
        hasState: true
    },
    'CAN': {
        regex: n2.maps.Constants.REGEX_CAN_POSTAL,
        hasState: true
    },
    'GBR': {
        regex: n2.maps.Constants.REGEX_GBR_POSTAL,
        regexSummary: n2.maps.Constants.REGEX_GBR_POSTAL_SUMMARY
    },
    'FRA': {
        regex: n2.maps.Constants.REGEX_FRA_POSTAL,
        regexSummary: n2.maps.Constants.REGEX_FRA_POSTAL_SUMMARY
    },
    'DEU': {
        regex: n2.maps.Constants.REGEX_DEU_POSTAL,
        regexSummary: n2.maps.Constants.REGEX_DEU_POSTAL_SUMMARY
    },
    'AUS': {
        regex: n2.maps.Constants.REGEX_AUS_NZL_POSTAL,
        regexSummary: n2.maps.Constants.REGEX_AUS_NZL_POSTAL_SUMMARY,
        hasState: true
    },
    'NZL': {
        regex: n2.maps.Constants.REGEX_AUS_NZL_POSTAL,
        regexSummary: n2.maps.Constants.REGEX_AUS_NZL_POSTAL_SUMMARY
    }
};
n2.maps.Constants.IMPORT_COUNTRIES = {
    'AUS': 'Australia',
    'CAN': 'Canada',
    'DEU': 'Germany',
    'FRA': 'France',
    'GBR': 'United Kingdom',
    'NZL': 'New Zealand',
    'USA': 'United States of America'
};

ncsquared.maps.Context = {

    mappingData: null,

    map: null,
    territories: [],
    geometries: {},
    currentTerritoryIndex: -1,
    loadedFeatures: 0,
    breadcrumb: [{
        name: 'World',
        id: 'W',
        type: n2.maps.Constants.ZOOM_TYPE_COUNTRY
    }],
    currentType: null,
    currentItems: null,
    territoriesFilter: null,

    clickTimeout: null,
    clickEvent: null,
    infoWindow: null,

    shiftPressed: false,
    mouseDown: false,
    mouseDownPosition: null,
    selectionBox: null,

    config: null,
    /**
     * Initialises the context with configuration for the hosting page
     * @param {Object} config The configuration for the hosting page
     * @param {boolean} config.isEditable Set to true for the map to be editable
     * @param {Object} [config.loadTerritoriesPromise] An optional promise that when resolved should return the array of territories to load
     * @param {Object} [config.loadGeometriesPromise] An optional promise that when resolved should return the gemoetries to load in the format <code>{territoryName: {geometry data}}</code>
     * @param {string} config.map The id for the map container
     * @param {Function} config.saveTerritoryHandler A function that will be called when a territory, and sometimes also the geometry (or territory shape data), should be saved, called with the argument <code>({Object} territory, {Object} [geometry])</code>. If a promise is returned then on rejection the state will revert accordingly
     * @param {Function} config.saveTerritoryDeleteHandler A function that will be called when a territory should be deleted, called with the argument <code>({Object} territory)</code>. If a promise is returned then on rejection the state will revert accordingly
     * @param {Function} config.saveTerritorieReorderHandler A function that will be called when the territories should be reordered, called with the argument <code>({{number} oldExecutionOrder: {number} newExecutionOrder} changedTerritories)</code>. If a promise is returned then on rejection the state will revert accordingly
     * @param {Function} config.editModeHandler A function that will be called when the map enters or exists territory edit mode, called with the argument <code>({boolean} editMode)</code>
     * @param {Function} config.noTerritoriesHandler A function that will be called when the territories are loaded to notify if there are any, called with the argument <code>({boolean} noTerritories)</code>
     * @param {Function} config.editTerritoryPropertiesHandler A function that will be called when the edit territory properties menu item is clicked, called with the argument <code>({Object} territory)</code>
     * @param {Function} config.deleteTerritoryHandler A function that will be called when the delete territory menu item is clicked, called with the argument <code>({Object} territory)</code>
     * @param {Function} [config.mappingDataLoadedHandler] An optional function that will be called when the mapping data is loaded, called with the argument <code>({Object} mappingData)</code>
     * @param {string} config.breadcrumb The selector for the breadcrumb list
     * @param {string} config.territories The selector for the territories list
     * @param {number} config.maxItems The maximum number of items that can be added to a territory
     */
    init: function(config) {
        n2.util.checkRequiredConfig(config, [
            'isEditable:boolean',
            'map:string',
            'saveTerritoryHandler:function',
            'saveTerritoryDeleteHandler:function',
            'saveTerritorieReorderHandler:function',
            'editModeHandler:function',
            'noTerritoriesHandler:function',
            'editTerritoryPropertiesHandler:function',
            'deleteTerritoryHandler:function',
            'breadcrumb:string',
            'territories:string',
            'maxItems:number'
        ]);

        this.config = config;
    }
};

ncsquared.maps.Features = {

    /**
     * Load the GeoJson data from the server into the map - we expect the
     * breadcrumb to have already been updated at this point
     */
    loadGeoJsonData: function(bounds) {
        // Show the mask and update the breadcrumb
        n2.spinner.show();
        n2.maps.Breadcrumb.updatePanel();

        // Clean up any existing features
        n2.maps.Context.map.data.forEach(function(feature) {
            n2.maps.Context.map.data.remove(feature);
        });

        // Generate the url to fetch the data based on the breadcrumb
        var path = n2.maps.Constants.GEOJSON_URL;
        var currentItem = n2.maps.Breadcrumb.getCurrentItem();
        // Only go to a maximum depth based on whether we have a state parent or not - ie when postal summary then detail we want to use the summary so that we have the state
        var maxDepth = currentItem.stateParent ? 3 : 2;
        var breadcrumbLength = n2.maps.Breadcrumb.length();
        var breadcrumbItem = n2.maps.Context.breadcrumb[Math.min(maxDepth, breadcrumbLength) - 1];
        if (breadcrumbLength > 1) {
            path += currentItem.type + '/';
        }
        path += breadcrumbItem.id + '.geojson';

        // Fetch the data from the server
        n2.sf.heroku.get(path)
            .done(function(data) {
                // Shouldn't happen but no need to continue if something has happened
                if (!data.features) {
                    throw new Error('Invalid structure of GeoJson data');
                }

                // If we are postal detail type check through and remove any non-matching parents
                if (currentItem.type === n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL) {
                    data.features = n2.util.map(data.features, function(feature) {
                        if (feature.properties && feature.properties.parent && feature.properties.parent !== currentItem.id) {
                            return null;
                        }
                        return feature;
                    });
                }

                // Store the number of features we have so that we can hide the mask once all features have been styled
                n2.maps.Context.loadedFeatures = data.features.length;

                // Zoom the map to the provided bounds, the custom bounds for the country, the bounds of the loaded geoJSON, or the whole map
                if (n2.util.isNullOrUndefined(bounds)) {
                    if (n2.maps.Constants.ZOOM_TYPE_STATE === breadcrumbItem.type && n2.maps.Constants.COUNTRY_BOUNDS.hasOwnProperty(breadcrumbItem.id)) {
                        bounds = n2.maps.Constants.COUNTRY_BOUNDS[breadcrumbItem.id];
                    } else {
                        bounds = data.bbox;
                    }
                }
                if (n2.util.isArray(bounds)) {
                    // If the bounds are an array, convert to Google format
                    if (bounds.length === 4) {
                        bounds = {
                            west: bounds[0],
                            south: bounds[1],
                            east: bounds[2],
                            north: bounds[3]
                        };
                    } else {
                        bounds = n2.maps.Constants.DEFAULT_BOUNDS;
                    }
                }
                n2.maps.Context.map.fitBounds(bounds || n2.maps.Constants.DEFAULT_BOUNDS);

                // Update the current zoom type before we load the data
                n2.maps.Zoom.updateCurrentZoomType();

                // Add the GeoJson data to the map
                n2.maps.Context.map.data.addGeoJson(data);
            })
            .fail(function(xhr, status, error) {
                n2.spinner.hide();
                n2.message.error('Failed to load GeoJSON: ' + (error || xhr.status));
            })
            .always(function() {
                // Hide the mask after 5 secs in case the style countdown didn't work
                setTimeout(n2.spinner.hide, 5000);
            });
    },

    /**
     * Get the style for the given feature
     */
    getFeatureStyle: function(feature) {
        var style = n2.util.clone(n2.maps.Constants.STYLE_DEFAULT, true);

        // Get feature details
        var id = feature.getId();
        var canBeZoomed = feature.getProperty('canBeZoomed');
        if (n2.util.isNullOrUndefined(canBeZoomed)) {
            canBeZoomed = n2.maps.Zoom.canBeZoomed(id);
            feature.setProperty('canBeZoomed', canBeZoomed);
        }

        // Highlight those features that can be zoomed
        if (canBeZoomed) {
            Object.assign(style, n2.maps.Constants.STYLE_ZOOMABLE);
        }

        // Highlight selected features
        if (id) {
            var zoomType = n2.maps.Zoom.getCurrentZoomType();
            var country = n2.maps.Breadcrumb.getCurrentItem().country;
            if (n2.maps.TerritoryItems.isSelectedInCurrent(id, zoomType, country)) {
                Object.assign(style, n2.maps.Constants.STYLE_SELECTED);
                if (n2.maps.Context.currentTerritoryIndex >= 0 && n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex].color) {
                    style.fillColor = n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex].color;
                }
                // If not editable disable clicking unless it can be zoomed
                if (!n2.maps.Context.config.isEditable && !canBeZoomed) {
                    style.clickable = false;
                }
            } else {
                // Highlight features selected in other territories and make them not clickable
                var territoryIndex = n2.maps.TerritoryItems.getTerritoryIndex(id, zoomType, country);
                if (territoryIndex !== -1) {
                    Object.assign(style, n2.maps.Constants.STYLE_SELECTED_OTHER);
                    // Keep countries that can be zoomed clickable
                    if (canBeZoomed) {
                        style.clickable = true;
                    }
                } else if (!n2.maps.Context.config.isEditable && !canBeZoomed) {
                    // For areas that aren't a part of any territory, if not editable disable clicking unless it can be zoomed
                    style.clickable = false;
                }
            }
        } else {
            // For territory combined features when in view mode, set stroke width to zero
            style.strokeWeight = 0;
        }

        // If we have a colour defined, use it
        var color = feature.getProperty('color');
        if (color) {
            style.fillColor = color;
            style.fillOpacity = 0.5;
        }

        // Countdown the loaded features, hiding the mask once complete
        if (n2.maps.Context.loadedFeatures > 0) {
            n2.maps.Context.loadedFeatures--;
            if (n2.maps.Context.loadedFeatures === 0) {
                n2.spinner.hide();
            }
        }

        return style;
    }
};

ncsquared.maps.HTML = {};

n2.maps.HTML.HTML_BREADCRUMB = '{{#.}}<li class="slds-breadcrumb__item">' +
    '{{#last}}<span>{{/last}}' +
    '{{^last}}<a class="n2__breadcrumb-item" data-index="{{index}}">{{/last}}' +
    '{{name}}{{#typeDescription}} ({{typeDescription}}){{/typeDescription}}' +
    '{{#last}}<span>{{/last}}' +
    '{{^last}}</a>{{/last}}' +
    '</li>{{/.}}';

n2.maps.HTML.HTML_TERRITORIES_LIST = '{{#territories}}<li class="n2__territory-item"><div class="slds-grid">' +
    '<h3 class="slds-text-heading_small slds-truncate slds-col">' +
    '<button class="slds-button slds-button_reset n2__territory-item-btn" title="{{name}}" data-index="{{_index}}" style="width: 100%">' +
    '<span class="slds-swatch n2__territory-dot" style="background-color: {{color}}"></span><span class="slds-truncate">({{executionOrder}}) {{name}}</span></button>' +
    '</h3>' +
    ncsquared.ui.Dropdown.renderStartTemplate(false) +
    '{{#isEditable}}' +
    '<li class="slds-dropdown__item" role="presentation">' +
    '<a class="n2__territory-edit-items" data-index="{{_index}}" role="menuitem" tabindex="0"><span class="slds-truncate" title="Choose Items">Choose Items</span></a>' +
    '</li>' +
    '<li class="slds-dropdown__item" role="presentation">' +
    '<a class="n2__territory-edit-properties" data-index="{{_index}}" role="menuitem" tabindex="0"><span class="slds-truncate" title="Edit Properties">Edit Properties</span></a>' +
    '</li>' +
    '<li class="slds-dropdown__item" role="presentation">' +
    '<a class="n2__territory-edit-delete" data-index="{{_index}}" role="menuitem" tabindex="-1"><span class="slds-truncate" title="Delete Territory">Delete Territory</span></a>' +
    '</li>' +
    '{{/isEditable}}' +
    '{{^isEditable}}' +
    '<li class="slds-dropdown__item" role="presentation">' +
    '<a class="n2__territory-edit-items" data-index="{{_index}}" role="menuitem" tabindex="0"><span class="slds-truncate" title="View Items">View Items</span></a>' +
    '</li>' +
    '{{/isEditable}}' +
    ncsquared.ui.Dropdown.endTemplate +
    '</div></li>{{/territories}}';

n2.maps.HTML.HTML_TERRITORY_ITEMS_LIST = '{{#types}}{{#items.length}}<li class="n2__territory-type" data-type="{{type}}"><span class="n2__color-primary">{{name}}</span><div>' +
    '<ul class="slds-listbox slds-listbox_horizontal slds-listbox_inline" role="listbox" aria-orientation="horizontal">' +
    '{{#items}}' +
    '<li class="slds-listbox-item" role="presentation"><span class="slds-pill" role="option"><span class="slds-pill__label">{{resolvedName}}</span>' +
    '{{#canRemove}}' +
    '<button title="Remove" data-id="{{id}}" class="slds-button slds-button_icon slds-button_icon slds-pill__remove n2__remove-territory-feature">' +
    '<svg class="slds-button__icon" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsIconsPrefix}}/utility-sprite/svg/symbols.svg#close" /></svg>' +
    '<span class="slds-assistive-text">Remove</span></button>' +
    '{{/canRemove}}' +
    '</span></li>' +
    '{{/items}}' +
    '</ul></li>{{/items.length}}{{/types}}';

n2.maps.HTML.HTML_ZOOM_POPOVER = '<div class="slds-popover_body">' +
    '{{#isEditable}}<div><button class="slds-button" onclick="n2.maps.TerritoryItems.itemClick();n2.maps.Context.clickEvent = null;">{{#selected}}Un-select{{/selected}}{{^selected}}Select{{/selected}}</button></div>{{/isEditable}}' +
    '{{#zoomTypes}}<div><button class="slds-button" onclick="n2.maps.Zoom.zoomFeature(\'{{type}}\');n2.maps.Context.clickEvent = null;">Zoom to {{description}}</button></div>{{/zoomTypes}}' +
    '</div>';

ncsquared.maps.Import = {

    /**
     * The number of character codes to offset the mask by
     * @type {Number}
     */
    MASK_OFFSET: 5,
    /**
     * The minimum character code that we will mask
     * @type {Number}
     */
    MASK_MIN: 97,
    /**
     * The maximum character code that we will mask
     * @type {Number}
     */
    MASK_MAX: 122,
    /**
     * The difference between the min and max mask character code used to wrap
     * @type {Number}
     */
    MASK_DIFF: 26,

    /**
     * A cache of the zip state data for mapping postal codes to states
     * @type {Object}
     */
    _zipStateData: null,

    /**
     * Get the territory items from the provided set of names
     *
     * @param {String[]} names The list of names to lookup territory items for
     * @param {String} zoomLevel The zoom level to focus the search on, or '-' for auto-detect
     * @param {String} [country='-'] The country to focus the search on, or '-' for auto-detect
     * @returns {Object} The resolved territory items to pass to the pill list component
     */
    getTerritoryItems: function(names, zoomLevel, country) {
        // If we haven't got the zip data yet, fetch it and resolve items on completion - return the promise so the UI can continue
        if (n2.util.isNullOrUndefined(n2.maps.Import._zipStateData)) {
            return n2.maps.Import._fetchZipStateData().then(function() {
                return n2.maps.Import._resolveTerritoryItems(names, zoomLevel, country);
            });
        }

        // If we have the data, resolve the items now
        return n2.maps.Import._resolveTerritoryItems(names, zoomLevel, country);
    },

    /**
     * Fetch the zip-state data from the server, returning the promise
     */
    _fetchZipStateData: function() {
        // Initialise the territory zip-state data
        return n2.sf.heroku.get('/json/zip-state.json')
            .done(function(response) {
                n2.maps.Import._zipStateData = response;
            })
            .fail(function(xhr, status, error) {
                n2.message.error('Failed to fetch zip-state.json: ' + (error || xhr.status));
            });
    },

    /**
     * Resolve the territory items from the given names and zoom level
     */
    _resolveTerritoryItems: function(names, zoomLevel, limitToCountry) {
        // Clean the names first to make matching easier
        var originalNames = {};
        var cleanedNames = {};
        var cleanName;
        n2.util.each(names, function(index, name) {
            cleanName = n2.maps.Import.cleanName(name);
            cleanedNames[cleanName] = n2.maps.Import.maskName(cleanName);
            // Store original names for use in the message at the end, if one already exists append this one to it
            if (originalNames.hasOwnProperty(cleanName)) {
                originalNames[cleanName] += '", "' + name;
            } else {
                originalNames[cleanName] = name;
            }
        });

        var foundItems = [];
        var autoDetectZoom = zoomLevel === n2.maps.Constants.IMPORT_TYPE_AUTODETECT;
        limitToCountry = limitToCountry || n2.maps.Constants.IMPORT_TYPE_AUTODETECT;
        var autoDetectCountry = limitToCountry === n2.maps.Constants.IMPORT_TYPE_AUTODETECT;

        // Start by looking for zip codes as we can check their syntax
        if (autoDetectZoom || zoomLevel === n2.maps.Constants.ZOOM_TYPE_POSTAL) {
            n2.util.each(cleanedNames, function(name) {
                // Loop through each country for their particular syntax
                n2.util.each(n2.maps.Constants.IMPORT_POSTAL, function(country, config) {
                    if ((autoDetectCountry || limitToCountry === country) && config.regex.test(name) && n2.maps.Import._zipStateData.hasOwnProperty(country) && n2.maps.Import._zipStateData[country].hasOwnProperty(name)) {
                        var upperName = name.toUpperCase();
                        var item = {
                            'id': upperName,
                            '_name': upperName,
                            '_type': config.regexSummary && config.regexSummary.test(name) ? n2.maps.Constants.ZOOM_TYPE_POSTAL : n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL,
                            'c': country
                        };
                        if (config.hasState) {
                            item.s = country + '-' + n2.maps.Import._zipStateData[country][name];
                        }
                        foundItems.push(item);
                        delete cleanedNames[name];
                        return false;
                    }
                });
            });
        }

        // Then look for states, in a given country order, as state codes may be more likely than country
        if (autoDetectZoom || zoomLevel === n2.maps.Constants.ZOOM_TYPE_STATE) {
            n2.util.each(n2.maps.Constants.IMPORT_STATE_COUNTRIES, function(index, country) {
                if (autoDetectCountry || limitToCountry === country) {
                    n2.maps.Import._resolveStates(cleanedNames, foundItems, country);
                }
            });
        }

        // If we have some left, then look for countries
        if (Object.keys(cleanedNames).length > 0 && (autoDetectZoom || zoomLevel === n2.maps.Constants.ZOOM_TYPE_COUNTRY)) {
            n2.util.each(cleanedNames, function(name, maskedName) {
                if (n2.maps.Context.mappingData.countries.hasOwnProperty(maskedName)) {
                    var countryISO = n2.maps.Context.mappingData.countries[maskedName];
                    foundItems.push({
                        'id': countryISO,
                        '_name': n2.maps.Context.mappingData.countryNames[countryISO],
                        '_type': n2.maps.Constants.ZOOM_TYPE_COUNTRY
                    });
                    delete cleanedNames[name];
                }
            });
        }

        // Check if any of the found items exist in any of the other territories, loop backwards so that we can remove the item if found
        var existingNames = [];
        n2.util.eachBackwards(foundItems, function(index, item) {
            if (n2.maps.TerritoryItems.isSelectedInCurrent(item.id, item._type, item.c) || n2.maps.TerritoryItems.isSelectedInTerritories(item.id, item._type, item.c)) {
                if (existingNames.indexOf(item._name) === -1) {
                    existingNames.push(item._name);
                }
                foundItems.splice(index, 1);
            }
        });

        // Create the response with a sorted set of found items
        var response = {
            pills: foundItems.sort(function(a, b) {
                return n2.util.compareObjectValues(a, b, '_name');
            }),
            message: ''
        };

        // At the end, if there are any remaining or were existing ones, create a message to add to the response
        var cleanedKeys = Object.keys(cleanedNames);
        if (cleanedKeys.length > 0) {
            var unRecognisedItems = n2.util.map(cleanedKeys, function(cleanedKey) {
                return originalNames[cleanedKey];
            }).join('", "');
            response.message = 'The following items were not recognized: "' + unRecognisedItems + '".';
        }
        if (existingNames.length > 0) {
            if (cleanedKeys.length > 0) {
                response.message += '\n';
            }
            response.message += 'The following items were resolved but already exist in a territory: "' + existingNames.join('", "') + '".';
        }

        return response;
    },

    /**
     * Resolve the territory names to requested states
     */
    _resolveStates: function(cleanedNames, foundItems, country) {
        // If we have any names left, loop through the states looking for a matching code or name
        if (Object.keys(cleanedNames).length > 0 && n2.maps.Context.mappingData.states.hasOwnProperty(country)) {
            var mappingState = n2.maps.Context.mappingData.states[country];
            n2.util.each(cleanedNames, function(name, maskedName) {
                if (mappingState.hasOwnProperty(maskedName)) {
                    var stateCode = mappingState[maskedName];
                    foundItems.push({
                        'id': stateCode,
                        '_name': n2.maps.Context.mappingData.stateNames[stateCode],
                        '_type': n2.maps.Constants.ZOOM_TYPE_STATE,
                        'c': country
                    });
                    delete cleanedNames[name];
                }
            });
        }
    },

    /**
     * Clean the item name to make matching easier
     *
     * @param {String} name The name of the item to clean
     * @returns {String} The cleaned name
     */
    cleanName: function(name) {
        if (!name) {
            return name;
        }
        name = name.replace(n2.maps.Constants.REGEX_A, 'a');
        name = name.replace(n2.maps.Constants.REGEX_E, 'e');
        name = name.replace(n2.maps.Constants.REGEX_I, 'i');
        name = name.replace(n2.maps.Constants.REGEX_O, 'o');
        name = name.replace(n2.maps.Constants.REGEX_U, 'u');
        name = name.replace(n2.maps.Constants.REGEX_C, 'c');
        name = name.replace(n2.maps.Constants.REGEX_N, 'n');
        name = name.replace(n2.maps.Constants.REGEX_AND, 'and');
        name = name.replace(n2.maps.Constants.REGEX_SPACE, ' ');
        name = name.replace(n2.maps.Constants.REGEX_OTHER, '');
        name = name.replace(n2.maps.Constants.REGEX_MULTIPLE_SPACES, ' ');
        return name.trim().toLowerCase();
    },

    /**
     * Mask the item name to match against the masked mapping data
     *
     * @param {String} name The name of the item to mask
     * @returns {String} The masked name
     */
    maskName: function(name) {
        if (!name) {
            return name;
        }

        var length = name.length;
        var newChars = [];
        var ch;
        var newCh;
        for (var i = 0; i < length; i++) {
            ch = name.charCodeAt(i);
            if (ch >= n2.maps.Import.MASK_MIN && ch <= n2.maps.Import.MASK_MAX) {
                newCh = ch + n2.maps.Import.MASK_OFFSET;
                if (newCh > n2.maps.Import.MASK_MAX) {
                    newCh = newCh - n2.maps.Import.MASK_DIFF;
                }
                newChars.push(newCh);
            } else {
                newChars.push(ch);
            }
        }
        return String.fromCharCode.apply(null, newChars);
    }
};

/* globals google: false */
ncsquared.maps.Mouse = {

    /**
     * On feature mouse over, apply the appropriate style and tooltip
     */
    featureMouseOver: function(event) {
        n2.maps.Context.map.data.revertStyle();
        if (n2.maps.Context.shiftPressed) {
            // If we have shift pressed mark the feature as not-clickable so that the cursor is correct
            n2.maps.Context.map.data.overrideStyle(event.feature, {
                clickable: false
            });
        } else {
            // Otherwise just apply the hover style when we are selecting and add the tooltip
            if (n2.maps.Context.currentItems) {
                n2.maps.Context.map.data.overrideStyle(event.feature, n2.maps.Constants.STYLE_HOVER);
            }
            var title = event.feature.getProperty('name');
            if (event.feature.getProperty('canBeZoomed') === true) {
                title = title + ' (Double-click to zoom)';
            }
            n2.maps.Context.map.getDiv().setAttribute('title', title);
        }
    },

    /**
     * On feature mouse out, remove the hover stlye and tooltip
     */
    featureMouseOut: function() {
        if (!n2.maps.Context.shiftPressed) {
            n2.maps.Context.map.data.revertStyle();
            n2.maps.Context.map.getDiv().removeAttribute('title');
        }
    },

    /**
     * On feature click, select the feature but put in a delay in case of a double click
     */
    featureClick: function(event) {
        if (!n2.maps.Context.shiftPressed && n2.maps.Context.config.isEditable && n2.maps.Context.currentItems) {
            n2.maps.Context.clickEvent = event;
            n2.maps.Context.clickTimeout = setTimeout(function() {
                n2.maps.TerritoryItems.itemClick();
                n2.maps.Context.clickEvent = null;
                n2.maps.Context.clickTimeout = null;
            }, n2.maps.Constants.CLICK_DELAY);
        }
    },

    /**
     * On feature double-click, if the feature can be zoomed do so to the first type
     */
    featureDoubleClick: function(event) {
        if (!n2.maps.Context.shiftPressed && n2.maps.Context.currentItems) {
            if (n2.maps.Context.clickTimeout) {
                clearTimeout(n2.maps.Context.clickTimeout);
                n2.maps.Context.clickEvent = null;
                n2.maps.Context.clickTimeout = null;
            }
            var id = event.feature.getId();
            if (n2.maps.Zoom.canBeZoomed(id)) {
                n2.maps.Context.clickEvent = event;
                var zoomTypes = n2.maps.Zoom.getZoomTypes(id);
                n2.maps.Zoom.zoomFeature(zoomTypes[0].type);
                n2.maps.Context.clickEvent = null;
            }
        }
    },

    /**
     * On feature right-click, if we can be zoomed show a popup of the options
     */
    featureRightClick: function(event) {
        if (!n2.maps.Context.shiftPressed && n2.maps.Context.currentItems) {
            var id = event.feature.getId();
            if (n2.maps.Zoom.canBeZoomed(id)) {
                // We store the click event so that the HTML can be dynamic in the popup
                n2.maps.Context.clickEvent = event;

                // Generate the HTML
                var zoomTypes = n2.maps.Zoom.getZoomTypes(id);
                n2.util.each(zoomTypes, function(index, zoomType) {
                    zoomType.description = n2.maps.Constants.ZOOM_TYPE_DESCRIPTIONS[zoomType.type];
                });
                var context = {
                    isEditable: n2.maps.Context.config.isEditable,
                    selected: n2.maps.TerritoryItems.isSelectedInCurrent(id, n2.maps.Zoom.getCurrentZoomType(), n2.maps.Breadcrumb.getCurrentItem().country),
                    zoomTypes: zoomTypes
                };
                var html = n2.ui.renderTemplate(n2.maps.HTML.HTML_ZOOM_POPOVER, context);

                // Open the info window popover
                n2.maps.Context.infoWindow.setContent(html);
                n2.maps.Context.infoWindow.setPosition(event.latLng);
                n2.maps.Context.infoWindow.open(n2.maps.Context.map);
            }
        }
    },

    /**
     * On a mouse down event, if shift is pressed and we're editable, store the posistion and update the map options so moving the mouse doesn't drag the map
     */
    selectionMouseDown: function(event) {
        n2.maps.Context.infoWindow.close();
        if (n2.maps.Context.shiftPressed && n2.maps.Context.config.isEditable) {
            n2.maps.Context.mouseDown = true;
            n2.maps.Context.mouseDownPosition = event.latLng;
            n2.maps.Context.map.setOptions({
                draggable: false
            });
        }
    },

    /**
     * On a mouse up event, if the mouse down was recorded (with shift) reset the mouse and map options and handle the selection box
     */
    selectionMouseUp: function() {
        n2.maps.Context.map.data.revertStyle();
        if (n2.maps.Context.mouseDown) {
            n2.maps.Context.mouseDown = false;
            n2.maps.Context.mouseDownPosition = null;
            n2.maps.Context.map.setOptions({
                draggable: true
            });

            if (n2.maps.Context.selectionBox) {
                // If a selection box was created, loop through each feature, and if visible and in the any point is in the box, mark it as selected
                var selected = false;
                var bounds = n2.maps.Context.selectionBox.getBounds();
                var zoomType = n2.maps.Zoom.getCurrentZoomType();
                var currentBreadcrumb = n2.maps.Breadcrumb.getCurrentItem();
                n2.maps.Context.map.data.forEach(function(feature) {
                    var parent = feature.getProperty('parent');
                    var visible = !parent || currentBreadcrumb.id === parent;
                    var id = feature.getId();
                    if (visible && !n2.maps.TerritoryItems.isSelectedInCurrent(id, zoomType, currentBreadcrumb.country) && !n2.maps.TerritoryItems.isSelectedInTerritories(id, zoomType, currentBreadcrumb.country)) {
                        selected = false;
                        feature.getGeometry().forEachLatLng(function(latLng) {
                            if (!selected && bounds.contains(latLng)) {
                                n2.maps.TerritoryItems.addItem(feature.getId(), zoomType);
                                var styleConfig = n2.maps.Constants.STYLE_SELECTED;
                                if (n2.maps.Context.currentTerritoryIndex >= 0 && n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex].color) {
                                    styleConfig.fillColor = n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex].color;
                                }
                                n2.maps.Context.map.data.overrideStyle(feature, styleConfig);
                                selected = true;
                            }
                        });
                    }
                });

                // Update the selected features panel
                n2.maps.TerritoryItems.updatePanel();

                // Remove the selection box
                n2.maps.Context.selectionBox.setMap();
                n2.maps.Context.selectionBox = null;
            }
        }
    },

    /**
     * On a mouse move event, update the selection box bounds
     */
    selectionMouseMove: function(event) {
        if (n2.maps.Context.shiftPressed && n2.maps.Context.mouseDown) {
            if (n2.maps.Context.selectionBox) {
                // If we have a select box, update the bounds based on the mouse down and current position, switching the direction as appropriate
                var bounds = {};
                if (event.latLng.lat() >= n2.maps.Context.mouseDownPosition.lat()) {
                    bounds.north = event.latLng.lat();
                    bounds.south = n2.maps.Context.mouseDownPosition.lat();
                } else {
                    bounds.north = n2.maps.Context.mouseDownPosition.lat();
                    bounds.south = event.latLng.lat();
                }
                if (event.latLng.lng() >= n2.maps.Context.mouseDownPosition.lng()) {
                    bounds.east = event.latLng.lng();
                    bounds.west = n2.maps.Context.mouseDownPosition.lng();
                } else {
                    bounds.east = n2.maps.Context.mouseDownPosition.lng();
                    bounds.west = event.latLng.lng();
                }
                n2.maps.Context.selectionBox.setBounds(bounds);
            } else {
                // Setup a new rectangle for the selection box
                n2.maps.Context.selectionBox = new google.maps.Rectangle({
                    map: n2.maps.Context.map,
                    bounds: new google.maps.LatLngBounds(event.latLng, event.latLng),
                    fillOpacity: 0.3,
                    strokeWeight: 0.5,
                    clickable: false
                });
            }
        }
    }
};

/* globals google: false */
ncsquared.maps.Setup = {

    /**
     * Initialise the map to the page, setting up the event handlers
     */
    initMap: function() {
        // If requested, just stop
        if (n2.maps.Context.stopInit) {
            return;
        }
        // Check the context is initialised
        if (n2.util.isNullOrUndefined(n2.maps.Context.config)) {
            n2.spinner.hide();
            n2.message.error('The maps context has not been initialised');
            return;
        }

        // Show the spinner while we are loading
        n2.spinner.show();

        // Create a deferred for the map setup to resolve at the end of this method, so we continue once everything is done
        var setupMap = n2.util.promise();

        // Initialise the territory mapping data
        var mappingRequest = n2.sf.heroku.get('/json/mapping-data.json')
            .done(function(mappingData) {
                if (n2.util.isFunction(n2.maps.Context.config.mappingDataLoadedHandler)) {
                    n2.maps.Context.config.mappingDataLoadedHandler(mappingData);
                }
            })
            .fail(function(xhr, status, error) {
                n2.spinner.hide();
                n2.message.error('Failed to fetch mapping-data.json: ' + (error || xhr.status));
            });

        // If we don't have a promise to load the territories or geometry, create one to just resolve with an empty array/object
        var loadTerritoriesPromise = n2.maps.Context.config.loadTerritoriesPromise;
        var loadGeometriesPromise = n2.maps.Context.config.loadGeometriesPromise;
        if (n2.util.isNullOrUndefined(loadTerritoriesPromise)) {
            loadTerritoriesPromise = n2.util.promise();
            loadTerritoriesPromise.resolve([]);
        }
        if (n2.util.isNullOrUndefined(loadGeometriesPromise)) {
            loadGeometriesPromise = n2.util.promise();
            loadGeometriesPromise.resolve({});
        }

        // Create promise to request the data via AJAX and setup the map and continue when all are complete
        n2j$.when(mappingRequest, loadTerritoriesPromise, loadGeometriesPromise, setupMap)
            .done(function(mappingResponse, loadTerritoriesResponse, loadGeometriesResponse) {
                // Store the mapping data
                n2.maps.Context.mappingData = mappingResponse[0].data;

                // Load the territories
                n2.maps.Context.territories = loadTerritoriesResponse || [];
                if (loadTerritoriesResponse.length <= n2.maps.Constants.MAX_TERRITORIES_FOR_SUMMARY) {
                    n2.maps.Context.geometries = loadGeometriesResponse || {};
                }
                n2.maps.Territories.loadTerritories();
                n2.spinner.hide();
            });

        // Create the info window for future use
        n2.maps.Context.infoWindow = new google.maps.InfoWindow();

        // Create the map component, setting up the options
        var map = n2.maps.Context.map = new google.maps.Map(document.getElementById(n2.maps.Context.config.map), {
            zoom: 2,
            minZoom: 2,
            center: {
                'lat': 0,
                'lng': 0
            },
            gestureHandling: 'greedy',
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: []
            }
        });

        // Add a function to do the feature styling
        map.data.setStyle(n2.maps.Features.getFeatureStyle);

        // Add handlers for mouse over/out and clicking features
        map.data.addListener('mouseover', n2.maps.Mouse.featureMouseOver);
        map.data.addListener('mouseout', n2.maps.Mouse.featureMouseOut);
        map.data.addListener('click', n2.maps.Mouse.featureClick);
        map.data.addListener('dblclick', n2.maps.Mouse.featureDoubleClick);
        map.data.addListener('rightclick', n2.maps.Mouse.featureRightClick);

        // Add handlers for mouse down, up and move events related to the selection box
        map.addListener('mousedown', n2.maps.Mouse.selectionMouseDown);
        map.data.addListener('mousedown', n2.maps.Mouse.selectionMouseDown);
        map.addListener('mouseup', n2.maps.Mouse.selectionMouseUp);
        map.data.addListener('mouseup', n2.maps.Mouse.selectionMouseUp);
        map.addListener('mousemove', n2.maps.Mouse.selectionMouseMove);
        map.data.addListener('mousemove', n2.maps.Mouse.selectionMouseMove);

        // Add handlers for rest of application
        n2.maps.Setup.addWindowHandlers();
        n2.maps.Setup.addDocumentHandlers();

        // Resolve the map setup to continue with loading the page once AJAX requests are complete
        setupMap.resolve();
    },

    /**
     * Add the window level handlers for various functions in the application
     */
    addWindowHandlers: function() {
        n2j$(window)
            // Keep track of the shift pressed state and change the cursor appropriately to indicate the user can draw a selection box
            .keydown(function(event) {
                if (!n2.maps.Context.shiftPressed && event.which === n2.key.KEY_SHIFT && n2.maps.Context.config.isEditable && n2.maps.Context.currentItems) {
                    n2.maps.Context.shiftPressed = true;
                    n2.maps.Context.map.setOptions({
                        draggableCursor: 'crosshair'
                    });
                    n2.maps.Context.map.data.revertStyle();
                }
            }).keyup(function(event) {
                if (n2.maps.Context.shiftPressed && event.which === n2.key.KEY_SHIFT) {
                    n2.maps.Context.shiftPressed = false;
                    n2.maps.Context.map.setOptions({
                        draggableCursor: ''
                    });
                    n2.maps.Context.map.data.revertStyle();
                }
            });
    },

    /**
     * Add the document level handlers for various functions in the application
     */
    addDocumentHandlers: function() {
        var getTerritoryIndex = function(element) {
            return Number(element.getAttribute('data-index'));
        };

        n2j$(document)
            .on('click', n2.maps.Context.config.territories + ' button.n2__territory-item-btn', function() {
                n2.maps.Territories.loadTerritory(getTerritoryIndex(this));
            })
            .on('click', n2.maps.Context.config.territories + ' button.n2__remove-territory-feature', function() {
                var button = n2j$(this);
                n2.maps.TerritoryItems.removeItem(button.attr('data-id'), button.closest('li.n2__territory-type').attr('data-type'));
            })
            .on('click', n2.maps.Context.config.territories + ' a.n2__territory-edit-items', function() {
                n2.maps.Territories.loadTerritory(getTerritoryIndex(this));
            })
            .on('click', n2.maps.Context.config.territories + ' a.n2__territory-edit-properties', function() {
                n2.maps.Context.config.editTerritoryPropertiesHandler(n2.maps.Context.territories[getTerritoryIndex(this)]);
            })
            .on('click', n2.maps.Context.config.territories + ' a.n2__territory-edit-delete', function() {
                n2.maps.Context.config.deleteTerritoryHandler(n2.maps.Context.territories[getTerritoryIndex(this)]);
            })
            .on('click', n2.maps.Context.config.breadcrumb + ' a.n2__breadcrumb-item', function() {
                n2.maps.Breadcrumb.loadFromBreadcrumb(this.getAttribute('data-index'));
            });
    }
};

ncsquared.maps.Territories = {

    /**
     * Load the territories into the side panel and add them to the map
     */
    loadTerritories: function() {
        n2.spinner.show();

        // Clean up any displayed territory
        n2.maps.Context.currentItems = null;
        n2.maps.Context.currentTerritoryIndex = -1;
        n2.maps.Breadcrumb.reset();
        n2.maps.Breadcrumb.updatePanel();

        // Configure UI state
        n2.maps.Context.config.editModeHandler(false);

        // Clean up any existing features
        n2.maps.Context.map.data.forEach(function(feature) {
            n2.maps.Context.map.data.remove(feature);
        });

        var territoriesLength = n2.maps.Context.territories.length;
        if (territoriesLength === 0) {
            // Show no territories message and clear the panel
            n2.maps.Context.config.noTerritoriesHandler(true);
            n2j$(n2.maps.Context.config.territories).html('');
            n2.spinner.hide();
        } else {
            // Hide no territories message
            n2.maps.Context.config.noTerritoriesHandler(false);

            // Add the geometry of the territory to the GeoJson
            var data = {
                'type': 'FeatureCollection',
                'features': []
            };
            var notLoaded = 0;
            if (territoriesLength <= n2.maps.Constants.MAX_TERRITORIES_FOR_SUMMARY) {
                n2.util.each(n2.maps.Context.territories, function(index, territory) {
                    if (n2.maps.Context.geometries.hasOwnProperty(territory.name)) {
                        data.features.push(n2.maps.Context.geometries[territory.name]);
                    } else {
                        notLoaded++;
                    }
                });
            }

            // Store the number of features we are going to load so that we can hide the mask once all features have been styled
            n2.maps.Context.loadedFeatures = territoriesLength - notLoaded;

            // Zoom the map to the bounds of the whole map
            n2.maps.Context.map.fitBounds(n2.maps.Constants.DEFAULT_BOUNDS);

            // Add the GeoJson data to the map
            n2.maps.Context.map.data.addGeoJson(data);

            // Sort the territories then update the territories list
            n2.maps.Territories.sortTerritories();
            n2.maps.Territories.updatePanel(n2.maps.Context.territoriesFilter);

            // Hide the mask after 5 secs in case the style countdown didn't work, or straight away if there is no data to load
            setTimeout(n2.spinner.hide, n2.maps.Context.loadedFeatures === 0 ? 0 : 5000);
        }
    },

    /**
     * Sort the territories
     */
    sortTerritories: function() {
        // Sort the territories by name
        n2.maps.Context.territories.sort(function(a, b) {
            return n2.util.compareObjectValues(a, b, 'executionOrder');
        });

        // Add an index to the territory so that it can be used for referencing in other methods
        n2.util.each(n2.maps.Context.territories, function(index, territory) {
            territory._index = index;
        });
    },

    /**
     * Update territories panel
     *
     * @param {String} [filter] An optional case-insensitive filter to apply to the list, if null or empty string all will be shown
     */
    updatePanel: function(filter) {
        if (!n2.util.isNullOrUndefined(filter)) {
            filter = filter.toLowerCase();
        }
        n2.maps.Context.territoriesFilter = filter;
        var territories = n2.util.map(n2.maps.Context.territories, function(territory) {
            if (filter && territory.name.toLowerCase().indexOf(filter) === -1) {
                return null;
            }
            return {
                _index: territory._index,
                color: territory.color,
                executionOrder: territory.executionOrder,
                name: territory.name
            };
        });

        var html = n2.ui.renderTemplate(n2.maps.HTML.HTML_TERRITORIES_LIST, {
            territories: territories,
            isEditable: n2.maps.Context.config.isEditable
        });
        n2j$(n2.maps.Context.config.territories).html(html);
    },

    /**
     * Load a given territory into the map
     */
    loadTerritory: function(index) {
        // Update the local data for the current territory
        index = Number(index);
        n2.maps.Context.currentTerritoryIndex = index;
        var territory = n2.maps.Context.territories[index];
        n2.maps.Context.currentItems = n2.util.clone(territory.items);
        n2.maps.Breadcrumb.reset();

        // Update the territories panel and buttons
        n2.maps.Context.config.editModeHandler(true, territory.name);
        n2.maps.TerritoryItems.updatePanel();

        // If we have a default zoom, create the breadcrumb
        if (n2.util.isArray(territory.defaultZoom) && territory.defaultZoom.length > 0) {
            // We need to check that the country supports that zoom type
            var country = territory.defaultZoom[0].id;
            var validTypes = n2.maps.Constants.ZOOM_COUNTRIES_TYPES[country];

            n2.util.each(territory.defaultZoom, function(index, zoom) {
                if (validTypes && validTypes.indexOf(zoom.type) !== -1) {
                    n2.maps.Breadcrumb.addItem(zoom.id, zoom.type);
                }
            });
        }

        // Load the map data for the territory
        var geometry = n2.maps.Context.geometries[territory.name] || {};
        n2.maps.Features.loadGeoJsonData(geometry.bbox);
    },

    /**
     * Create a territory and load it
     */
    createTerritory: function(name, color) {
        // Create the territory
        var territory = {
            name: name,
            color: color || n2.maps.Constants.TERRITORY_COLORS[n2.maps.Context.territories.length],
            items: {},
            executionOrder: n2.maps.Context.territories.length + 1
        };
        // Clone the territories so we can revert if needed
        var oldTerritories = n2.util.clone(n2.maps.Context.territories);
        n2.maps.Context.territories.push(territory);

        // Save the territories and return the promise
        return n2.maps.Territories.saveTerritory(territory)
            .done(function() {
                // Sort and update the list of territories then load the created one
                n2.maps.Territories.sortTerritories();
                n2.maps.Territories.updatePanel(n2.maps.Context.territoriesFilter);
                n2.maps.Territories.loadTerritory(n2.maps.Context.territories.indexOf(territory));
            })
            .fail(function() {
                // If it fails revert the territories
                n2.maps.Context.territories = oldTerritories;
            });
    },

    /**
     * Update the name and colour of a territory
     */
    updateTerritory: function(index, name, color) {
        var territory = n2.maps.Context.territories[index];
        // Clone the territory so we can revert if needed
        var oldTerritory = n2.util.clone(territory);

        // Update the geometry properties and add it back under the name name
        var geometry;
        if (n2.maps.Context.geometries.hasOwnProperty(territory.name)) {
            geometry = n2.maps.Context.geometries[territory.name];
            geometry.properties.name = name;
            geometry.properties.color = color;
            delete n2.maps.Context.geometries[territory.name];
            n2.maps.Context.geometries[name] = geometry;
        }
        // Update the territory properties
        territory.name = name;
        territory.color = color;

        // Save the territory then update the panel, force a refresh on the map to pickup the new colour and return the promise
        return n2.maps.Territories.saveTerritory(territory, geometry)
            .done(function() {
                n2.maps.Territories.sortTerritories();
                n2.maps.Territories.updatePanel(n2.maps.Context.territoriesFilter);
                n2.maps.Context.map.data.forEach(function(feature) {
                    n2.maps.Context.map.data.revertStyle(feature);
                });
            })
            .fail(function() {
                // If it fails revert the territory
                n2.maps.Context.territories[index] = oldTerritory;
            });
    },

    /**
     * Updates the current territory items, fetching the geometry data from the server to store it
     */
    updateCurrentTerritoryItems: function() {
        n2.spinner.show();

        var territory = n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex];
        var path = n2.maps.Constants.COMBINE_URL + '?name=' + encodeURIComponent(territory.name) + '&color=' + encodeURIComponent(territory.color);
        n2.sf.heroku.post(path, n2.maps.Context.currentItems)
            .done(function(response) {
                // Clone the territory so we can revert if needed
                var oldTerritory = n2.util.clone(territory);
                // Update the territory and geometry with the new data
                territory.items = n2.maps.Context.currentItems;
                territory.defaultZoom = response.defaultZoom;

                // Save the territories and the new geometry
                var saveGeometry = n2.maps.Context.territories.length <= n2.maps.Constants.MAX_TERRITORIES_FOR_SUMMARY;
                n2.maps.Territories.saveTerritory(territory, saveGeometry ? response.feature : '')
                    .done(function() {
                        // If successful store the geometry and load the territories panel
                        if (saveGeometry) {
                            n2.maps.Context.geometries[territory.name] = response.feature;
                        }
                        n2.maps.Territories.loadTerritories();
                        n2.spinner.hide();
                    })
                    .fail(function() {
                        // If fails then revert the territory and hide the spinner so save can be tried again
                        n2.maps.Context.territories[n2.maps.Context.currentTerritoryIndex] = oldTerritory;
                        n2.spinner.hide();
                    });
            })
            .fail(function(xhr, status, error) {
                n2.spinner.hide();
                n2.message.error('Failed to generate the combined territory shape: ' + (error || xhr.status));
            });
    },

    /**
     * Save the given territory and geometry by calling the config handler
     */
    saveTerritory: function(territory, geometry) {
        // Clean then call the save handler with the updated territories
        n2.maps.Territories._cleanTerritory(territory);
        var result = n2.maps.Context.config.saveTerritoryHandler(territory, geometry);
        if (n2.util.isPromise(result)) {
            return result;
        }
        // If we weren't given a promise just return a resolved one
        return n2.util.promise().resolve();
    },

    /**
     * Delete a given territory and reload
     */
    deleteTerritory: function(index) {
        // Remove the territory, but clone it first in case we need to revert
        var oldTerritories = n2.util.clone(n2.maps.Context.territories);
        var deletedTerritories = n2.maps.Context.territories.splice(Number(index), 1);

        // Update the execution orders
        if (deletedTerritories.length === 1) {
            n2.util.each(n2.maps.Context.territories, function(index, territory) {
                territory.executionOrder = index + 1;
            });

            // Clean, save and reload the territories and delete the geometry
            n2.maps.Territories._cleanTerritory(deletedTerritories[0]);
            var result = n2.maps.Context.config.saveTerritoryDeleteHandler(deletedTerritories[0]);
            if (n2.util.isPromise(result)) {
                result
                    .done(function() {
                        n2.maps.Territories.loadTerritories();
                        delete n2.maps.Context.geometries[deletedTerritories[0].name];
                    })
                    .fail(function() {
                        // If it fails revert to the territories
                        n2.maps.Context.territories = oldTerritories;
                    });
            } else {
                n2.maps.Territories.loadTerritories();
                delete n2.maps.Context.geometries[deletedTerritories[0].name];
            }
        }
    },

    reorderTerritories: function(changedTerritories) {
        if (Object.keys(changedTerritories).length > 0) {
            // Clone the territories so we can revert if needed
            var oldTerritories = n2.util.clone(n2.maps.Context.territories);

            // If we have any changed rows loop through them updating the execution order
            n2.util.each(n2.maps.Context.territories, function(index, territory) {
                if (changedTerritories.hasOwnProperty(territory.executionOrder)) {
                    territory.executionOrder = changedTerritories[territory.executionOrder];
                }
            });

            // Sort the array, save the territories and update the panel
            n2.maps.Territories.sortTerritories();
            var result = n2.maps.Context.config.saveTerritorieReorderHandler(changedTerritories);
            if (n2.util.isPromise(result)) {
                return result
                    .done(function() {
                        n2.maps.Territories.updatePanel(n2.maps.Context.territoriesFilter);
                    })
                    .fail(function() {
                        // If it fails revert the territories and reject the promise
                        n2.maps.Context.territories = oldTerritories;
                        return false;
                    });
            }

            // If we weren't given a promise just update the panel and return a new resolved one
            n2.maps.Territories.updatePanel(n2.maps.Context.territoriesFilter);
            return n2.util.promise().resolve();
        }
    },

    /**
     * Clean the given territory to remove the temporary properties. Object provided will be updated
     */
    _cleanTerritory: function(territory) {
        // Strip out the temporary underscore properties as they aren't needed by the server and will be re-populated by the client if needed
        n2.util.eachDeep(territory, function(parent, indexOrKey) {
            if (n2.util.isString(indexOrKey) && indexOrKey.indexOf('_') === 0) {
                delete parent[indexOrKey];
            }
        });
    }
};

ncsquared.maps.TerritoryItems = {

    /**
     * Returns the index of an item from the given array, or -1 if it is not found
     */
    _getIndex: function(items, id, type, country) {
        var foundIndex = -1;
        if (items && items.hasOwnProperty(type)) {
            n2.util.each(items[type], function(index, item) {
                if (id === item.id && (!country || country === item.c)) {
                    foundIndex = index;
                    return false;
                }
            });
        }
        return foundIndex;
    },

    /**
     * Returns whether or not a given item is selected in the current territory
     */
    isSelectedInCurrent: function(id, type, country) {
        return n2.maps.TerritoryItems._getIndex(n2.maps.Context.currentItems, id, type, country) !== -1;
    },

    /**
     * Returns the index of the territory where a given item is selected, or -1 if not selected
     */
    getTerritoryIndex: function(id, type, country) {
        var foundIndex = -1;
        n2.util.each(n2.maps.Context.territories, function(index, territory) {
            if (index !== n2.maps.Context.currentTerritoryIndex && n2.maps.TerritoryItems._getIndex(territory.items, id, type, country) !== -1) {
                foundIndex = index;
                return false;
            }
        });
        return foundIndex;
    },

    /**
     * Returns whether or not a given item is selected in any territory that isn't the current
     */
    isSelectedInTerritories: function(id, type, country) {
        return n2.maps.TerritoryItems.getTerritoryIndex(id, type, country) !== -1;
    },

    /**
     * On click, select the item as stored in the click event. If it's already selected then un-select it
     */
    itemClick: function() {
        n2.maps.Context.infoWindow.close();
        if (n2.maps.Context.clickEvent) {
            var id = n2.maps.Context.clickEvent.feature.getId();
            var zoomType = n2.maps.Zoom.getCurrentZoomType();
            var country = n2.maps.Breadcrumb.getCurrentItem().country;
            if (!n2.maps.TerritoryItems.isSelectedInTerritories(id, zoomType, country)) {
                var selectedIndex = n2.maps.TerritoryItems._getIndex(n2.maps.Context.currentItems, id, zoomType, country);
                if (selectedIndex === -1) {
                    n2.maps.TerritoryItems.addItem(id, zoomType);
                } else {
                    n2.maps.Context.currentItems[zoomType].splice(selectedIndex, 1);
                    // Delete the item type if there are none left
                    if (n2.maps.Context.currentItems[zoomType].length === 0) {
                        delete n2.maps.Context.currentItems[zoomType];
                    }
                }

                // Revert the style so that the selection styling is picked up, then re-add the hover style
                n2.maps.Context.map.data.revertStyle();
                n2.maps.Context.map.data.overrideStyle(n2.maps.Context.clickEvent.feature, n2.maps.Constants.STYLE_HOVER);

                // Update the panel
                n2.maps.TerritoryItems.updatePanel();
            }
        }
    },

    /**
     * Adds the given id and type to the list of selected items, the country and state is retrieved from the current breadcrumb
     */
    addItem: function(id, type) {
        // Check that we haven't got too many items before adding it
        if (n2.maps.TerritoryItems._checkMaxItems(n2.maps.TerritoryItems.getCurrentItemsCount())) {
            if (!n2.maps.Context.currentItems.hasOwnProperty(type)) {
                n2.maps.Context.currentItems[type] = [];
            }
            var item = {
                id: id
            };
            if (n2.maps.Breadcrumb.length() > 1) {
                item.c = n2.maps.Context.breadcrumb[1].id;
                if (n2.maps.Breadcrumb.getCurrentItem().stateParent) {
                    item.s = n2.maps.Context.breadcrumb[2].id;
                }
            }
            if (n2.maps.Constants.ZOOM_TYPE_COUNTRY === type) {
                item._name = n2.maps.Context.mappingData.countryNames[id];
            } else if (n2.maps.Constants.ZOOM_TYPE_STATE === type) {
                item._name = n2.maps.Context.mappingData.stateNames[id];
            }

            n2.maps.Context.currentItems[type].push(item);
        }
    },

    /**
     * Add the provided territory items to the current territory, then refresh the panel
     */
    addItems: function(items) {
        // Get how many items we currently have
        var count = n2.maps.TerritoryItems.getCurrentItemsCount();

        // For the given items, check if they are already selected, and if not add them to the list of current items
        var country = n2.maps.Breadcrumb.getCurrentItem().country;
        n2.util.each(items, function(index, value) {
            if (!n2.maps.TerritoryItems.isSelectedInCurrent(value.id, value._type, country) && !n2.maps.TerritoryItems.isSelectedInTerritories(value.id, value._type, country)) {
                if (n2.maps.TerritoryItems._checkMaxItems(count)) {
                    count++;
                    if (n2.maps.Context.currentItems.hasOwnProperty(value._type)) {
                        n2.maps.Context.currentItems[value._type].push(value);
                    } else {
                        n2.maps.Context.currentItems[value._type] = [value];
                    }
                } else {
                    return false;
                }
            }
        });

        // Refresh the panel and force a refresh of the map styles
        n2.maps.TerritoryItems.updatePanel();
        n2.maps.Context.map.data.forEach(function(feature) {
            n2.maps.Context.map.data.revertStyle(feature);
        });
    },

    /**
     * Removes thte selected item from the territory and refreshes the panel and map
     */
    removeItem: function(id, type) {
        var index = n2.maps.TerritoryItems._getIndex(n2.maps.Context.currentItems, id, type);
        if (index !== -1) {
            n2.maps.Context.currentItems[type].splice(index, 1);
            // Delete the item type if there are none left
            if (n2.maps.Context.currentItems[type].length === 0) {
                delete n2.maps.Context.currentItems[type];
            }
            n2.maps.TerritoryItems.updatePanel();
            var feature = n2.maps.Context.map.data.getFeatureById(id);
            if (!n2.util.isNullOrUndefined(feature)) {
                n2.maps.Context.map.data.revertStyle(feature);
            }
        }
    },

    /**
     * Update the territory items panel with a list of the currently selected items
     */
    updatePanel: function() {
        // Create the initial context for the template, add the empty country type as it doesn't need multiple and it'll be first
        var canRemove = n2.maps.Context.config.isEditable && n2.maps.Context.currentTerritoryIndex >= 0;
        var context = {
            resolvedName: function() {
                return this._name || this.id;
            },
            canRemove: canRemove,
            types: [{
                name: n2.maps.Constants.ZOOM_TYPE_DESCRIPTIONS[n2.maps.Constants.ZOOM_TYPE_COUNTRY],
                type: n2.maps.Constants.ZOOM_TYPE_COUNTRY,
                order: 0,
                items: []
            }]
        };

        // Hold a map of the types to make it easier to find
        var typeMap = [n2.maps.Constants.ZOOM_TYPE_COUNTRY];

        var typeId;
        var typeMapIndex;
        var name;
        var self = this;
        n2.util.each(n2.maps.Context.currentItems, function(type, items) {
            // For each type in the current items, if it's country just add all the items to the first group
            if (n2.maps.Constants.ZOOM_TYPE_COUNTRY === type) {
                // Populate the names if not already done
                n2.util.each(items, function(itemIndex, item) {
                    self.populateItemName(type, item);
                });
                context.types[0].items = items;
            } else {
                // Otherwise, loop through the items so that we can group by country and state
                n2.util.each(items, function(itemIndex, item) {
                    // Populate the name if not already done
                    self.populateItemName(type, item);

                    // If the type grouping doesn't exist create it and add the item, otherwise just add the item to the existing group
                    typeId = type + '-' + item.c + '-' + item.s;
                    if ((typeMapIndex = typeMap.indexOf(typeId)) === -1) {
                        typeMap.push(typeId);
                        name = n2.maps.Constants.ZOOM_TYPE_DESCRIPTIONS[type] + ' - ' + n2.maps.Context.mappingData.countryNames[item.c];
                        if (!n2.util.isNullOrUndefined(item.s)) {
                            name += ' - ' + n2.maps.Context.mappingData.stateNames[item.s];
                        }

                        context.types.push({
                            name: name,
                            type: type,
                            order: n2.maps.Constants.ZOOM_TYPES.indexOf(type),
                            items: [item]
                        });
                    } else {
                        context.types[typeMapIndex].items.push(item);
                    }
                });
            }
        });

        // Sort the items by type order and name
        context.types.sort(function(a, b) {
            var sort = n2.util.compareObjectValues(a, b, 'order');
            return sort === 0 ? n2.util.compareObjectValues(a, b, 'name') : sort;
        });
        n2.util.each(context.types, function(index, type) {
            type.items.sort(function(a, b) {
                var sort = n2.util.compareObjectValues(a, b, '_name');
                return sort === 0 ? n2.util.compareObjectValues(a, b, 'id') : sort;
            });
        });

        // Render the template then update the DOM
        var html = n2.ui.renderTemplate(n2.maps.HTML.HTML_TERRITORY_ITEMS_LIST, context);
        n2j$(n2.maps.Context.config.territories).html(html);
    },

    /**
     * Populates the names of the territory items from the mapping data
     */
    populateItemName: function(type, item) {
        if (!item.hasOwnProperty('_name')) {
            if (n2.maps.Constants.ZOOM_TYPE_COUNTRY === type) {
                item._name = n2.maps.Context.mappingData.countryNames[item.id];
            } else if (n2.maps.Constants.ZOOM_TYPE_STATE === type) {
                item._name = n2.maps.Context.mappingData.stateNames[item.id];
            }
        }
    },

    getCurrentItemsCount: function() {
        var count = 0;
        if (!n2.util.isNullOrUndefined(n2.maps.Context.currentItems)) {
            n2.util.each(n2.maps.Context.currentItems, function(index, items) {
                count += items.length;
            });
        }
        return count;
    },

    hasTerritoryItems: function() {
        // Check if the current items have any types
        if (!n2.util.isNullOrUndefined(n2.maps.Context.currentItems) && Object.keys(n2.maps.Context.currentItems).length > 0) {
            return true;
        }

        // If not, check all other territories to see if we have any item types (we remove empty item types on delete)
        var hasTerritoryItems = false;
        n2.util.each(n2.maps.Context.territories, function(index, territory) {
            if (index !== n2.maps.Context.currentTerritoryIndex) {
                n2.util.each(territory.items, function(index, items) {
                    if (Object.keys(items).length > 0) {
                        hasTerritoryItems = true;
                        return false;
                    }
                });
                if (hasTerritoryItems) {
                    return false;
                }
            }
        });
        return hasTerritoryItems;
    },

    _checkMaxItems: function(count) {
        if (count >= n2.maps.Context.config.maxItems) {
            n2.message.show({
                text: 'You have reached the maximum number of items that you can add to a territory: ' + n2.maps.Context.config.maxItems,
                heading: 'Too Many Items',
                theme: 'warning'
            });
            return false;
        }
        return true;
    }
};

/* globals google: false */
ncsquared.maps.Zoom = {

    /**
     * Determines whether the given item id can be zoomed based on the current type
     */
    canBeZoomed: function(id) {
        if (id) {
            var breadcrumbLength = n2.maps.Breadcrumb.length();
            if (breadcrumbLength === 1) {
                return n2.maps.Constants.ZOOM_COUNTRIES.hasOwnProperty(id);
            } else if (breadcrumbLength > 1 && n2.maps.Context.currentType) {
                return n2.maps.Context.currentType.children && n2.maps.Context.currentType.children.length > 0;
            }
        }
    },

    /**
     * Return the zoom types for the given id based on the current type
     */
    getZoomTypes: function(id) {
        if (id) {
            return n2.maps.Context.currentType ? n2.maps.Context.currentType.children : n2.maps.Constants.ZOOM_COUNTRIES[id].children;
        }
        return [];
    },

    /**
     * Get the current zoom type
     */
    getCurrentZoomType: function() {
        return n2.maps.Context.currentType ? n2.maps.Context.currentType.type : n2.maps.Constants.ZOOM_TYPE_COUNTRY;
    },

    /**
     * Update the current type variable based on the set breadcrumb
     */
    updateCurrentZoomType: function() {
        if (n2.maps.Breadcrumb.length() > 1) {
            n2.maps.Context.currentType = n2.maps.Constants.ZOOM_COUNTRIES[n2.maps.Context.breadcrumb[1].id];
            if (n2.maps.Context.currentType.children) {
                n2.util.each(n2.maps.Context.breadcrumb, function(breadcrumbIndex, breadcrumbItem) {
                    n2.util.each(n2.maps.Context.currentType.children, function(typeIndex, childType) {
                        if (childType.type === breadcrumbItem.type) {
                            n2.maps.Context.currentType = childType;
                            return false;
                        }
                    });
                });
            }
        } else {
            n2.maps.Context.currentType = null;
        }
    },

    /**
     * Zoom into a feature based on the stored click event and provided type
     */
    zoomFeature: function(type) {
        n2.maps.Context.infoWindow.close();
        if (n2.maps.Context.clickEvent) {
            var id = n2.maps.Context.clickEvent.feature.getId();
            if (n2.maps.Zoom.canBeZoomed(id)) {
                // Add the new item to the breadcrumb
                n2.maps.Breadcrumb.addItem(id, type);

                // For postal detail, get the bounds of the clicked feature so that we can zoom in on load, as it's not stored in the GeoJson
                var bounds;
                if (n2.maps.Constants.ZOOM_TYPE_POSTAL_DETAIL === type) {
                    bounds = new google.maps.LatLngBounds();
                    n2.maps.Context.clickEvent.feature.getGeometry().forEachLatLng(function(latLng) {
                        bounds.extend(latLng);
                    });
                }

                // Load the GeoJson data based on the new breadcrumb
                n2.maps.Features.loadGeoJsonData(bounds);
            }
        }
    }
};
