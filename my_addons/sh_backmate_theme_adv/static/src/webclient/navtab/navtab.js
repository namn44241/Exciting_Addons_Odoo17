/** @odoo-module **/

const { Component, hooks } = owl;
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";

export class NavTab extends Component {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.sh_enable_multi_tab = session.sh_enable_multi_tab
        }

    }

 NavTab.template = 'sh_backmate_theme_adv.NavTab';
