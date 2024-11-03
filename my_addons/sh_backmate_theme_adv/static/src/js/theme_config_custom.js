/* @odoo-module */

import { Component, useState, xml, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { jsonrpc } from "@web/core/network/rpc_service";
import { renderToElement } from "@web/core/utils/render";


export class ThemeConfigurationTemplate extends Component {
    static template = "ThemeConfigurationTemplate";

    async setup() {
        super.setup()
        this.orm = useService("orm");
        let userAgent = navigator.userAgent;
		let browserName;
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
		var iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
		var is_iPad = navigator.userAgent.match(/iPad/i) != null;
		var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		if(is_safari){
			$('.o_web_client').addClass('backmate_safari')
		}
		if(iOS && !is_iPad){
			if(userAgent.match(/chrome|chromium|crios/i)){
				$('.o_web_client').addClass("sh_iphone_chrome")
			}else{
				$('.o_web_client').addClass("sh_iphone_safari")
			}
		}
        this.user = useService("user");
        var color_change = false;
        if (!$('.backmate_theme_layout').length){
            var self = this
            var theme_configuration_html = renderToElement('ThemeConfiguration',{
                               _click_sh_theme_design: function (ev){
                                self._click_sh_theme_design(ev)
                            },
                            _click_close_setting: function(ev){
                                $('.backmate_theme_layout').removeClass('sh_theme_model');
                            },
                            _click_pre_theme_color_box(ev){
                                var pre_color_id = $(ev.currentTarget).attr('id');

                                $.each($('.pre_theme_color_box'), function (event) {

                                    $(event).removeClass('active');
                                    $(event).find('input[name="preThemeColor"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="preThemeColor"]').attr('checked', true);
                                color_change = true;
                                jsonrpc('/update/theme_style_pre_color',{'pre_color_id': pre_color_id}).then(function (data) {
                                    location.reload();
                                });
                            },
                            /*_click_theme_color_box(ev){
                                var color_id = $(ev.currentTarget).attr('id');

                                $.each($('.theme_color_box'), function (event) {
                                    // 
                                    $(event).removeClass('active');
                                    $(event).find('input[name="themeColor"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="themeColor"]').attr('checked', true);

                                color_change = true;
                                jsonrpc('/update/theme_style_color',{'color_id': color_id}).then(function (data) {
                                    location.reload();
                                });
                            },*/
                            _click_theme_style_box(ev){
                                $.each($('.theme_style_box'), function (event) {
                                        $(event).removeClass('active');
                                        $(event).find('input[name="themeStyle"]').attr('checked', false);
                                    })

                                var color_id = $(ev.currentTarget).attr('id');

                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="themeStyle"]').attr('checked', true);
                                color_change = true;
                                jsonrpc('/update/theme_style',{'color_id': color_id}).then(function (data) {
                                    location.reload();
                                });

                            },
                            _click_discard_color : function(ev){
                                location.reload();
                            },
                            async _click_button_style_box(ev){
                                var button_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="button_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="button_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 button_style : button_style});
                                 if (result){
                                    location.reload();
                                 }
                            },
                            async _click_separator_style_box(ev){
                                var separator_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="separator_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="separator_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 separator_style : separator_style});
                                 if (result){
                                    location.reload();
                                 }
                            },
                            async _click_kanban_style_box(ev){
                                var kanban_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="kanban_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="kanban_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 kanban_box_style : kanban_style});
                                 if (result){
                                    location.reload();
                                 }
                            },
                            async _click_listview_style_box(ev){
                                var listview_style = $(ev.currentTarget).attr('id');
                                $("#listview_table_id").find(".theme_style_box").removeClass('active')
                                $("#listview_table_id").find(".theme_style_box").find('input[name="listview_style"]').attr('checked', false);
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="listview_style"]').attr('checked', true);
                            },
                            async _click_tab_style_box(ev){
                                var tab_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="tab_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="tab_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 horizontal_tab_style : tab_style});
                                 if (result){
                                    location.reload();
                                 }

                            },
                            async _click_form_element_style_box(ev){
                                var form_element_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="form_element_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="form_element_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 form_element_style : form_element_style});
                                 if (result){
                                    location.reload();
                                 }
                           },
                           async _click_breadcrumbs_style_box(ev){
                                var breadcrumbs_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="breadcrumbs_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="breadcrumbs_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 breadcrumb_style : breadcrumbs_style});
                                 if (result){
                                    location.reload();
                                 }
                            },
                            async _click_radio_button_style_box(ev){
                                var radio_button_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="radio_button_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="radio_button_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 radio_btn_style : radio_button_style});
                                 if (result){
                                    location.reload();
                                 }
                           },
                           async _click_checkbox_style_box(ev){
                                var checkbox_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="checkbox_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="checkbox_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 checkbox_style : checkbox_style});
                                 if (result){
                                    location.reload();
                                 }

                           },
                           async _click_scrollbar_style_box(ev){
                                var scrollbar_style = $(ev.currentTarget).attr('id');
                                $.each($('.theme_style_box'), function (event) {
                                    $(event).removeClass('active');
                                    $(event).find('input[name="scrollbar_style"]').attr('checked', false);
                                })
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="scrollbar_style"]').attr('checked', true);
                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                 scrollbar_style : scrollbar_style});
                                 if (result){
                                    location.reload();
                                 }
                           },
                           async _click_font_icon_style_box(ev){
                                var font_icon_style = $(ev.currentTarget).attr('id');
                                    $.each($('.theme_style_box'), function (event) {
                                        $(event).removeClass('active');
                                        $(event).find('input[name="font_icon_style"]').attr('checked', false);
                                    })
                                    $(ev.currentTarget).addClass('active');
                                    $(ev.currentTarget).find('input[name="font_icon_style"]').attr('checked', true);
                                    var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                     backend_all_icon_style : font_icon_style});
                                     if (result){
                                        location.reload();
                                     }
                           },
                            _click_save_color : async function(ev){
                                if (color_change == false) {
                                var is_used_google_font = false
                                var primary_color_id = $('#primary_color_id').val();
                                var secondary_color_id = $('#secondary_color_id').val();
                                var kanban_box_style = $('#kanban_box_style').val();
                                var header_background_color = $("#header_background_color").val();
                                var header_font_color = $("#header_font_color").val();
                                var body_background_color = $("#body_background_color").val();
                                var body_font_family = $("#body_font_family").val();
                                var body_google_font_family = $("#body_google_font_family").val();
                                if (body_font_family == "custom_google_font" ){
                                    is_used_google_font = true
                                }
                                else{
                                    body_google_font_family = 'Muli'
                                }

                                var body_background_type = $("input[name='body_background_type']:checked").val();
                                var header_background_type = $("input[name='header_background_type']:checked").val();
                                var button_style = $("#button_style").val();
                                var separator_style = $("#separator_style").val();
                                var separator_color = $("#separator_color").val();
                                var icon_style = $("input[name='app_icon_style']:checked").val();

                                var backend_all_icon_style = $("#font_awesome_icon_style").val();
                                var dual_tone_icon_color_1 = $("#dual_tone_icon_color_1").val();
                                var dual_tone_icon_color_2 = $("#dual_tone_icon_color_2").val();
                                var body_background_img = $('#body_background_img').val();
                                var sidebar_font_color = $('#sidebar_font_color').val();
                                var sidebar_background_color = $('#sidebar_background_color').val();
                                var sidebar_background_style = $("input[name='sidebar_background_style']:checked").val();
                                var sidebar_background_img = $('#sidebar_background_img').val();
                                var sidebar_collapse_style = $("input[name='sidebar_collapse_style']:checked").val();
                                var predefined_list_view_boolean = $("#predefined_list_view_boolean").prop("checked");
                                var predefined_list_view_style = $("input[name='listview_style']:checked").val();
                                var list_view_border = $("#list_view_border").val();
                                var list_view_even_row_color = $("#list_view_even_row_color").val();
                                var list_view_odd_row_color = $("#list_view_odd_row_color").val();
                                var list_view_is_hover_row = $("#list_view_is_hover_row").prop("checked");
                                var list_view_hover_bg_color = $("#list_view_hover_bg_color").val();
                                var login_page_style = $("input[name='login_style']:checked").val();
                                var login_page_style_comp_logo = $("#login_page_style_comp_logo").prop("checked");
                                var login_page_background_type = $("input[name='login_page_background_type']:checked").val();
                                var login_page_box_color = $("#login_page_box_color").val();
                                var login_page_background_color = $("#login_page_background_color").val();

                                var is_sticky_form = $("#is_sticky_form").prop("checked");
                                var is_sticky_list = $("#is_sticky_list").prop("checked");
                                var is_sticky_list_inside_form = $("#is_sticky_list_inside_form").prop("checked");
                                var is_sticky_pivot = $("#is_sticky_pivot").prop("checked");

                                var tab_style_mobile = $("input[name='tab_mobile_style']:checked").val();
                                var horizontal_tab_style = $("#horizontal_tab_style").val();

                                var navbar_style = $("input[name='navbar_style']:checked").val();
                                var search_style = $("input[name='search_style']:checked").val();
                                var progress_style = $("#progress_style").val();
                                var progress_height = $("#progress_height").val();
                                var progress_color = $("#progress_color").val();

                                var result = await self.orm.write("sh.back.theme.config.settings", [1], {
                                        'primary_color': primary_color_id,
                                        'kanban_box_style': kanban_box_style,
                                        'secondary_color': secondary_color_id,
                                        'header_background_color': header_background_color,
                                        'header_font_color': header_font_color,
                                        'body_background_color': body_background_color,
                                        'body_font_family': body_font_family,
                                        'is_used_google_font': is_used_google_font,
                                        'body_google_font_family': body_google_font_family,
                                        'body_background_type': body_background_type,
                                        'header_background_type': header_background_type,
                                        'button_style': button_style,
                                        'separator_style': separator_style,
                                        'separator_color': separator_color,
                                        'icon_style': icon_style,
                                        'dual_tone_icon_color_1': dual_tone_icon_color_1,
                                        'dual_tone_icon_color_2': dual_tone_icon_color_2,
                                        'sidebar_font_color': sidebar_font_color,
                                        'sidebar_background_style': sidebar_background_style,
                                        'sidebar_background_color': sidebar_background_color,
                                        'sidebar_collapse_style': sidebar_collapse_style,
                                        'predefined_list_view_boolean': predefined_list_view_boolean,
                                        'predefined_list_view_style': predefined_list_view_style,
                                        'list_view_border': list_view_border,
                                        'list_view_even_row_color': list_view_even_row_color,
                                        'list_view_odd_row_color': list_view_odd_row_color,
                                        'list_view_is_hover_row': list_view_is_hover_row,
                                        'list_view_hover_bg_color': list_view_hover_bg_color,
                                        'login_page_style': login_page_style,
                                        'login_page_style_comp_logo': login_page_style_comp_logo,
                                        'login_page_background_type': login_page_background_type,
                                        'login_page_box_color': login_page_box_color,
                                        'login_page_background_color': login_page_background_color,
                                        'is_sticky_form': is_sticky_form,
                                        'is_sticky_list': is_sticky_list,
                                        'is_sticky_list_inside_form': is_sticky_list_inside_form,
                                        'is_sticky_pivot': is_sticky_pivot,
                                        'horizontal_tab_style': horizontal_tab_style,
                                        'search_style': search_style,
                                        'navbar_style': navbar_style,
                                        'progress_style': progress_style,
                                        'progress_height': progress_height,
                                        'progress_color': progress_color,
                                        'backend_all_icon_style': backend_all_icon_style,
                                    });

                                if (result){
                                    location.reload();
                                 }

                                var form = $('#body_background_img')[0];
                                var data = new FormData(form);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }

                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var form = $('#header_background_img')[0];
                                var data = new FormData(form);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {
                                        
                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }

                                    },
                                    error: function (e) {
                                        
                                        console.log("ERROR : ", e);

                                    }
                                });



                                var sidebar_background_img_form = $('#sidebar_background_img')[0];
                                var data5 = new FormData(sidebar_background_img_form);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data5,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });


                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data5,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var login_page_banner_img = $('#login_page_banner_img')[0];
                                var data2 = new FormData(login_page_banner_img);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data2,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var login_page_icon_img = $('#login_page_icon_img')[0];
                                var data2 = new FormData(login_page_icon_img);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data2,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var login_page_icon_img_long = $('#login_page_icon_img_long')[0];
                                var data2 = new FormData(login_page_icon_img_long);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data2,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var login_page_background_img = $('#login_page_background_img')[0];
                                var data3 = new FormData(login_page_background_img);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data3,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

                                var loading_gif = $('#loading_gif')[0];
                                var data4 = new FormData(loading_gif);
                                $.ajax({
                                    type: "POST",
                                    enctype: 'multipart/form-data',
                                    url: "/api/upload/multi",
                                    data: data4,
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    timeout: 600000,
                                    success: function (data) {

                                        console.log("SUCCESS : ", data);
                                        if(data){
                                            setTimeout(function () {
                                                location.reload();

                                            }, 5000);
                                        }
                                    },
                                    error: function (e) {

                                        console.log("ERROR : ", e);

                                    }
                                });

            }
                             },
                            _click_progress_style : function(ev){
                                var progress_style = $("#progress_style").val();
                                if (progress_style == 'style_1') {
                                    $("#progress_color_height").css("display", "table-row");
                                } else {
                                    $("#progress_color_height").css("display", "none");
                                }
                            },
                            _click_header_background_type: function(ev){
                                
                                var radioValue = $("input[name='header_background_type']:checked").val();
                                if (radioValue == 'header_color') {
                                    $('#header_background_color').css("display", "block");
                                    $('#header_background_img').css("display", "none");
                                } else {
                                    $('#header_background_color').css("display", "none");
                                    $('#header_background_img').css("display", "block");
                                }
                            },
                            _click_body_background_type: function(ev){
                                
                                var radioValue = $("input[name='body_background_type']:checked").val();
                                if (radioValue == 'bg_color') {
                                    $('#body_background_color').css("display", "block");
                                    $('#body_background_img').css("display", "none");
                                } else {
                                    $('#body_background_color').css("display", "none");
                                    $('#body_background_img').css("display", "block");
                                }
                            },
                            _click_sidebar_background_style: function(ev){
                                var radioValue = $("input[name='sidebar_background_style']:checked").val();
                                if (radioValue == 'color') {
                                    $('#sidebar_background_color').css("display", "block");
                                    $('#sidebar_background_img').css("display", "none");
                                } else {
                                    $('#sidebar_background_color').css("display", "none");
                                    $('#sidebar_background_img').css("display", "block");
                                }
                            },
                            _click_predefined_list_view_boolean: function(ev){
                                    var predefined_list_view_boolean = $("#predefined_list_view_boolean").prop("checked");
                                    if (predefined_list_view_boolean) {
                                        $('#predefined_list_view_boolean').attr('checked', true);
                                        $(".predefined_list_view_style").css("display", "table-row");
                                        $(".is_row_color_hover").css("display", "none");
                                        $("#list_view_is_hover_row").css("display", "none");
                                        $("#list_view_border").css("display", "none");
                                        $("#list_view_even_row_color").css("display", "none");
                                        $("#list_view_odd_row_color").css("display", "none");
                                        $("#list_view_hover_bg_color").css("display", "none");
                                        $(".list_view_border_even_row_color").css("display","none");
                                        $(".row_hover_odd_row_color").css("display","none");
                                    } else {
                                        $('#predefined_list_view_boolean').attr('checked', false);
                                        $(".predefined_list_view_style").css("display", "none");
                                        $(".is_row_color_hover").css("display", "table-row");
                                        $("#list_view_is_hover_row").css("display", "table-row");
                                        $("#list_view_border").css("display", "table-row");
                                        $("#list_view_even_row_color").css("display", "table-row");
                                        $("#list_view_odd_row_color").css("display", "table-row");
                                        $("#list_view_hover_bg_color").css("display", "table-row");
                                        $(".list_view_border_even_row_color").css("display","table-row");
                                        $(".row_hover_odd_row_color").css("display","table-row");
                                        var list_view_is_hover_row = $("#list_view_is_hover_row").prop("checked");
                                        if (!list_view_is_hover_row){
                                            $(".is_row_color_hover").css("display", "none");
                                        }
                                    }
                            },
                            _click_list_view_is_hover_row: function(ev){
                                var list_view_is_hover_row = $("#list_view_is_hover_row").prop("checked");
                                if (list_view_is_hover_row) {
                                    $(".is_row_color_hover").css("display", "table-row");
                                } else {
                                    $(".is_row_color_hover").css("display", "none");
                                }
                            },
                            _on_change_body_font_family: function(ev){
                                var body_font_family = $('#body_font_family').val();
                                if (body_font_family == 'custom_google_font') {
                                    $("#body_google_font_family").css("display", "block");
                                    $("#body_google_font_family_label").css("display", "block");
                                } else {
                                    $("#body_google_font_family").css("display", "none");
                                    $("#body_google_font_family_label").css("display", "none");
                                }
                            },
                            _on_change_icon_style: function(ev){
                                var icon_style = $(ev.currentTarget).attr('id');
                                $("#icon_style_id").find(".theme_style_box").removeClass('active')
                                $("#icon_style_id").find(".theme_style_box").find('input[name="app_icon_style"]').attr('checked', false);
                                $(ev.currentTarget).addClass('active');
                                $(ev.currentTarget).find('input[name="app_icon_style"]').attr('checked', true);

                                /*var icon_style = $('#icon_style').val();*/
                                if (icon_style != 'dual_tone') {
                                    $(".sh_config_dt_label").css("display", "none");
                                    $("#dual_tone_icon_color_1").css("display", "none");
                                    $("#dual_tone_icon_color_2").css("display", "none");
                                }else if (icon_style == 'dual_tone') {
                                    $(".sh_config_dt_label").css("display", "block");
                                    $("#dual_tone_icon_color_1").css("display", "block");
                                    $("#dual_tone_icon_color_2").css("display", "block");
                                }
                            },
                            // _on_change_discuss_chatter_style: function(ev){
                            //     var discuss_chatter_style = $('#discuss_chatter_style').val();
                            //     if (discuss_chatter_style == 'style_1' || discuss_chatter_style == 'standard') {
                            //         $(".discuss_chatter_background_image").css("display", "none");
                            //         $("#discuss_chatter_style_image").css("display", "none");
                            //     }else if (discuss_chatter_style != 'style_1' || discuss_chatter_style != 'standard') {
                            //         $(".discuss_chatter_background_image").css("display", "block");
                            //         $("#discuss_chatter_style_image").css("display", "block");
                            //     }
                            // },
                            _on_change_login_page_style: function(ev){
                            var login_page_style = $(ev.currentTarget).attr('id');
                            $("#login_style_id").find(".theme_style_box").removeClass('active')
                            $("#login_style_id").find(".theme_style_box").find('input[name="login_style"]').attr('checked', false);
                            $(ev.currentTarget).addClass('active');
                            $(ev.currentTarget).find('input[name="login_style"]').attr('checked', true);
                            if (login_page_style == 'style_0') {
                                $(".login_bg_type").css("display", "none");
                                $(".login_box_color").css("display", "none");
                                $(".login_bg_img").css("display", "none");
                                $(".login_bg_color").css("display", "none");
                                $(".login_bg_img_title").css("display", "none");
                                $(".login_banner_img").css("display", "none");
                                $('.company_icon_image').css("display", "none");
                                $('.company_name_image').css("display", "none");
                                $('.login_page_style_with_comp_logo_tr').css("display", "none");
                            } else if (login_page_style == 'style_1') {
                                $(".login_bg_type").css("display", "none");
                                $(".login_box_color").css("display", "none");
                                $(".login_bg_img").css("display", "none");
                                $(".login_bg_img_title").css("display", "none");
                                $(".login_bg_color").css("display", "none");
                                $(".login_banner_img").css("display", "none");
                                $('.company_icon_image').css("display", "none");
                                $('.company_name_image').css("display", "none");
                                $('.login_page_style_with_comp_logo_tr').css("display", "block");
                            }
                            else if (login_page_style == 'style_2') {

                                $(".login_bg_type").css("display", "none");
                                $(".login_bg_color").css("display", "none");
                                $(".login_box_color").css("display", "block");
                                $(".login_bg_img_title").css("display", "none");
                                $(".login_bg_img").css("display", "none");
                                $(".login_box_color").val("#FFFFFF");

                                $(".login_banner_img").css("display", "block");
                                $('.company_icon_image').css("display", "none");
                                $('.company_name_image').css("display", "none");
                                $('.login_page_style_with_comp_logo_tr').css("display", "none");


                            } else if (login_page_style == 'style_3') {

                                $(".login_bg_type").css("display", "block");
                                $(".login_box_color").css("display", "none");
                                $(".login_bg_img_title").css("display", "block");

                                $(".login_bg_img_title").css("display", "block");
                                $("#login_bg_img").attr('checked', true);
                                $(".login_bg_img").css("display", 'block');
                                $(".login_bg_color").css("display", "none");


                                $(".login_banner_img").css("display", "none");
                                $('.company_icon_image').css("display", "block");
                                $('.company_name_image').css("display", "block");
                                $('.login_page_style_with_comp_logo_tr').css("display", "none");


                            } else if (login_page_style == 'style_4') {

                                $(".login_bg_type").css("display", "block");

                                $(".login_box_color").css("display", "none");

                                $(".login_bg_img_title").css("display", "block");
                                $("#login_bg_img").attr('checked', true);
                                $(".login_bg_img").css("display", 'block');
                                $(".login_bg_color").css("display", "none");

                                $(".login_banner_img").css("display", "none");
                                $('.company_icon_image').css("display", "block");
                                $('.company_name_image').css("display", "none");
                                $('.login_page_style_with_comp_logo_tr').css("display", "none");


                            }

                            },
                            _click_login_page_background_type: function(ev){
                                var radioValue = $("input[name='login_page_background_type']:checked").val();
                                if (radioValue == 'bg_color') {
                                    $('#login_page_background_color').css("display", "block");
                                    $('#login_page_background_img').css("display", "none");
                                } else {
                                    $('#login_page_background_color').css("display", "none");
                                    $('#login_page_background_img').css("display", "block");
                                }
                            },
            });
            $('.o_web_client').append(theme_configuration_html)
            jsonrpc('/get_theme_style',{}).then(function (data) {
                var app_icon_style = data['icon_style']
                if (app_icon_style) {
                    $('#icon_style_id').find('#' + app_icon_style).find('input[name="app_icon_style"]').attr('checked', true);
                }
                if (app_icon_style != 'dual_tone') {
                    $(".sh_config_dt_label").css("display", "none");
                    $("#dual_tone_icon_color_1").css("display", "none");
                    $("#dual_tone_icon_color_2").css("display", "none");
                }else if (app_icon_style == 'dual_tone') {
                    $(".sh_config_dt_label").css("display", "block");
                    $("#dual_tone_icon_color_1").css("display", "block");
                    $("#dual_tone_icon_color_2").css("display", "block");
                }

                var scrollbar_style = data['scrollbar_style']
                if (scrollbar_style) {
                    $('#scrollbar_style_id').find('#' + scrollbar_style).find('input[name="scrollbar_style"]').attr('checked', true);
                }
                var checkbox_style = data['checkbox_style']
                if (checkbox_style) {
                    $('#check_box_style_id').find('#' + checkbox_style).find('input[name="checkbox_style"]').attr('checked', true);
                }
                var radio_button_style = data['radio_btn_style']
                    if (radio_button_style) {
                        $('#radio_button_style_id').find('#' + radio_button_style).find('input[name="radio_button_style"]').attr('checked', true);
                    }
                var breadcrumbs_style = data['breadcrumb_style']
                if (breadcrumbs_style) {
                    $('#breadcrumbs_style_id').find('#' + breadcrumbs_style).find('input[name="breadcrumbs_style"]').attr('checked', true);
                }
                var form_element_style = data['form_element_style']
                if (form_element_style) {
                    $('#form_element_style_id').find('#' + form_element_style).find('input[name="form_element_style"]').attr('checked', true);
                }
                var tab_style = data['horizontal_tab_style']
                if (tab_style) {
                    $('#tab_style_id').find('#' + tab_style).find('input[name="tab_style"]').attr('checked', true);
                }
                var kanban_style = data['kanban_box_style']
                if (kanban_style) {
                    $('#kanban_style_id').find('#' + kanban_style).find('input[name="kanban_style"]').attr('checked', true);
                }
                var separator_style = data['separator_style']
                if (separator_style) {
                    $('#separator_style_id').find('#' + separator_style).find('input[name="separator_style"]').attr('checked', true);
                }
                $('#separator_color').val(data['separator_color']);

                var button_style = data['button_style']
                if (button_style) {
                    $('#button_style_id').find('#' + button_style).find('input[name="button_style"]').attr('checked', true);
                }
                var is_navbar_style = data['navbar_style']
                if (is_navbar_style == 'collapsed') {
                    $('input[name=navbar_style]').attr('checked', true);
                }
                else{
                    $('input[name=navbar_style]').attr('checked', false);
                }
                var active_style = data['theme_style']
                if (active_style) {
                    $('#' + active_style).find('input[name="themeStyle"]').attr('checked', true);
                }
                var active_color = data['theme_color']
                if (active_color) {
                    $('#' + active_color).find('input[name="themeColor"]').attr('checked', true);
                }
                
                var active_pre_color = data['pre_theme_style']
                if (active_pre_color) {
                    $('#' + active_pre_color).find('input[name="preThemeColor"]').attr('checked', true);
                }

                var current_active_style_pallete = data['current_active_style_pallete'];
                if (current_active_style_pallete) {
                    $('#' + current_active_style_pallete).find('input[name="themeStyle"]').attr('checked', true);
                }
                var current_active_color_pallete = data['current_active_color_pallete'];
                if (current_active_color_pallete) {
                    $('#' + current_active_color_pallete).find('input[name="themeColor"]').attr('checked', true);
                }
                var current_active_pre_color_pallete = data['current_active_pre_color_pallete'];
                if (current_active_pre_color_pallete) {
                    $('#' + current_active_pre_color_pallete).find('input[name="preThemeColor"]').attr('checked', true);
                }

                var primary_color = data['primary_color']
                if (primary_color) {
                    $('#primary_color_id').val(primary_color);
                }

                var secondary_color = data['secondary_color']
                if (secondary_color) {
                    $('#secondary_color_id').val(secondary_color);
                }

                var kanban_box_style = data['kanban_box_style']
                if (kanban_box_style) {
                    $('#kanban_box_style').val(kanban_box_style);
                }
                var header_background_color = data['header_background_color']
                if (header_background_color) {
                    $('#header_background_color').val(header_background_color);
                }
                var header_font_color = data['header_font_color']
                if (header_font_color) {
                    $('#header_font_color').val(header_font_color);
                }
                var body_background_color = data['body_background_color']
                if (body_background_color) {
                    $('#body_background_color').val(body_background_color);
                }
                var body_font_family = data['body_font_family']
                if (body_font_family) {
                    $('#body_font_family').val(body_font_family);
                }

                var body_font_family = $('#body_font_family').val();
                if (body_font_family == 'custom_google_font') {

                    $("#body_google_font_family").css("display", "block");
                    $("#body_google_font_family_label").css("display", "block");
                } else {
                    $("#body_google_font_family").css("display", "none");
                    $("#body_google_font_family_label").css("display", "none");
                }
                var body_google_font_family = data['body_google_font_family']
                if (body_google_font_family) {
                    $('#body_google_font_family').val(body_google_font_family);
                }

                var body_background_type = data['body_background_type']
                if (body_background_type == 'bg_img') {
                    $('#bg_img').attr('checked', true);
                    $('#body_background_color').css("display", "none");
                    $('#body_background_img').css("display", "block");
                } else if (body_background_type == 'bg_color') {
                    $('#bg_color').attr('checked', true);
                    $('#body_background_color').css("display", "block");
                    $('#body_background_img').css("display", "none");
                }

                var header_background_type = data['header_background_type']
                if (header_background_type == 'header_img') {
                    $('#header_img').attr('checked', true);
                    $('#header_background_color').css("display", "none");
                    $('#header_background_img').css("display", "block");
                } else if (header_background_type == 'header_color') {
                    $('#header_color').attr('checked', true);
                    $('#header_background_color').css("display", "block");
                    $('#header_background_img').css("display", "none");
                }

                /*var separator_style = data['separator_style']
                if (separator_style) {
                    $('#separator_style').val(separator_style);
                }*/
                /*var separator_color = data['separator_color']
                if (separator_color) {
                    $('#separator_color').val(separator_color);
                }*/
                var backend_all_icon_style = data['backend_all_icon_style']
                if (backend_all_icon_style) {
                    if (backend_all_icon_style) {
                    $('#font_icon_style_id').find('#' + backend_all_icon_style).find('input[name="font_icon_style"]').attr('checked', true);
                }
                }
                var dual_tone_icon_color_1 = data['dual_tone_icon_color_1']
                if (dual_tone_icon_color_1) {
                    $('#dual_tone_icon_color_1').val(dual_tone_icon_color_1);
                }
                var dual_tone_icon_color_2 = data['dual_tone_icon_color_2']
                if (dual_tone_icon_color_2) {
                    $('#dual_tone_icon_color_2').val(dual_tone_icon_color_2);
                }
                var sidebar_font_color = data['sidebar_font_color']
                if (sidebar_font_color) {
                    $('#sidebar_font_color').val(sidebar_font_color);
                }
                var sidebar_background_style = data['sidebar_background_style']
                if (sidebar_background_style == 'color') {
                    $('#sidebar_color').attr('checked', true);
                    $('#sidebar_background_color').css("display", "block");
                    $('#sidebar_background_img').css("display", "none");

                } else if (sidebar_background_style == 'image') {
                    $('#sidebar_image').attr('checked', true);
                    $('#sidebar_background_color').css("display", "none");
                    $('#sidebar_background_img').css("display", "block");
                }


                var sidebar_background_color = data['sidebar_background_color']
                if (sidebar_background_color) {
                    $('#sidebar_background_color').val(sidebar_background_color);
                }
                var sidebar_collapse_style = data['sidebar_collapse_style']
                if (sidebar_collapse_style == 'collapsed') {
                    $('#sidebar_collapsed').attr('checked', true);
                } else if (sidebar_collapse_style == 'expanded') {
                    $('#sidebar_expanded').attr('checked', true);
                }


                var predefined_list_view_boolean = data['predefined_list_view_boolean']
                var predefined_list_view_style = data['predefined_list_view_style']
                if (predefined_list_view_style) {
                    $('#listview_table_id').find('#' + predefined_list_view_style).find('input[name="listview_style"]').attr('checked', true);
                }


                if (predefined_list_view_style) {
                    $('#predefined_list_view_style').val(predefined_list_view_style);
                }
                if (predefined_list_view_boolean) {
                    data['list_view_is_hover_row'] = false
                    $('#predefined_list_view_boolean').attr('checked', true);
                    $(".predefined_list_view_style").css("display", "table-row");
                    $(".is_row_color_hover").css("display", "none");
                    $("#list_view_is_hover_row").css("display", "none");
                    $("#list_view_border").css("display", "none");
                    $("#list_view_even_row_color").css("display", "none");
                    $("#list_view_odd_row_color").css("display", "none");
                    $("#list_view_hover_bg_color").css("display", "none");
                    $(".list_view_border_even_row_color").css("display","none");
                    $(".row_hover_odd_row_color").css("display","none");
                } else {
                    $('#predefined_list_view_boolean').attr('checked', false);
                    $(".predefined_list_view_style").css("display", "none");
                    $(".is_row_color_hover").css("display", "table-row");
                    $("#list_view_is_hover_row").css("display", "table-row");
                    $("#list_view_border").css("display", "table-row");
                    $("#list_view_even_row_color").css("display", "table-row");
                    $("#list_view_odd_row_color").css("display", "table-row");
                    $("#list_view_hover_bg_color").css("display", "table-row");
                    $(".list_view_border_even_row_color").css("display","table-row");
                    $(".row_hover_odd_row_color").css("display","table-row");
                }
                var list_view_border = data['list_view_border']
                if (list_view_border) {
                    $('#list_view_border').val(list_view_border);
                }
                var list_view_even_row_color = data['list_view_even_row_color']
                if (list_view_even_row_color) {
                    $('#list_view_even_row_color').val(list_view_even_row_color);
                }
                var list_view_odd_row_color = data['list_view_odd_row_color']
                if (list_view_odd_row_color) {
                    $('#list_view_odd_row_color').val(list_view_odd_row_color);
                }
                var list_view_is_hover_row = data['list_view_is_hover_row']
                if (list_view_is_hover_row) {
                    $('#list_view_is_hover_row').attr('checked', true);
                    $(".is_row_color_hover").css("display", "table-row");
                } else {
                    $('#list_view_is_hover_row').attr('checked', false);
                    $(".is_row_color_hover").css("display", "none");
                }
                var list_view_hover_bg_color = data['list_view_hover_bg_color']
                if (list_view_hover_bg_color) {
                    $('#list_view_hover_bg_color').val(list_view_hover_bg_color);
                }
                var login_page_style = data['login_page_style']
                if (login_page_style) {
                    $('#login_style_id').find('#' + login_page_style).find('input[name="login_style"]').attr('checked', true);
                }

                var login_page_style_comp_logo = data['login_page_style_comp_logo']
                if (login_page_style_comp_logo) {
                    $('#login_page_style_comp_logo').attr('checked', true);
                } else {
                    $('#login_page_style_comp_logo').attr('checked', false);
                }

                var login_page_box_color = data['login_page_box_color']
                if (login_page_box_color) {
                    $('#login_page_box_color').val(login_page_box_color);
                }
                var login_page_background_color = data['login_page_background_color']
                if (login_page_background_color) {
                    $('#login_page_background_color').val(login_page_background_color);
                }


                if (login_page_style == 'style_0') {
                    $(".login_bg_type").css("display", "none");
                    $(".login_box_color").css("display", "none");
                    $(".login_bg_img").css("display", "none");
                    $(".login_bg_color").css("display", "none");
                    $(".login_bg_img_title").css("display", "none");
                    $(".login_banner_img").css("display", "none");
                    $('.company_icon_image').css("display", "none");
                    $('.company_name_image').css("display", "none");
                    $('.login_page_style_with_comp_logo_tr').css("display", "none");
                } else if (login_page_style == 'style_1') {
                    $(".login_bg_type").css("display", "none");
                    $(".login_box_color").css("display", "none");
                    $(".login_bg_img").css("display", "none");
                    $(".login_bg_img_title").css("display", "none");
                    $(".login_bg_color").css("display", "none");
                    $(".login_banner_img").css("display", "none");
                    $('.company_icon_image').css("display", "none");
                    $('.company_name_image').css("display", "none");
                    $('.login_page_style_with_comp_logo_tr').css("display", "table-row");
                }
                else if (login_page_style == 'style_2') {

                    $(".login_bg_type").css("display", "none");
                    $(".login_bg_color").css("display", "none");
                    $(".login_box_color").css("display", "block");

                    $(".login_bg_img_title").css("display", "none");
                    $(".login_bg_img").css("display", "none");


                    $(".login_banner_img").css("display", "block");
                    $('.company_icon_image').css("display", "none");
                    $('.company_name_image').css("display", "none");
                    $('.login_page_style_with_comp_logo_tr').css("display", "none");


                } else if (login_page_style == 'style_3') {

                    $(".login_bg_type").css("display", "block");
                    $(".login_bg_color").css("display", "block");
                    $(".login_box_color").css("display", "none");
                    $(".login_bg_img_title").css("display", "block");
                    $(".login_bg_img").css("display", "none");

                    $(".login_banner_img").css("display", "none");
                    $('.company_icon_image').css("display", "block");
                    $('.company_name_image').css("display", "block");
                    $('.login_page_style_with_comp_logo_tr').css("display", "none");
                    var login_page_background_type = data['login_page_background_type']
                    if (login_page_background_type == 'bg_img') {
                        $('#login_bg_img').attr('checked', true);
                        $('#login_page_background_color').css("display", "none");
                        $('#login_page_background_img').css("display", "block");
                    } else if (login_page_background_type == 'bg_color') {
                        $('#login_bg_color').attr('checked', true);
                        $('#login_page_background_color').css("display", "block");
                        $('#login_page_background_img').css("display", "none");
                    }


                } else if (login_page_style == 'style_4') {

                    $(".login_bg_type").css("display", "block");

                    $(".login_bg_color").css("display", "block");
                    $(".login_box_color").css("display", "none");
                    $(".login_bg_img_title").css("display", "block");
                    $(".login_bg_img").css("display", "none");


                    $(".login_banner_img").css("display", "none");
                    $('.company_icon_image').css("display", "block");
                    $('.company_name_image').css("display", "none");
                    $('.login_page_style_with_comp_logo_tr').css("display", "none");
                    var login_page_background_type = data['login_page_background_type']
                    if (login_page_background_type == 'bg_img') {
                        $('#login_bg_img').attr('checked', true);
                        $('#login_page_background_color').css("display", "none");
                        $('#login_page_background_img').css("display", "block");
                    } else if (login_page_background_type == 'bg_color') {
                        $('#login_bg_color').attr('checked', true);
                        $('#login_page_background_color').css("display", "block");
                        $('#login_page_background_img').css("display", "none");
                    }

                }



                var is_sticky_form = data['is_sticky_form']
                if (is_sticky_form) {
                    $('#is_sticky_form').attr('checked', true);
                }
                /*var is_sticky_chatter = data['is_sticky_chatter']
                if (is_sticky_chatter) {
                    $('#is_sticky_chatter').attr('checked', true);
                }*/
                var is_sticky_list = data['is_sticky_list']
                if (is_sticky_list) {
                    $('#is_sticky_list').attr('checked', true);
                }
                var is_sticky_list_inside_form = data['is_sticky_list_inside_form']
                if (is_sticky_list_inside_form) {
                    $('#is_sticky_list_inside_form').attr('checked', true);
                }
                var is_sticky_pivot = data['is_sticky_pivot']
                if (is_sticky_pivot) {
                    $('#is_sticky_pivot').attr('checked', true);
                }
                var tab_style = data['tab_style']
                if (tab_style == 'horizontal') {
                    $('#tab_horizontal').attr('checked', true);
                } else if (tab_style == 'vertical') {
                    $('#tab_vertical').attr('checked', true);
                }

                var tab_mobile_style = data['tab_mobile_style']
                if (tab_mobile_style == 'horizontal') {
                    $('#tab_mobile_horizontal').attr('checked', true);
                } else if (tab_mobile_style == 'vertical') {
                    $('#tab_mobile_vertical').attr('checked', true);
                }

                var form_element_style = data['form_element_style']
                if (form_element_style) {
                    $('#form_element_style').val(form_element_style);
                }

                var search_style = data['search_style']
                if (search_style == 'collapsed') {
                    $('#search_collapsed').attr('checked', true);
                } else if (search_style == 'expanded') {
                    $('#search_expanded').attr('checked', true);
                }

                var breadcrumb_style = data['breadcrumb_style']
                if (breadcrumb_style) {
                    $('#breadcrumb_style').val(breadcrumb_style);
                }
                var progress_style = data['progress_style']
                if (progress_style) {
                    $('#progress_style').val(progress_style);
                }
                var progress_height = data['progress_height']
                if (progress_height) {
                    $('#progress_height').val(progress_height);
                }


                if (progress_style == 'style_1') {
                    $("#progress_color_height").css("display", "table-row");
                } else {
                    $("#progress_color_height").css("display", "none");
                }
                var progress_color = data['progress_color']
                if (progress_color) {
                    $('#progress_color').val(progress_color);
                }
                var scrollbar_style = data['scrollbar_style']
                if (scrollbar_style) {
                    $('#scrollbar_style').val(scrollbar_style);
                }
                // var discuss_chatter_style = data['discuss_chatter_style']
                // if (discuss_chatter_style) {
                //     $('#discuss_chatter_style').val(discuss_chatter_style);
                // }
                // var discuss_chatter_style_image = data['discuss_chatter_style_image']
                // if (discuss_chatter_style_image) {
                //     $('#discuss_chatter_style_image').val(discuss_chatter_style_image);
                // }

                // if (discuss_chatter_style == 'style_1') {
                // 	// alert("Hiii")
                // 	$('.discuss_chatter_background_image').css("display","none");
                // }
                // if (discuss_chatter_style == 'style_2') {
                // 	alert("Hello")
                // 	$('.discuss_chatter_background_image').css("display","block");
                // }
                // else if (discuss_chatter_style == 'style_3') {
                // 	alert("bye")
                // 	$('.discuss_chatter_background_image').css("display","block");
                // }

            });
        }
        onWillStart(this.onWillStart);
        
        }

   async onWillStart() {
        
        this.is_group_theme_configuration_user = await this.user.hasGroup("sh_backmate_theme_adv.group_theme_configuration");
    }

    _click_sh_theme_design(ev){
            if ($(ev.currentTarget.parentElement.getElementsByClassName('collapse')).css('display') == 'none')
            {
                $(ev.currentTarget.parentElement.getElementsByClassName('collapse')).slideDown('slow')
            }else{
                $(ev.currentTarget.parentElement.getElementsByClassName('collapse')).slideUp(600)
            }
        }

    _click_theme_configuration(){
        if ($('.backmate_theme_layout').length) {

				if ($('.sh_theme_model').length) {

					$('.backmate_theme_layout').removeClass('sh_theme_model');
				} else {
					$('.backmate_theme_layout').addClass('sh_theme_model');

					var radioValue = $("input[name='body_background_type']:checked").val();
					if (radioValue == 'bg_color') {
						$('#body_background_color').css("display", "block");
						$('#body_background_img').css("display", "none");
					} else {
						$('#body_background_color').css("display", "none");
						$('#body_background_img').css("display", "block");
					}

					var radioValue = $("input[name='header_background_type']:checked").val();
                    if (radioValue == 'header_color') {
                        $('#header_background_color').css("display", "block");
                        $('#header_background_img').css("display", "none");
                    } else {
                        $('#header_background_color').css("display", "none");
                        $('#header_background_img').css("display", "block");
                    }

					var radioValue = $("input[name='sidebar_background_style']:checked").val();
					if (radioValue == 'color') {
						$('#sidebar_background_color').css("display", "block");
						$('#sidebar_background_img').css("display", "none");
					} else {
						$('#sidebar_background_color').css("display", "none");
						$('#sidebar_background_img').css("display", "block");
					}
				}
			}
    }

    }

registry.category("systray").add("sh_backmate_theme_adv.ThemeConfigurationTemplate", { Component: ThemeConfigurationTemplate });


