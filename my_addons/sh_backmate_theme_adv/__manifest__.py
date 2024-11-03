# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Backmate Backend Theme Advance",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "description": """
                Are you bored with your standard odoo backend theme? Are You are looking for modern, creative, clean, clear, materialize Odoo theme for your backend? So you are at right place, We have made sure that this theme is highly customizable and it comes with a premium look and feel. Our theme is not only beautifully designed but also fully functional, flexible, fast, lightweight, animated and modern multipurpose theme. Our backend theme is suitable for almost every purpose.
                """,
    "summary": "Advance Material Backend Theme, Responsive Theme, Fully functional Theme, flexible Backend Theme, fast Backend Theme, lightweight Backend Theme, Animated Backend Theme, Modern multipurpose theme, Customizable Backend Theme, Multi Tab Backend Theme Odoo",
    "category": "Themes/Backend",
    "version": "0.0.5",
    "depends":
    [
        "web", "mail"
    ],

    "data":
    [
        "security/base_security.xml",
        "security/ir.model.access.csv",
        "data/theme_config_data.xml",
        "views/login_layout.xml",
        "views/back_theme_config_view.xml",
        "views/assets_backend.xml",
        "views/res_config_settings.xml",
        "views/base_view.xml",
        "views/global_search_view.xml",
        "views/views.xml",
        "views/notifications_view.xml",
        "views/send_notifications.xml",
        "views/web_push_notification.xml",
        "views/import_export_view.xml",        
        "views/res_users_views.xml",
        
    ],
     'assets': {
       
        'web.assets_backend': [

            # quick create
            'sh_backmate_theme_adv/static/src/js/quick_create/quick_create.js',
            'sh_backmate_theme_adv/static/src/scss/quick_create/quick_create.scss',
            "sh_backmate_theme_adv/static/src/xml/quick_create/quick_create.xml",

            # recent viewed records
            "sh_backmate_theme_adv/static/src/js/recently_viewed_records/dropdown.js",
            "sh_backmate_theme_adv/static/src/js/recently_viewed_records/form_controller.js",
            "sh_backmate_theme_adv/static/src/js/recently_viewed_records/systray_recent_records.js",
            "sh_backmate_theme_adv/static/src/scss/recently_viewed_records/recent_records_systray.scss",
            "sh_backmate_theme_adv/static/src/xml/recently_viewed_records/systray_recent_records.xml",

            #Night mode
            "sh_backmate_theme_adv/static/src/xml/nightMode.xml",
            "sh_backmate_theme_adv/static/src/scss/night_mode/night_mode.scss",
            "sh_backmate_theme_adv/static/src/js/night_mode.js",
            

            #new_style_1_view#
            "sh_backmate_theme_adv/static/src/scss/modal_dialog/modal_dialog.scss",
            "sh_backmate_theme_adv/static/src/scss/extra_scss/extra.scss",
            "sh_backmate_theme_adv/static/src/scss/tab/tab_style.scss",
            "sh_backmate_theme_adv/static/src/scss/check_box_style/check_box_style.scss",
            "sh_backmate_theme_adv/static/src/scss/radio_btn_style/radio_btn_style.scss",
            "sh_backmate_theme_adv/static/src/scss/form_element_style/form_element_style.scss",

            # button #
            "sh_backmate_theme_adv/static/src/scss/button/common_button_style.scss",
            "sh_backmate_theme_adv/static/src/scss/button/button_style.scss",
            # button #
            

            #kanban#
            "sh_backmate_theme_adv/static/src/scss/kanban_view/common_kanban_style.scss",
            "sh_backmate_theme_adv/static/src/scss/kanban_view/kanban_style_1.scss",
            "sh_backmate_theme_adv/static/src/scss/kanban_view/kanban_style_2.scss",
            "sh_backmate_theme_adv/static/src/scss/kanban_view/kanban_style_3.scss",
            "sh_backmate_theme_adv/static/src/scss/kanban_view/kanban_style_4.scss",
            #kanban#
          
            
            #calender#
            "sh_backmate_theme_adv/static/src/scss/calendar_view/common_calender_style.scss",
            

            # sticky # 
            "sh_backmate_theme_adv/static/src/scss/sticky/sticky_form.scss",
            "sh_backmate_theme_adv/static/src/scss/sticky/sticky_list_inside_form.scss",
            "sh_backmate_theme_adv/static/src/scss/sticky/sticky_list.scss",
            "sh_backmate_theme_adv/static/src/scss/sticky/sticky_pivot.scss",

            # scrollbar style
            "sh_backmate_theme_adv/static/src/scss/scrollbar/scrollbar_style.scss",

            "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
            #new_style_1_view#            


            #menu structure
            "sh_backmate_theme_adv/static/src/js/navbar.js",
            'sh_backmate_theme_adv/static/src/js/dropdown.js',
            "sh_backmate_theme_adv/static/src/xml/menu.xml",
           

            #Theme Config
            "sh_backmate_theme_adv/static/src/js/theme_config_custom.js",
            "sh_backmate_theme_adv/static/src/xml/ThemeConfigSystray.xml",
            "sh_backmate_theme_adv/static/src/xml/theme_config.xml",



            # #To DO
            "sh_backmate_theme_adv/static/src/scss/todo/todo.scss",
            'sh_backmate_theme_adv/static/src/js/todo_widget.js',
            'sh_backmate_theme_adv/static/src/js/todo.js',
            "sh_backmate_theme_adv/static/src/xml/todo.xml",
            "sh_backmate_theme_adv/static/src/xml/todo_card.xml",

            #Calculator
            "sh_backmate_theme_adv/static/src/js/calculator.js",
            "sh_backmate_theme_adv/static/src/scss/calculator/calculator.scss",
            "sh_backmate_theme_adv/static/src/xml/Calculator.xml",

            #Language Selection
            "sh_backmate_theme_adv/static/src/xml/Language.xml",
            'sh_backmate_theme_adv/static/src/js/language_selector.js',


            # # Base odoo js
            # todo for multi tab
            # 'sh_backmate_theme_adv/static/src/js/action_service.js',
            # "sh_backmate_theme_adv/static/src/js/owl.carousel.js",
            # "sh_backmate_theme_adv/static/src/scss/owl.carousel.css",
            # "sh_backmate_theme_adv/static/src/scss/owl.theme.default.min.css",

            # #global Search
            "sh_backmate_theme_adv/static/src/js/global_search.js",
            "sh_backmate_theme_adv/static/src/scss/global_search/global_search.scss",
             "sh_backmate_theme_adv/static/src/xml/global_search.xml",

            #Zoom Widget
            "sh_backmate_theme_adv/static/src/scss/zoom_in_out/zoom_in_out.scss",
            "sh_backmate_theme_adv/static/src/xml/zoom.xml",
            "sh_backmate_theme_adv/static/src/webclient/web_client.js",
            "sh_backmate_theme_adv/static/src/webclient/zoomwidget/zoomwidget.js",

            #  # discuss chatter design
            'sh_backmate_theme_adv/static/src/components/message/message.js',
            "sh_backmate_theme_adv/static/src/xml/message.xml",

            #  #Firebase and bus Notification
            'https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js',
            'https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js',
            "sh_backmate_theme_adv/static/src/js/firebase.js",

            # #multi tab
            "sh_backmate_theme_adv/static/src/xml/navbar.xml",
            "sh_backmate_theme_adv/static/src/webclient/navtab/navtab.js",
            'sh_backmate_theme_adv/static/src/webclient/action_container.js',
            "sh_backmate_theme_adv/static/src/xml/notification.xml",

            # # Refresh Feature
            "sh_backmate_theme_adv/static/src/js/kanban_controller.js",
            "sh_backmate_theme_adv/static/src/js/list_controller.js",
            'sh_backmate_theme_adv/static/src/js/calendar_controller.js',
            "sh_backmate_theme_adv/static/src/xml/refresh.xml",

            # fonts file
            "sh_backmate_theme_adv/static/src/scss/font/fonts.scss",

            # theme config panel design
            "sh_backmate_theme_adv/static/src/scss/theme_config.scss",

            # body background type color/image
            "sh_backmate_theme_adv/static/src/scss/background/body_background_img/background-img.scss",
            "sh_backmate_theme_adv/static/src/scss/background/body_background_color/background-color.scss",

            # sidebar style
            "sh_backmate_theme_adv/static/src/scss/sidebar/sidebar_style_1.scss",
            "sh_backmate_theme_adv/static/src/scss/sidebar/expaned.scss",
            "sh_backmate_theme_adv/static/src/scss/sidebar/collapsed.scss",

            #rtl
            "sh_backmate_theme_adv/static/src/scss/rtl/rtl.scss",
            
            # breadcrumb style
            "sh_backmate_theme_adv/static/src/scss/breadcrumb/breadcrumb.scss",

            # separator style
            "sh_backmate_theme_adv/static/src/scss/separator/separator.scss",

            # Navbar
            "sh_backmate_theme_adv/static/src/scss/navbar/navbar.scss",

            # Form View
            "sh_backmate_theme_adv/static/src/scss/form_view/form_view.scss",

            # responsive view
            "sh_backmate_theme_adv/static/src/scss/responsive/responsive_theme.scss",

            # notification style
            "sh_backmate_theme_adv/static/src/scss/notification/notification.scss",

            # list view style
            "sh_backmate_theme_adv/static/src/scss/list_view/predefine_list_view.scss",
            "sh_backmate_theme_adv/static/src/scss/list_view/custome_list_view.scss",

            # nprogress
            "sh_backmate_theme_adv/static/src/scss/nprogress/nprogress.scss",
   
            # multi tab
            "sh_backmate_theme_adv/static/src/scss/multi_tab_at_control_panel/multi_tab.scss",
         
            # control panel 
            "sh_backmate_theme_adv/static/src/scss/control_panel_style/control_panel_style.scss",
        
            "sh_backmate_theme_adv/static/src/js/pivot_view_sticky/pivot_sticky_dropdown.js",
         
            # font icon 
            "sh_backmate_theme_adv/static/src/scss/icon_style/icon_style.scss",
            "sh_backmate_theme_adv/static/src/scss/backend_font_icon_style/font_awesome_light_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/backend_font_icon_style/font_awesome_thin_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/backend_font_icon_style/font_awesome_std_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/backend_font_icon_style/font_awesome_regular_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/oi_odoo_icon/oi_light_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/oi_odoo_icon/oi_regular_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/oi_odoo_icon/oi_thin_icon.scss",
            "sh_backmate_theme_adv/static/src/scss/app_icon_style/app_icon.scss",
            
            # Disable Auto edit feature
            "sh_backmate_theme_adv/static/src/js/form_controller.js",
            "sh_backmate_theme_adv/static/src/xml/form_controller.xml",

          
            # open record in new tab feature
            'sh_backmate_theme_adv/static/src/xml/open_record_in_new_tab/action_menus.xml',
            'sh_backmate_theme_adv/static/src/xml/open_record_in_new_tab/list_rendered.xml',
            'sh_backmate_theme_adv/static/src/js/open_record.js',

            #Quick menu
            "sh_backmate_theme_adv/static/src/scss/quick_menu/quick_menu.scss",
            "sh_backmate_theme_adv/static/src/js/quick_menu.js",
            'sh_backmate_theme_adv/static/src/js/route_service.js',
            "sh_backmate_theme_adv/static/src/xml/web_quick_menu.xml",

            # attachments in listview
            "sh_backmate_theme_adv/static/src/scss/attachment/attachment.scss",
            "sh_backmate_theme_adv/static/src/xml/attachment_in_listview/ShDocumentViewer.xml",
            "sh_backmate_theme_adv/static/src/xml/attachment_in_listview/list_renderer.xml",
            "sh_backmate_theme_adv/static/src/js/attachment_in_listview/ShDocumentViewer.js",
            "sh_backmate_theme_adv/static/src/js/attachment_in_listview/list_view_renderer.js",
            'web/static/lib/pdfjs/build/pdf.js',
            'web/static/lib/pdfjs/build/pdf.worker.js',
            'web/static/lib/pdfjs/web/viewer.js',


            
        ],
          'web.assets_frontend': [
            # 'sh_backmate_theme_adv/static/src/js/custom_on_document_ready.js',

            "sh_backmate_theme_adv/static/src/scss/login_page/login_page_style_1.scss",
            "sh_backmate_theme_adv/static/src/scss/login_page/login_page_style_2.scss",
            "sh_backmate_theme_adv/static/src/scss/login_page/login_page_style_3.scss",
            "sh_backmate_theme_adv/static/src/scss/login_page/login_page_style_4.scss",
           
           
        ],
         'web._assets_primary_variables': [
          ('after', 'web/static/src/scss/primary_variables.scss', '/sh_backmate_theme_adv/static/src/scss/back_theme_config_main_scss.scss'),        
        ],
        # 'web.assets_qweb': [
               
        # ],
        
      
       
    },
 
    'images': [
        'static/description/splash-screen.png',
        'static/description/splash-screen_screenshot.gif'
    ],
    "live_test_url": "https://softhealer.com/support?ticket_type=demo_request",
    "installable": True,
    "application": True,
    "price": 125,
    "currency": "EUR",
    "bootstrap": True,
    "license": "OPL-1",

}
