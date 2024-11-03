/* @odoo-module */

import { Component, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { jsonrpc } from "@web/core/network/rpc_service";
import { renderToFragment } from "@web/core/utils/render";
import { onWillStart, onMounted } from "@odoo/owl";
import { isMobileOS } from "@web/core/browser/feature_detection";
var show_company = false;


export class GlobalSearchSh extends Component {
    static template = "sh_backmate_theme_adv.GlobalSearch";

    setup() {
        super.setup()
        this.orm = useService("orm");
        this._search_def = $.Deferred();
        this.show_company = show_company
        this.sh_enable_gloabl_search_mode = session.sh_enable_gloabl_search_mode
        this.sidebar_collapse_style = ""
        onMounted(() => {
            if ($("input[name='sidebar_collapse_style']:checked").val() == 'collapsed' && $("input[name='search_style']:checked").val() == 'expanded'){
                $(".sh_search").css("left","80px")
            }
            else{
                $(".sh_search").css("left","275px")
            }
        });
    }

    async _onclick_search_top_bar(event) {
            const data = await this.orm.searchRead(
            "sh.back.theme.config.settings",
            [['id', '=', 1]],
            ["search_style"]);
            if (data) {
                if (!isMobileOS()) {
                    if (data[0]['search_style'] == 'collapsed') {
                        if ($(".usermenu_search_input").css("display") == 'block') {
                            $(".usermenu_search_input").css("display", "none");
                        } else {
                            $(".usermenu_search_input").css("display", "block");
                        }
                    }
                } else {
                    if ($(".usermenu_search_input").css("display") == "block") {
                        $(".usermenu_search_input").css("display", "none");
                    } else {
                        $(".usermenu_search_input").css("display", "block");
                    }
                }
            }
        }

    _linkInfo(key) {
        var original = this._searchableMenus[key];
        return original;
    }
    _getFieldInfo(key) {
        key = key.split('|')[1]
        return key;
    }
    _getcompanyInfo(key) {
        key = key.split('|')[0]
        return key;
    }
    _checkIsMenu(key) {
        key = key.split('|')[0]
        if (key == 'menu') {
            return true;
        } else {
            return false;
        }

    }

    async _searchData() {
        // 
        const data = await this.orm.searchRead(
            "sh.back.theme.config.settings",
            [['id', '=', 1]],
            ["search_style"]);
        if (data) {
              if (!isMobileOS()) {
                if (data[0]['search_style'] == 'expanded') {
                    this.$search_input = $(".sh_search_input input.usermenu_search_input2");
                } else {
                    this.$search_input = $(".sh_search_input input.usermenu_search_input");
                }
                }
              else {
                this.$search_input = $(".sh_search_input input.usermenu_search_input");
                }
            }
        var query = this.$search_input.val();
        if (query === "") {
            $(".sh_search_container").removeClass("has-results");
            $(".sh_search_results").empty();
            return;
        }
        var self = this;

        await jsonrpc("/web/dataset/call_kw/global.search/get_search_result", {
                    model: 'global.search',
                    method: 'get_search_result',
                    args: [[query]],
                    kwargs: {},
                }).then(function (data) {
                    if (data) {
                        self._searchableMenus = data

                        var results = Object.keys(self._searchableMenus)
                        $(".sh_search_results").css("display", "block");
                        $(".sh_search_container").toggleClass("has-results", Boolean(results.length));
                        if (results.length > 0) {
                            $(".sh_search_results").css("display", "block");

                            const sh_search_results_html = renderToFragment(
                                    'sh_backmate_theme_adv.MenuSearchResults', {
                                    results : results,
                                    widget: self,
                                });

                             $(".sh_search_results").html(sh_search_results_html);

                        } else {
                            $(".sh_entmate_theme_appmenu_div").css("opacity", "1");
                            $(".sh_search_results").css("display", "none");
                        }
                    }
        });

    }

    _onSearchResultsNavigate() {
        $("body").addClass("sh_detect_first_keydown")
        $(".sh_search_container").css("display", "block");
        this._search_def.reject();
        this._search_def = $.Deferred();
        setTimeout(this._search_def.resolve.bind(this._search_def), 50);
        this._search_def.done(this._searchData.bind(this));
        return;
    }


}

registry.category("systray").add("sh_backmate_theme_adv.GlobalSearch", { Component: GlobalSearchSh }, { sequence: 25 });