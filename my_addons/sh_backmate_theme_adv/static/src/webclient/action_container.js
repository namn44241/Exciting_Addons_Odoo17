/** @odoo-module **/


import { ActionDialog } from "@web/webclient/actions/action_dialog";
import { ActionContainer } from '@web/webclient/actions/action_container';
const { Component, tags } = owl;
import { NavBar } from '@web/webclient/navbar/navbar';
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onMounted, onWillStart, onWillDestroy, xml } from "@odoo/owl";
import { markup } from "@odoo/owl";
const components = { ActionContainer };
import { session } from "@web/session";
import { renderToElement } from "@web/core/utils/render";
import {NavTab} from "./navtab/navtab"

var display_notice = false;
var font_color = '#ffffff';
var background_color = '#212121';
var font_size = 12;
var font_family = 'Roboto';
var padding = 5;
var content = ''
var is_animation = false;
var direction = 'right';
var simple_text = false;
var is_popup_notification = false;
var close_notification = false;
var notification_template = '';

patch(components.ActionContainer.prototype, {
    setup() {
       super.setup()
       this.orm = useService("orm");
       this.render_action_template()
    },

    async render_notification_template(){
        
        const output = await this.orm.searchRead(
                        "sh.announcement",
                        [['is_popup_notification', '=', false], ['user_ids.id', 'in', [session.user_context.uid]]],
                        ['is_popup_notification', 'font_size', 'font_family', 'padding', 'name', 'description', 'is_animation', 'direction', 'user_ids', 'simple_text', 'background_color', 'font_color', 'description_text']
                        );
        if (output){
            var i;
            for (i = 0; i < output.length; i++) {
                if (output[i]['user_ids'].includes(session.user_context.uid)) {
                    display_notice = true;
                    background_color = output[i]['background_color']
                    font_size = output[i]['font_size']
                    font_family = output[i]['font_family']
                    padding = output[i]['padding']
                    font_color = output[i]['font_color']
                    is_animation = output[i]['is_animation']
                    direction = output[i]['direction']
                    simple_text = output[i]['simple_text']
                    is_popup_notification = output[i]['is_popup_notification']
                    if (simple_text) {
                        content = output[i]['description_text'] || ''
                    } else {
                        content = output[i]['description']
                    }
                }

            }
            
            if (display_notice && !is_popup_notification) {
                var style = "position:relative;background:" + background_color + ";color:" + font_color + ";font-size:" + font_size + "px;font-family:" + font_family + ";padding:" + padding + "px;"
                var notification_html =   renderToElement(
                                    'sh_backmate_theme_adv.notification', {
                                    display_notice: display_notice,
                                    background_color: background_color,
                                    font_size: font_size,
                                    font_family: font_family,
                                    padding: padding,
                                    font_color: font_color,
                                    is_animation: is_animation,
                                    direction: direction,
                                    simple_text: simple_text,
                                    is_popup_notification: is_popup_notification,
                                    content: content,
                                    style: style,
                                    close_notification: function (ev){
                                        $("#object").css("display", "none");
                                        $("#object1").css("display", "none");
                                    }
                                });
                $(".o_web_client").append(notification_html);
            }

        }

    },
    async render_action_template(){
        var self = this
        await self.render_notification_template().then(function (data){
            self.info = {};
            self.notification_template = notification_template;
            self.onActionManagerUpdate = ({ detail: info }) => {
                self.info = info;
                self.render();
            };
            self.env.bus.addEventListener("ACTION_MANAGER:UPDATE", self.onActionManagerUpdate);
        });
    },

    close_backmate_theme_layout(){
        /*close pop-ups*/
        $('.backmate_theme_layout').removeClass("sh_theme_model");
        $('.todo_layout').removeClass("sh_theme_model");
        $('.todo').removeClass('todo_active');
        $('.sh_calc_util').removeClass("active")
		$(".sh_calc_results").html("");
		$('.sh_wqm_quick_menu_submenu_list_cls').css("display","none")
		$('.o_user_bookmark_menu').removeClass('bookmark_active')
		$('.sh_search_results').css("display", "none");

    },

});

ActionContainer.components = { ActionDialog, NavTab };
ActionContainer.template = xml`
    <t t-name="web.ActionContainer">
      <div class="o_action_manager" t-on-click="close_backmate_theme_layout" >
       <NavTab/>
        <t t-if="info.Component" t-component="info.Component" className="'o_action'" t-props="info.componentProps" t-key="info.id"/>
      </div>
    </t>`;
ActionContainer.props = {};


