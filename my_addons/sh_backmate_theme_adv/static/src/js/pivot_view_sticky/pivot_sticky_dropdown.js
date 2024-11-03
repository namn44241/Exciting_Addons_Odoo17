/** @odoo-module **/
import { Dropdown } from "@web/core/dropdown/dropdown";
import { patch } from "@web/core/utils/patch";
import { PivotGroupByMenu } from "@web/views/pivot/pivot_group_by_menu";


const components = { Dropdown, PivotGroupByMenu };

patch(components.PivotGroupByMenu.prototype, {
    onGroupBySelected({ itemId, optionId }) {
        if($('.o_pivot').hasClass("sh_pivot")){
                $('.o_pivot').removeClass("sh_pivot")    
        }
                
        const item = this.items.find(({ id }) => id === itemId);
        this.props.onItemSelected({
            itemId,
            optionId,
            fieldName: item.fieldName,
            interval: optionId,
            groupId: this.props.cell.groupId,
        });
    }

});
patch(components.Dropdown.prototype, {

    toggle() {
        const toggled = !this.state.open;
        
        if(toggled){
            $('.o_pivot').addClass("sh_pivot")
        }else{

            $('.o_pivot').removeClass("sh_pivot")
        }
        return this.changeStateAndNotify({ open: toggled, groupIsOpen: toggled });

    },
   
});