odoo.define('quan_ly_van_ban.language_switch', function (require) {
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');
    var SystrayMenu = require('web.SystrayMenu');

    var LanguageSwitchWidget = Widget.extend({
        template: 'language_switch_buttons',
        events: {
            'click .switch-en': '_onSwitchToEnglish',
            'click .switch-vi': '_onSwitchToVietnamese',
        },

        _onSwitchToEnglish: function () {
            this._switchLanguage('en_US');
        },

        _onSwitchToVietnamese: function () {
            this._switchLanguage('vi_VN');
        },

        _switchLanguage: function (lang) {
            this._rpc({
                model: 'language.switch',
                method: 'switch_language',
                args: [lang],
            }).then(function (result) {
                if (result.success) {
                    location.reload();
                } else {
                    console.error('Language switch failed:', result.message);
                }
            });
        },
    });

    SystrayMenu.Items.push(LanguageSwitchWidget);
    return LanguageSwitchWidget;
});