/** @odoo-module **/

import { ListController } from "@web/views/list/list_controller";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { useService } from "@web/core/utils/hooks";

var show_expand_collapse = false

patch(ListController.prototype, {

    setup(...args) {
        super.setup(...args)
        this.orm = useService("orm");
        this.search_enable_expand_collapse()

    },

    async search_enable_expand_collapse() {
            const data = await this.orm.searchRead(
            "res.users",
            [['id', '=', session.uid]],
            ["sh_enable_expand_collapse"]
            );
             if (data) {
             this.show_expand_collapse = data[0].sh_enable_expand_collapse
        }
     },

    _onClickRefreshView (ev) {
        this.actionService.switchView('list');
    },

    shExpandGroups () {

        $(document).find('.o_group_header').each(function () {
            var $header = $(this);
            if (!$header.hasClass('o_group_open')) {
                $header.find('.o_group_name').click();
            }
        });
    },

    shCollapseGroups () {
        $(document).find('.o_group_header').each(function () {
            var $header = $(this);
            if ($header.hasClass('o_group_open')) {
                $header.find('.o_group_name').click();
            }
        });
    },

});

