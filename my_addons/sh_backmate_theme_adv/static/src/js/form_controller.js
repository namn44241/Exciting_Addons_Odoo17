/** @odoo-module **/

import { FormController } from "@web/views/form/form_controller";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
var sh_disable_auto_edit_model = false
import { session } from "@web/session";
import { jsonrpc } from "@web/core/network/rpc_service";
import { Component, onRendered, useEffect, useRef, useState } from "@odoo/owl";
import { useModel } from "@web/model/model";

patch(FormController.prototype, {

     async setup() {
        super.setup();
        if (this.footerArchInfo) {
            // If dialogue box then need to give edit permission
            this.props.preventEdit = false
        }
        else if (session.sh_disable_auto_edit_model){
            this.model.config.mode = 'readonly';
        }
        },

    disableEditButton() {
        if (session.sh_disable_auto_edit_model) {
            return true
        } else {
            return false
        }
    },
    _onClickEditView() {
        this.model.root.switchMode("edit");
        this.shDisplayButtons()
        this.hideEdit = true
    },
    async saveButtonClicked(params = {}) {
        super.saveButtonClicked();
        if (session.sh_disable_auto_edit_model) {
            this.hideEdit = false
            this.model.root.switchMode("readonly");
        }
    },
    async discard() {
       super.discard();
        if (session.sh_disable_auto_edit_model) {
            this.hideEdit = false
        }
            this.model.root.switchMode("readonly");
    },

    async shDisplayButtons() {
        const dirty = await this.model.root.isDirty();

        if (dirty) {
                return false
        }
        else {
                return true
        }
    },

});

