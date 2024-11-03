/* @odoo-module */

import { Component, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { ToDoWidget } from "./todo_widget";

export class ToDoTemplate extends Component {
       static template = "ToDoTemplate";

        setup() {
            this.orm = useService("orm");
            this.sh_enable_todo_mode = session.sh_enable_todo_mode
        }

       _click_todo() {
       /*close pop-ups*/
        $('.sh_wqm_quick_menu_submenu_list_cls').css('display','none')
        $('.o_user_bookmark_menu').removeClass('bookmark_active')
        $('.sh_calc_util').removeClass("active")
        $(".sh_calc_results").html("");

			if ($('.todo_layout').length) {
				if ($('.sh_theme_model').length) {
					$('.todo_layout').removeClass('sh_theme_model');
					$('.todo').removeClass('todo_active');
				} else{
					$('.todo_layout').addClass('sh_theme_model');
					$('.todo').addClass('todo_active');
				}
			}else{
				this.body_container = new todo_widget();
				this.body_container.appendTo($('.o_web_client')).then(function () {
					$('.todo_layout').addClass('sh_theme_model');
					$('.todo').addClass('todo_active');
				});
			}
        }
}

registry.category("systray").add("sh_backmate_theme_adv.ToDoTemplate", { Component: ToDoTemplate }, { sequence: 25 });
