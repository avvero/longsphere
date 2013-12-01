var Jabber;
if (typeof jQuery !== 'undefined') {
	(function($) {

        /*
         The Jabber variable holds all JavaScript code required for communicating with the server.
         It basically wraps the functions in atmosphere.js and jquery.atmosphere.js.
         */
        Jabber = {
            socket: null,
            chatSubscription: null,
            notificationSubscription: null,
            publicSubscription: null,
            transport: null,

            subscribe: function (options) {
                var defaults = {
                    type: '',
                    contentType: "application/json",
                    shared: false,
                    transport: 'websocket',
                    //transport: 'long-polling',
                    fallbackTransport: 'long-polling',
                    trackMessageLength: true
                }
                var jabberRequest = $.extend({}, defaults, options);

                jabberRequest.onOpen = function (response) {
                    console.log('jabberOpen transport: ' + response.transport);
                };
                jabberRequest.onReconnect = function (request, response) {
                    console.log("jabberReconnect");
                };
                jabberRequest.onMessage = function (response) {
                    Jabber.onMessage(response);
                };
                jabberRequest.onError = function (response) {
                    console.log('jabberError: ' + response);
                };
                jabberRequest.onTransportFailure = function (errorMsg, request) {
                    console.log('jabberTransportFailure: ' + errorMsg);
                };
                jabberRequest.onClose = function (response) {
                    console.log('jabberClose: ' + response);
                };
                Jabber.chatSubscription = Jabber.socket.subscribe(jabberRequest);
            },

            unsubscribe: function () {
                Jabber.socket.unsubscribe();
            },

            onMessage: function (response) {
                var data = response.responseBody;
                console.log(data);

            }
        };

        $(window).unload(function () {
            Jabber.unsubscribe();
        });

        $(document).ready(function () {
            if (typeof atmosphere == 'undefined') {
                // if using jquery.atmosphere.js
                Jabber.socket = $.atmosphere;
            } else {
                // if using atmosphere.js
                Jabber.socket = atmosphere;
            }
            var jabberRequest = {
                url: 'log/1'
            };
            Jabber.subscribe(jabberRequest);
            //Jabber.chatSubscription.push("Im in!");
        });
	})(jQuery);
}
