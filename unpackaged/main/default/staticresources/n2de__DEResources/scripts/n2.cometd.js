/* Copyright: © 2020 NC Squared Ltd, All Rights Reserved */
window.n2 = window.n2 || {};
n2.cometd = n2.cometd || {};

n2.cometd = {

    /**
     * The current instance of CometD
     * @type {Object}
     * @private
     */
    _cometd: null,
    /**
     * The current subscription
     * @type {Object}
     * @private
     */
    _cometdSubscription: null,
    /**
     * Whether or not CometD is connected
     * @type {Boolean}
     * @private
     */
    _cometdConnected: false,
    /**
     * The listener to handle metadata connection events
     * @type {Function}
     * @private
     */
    _metaConnectListener: null,
    /**
     * The handler for the different messages
     * @type {Function}
     * @private
     */
    _handler: null,
    /**
     * Whether to output debug to the console
     * @type {Boolean}
     * @private
     */
    _debug: false,

    /**
     * Connect and subscribe to a CometD channel
     * @param {String} serverUrl The URL of the server
     * @param {String} sessionId The OAuth session id to use when connecting
     * @param {String} channelName The name of the channel to connect to
     * @param {Function} handler The handler of events and messages, will be called with the type (MESSAGE, CONNECTED, DISCONNECTED, ERROR) and the message from the server
     * @param {Boolean} [debug=false] Whether to output debug to the console
     */
    connect: function(serverUrl, sessionId, channelName, handler, debug) {
        window.onunload = function() {
            n2.cometd._unsubscribe(function() { });
        };

        n2.cometd._handler = handler;
        if (debug === true) {
            n2.cometd._debug = true;
        }

        n2.cometd._unsubscribe(n2.cometd._connect.bind(null, serverUrl, sessionId, channelName));
    },

    /**
     * Returns whether or not the CometD connection is connected
     * @returns {Boolean}
     */
    isConnected: function() {
        return n2.cometd._cometdConnected;
    },

    _connect: function(serverUrl, sessionId, channelName) {
        n2.cometd._log('Connecting');
        n2.cometd._cometd = new org.cometd.CometD();

        if (!n2.cometd._metaConnectListener) {
            n2.cometd._metaConnectListener = n2.cometd._cometd.addListener('/meta/connect', n2.cometd._metaConnect);
        }

        n2.cometd._cometd.websocketEnabled = false;
        n2.cometd._cometd.configure({
            url: serverUrl,
            requestHeaders: { Authorization: 'OAuth ' + sessionId },
            appendMessageTypeToURL: false
        });

        n2.cometd._cometd.handshake(function(message) {
            if (message.successful) {
                n2.cometd._log('Subscribing');
                n2.cometd._cometdSubscription = n2.cometd._cometd.subscribe(channelName, n2.cometd._receiveMessage, function(reply) {
                    if (reply.successful) {
                        n2.cometd._log('Subscribed');
                    } else {
                        n2.cometd._log('Subscribe Failed: ', reply);
                        n2.cometd._handleError(reply);
                    }
                });
            } else {
                n2.cometd._log('Handshake Failed: ', message);
                n2.cometd._handleError(message);
            }
        });
    },

    _receiveMessage: function(message) {
        n2.cometd._log('Message: ', message);
        n2.cometd._handler('MESSAGE', message);
    },

    _metaConnect: function(message) {
        if (n2.cometd._cometd.isDisconnected()) {
            n2.cometd._log('Disconnected: ', message);
            n2.cometd._handler('DISCONNECTED', message);
            n2.cometd._cometdConnected = false;
            return;
        }

        var wasConnected = n2.cometd._cometdConnected;
        n2.cometd._cometdConnected = message.successful;

        if (!wasConnected && n2.cometd._cometdConnected) {
            n2.cometd._log('Connected');
            n2.cometd._handler('CONNECTED', message);
        } else if (wasConnected && !n2.cometd._cometdConnected) {
            n2.cometd._log('Disconnected: ', message);
            n2.cometd._handler('DISCONNECTED', message);
        }
    },

    _unsubscribe: function(callback) {
        if (!callback) {
            callback = function() { };
        }
        if (!n2.cometd._cometd) {
            callback();
            return;
        }

        if (n2.cometd._cometdSubscription) {
            n2.cometd._log('Unsubscribing');
            n2.cometd._cometdSubscription = n2.cometd._cometd.unsubscribe(n2.cometd._cometdSubscription, function(message) {
                if (message.successful) {
                    n2.cometd._log('Unsubscribed');
                } else {
                    n2.cometd._log('Unsubscribe Failed: ', message);
                    n2.cometd._handleError(message);
                }
                n2.cometd._disconnect(callback);
            });
            return;
        }
        n2.cometd._disconnect(callback);
    },

    _disconnect: function(callback) {
        n2.cometd._log('Disconnecting');
        n2.cometd._cometd.disconnect(function() {
            n2.cometd._metaConnectListener = n2.cometd._cometd.removeListener(n2.cometd._metaConnectListener);
            n2.cometd._cometd = undefined;

            callback();
        });
    },

    _handleError: function(message) {
        var error = 'Unknown error';
        if (message.error) {
            error = message.error;
        } else if (message.failure && message.failure.reason) {
            error = message.failure.reason;
        } else if (message.failureReason) {
            error = message.failureReason;
        }
        n2.cometd._handler('ERROR', error);
    },

    _log: function(prefix, message) {
        if (n2.cometd._debug) {
            console.log(prefix + (message ? JSON.stringify(message) : ''));
        }
    }
};
