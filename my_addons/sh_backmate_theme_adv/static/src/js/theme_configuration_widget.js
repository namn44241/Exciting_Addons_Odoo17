/* @odoo-module */

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class ThemeSettingWidget extends Component {
    static template = "ThemeConfiguration";

    async setup() {
            super.setup()
        }

    _click_sh_theme_design(ev){
        
				if ($(ev.currentTarget.parentElement.getElementsByClassName('collapse')).css('display') == 'none')
				{
				    $(ev.currentTarget.parentElement.getElementsByClassName('collapse')).slideDown('slow')
				}else{
					$(ev.currentTarget.parentElement.getElementsByClassName('collapse')).slideUp(600)
				}
    }
}

registry.category("systray").add("sh_backmate_theme_adv.ThemeSettingWidget", { Component: ThemeSettingWidget });