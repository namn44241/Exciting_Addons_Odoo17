/** @odoo-module **/

import { FormCompiler } from "@web/views/form/form_compiler";
import core from "web.core";
var _t = core._t;
import { patch } from "@web/core/utils/patch";
import {
    append,
    combineAttributes,
    createElement,
    createTextNode,
    getTag,
} from "@web/core/utils/xml";

import {
    useExternalListener,
} from "@odoo/owl";

var session = require('web.session');
patch(FormCompiler.prototype, 'sh_backmate_theme_adv/static/src/js/FullFormWidth.js', {

    setup() {
        this._super()
        useExternalListener(window, "click",this._onClickFullWidthForm);
    },


    _onClickFullWidthForm(ev) {
        if($(ev.path[1]).hasClass('sh_ffw_svg') || $(ev.path[1]).hasClass('full_form_toggle')){

            if (localStorage.getItem("is_full_width") == 't') {
                localStorage.setItem("is_full_width", "f");
                $(ev.target).parents().find('.o_form_sheet').removeClass("sh_full_form")
                $(ev.target).parents().find('.o_content').removeClass("sh_full_content")
                $(ev.target).parents().find('.full_form_toggle').replaceWith('<span class="full_form_toggle"><svg class="sh_ffw_svg" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>full screen - new</title><path d="M233.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C245.65,251.91,246.65,236.91,233.65,236.91Z" transform="translate(-26.98 -178.27)"/><path d="M290,267H442l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35-152,1s-11,1-13,14C278,252,277,267,290,267Z" transform="translate(-26.98 -178.27)"/></svg></span>')

            } else {
                localStorage.setItem("is_full_width", "t");
                $(ev.target).parents().find('.o_form_sheet').addClass("sh_full_form")
                $(ev.target).parents().find('.o_content').addClass("sh_full_content")
                $(ev.target).parents().find('.full_form_toggle').replaceWith('<span class="full_form_toggle"><svg class="sh_ffw_svg" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>exit full screen - new</title><path d="M39,267H191l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35L40,238s-11,1-13,14C27,252,26,267,39,267Z" transform="translate(-26.98 -178.27)"/><path d="M484.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C496.65,251.91,497.65,236.91,484.65,236.91Z" transform="translate(-26.98 -178.27)"/></svg></span>')

            }
        }


    },
   /**
     * @param {Element} el
     * @param {Record<string, any>} params
     * @returns {Element}
     */
    compileSheet(el, params) {
        const sheetBG = createElement("div");
        sheetBG.className = "o_form_sheet_bg";

        const sheetFG = createElement("div");

        if(session.sh_enable_full_width_form){

            if (localStorage.getItem("is_full_width") == 't') {
                sheetFG.className = "o_form_sheet position-relative sh_full_form";
                var sheetIcon = createElement("div");
                sheetIcon.innerHTML = '<div class="sh_full_screen_icon_div"><span class="full_form_toggle" ><svg class="sh_ffw_svg" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>exit full screen - new</title><path d="M39,267H191l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35L40,238s-11,1-13,14C27,252,26,267,39,267Z" transform="translate(-26.98 -178.27)"/><path d="M484.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C496.65,251.91,497.65,236.91,484.65,236.91Z" transform="translate(-26.98 -178.27)"/></svg></span></div>'
               append(sheetBG, sheetIcon);
            }else{
                sheetFG.className = "o_form_sheet position-relative";
                var sheetIcon = createElement("div");
                sheetIcon.innerHTML = '<div class="sh_full_screen_icon_div"><span class="full_form_toggle"><svg class="sh_ffw_svg" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>full screen - new</title><path d="M233.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C245.65,251.91,246.65,236.91,233.65,236.91Z" transform="translate(-26.98 -178.27)"/><path d="M290,267H442l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35-152,1s-11,1-13,14C278,252,277,267,290,267Z" transform="translate(-26.98 -178.27)"/></svg></span></div>'
               append(sheetBG, sheetIcon);
            }
        }else{
            sheetFG.className = "o_form_sheet position-relative";
        }
        

        append(sheetBG, sheetFG);
        for (const child of el.childNodes) {
            const compiled = this.compileNode(child, params);
            if (!compiled) {
                continue;
            }
            if (getTag(child, true) === "field") {
                compiled.setAttribute("showTooltip", true);
            }
            append(sheetFG, compiled);
        }
        return sheetBG;
    }
  
});


// odoo.define('sh_backmate_theme.menu', function (require) {
//     "use strict";


//     var core = require('web.core');
//     // var AppsMenu = require("web.AppsMenu");
//     var config = require("web.config");
//     // var Menu = require("web.Menu");
//     var FormRenderer = require('web.FormRenderer');
//     var BasicRenderer = require('web.BasicRenderer');
//     var AbstractController = require("web.AbstractController");
//     var QWeb = core.qweb;
//     var user = require('web.session');
//     var rpc = require("web.rpc");


//     const BaseSettingRenderer = require('base.settings').Renderer;
//     AbstractController.include({
//         start: async function () {
//             var prom = this._super.apply(this, arguments);
//             if (localStorage.getItem("is_full_width") == 't') {
//                 this.$el.find('.o_content').addClass("sh_full_content")
//             } else {
//                 this.$el.find('.o_content').removeClass("sh_full_content")
//             }
//             return prom;
//         },
//     });



//     // Responsive view "action" buttons
//     FormRenderer.include({
//         events: _.extend({}, BasicRenderer.prototype.events, {
//             'click .full_form_toggle': '_onClickFullWidthForm',
//         }),
        
//         _renderTagSheet: function (node) {
//             this.has_sheet = true;
//             if (user.sh_enable_full_width_form) {
//                 if (localStorage.getItem("is_full_width") == 't') {
//                     var $sheet = $('<div>', { class: 'clearfix position-relative o_form_sheet sh_full_form' });
//                     $sheet.append('<div class="sh_full_screen_icon_div"><span class="full_form_toggle"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>exit full screen - new</title><path d="M39,267H191l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35L40,238s-11,1-13,14C27,252,26,267,39,267Z" transform="translate(-26.98 -178.27)"/><path d="M484.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C496.65,251.91,497.65,236.91,484.65,236.91Z" transform="translate(-26.98 -178.27)"/></svg></span></div>')
//                     $sheet.append(node.children.map(this._renderNode.bind(this)));
//                     //  $(ev.currentTarget).parents().find('.o_content').addClass("sh_full_content")
//                     return $sheet;
//                 } else {
//                     var $sheet = $('<div>', { class: 'clearfix position-relative o_form_sheet' });
//                     $sheet.append('<div class="sh_full_screen_icon_div"><span class="full_form_toggle"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>full screen - new</title><path d="M233.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C245.65,251.91,246.65,236.91,233.65,236.91Z" transform="translate(-26.98 -178.27)"/><path d="M290,267H442l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35-152,1s-11,1-13,14C278,252,277,267,290,267Z" transform="translate(-26.98 -178.27)"/></svg></span></div>')
//                     $sheet.append(node.children.map(this._renderNode.bind(this)));
//                     return $sheet;
//                 }

//             } else {
//                 var $sheet = $('<div>', { class: 'clearfix position-relative o_form_sheet' });
//                 $sheet.append(node.children.map(this._renderNode.bind(this)));
//                 return $sheet;
//             }

//         },
//         _onClickFullWidthForm: function (ev) {
//             if (localStorage.getItem("is_full_width") == 't') {
//                 localStorage.setItem("is_full_width", "f");
//                 $(ev.currentTarget).parents().find('.o_form_sheet').removeClass("sh_full_form")
//                 $(ev.currentTarget).parents().find('.o_content').removeClass("sh_full_content")
//                 $(ev.currentTarget).parents().find('.full_form_toggle').replaceWith('<span class="full_form_toggle"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>full screen - new</title><path d="M233.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C245.65,251.91,246.65,236.91,233.65,236.91Z" transform="translate(-26.98 -178.27)"/><path d="M290,267H442l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35-152,1s-11,1-13,14C278,252,277,267,290,267Z" transform="translate(-26.98 -178.27)"/></svg></span>')

//             } else {
//                 localStorage.setItem("is_full_width", "t");
//                 $(ev.currentTarget).parents().find('.o_form_sheet').addClass("sh_full_form")
//                 $(ev.currentTarget).parents().find('.o_content').addClass("sh_full_content")
//                 $(ev.currentTarget).parents().find('.full_form_toggle').replaceWith('<span class="full_form_toggle"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.68 147.37"><title>exit full screen - new</title><path d="M39,267H191l-37,37s-7,8,2,17c0,0,5,8,18,3l69-65s6-6,0-15l-60-64s-10-5-19,2c0,0-10,8-5,20l33,35L40,238s-11,1-13,14C27,252,26,267,39,267Z" transform="translate(-26.98 -178.27)"/><path d="M484.65,236.91h-152l37-37s7-8-2-17c0,0-5-8-18-3l-69,65s-6,6,0,15l60,64s10,5,19-2c0,0,10-8,5-20l-33-35,152-1s11-1,13-14C496.65,251.91,497.65,236.91,484.65,236.91Z" transform="translate(-26.98 -178.27)"/></svg></span>')

//             }


//         },

//     });






// });
