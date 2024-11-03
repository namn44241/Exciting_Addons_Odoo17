/* @odoo-module */

// ===========================================
//	Language list
// ===========================================

import { Component, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { jsonrpc } from "@web/core/network/rpc_service";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";

export class LanguageTemplate extends Component {
       static components = { Dropdown };
       static template = "LanguageTemplate";

       setup() {
            this.actionService = useService("action");
            this.orm = useService("orm");
            this.search_sh_enable_language_selection()
            this.fetch_sh_get_installed_lang()
        }

       async search_sh_enable_language_selection() {
            this.sh_enable_language_selection = session.sh_enable_language_selection
       }

       async fetch_sh_get_installed_lang() {
            var self = this;
            jsonrpc("/web/dataset/call_kw/res.lang/sh_get_installed_lang", {
                    model: 'res.lang',
                    method: 'sh_get_installed_lang',
                    args: [],
                    kwargs: {},
                }).then(function (languages) {
                    self.languages_list = languages
                    self.selected_lang = session.user_context.lang
                    });
       }

       onBeforeOpen() {
        this.fetch_sh_get_installed_lang();
        }

       change_sh_user_lang(e){
            var self = this;
            var lang = e[0]
            var self = this;

            this.orm.write("res.users", [parseInt(session.user_context.uid)], { 'lang': lang }).then(function () {
            self.actionService.doAction({
                        name: 'Reload Context',
                        type: 'ir.actions.client',
                        tag: 'reload_context',
                    });
        });
        }
}

registry.category("systray").add("sh_entmate_theme.language_template", { Component: LanguageTemplate });

