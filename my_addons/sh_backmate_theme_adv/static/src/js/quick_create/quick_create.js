
/** @odoo-module **/

import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { jsonrpc, RPCError } from "@web/core/network/rpc_service";
import { _t } from "@web/core/l10n/translation";
import { Many2XAutocomplete } from "@web/views/fields/relational_utils";
import { session } from "@web/session";
import { Component,onWillStart,onWillUpdateProps,useState } from "@odoo/owl";


export class ModelSelection extends Component {
    getDomain() {
        // return [['share', '=', false]];
        return [];
    }
}
ModelSelection.components = {
    Many2XAutocomplete,
}
ModelSelection.props = ["modelname", "modelid", "onUpdateModel"];
ModelSelection.template = "sh_quick_create.ModelSelection";


export class QuickCreateWebsiteSystray extends Component {
    setup() {
        this.user = useService("user");
        this.orm = useService("orm");
        this.actionService = useService("action");
        this.quick_create_view = session.quick_create_view

        onWillStart(async () => {
            this.actionItems = await this.getActionItems(this.props);
        });
        onWillUpdateProps(async (nextProps) => {
            this.actionItems = await this.getActionItems(nextProps);
        });
        this.state = useState({
            showForm: false,
            quick_action_data: false,
            modelId:false,
            modelname:'Select Model',
            IsEditMode:false,
            icon:'fa fa-arrow-right',
            sequence:1,
            CurrentEditId:false,
        });
    }

    EditQuickAction() {
        this.state.IsEditMode = !this.state.IsEditMode
    }

    AddNewQuickAction() {

        console.log('=======modelname=======.',this.state.modelname)
        this.state.IsEditMode = false
        this.state.modelId = false
        this.state.modelname = 'Select Model'
        this.state.showForm = !this.state.showForm

    }

    QuitEditMode() {
        this.state.IsEditMode = false
    }

    async getActionItems(props) {
        jsonrpc("/get/quick/action/data", {}
        ).then((result) => {
            this.state.quick_action_data=result[0]
            this.state.modeldata=result[1]
            // this.state.quick_action_data=result[0]
        });

    }

    RecordEditQuickAction(ev,action_id){
        ev.stopPropagation();
        this.state.showForm = !this.state.showForm
        this.state.CurrentEditId=action_id

        jsonrpc("/get/edit/quick/action/data", {
            action_id:action_id
        }).then((result) => {
            this.state.modelId=result[0].model_id
            this.state.modelname=result[0].name
            this.state.icon=result[0].icon
            this.state.sequence=result[0].sequence
        });

    }

    async onActionSelectedEdit(ev,action){
        ev.preventDefault();
        ev.stopPropagation();
        if (action.model_id !== undefined) {
            this.state.modelId = action.model_id;
        } else {
            console.error('Error: action.model_id is undefined');
        }
        this.state.modelname = action.name
        this.state.CurrentEditId = action.id
        // extra
        this.state.icon=action.icon
        this.state.sequence=action.sequence
        this.state.showForm = !this.state.showForm
    }

    async onActionSelected(ev,action){
        this.actionService.doAction({
            type: 'ir.actions.act_window',
            // name: _t('Manage Questions Setting'),
            target: 'new',
            res_model: action.model_name,
            views: [[false, 'form']],
        });   
    }


    async DeleteNewAction(){
        await jsonrpc("/unlink/quick/action/data", {
            action_id:this.state.CurrentEditId
        }).then((result) => {
            this.state.CurrentEditId=false
            this.state.IsEditMode = false
            this.state.showForm =false
            this.state.modelId=false
            this.state.modelname=false
            this.state.icon='fa fa-car'
            this.state.sequence=1
            this.getActionItems()
        });
    }

    async SaveAction(){
        let isEmpty = false;
        const formData = {};
        const inputs = document.querySelectorAll('.sh_input_data');
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                isEmpty = true;
            }
            formData[input.name] = input.value.trim();
        });
        
        if (isEmpty || this.state.modelname=='Select Model') {
            $('#quick_create_errors_msg').removeClass("d-none");
        }

        // FOR SAVE AFTER EDIT
        else if(this.state.IsEditMode){
            formData['model_id'] = this.state.modelId;
            $('#quick_create_errors_msg').addClass('d-none');
            jsonrpc("/update/quick/action", {
                'data': formData,
                'action_id': this.state.CurrentEditId,
              }).then((result) => {
                this.getActionItems()
            });
            this.state.showForm=false

        }
        // FOR SAVE WHEN NEW CREATE
        else {  
            formData['model_id'] = this.state.modelId;
            this.state.modelId=false
            this.state.modelname=false

            $('#quick_create_errors_msg').addClass('d-none');
            jsonrpc("/create/quick/action", {
                'data': formData,
              }).then((result) => {
                this.getActionItems()
            });
            this.state.showForm=false
        }

    }
    onUpdateModel(props){
        if (props){
            this.state.modelId=props[0].id
            this.state.modelname=this.state.modeldata[props[0].id]
            this.props.modelname=this.state.modeldata[props[0].id]
        }
        else{
            this.state.modelId=false
            this.state.modelname=false
            this.props.modelname=''
        }

    }
}
QuickCreateWebsiteSystray.template = "sh_quick_create.QuickCreateWebsiteSystray";
QuickCreateWebsiteSystray.components = { Dropdown, DropdownItem,ModelSelection };
// UserMenu.props = {};

export const systrayItem = {
    Component: QuickCreateWebsiteSystray,
};


registry.category("systray").add("QuickCreateWebsiteSystray", systrayItem, { sequence: 110 });
