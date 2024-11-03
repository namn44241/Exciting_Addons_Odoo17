/** @odoo-module **/
import { MenuItem, NavBar } from '@web/webclient/navbar/navbar';
import { patch } from "@web/core/utils/patch";
import { ErrorHandler, NotUpdatable } from "@web/core/utils/components";


var theme_style = 'default';

import { isMobileOS } from "@web/core/browser/feature_detection";
import { session } from "@web/session";
import { useService } from "@web/core/utils/hooks";
import { jsonrpc } from "@web/core/network/rpc_service";
import { onMounted } from "@odoo/owl";

var icon_style = 'standard';
var sidebar_collapse_style = '';
var search_style = '';
var enable_multi_tab = false

patch(NavBar.prototype, {

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    async setup() {
            super.setup()
            this.orm = useService("orm");

            enable_multi_tab = session.sh_enable_multi_tab
            onMounted(() => {
                if (enable_multi_tab){
                   this.addmultitabtags()
                }
            });
            const data = await this.orm.searchRead(
                        "sh.back.theme.config.settings",
                        [['id', '=', 1]],
                        ['icon_style','sidebar_collapse_style','search_style']
                        );
            if (data) {
                var i;
                for (i = 0; i < data.length; i++) {

                    if (data[i]['icon_style']) {
                        icon_style = data[i]['icon_style'];
                    }
                    if (data[i]['sidebar_collapse_style']) {
                        sidebar_collapse_style = data[i]['sidebar_collapse_style'];
                    }
                    if (data[i]['search_style']) {
                        search_style = data[i]['search_style'];
                    }
                }
            }
        },

    onMouseenter_o_app2(ev){
        $(ev.target.parentElement).find('ul.show_ul').css("transition", "all 0.6s ease 0s;");
        $(ev.target.parentElement).find('ul.show_ul').slideDown("slow");
    },
    onMouseenter_sh_backmate_theme_appmenu_div(ev){

        if ($('.o_web_client').hasClass('o_rtl')) {
				if ($('#js_bar_toggle_btn_mobile').css("top") == '0px') {
					$('.o_action_manager').css("margin-right", '260px');
					$('.o_menu_systray').css("width", '260px');
					$('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show').css("right", "260px");
					$('.o_mail_systray_dropdown').css("right", "260px");
					$('.o_switch_company_menu .dropdown-menu').css("right", "260px");
					if (sidebar_collapse_style != 'expanded' && search_style != 'collapsed') {
						$('.sh_search_container').css("margin-right", '190px');
						$('#object1').css("padding-right", "0px");
						$('.multi_tab_section').css("margin-right", '260px');
					}
				}
			} else {
				if ($('#js_bar_toggle_btn_mobile').css("top") == '0px') {

                    if (sidebar_collapse_style != 'expanded') {
					    $('.multi_tab_section').css("margin-left", '260px');
					    $('.o_action_manager').css("margin-left", '260px');
					}
					$('.o_menu_systray').css("width", '260px');
					$('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show').css("left", "260px");
					$('.o_mail_systray_dropdown').css("left", "260px");
					$('.o_switch_company_menu .dropdown-menu').css("left", "260px");
					if (sidebar_collapse_style != 'expanded' && search_style != 'collapsed') {
						$('.sh_search_container').css("margin-left", '190px');
						$('#object1').css("padding-left", "0px");
					}
				}
			}
    },
    onMouseleave_sh_backmate_theme_appmenu_div(ev){

        if ($('.o_web_client').hasClass('o_rtl')) {
				if ($('#js_bar_toggle_btn_mobile').css("top") == '0px') {

					if (sidebar_collapse_style != 'expanded') {
						$(ev.target).find('.o_app2.sh_dropdown.active').parents('.sh_dropdown_div').find('ul.show_ul').slideUp("slow");
						$(ev.target).find('.o_app2.sh_dropdown.active').parents('.sh_dropdown_div').find('ul.show_ul').css("transition", "all 0.6s ease 0s;");
						$('#object1').css("padding-right", "0px");
						$('.multi_tab_section').css("margin-right", '80px');
					}

					$('.o_action_manager').css("margin-right", '68px');
					$('.sh_search_container').css("margin-right", '0px');
					$('.o_menu_systray').css("width", '68px');
					if ($('ul.dropdown-menu.dropdown-menu-right').hasClass('show_ul')) {
					}
					$('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show').css("right", "68px");
					$('.o_mail_systray_dropdown').css("right", "68px");
					$('.o_switch_company_menu .dropdown-menu').css("right", "68px");
					$(ev.target).find('.o_app2.sh_dropdown.active').parents('.sh_dropdown_div').find('ul.show_ul').css("display", "none");
				}
			} else {
				if ($('#js_bar_toggle_btn_mobile').css("top") == '0px') {
					if (sidebar_collapse_style != 'expanded') {
						$(ev.target).find('.o_app2.sh_dropdown.active').parents('.sh_dropdown_div').find('ul.show_ul').slideUp("slow");
						$(ev.target).find('.o_app2.sh_dropdown.active').parents('.sh_dropdown_div').find('ul.show_ul').css("transition", "all 0.6s ease 0s;");
						$('#object1').css("padding-left", "0px");
						$('.multi_tab_section').css("margin-left", '80px');
						$('.o_action_manager').css("margin-left", '68px');
					}

					$('.sh_search_container').css("margin-left", '0px');
					$('.o_menu_systray').css("width", '68px');
					if ($('ul.dropdown-menu.dropdown-menu-right').hasClass('show_ul')) {
					}
					$('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show').css("left", "68px");
					$('.o_mail_systray_dropdown').css("left", "68px");
					$('.o_switch_company_menu .dropdown-menu').css("left", "68px");

				}

			}

    },
    _click_o_app(ev){
        $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');
        /*todo later*/
        /*$(this).parents('.sh_dropdown_div').find('.sh_dropdown').removeClass('sh_dropdown');
		$(this).parents('.sh_dropdown_div').find('.show_ul').css("display", "none");*/
    },
    _click_toggle_bar(ev){
        if ($("#toggle_bar").hasClass("fa-bars")) {
                ev.target.classList.toggle('fa-times');
				$("#toggle_bar").removeClass('fa-bars');
			} else {
			    ev.target.classList.toggle('fa-bars');
				$("#toggle_bar").removeClass('fa-times');
			}
    },
    _click_js_bar_toggle_btn_mobile(ev){
        $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');

        if ($('.sidebar_toggle').css("max-width") != '100%') {
              $('.o_action_manager').css("margin-left" , '0px');
              $('.o_menu_systray').css("width", '0px');
             $('.o_menu_systray').css("opacity", '0');
             $('ul.dropdown-menu.dropdown-menu-right').css("display", 'none');
             $('ul.dropdown-menu.dropdown-menu-right').removeClass('show_ul');
             $('span.sh_dropdown').removeClass('sh_dropdown');
             $("#toggle_bar").addClass('fa-bars');
             $("#toggle_bar").removeClass('fa-times');
             $("#js_bar_toggle_btn_mobile").css("display","none");

        } else {
            $('.o_action_manager').css("margin-left" , '310px');
            $('.o_menu_systray').css("width", '100%');
            $('.o_menu_systray').css("opacity", '1');
            $("#toggle_bar").removeClass('fa-bars');
            $("#toggle_bar").addClass('fa-times');
        }

    },
    _click_blur_div(ev){
        if ($('#js_bar_toggle_btn_mobile').css("top") != '0px') {
				if (!$('.blur_div').hasClass('blur_toggle')) {
					 $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
                     $(".blur_div").toggleClass("blur_toggle");
                     $('.o_menu_systray').css("opacity", '1');
				}
			}
    },
    _click_hide_top_bar(ev){
        $('.o_main_navbar').css("width", "0px");
        $('.o_main_navbar').css("height", "0px");
        $('.o_main_navbar').css("min-height", "0px");
        $('.o_main_navbar').css("display", "revert");
        $('.o_menu_systray').attr("style", "display: none !important");
        $('body > header').css("height", "auto");
        $('.sh_search_container').css("display", "none");
        $('body > header').css("transition", "all .3s ease-out;")
        $("#show_top_bar").css("display", "block");
        $("#hide_top_bar").css("display", "none");
    },
    _click_show_top_bar(ev){
        $('.o_main_navbar').css("width", "100%");
        $('.o_main_navbar').css("height", "4rem");
        $('.o_main_navbar').css("min-height", "4rem");
        $('.o_main_navbar').css("display", "flex");
        $('.o_menu_systray').attr("style", "display: inline-flex !important");
        $('.sh_search_container').css("display", "block");
        $('body > header').css("height", "auto");
        $("#hide_top_bar").css("display", "block");
        $("#show_top_bar").css("display", "none");

    },
    get_current_company(){
        let current_company_id;
        if (session.user_context.allowed_company_ids) {
            current_company_id = session.user_context.allowed_company_ids[0];
        } else {
            current_company_id = session.user_companies ?
                session.user_companies.current_company :
                false;
        }

        return current_company_id;
    },
    getIconStyle() {
        return icon_style;
    },

    onNavBarDropdownItemSelection(menu) {
        $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');
        if (enable_multi_tab){
            if(window.event.shiftKey){
                this._createMultiTab(menu)
//                localStorage.setItem("sh_add_tab",1)
            }else{
//                localStorage.setItem("sh_add_tab",0)
            }
        }

        if(this.websiteCustomMenus){
            const websiteMenu = this.websiteCustomMenus.get(menu.xmlid);
            if (websiteMenu) {
                return this.websiteCustomMenus.open(menu);
            }
        }

        if (menu) {
            this.menuService.selectMenu(menu);
        }
    },

    _createMultiTab: function (ev) {
            var tab_name = ev.name
            var url = '#menu_id='+ev.id + '&action='+ ev.actionID
            var actionId = ev.actionID
            var menuId = ev.id
            var menu_xmlid = ev.xmlid
            var self = this
            localStorage.setItem('LastCreatedTab',actionId)

            jsonrpc('/add/mutli/tab', {
                    'name':tab_name,
                    'url':url,
                    'actionId':actionId,
                    'menuId':menuId,
                    'menu_xmlid':menu_xmlid,
                }).then((rec) => {
                    self.addmultitabtags(ev)
                });
         },

    addmultitabtags: async function (ev) {
            var self = this
            var rec = await jsonrpc('/get/mutli/tab', {});
            if (rec){
                    if (theme_style == 'theme_style'){ $('body > header').css("height", "48px"); }
                    $('.multi_tab_section').empty()
                    $.each(rec, function( key, value ) {
                        var tab_tag = '<div class="d-flex justify-content-between multi_tab_div align-items-center"><a href="'+ value.url +'"'+' class="flex-fill" data-xml-id="'+ value.menu_xmlid +'" data-menu="'+ value.menuId +'" data-action-id="'+ value.actionId +'" multi_tab_id="'+value.id+'" multi_tab_name="'+value.name+'"><span>'+value.name+'</span></a><span class="remove_tab ml-4">X</span></div>'
                        $('.multi_tab_section').append(tab_tag)
                    })
                    var ShstoredActionId = sessionStorage.getItem("sh_current_action_id");
                    var ShstoredAction = sessionStorage.getItem("sh_current_action");
                    if (ShstoredActionId){
                        var TabDiv = $('.multi_tab_section .multi_tab_div');
                        var ActiveMenu = TabDiv.find('a[data-action-id="'+ ShstoredActionId +'"]');
                        ActiveMenu.parent().addClass('tab_active')
                    }

                    if (ev) {
                        var actionId = ev.actionID
                        var menu_xmlid = ev.xmlid
                        if(localStorage.getItem('LastCreatedTab')){
                            var target = '.multi_tab_section .multi_tab_div a[data-action-id="'+ localStorage.getItem('LastCreatedTab') +'"]'
                            $(target).parent().addClass('tab_active')
                            localStorage.removeItem('LastCreatedTab')
                        } else {
                            var target = '.multi_tab_section .multi_tab_div a[data-xml-id="'+ menu_xmlid +'"]'
                            $(target).parent().addClass('tab_active')
                        }
                    }
                    $('body').addClass("multi_tab_enabled");
                } else {
                    $('body').removeClass("multi_tab_enabled");
                }
            $('.multi_tab_section .remove_tab').on('click', function (ev) {
                        self._RemoveTab(ev)
                    });
            $('.multi_tab_section .multi_tab_div a').on('click', function (ev) {
                        self._TabClicked(ev)
                    });
         },

    _RemoveTab: function (ev) {
            var self = this
            var multi_tab_id = $(ev.target).parent().find('a').attr('multi_tab_id')
            jsonrpc('/remove/multi/tab', {
                'multi_tab_id':multi_tab_id,
            }).then(function(rec) {
                if (rec){
                    if(rec['removeTab']){
                        $(ev.target).parent().remove()
                        var FirstTab = $('.multi_tab_section').find('.multi_tab_div:first-child')
                        if(FirstTab.length){
                            $(FirstTab).find('a')[0].click()
                            $(FirstTab).addClass('tab_active')
                        }
                    }
                    if(rec['multi_tab_count'] == 0){
                        $('body').removeClass("multi_tab_enabled");
                    }
                }
            });
         },

    _TabClicked: function (ev){
     localStorage.setItem("TabClick", true);
     localStorage.setItem("TabClickTilteUpdate", true);
     if($(ev.target).data('action-id')){
        $('.multi_tab_section').find('.tab_active').removeClass('tab_active');
        $(ev.target).parent().addClass('tab_active')
        console.log('$(ev.target).parent()',$(ev.target).parent())
     }
     else{
        if($(ev.currentTarget).data('action-id')){
            $('.multi_tab_section').find('.tab_active').removeClass('tab_active');
            $(ev.currentTarget).parent().addClass('tab_active')
            console.log('$(ev.target).parent()',$(ev.target).parent())
        }
     }
    },

    onNavBarDropdownItemClick(ev) {
        if(ev.shiftKey){
            localStorage.setItem("sh_add_tab",1)
        }else{
            localStorage.setItem("sh_add_tab",0)
        }
    },
    getAppClassName(app){
        var app_name = app.xmlid
        return app_name.replaceAll('.', '_')
    },
    getXmlID(app_id) {
        return this.menuService.getMenuAsTree(app_id).xmlid;
    },
    OnClickDropdown(ev){
            /*close pop-ups*/
            $('.backmate_theme_layout').removeClass("sh_theme_model");
            $('.todo_layout').removeClass("sh_theme_model");
            $('.todo').removeClass('todo_active');
            $('.sh_calc_util').removeClass("active")
            $(".sh_calc_results").html("");
            $('.sh_wqm_quick_menu_submenu_list_cls').css("display","none")
            $('.o_user_bookmark_menu').removeClass('bookmark_active')
            $('.sh_search_results').css("display", "none");

			if (!$(ev.currentTarget).next().hasClass('show_ul')) {
				$(ev.currentTarget).next('.dropdown-menu-right').first().slideDown('slow');


				$(ev.currentTarget).parents('.dropdown-menu').first().find('.show_ul').slideUp(600)
				$(ev.currentTarget).parents('.dropdown-menu').first().find('.show_ul').css("display", "none !important")
				$(ev.currentTarget).parents('.dropdown-menu').first().find('.show_ul').removeClass('show_ul');


				if ($(ev.currentTarget).next('.dropdown-menu').parents('.dropdown-header').length == 1) {
					$(ev.currentTarget).parents('.dropdown-menu').first().find('.sh_sub_dropdown').removeClass('sh_sub_dropdown');
					$(ev.currentTarget).next('.dropdown-menu').parents('.dropdown-header').children('.dropdown-item').addClass('sh_sub_dropdown');


				} else {
					$(ev.currentTarget).parents('.dropdown-menu').first().find('.sh_dropdown').removeClass('sh_dropdown');
					$(ev.currentTarget).parents('.dropdown-menu').first().find('.active').removeClass('active');

					$(ev.currentTarget).parents('.dropdown-menu').first().find('.sh_sub_dropdown').removeClass('sh_sub_dropdown');
					$(ev.currentTarget).next('.dropdown-menu').parents('.sh_dropdown_div').children('.dropdown-item').addClass('sh_dropdown');
					$(ev.currentTarget).next('.dropdown-menu').parents('.sh_dropdown_div').children('.dropdown-item').addClass('active');
				}
			}

			if ($(ev.currentTarget).next().hasClass('show_ul')) {
				$(ev.currentTarget).next('.dropdown-menu-right').first().slideUp(600);

				if ($(ev.currentTarget).next('.dropdown-menu').parents('.dropdown-header').length == 1) {
					$(ev.currentTarget).next('.dropdown-menu').parents('.dropdown-header').children('.dropdown-item').removeClass('sh_sub_dropdown');
				} else {

					$(ev.currentTarget).next('.dropdown-menu').parents('.sh_dropdown_div').children('span').removeClass('sh_dropdown');
					$(ev.currentTarget).next('.dropdown-menu').parents('.sh_dropdown_div').children('span').removeClass('active');
				}
			}

			var $subMenu = $(ev.currentTarget).next('.dropdown-menu');
			$subMenu.toggleClass('show_ul');

    },
    currentMenuAppSections(app_id) {

        return (
            (this.menuService.getMenuAsTree(app_id).childrenTree) ||
            []
        );
    },

    getThemeStyle(ev) {

        return theme_style;
    },
    isMobile(ev) {
        return isMobileOS
    },
    click_secondary_submenu(ev) {
        if (isMobileOS) {
            $(".sh_sub_menu_div").addClass("o_hidden");
        }

        $(".o_menu_sections").removeClass("show")
    },
    click_close_submenu(ev) {
        $(".sh_sub_menu_div").addClass("o_hidden");
        $(".o_menu_sections").removeClass("show")
    },
    click_mobile_toggle(ev) {
        $(".sh_sub_menu_div").removeClass("o_hidden");

    },
});