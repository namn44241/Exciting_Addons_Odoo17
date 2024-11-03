/** @odoo-module **/

import { BlockUI } from "@web/core/ui/block_ui";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { xml } from "@odoo/owl";
var progress_style = 'default';

patch(BlockUI.prototype,{
    async  setup() {
        super.setup()
        this.orm = useService("orm");
        const data = await this.orm.searchRead(
            "sh.back.theme.config.settings",
            [['id', '=', 1]],
            ["progress_style"]
            );
            if (data) {
                if (data[0]['progress_style'] == 'style_1') {
                     progress_style = 'style_1';
                    }
            }
    },
    block() {
        if (progress_style == 'style_1') {
            NProgress.configure({ showSpinner: false });
            NProgress.start();
        }
        this.state.blockUI = true;
        this.replaceMessage(0);

    },
    unblock() {
        NProgress.done();
        this.state.blockUI = false;
        clearTimeout(this.msgTimer);
        this.state.line1 = "";
        this.state.line2 = "";
    }


});

BlockUI.template = xml`
    <div t-att-class="state.blockUI ? 'o_blockUI fixed-top d-flex justify-content-center align-items-center flex-column vh-100 bg-black-50' : ''">
      <t t-if="state.blockUI">
        <div class="o_spinner mb-4">
            <img src="/web/static/img/spin.svg" alt="Loading..."/>
        </div>
        <div class="o_message text-center px-4">
            <t t-esc="state.line1"/> <br/>
            <t t-esc="state.line2"/>
        </div>
      </t>
    </div>`;
