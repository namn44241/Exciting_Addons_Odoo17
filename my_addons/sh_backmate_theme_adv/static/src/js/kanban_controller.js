/** @odoo-module **/

import { KanbanController } from "@web/views/kanban/kanban_controller";
import { patch } from "@web/core/utils/patch";

patch(KanbanController.prototype, {
   
    _onClickRefreshView (ev) { 
        this.actionService.switchView('kanban');
    }
  
});
