odoo.define("sh_sale_barcode_mobile.NotificationService", function (require) {
    "use strict";

    var AbstractService = require("web.AbstractService");
    var Notification = require("web.Notification");
    var core = require("web.core");

    var NotificationService = require("web.NotificationService");

    var id = 0;

    var NotificationService = NotificationService.include({
        /**
         * Display a notification at the appropriate location, and returns the
         * reference id to the same widget.
         *
         * Note that this method does not wait for the appendTo method to complete.
         *
         * @param {Object} params
         * @param {function} [params.Notification] javascript class of a notification
         *   to instantiate by default use 'web.Notification'
         * @param {string} params.title notification title
         * @param {string} params.subtitle notification subtitle
         * @param {string} params.message notification main message
         * @param {string} params.type 'notification' or 'warning'
         * @param {boolean} [params.sticky=false] if true, the notification will stay
         *   visible until the user clicks on it.
         * @param {string} [params.className] className to add on the dom
         * @param {function} [params.onClose] callback when the user click on the x
         *   or when the notification is auto close (no sticky)
         * @param {Object[]} params.buttons
         * @param {function} params.buttons[0].click callback on click
         * @param {Boolean} [params.buttons[0].primary] display the button as primary
         * @param {string} [params.buttons[0].text] button label
         * @param {string} [params.buttons[0].icon] font-awsome className or image src
         * @returns {Number} notification id
         */
        notify: function (params) {
            //for play sound start here
            //if message has SH_BARCODE_MOBILE_SUCCESS_
            var str_msg = params.message.match("SH_NOTIFICATION_SUCCESS_");
            if (str_msg) {
                //remove SH_BARCODE_MOBILE_SUCCESS_ from message and make valid message
                params.message = params.message.replace("SH_NOTIFICATION_SUCCESS_", "");

                //play sound
                var src = "/sh_backmate_theme/static/src/sounds/picked.wav";
                $("body").append('<audio src="' + src + '" autoplay="true"></audio>');
            }
            //for play sound ends here

            //for play sound start here
            //if message has SH_BARCODE_MOBILE_FAIL_
            var str_msg = params.message.match("SH_NOTIFICATION_FAIL_");
            if (str_msg) {
                //remove SH_BARCODE_MOBILE_FAIL_ from message and make valid message
                params.message = params.message.replace("SH_NOTIFICATION_FAIL_", "");

                //play sound
                var src = "/sh_backmate_theme/static/src/sounds/error.wav";
                $("body").append('<audio src="' + src + '" autoplay="true"></audio>');
            }
            //for play sound ends here
            return this._super.apply(this, arguments);
        },
    });

    return NotificationService;
});
