/** @odoo-module **/

import { CalendarController } from "@web/views/calendar/calendar_controller";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";


patch(CalendarController.prototype, {
    setup(...args) {
        super.setup(...args)
        this.actionService = useService('action');
    },
    _onClickRefreshView (ev) { 
        this.actionService.switchView('calendar');
    }
  
});
