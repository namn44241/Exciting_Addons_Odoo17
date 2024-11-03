# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import http
from odoo.http import request
import json
import base64

dict_pre_theme_color_style = {
    'pre_color_1': {
        'theme_color': 'color_1',
        'theme_style': 'style_1',
        'primary_color': '#111c43',
        'secondary_color': '#FFFFFF',
        'kanban_box_style': 'style_2',
        'header_background_color': '#ebedf6',
        'body_background_color': '#ebedf6',
        'header_font_color': '#111c43',
        'sidebar_is_show_nav_bar': True,
        'sidebar_collapse_style': 'expanded',
        'sidebar_background_style': 'color',
        'sidebar_background_color': '#111c43',
        'sidebar_font_color': '#e2e8f0',
        'separator_color': '#111c43',
        'separator_style': 'style_7',
        'button_style': 'style_4',
        'body_background_type': 'bg_color',
        'body_font_family': 'Poppins',
        'body_google_font_family': 'inter',
        'is_used_google_font': True,
        'predefined_list_view_boolean': False,
        'predefined_list_view_style': 'style_1',
        'list_view_border': 'without_border',
        'list_view_is_hover_row': True,
        'list_view_hover_bg_color': '#111c43',
        'list_view_even_row_color': '#FFFFFF',
        'list_view_odd_row_color': '#FFFFFF',
        'login_page_style': 'style_2',
        'login_page_style_comp_logo': False,
        'login_page_background_type': 'bg_color',
        'progress_style': 'style_1',
        'progress_height': '4px',
        'progress_color': '#2C3782',
        'is_sticky_pivot': False,
        'horizontal_tab_style': 'style_4',
        'form_element_style': 'style_1',
        'breadcrumb_style': 'style_1',
        'search_style': 'expanded',
        'icon_style': 'light_icon',
        'dual_tone_icon_color_1': '#FFFFFF',
        'dual_tone_icon_color_2': '#2C3782',
        'checkbox_style': 'style_2',
        'radio_btn_style': 'style_1',
        'scrollbar_style': 'style_1',
        'backend_all_icon_style': 'style_2',
        'is_sticky_form':True,
        'is_sticky_list':True,
        'is_sticky_list_inside_form':True,
        'header_background_type': 'header_color',
    },
}
class ThemeConfigController(http.Controller):

    @http.route('/api/upload/multi', type='http', auth="none", csrf=False)
    def Upload_image(self, **kwargs):

        theme_setting_rec = request.env['sh.back.theme.config.settings'].sudo().search([
            ('id', '=', 1)], limit=1)
        if kwargs.get('body_background_img'):
            body_background_img = base64.b64encode(
                kwargs.get('body_background_img').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'body_background_image': body_background_img})

        if kwargs.get('header_background_img'):
            body_background_img = base64.b64encode(
                kwargs.get('header_background_img').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'header_background_image': body_background_img})

        if kwargs.get('sidebar_background_img'):
            sidebar_background_img = base64.b64encode(
                kwargs.get('sidebar_background_img').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'sidebar_background_image': sidebar_background_img})

        if kwargs.get('loading_gif'):
            loading_gif = base64.b64encode(kwargs.get('loading_gif').read())
            if theme_setting_rec:
                theme_setting_rec.write({'loading_gif': loading_gif})

        if kwargs.get('login_page_banner_img'):
            login_page_banner_image = base64.b64encode(
                kwargs.get('login_page_banner_img').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'login_page_banner_image': login_page_banner_image})

        if kwargs.get('login_page_icon_img'):
            login_page_icon_img = base64.b64encode(
                kwargs.get('login_page_icon_img').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'login_page_icon_img': login_page_icon_img})
        if kwargs.get('login_page_icon_img_long'):
            login_page_icon_img_long = base64.b64encode(
                kwargs.get('login_page_icon_img_long').read())
            if theme_setting_rec:
                theme_setting_rec.write(
                    {'login_page_icon_img_long': login_page_icon_img_long})

        if kwargs.get('login_page_background_img'):
            login_page_background_image = base64.b64encode(
                kwargs.get('login_page_background_img').read())
            if login_page_background_image:
                theme_setting_rec.write(
                    {'login_page_background_image': login_page_background_image})

        return json.dumps({})

    @http.route('/get_theme_style', type='json', auth="public")
    def get_theme_style(self):
        theme_setting_rec = request.env['sh.back.theme.config.settings'].sudo().search([
            ('id', '=', 1)], limit=1)
        active_color = '1'
        active_style = '1'
        active_pre_color = 'pre_color_1'
        if theme_setting_rec.theme_style:
            active_style = str(theme_setting_rec.theme_style).split('_')[1]
        if theme_setting_rec.theme_color:
            active_color = str(theme_setting_rec.theme_color).split('_')[1]
        if theme_setting_rec.pre_theme_style:
            active_pre_color = theme_setting_rec.pre_theme_style

        data_html = ' <div class="sh_main_div">  <input type="hidden" class="current_active_style" value="style_' + \
                    active_style + '"/><input type="hidden" class="current_active_style_pallete"/>'
        data_color = ' <div class="sh_main_div">  <input type="hidden" class="current_active_color" value="color_' + \
                     active_color + '"/><input type="hidden" class="current_active_color_pallete"/>'
        data_pre_color = ' <div class="sh_main_div">  <input type="hidden" class="current_active_pre_color" value="' + \
                         active_pre_color + '"/><input type="hidden" class="current_active_pre_color_pallete"/>'

        if theme_setting_rec:
            i = 1
            for theme_style in range(1):
                data_html += '<li class="sh_div_plt"><div class="theme_style_box" id="style_' + \
                             str(i) + '"><input type="radio" name="themeStyle"> <span class="circle fa fa-check-circle"></span> <div class="sh_style_box_' + \
                             str(i) + '"></div></label></li>'
                i += 1

            j = 1
            for theme_color in range(7):
                data_color += '<li class="sh_div_plt"><div class="theme_color_box" id="color_' + \
                              str(j) + '"><input type="radio" name="themeColor"> <i class="fa fa-check-circle"></i> <div class="sh_color_box_' + \
                              str(j) + '"></div></label></li>'
                j += 1

            k = 1
            for pre_theme_color in range(1):
                data_pre_color += '<li class="sh_div_plt"><div class="pre_theme_color_box" id="pre_color_' + \
                                  str(k) + '"><input type="radio" name="preThemeColor"> <i class="fa fa-check-circle"></i> <div class="sh_pre_color_box_' + \
                                  str(k) + '"></div></label></li>'
                k += 1

        return {'data_html': data_html,
                'data_color': data_color,
                'data_pre_color': data_pre_color,
                'primary_color': theme_setting_rec.primary_color,
                'kanban_box_style': theme_setting_rec.kanban_box_style,
                'secondary_color': theme_setting_rec.secondary_color,
                'header_background_color': theme_setting_rec.header_background_color,
                'header_font_color': theme_setting_rec.header_font_color,
                'body_background_color': theme_setting_rec.body_background_color,
                'body_font_family': theme_setting_rec.body_font_family,
                'body_google_font_family': theme_setting_rec.body_google_font_family,
                'body_background_type': theme_setting_rec.body_background_type,
                'header_background_type':theme_setting_rec.header_background_type,
                'button_style': theme_setting_rec.button_style,
                'separator_style': theme_setting_rec.separator_style,
                'separator_color': theme_setting_rec.separator_color,
                'icon_style': theme_setting_rec.icon_style,
                'dual_tone_icon_color_1': theme_setting_rec.dual_tone_icon_color_1,
                'dual_tone_icon_color_2': theme_setting_rec.dual_tone_icon_color_2,
                'sidebar_font_color': theme_setting_rec.sidebar_font_color,
                'sidebar_background_style': theme_setting_rec.sidebar_background_style,
                'sidebar_background_color': theme_setting_rec.sidebar_background_color,
                'sidebar_collapse_style': theme_setting_rec.sidebar_collapse_style,
                'predefined_list_view_boolean': theme_setting_rec.predefined_list_view_boolean,
                'predefined_list_view_style': theme_setting_rec.predefined_list_view_style,
                'list_view_border': theme_setting_rec.list_view_border,
                'list_view_even_row_color': theme_setting_rec.list_view_even_row_color,
                'list_view_odd_row_color': theme_setting_rec.list_view_odd_row_color,
                'list_view_is_hover_row': theme_setting_rec.list_view_is_hover_row,
                'list_view_hover_bg_color': theme_setting_rec.list_view_hover_bg_color,
                'login_page_style': theme_setting_rec.login_page_style,
                'login_page_style_comp_logo': theme_setting_rec.login_page_style_comp_logo,
                'login_page_background_type': theme_setting_rec.login_page_background_type,
                'login_page_box_color': theme_setting_rec.login_page_box_color,
                'login_page_background_color': theme_setting_rec.login_page_background_color,
                'is_sticky_form': theme_setting_rec.is_sticky_form,
                'is_sticky_list': theme_setting_rec.is_sticky_list,
                'is_sticky_list_inside_form': theme_setting_rec.is_sticky_list_inside_form,
                'is_sticky_pivot': theme_setting_rec.is_sticky_pivot,
                'tab_style': theme_setting_rec.tab_style,
                'tab_mobile_style': theme_setting_rec.tab_style_mobile,
                'horizontal_tab_style': theme_setting_rec.horizontal_tab_style,
                'form_element_style': theme_setting_rec.form_element_style,
                'search_style': theme_setting_rec.search_style,
                'navbar_style': theme_setting_rec.navbar_style,
                'breadcrumb_style': theme_setting_rec.breadcrumb_style,
                'progress_style': theme_setting_rec.progress_style,
                'progress_height': theme_setting_rec.progress_height,
                'progress_color': theme_setting_rec.progress_color,
                'checkbox_style': theme_setting_rec.checkbox_style,
                'radio_btn_style': theme_setting_rec.radio_btn_style,
                'scrollbar_style': theme_setting_rec.scrollbar_style,
                'backend_all_icon_style': theme_setting_rec.backend_all_icon_style,
                'pre_theme_style':theme_setting_rec.pre_theme_style,
                'theme_style':theme_setting_rec.theme_style,
                'theme_color':theme_setting_rec.theme_color,
                }

    @http.route('/update/theme_style', type='json', auth="public")
    def update_theme_style_sidebar(self, color_id):
        theme_setting_rec = request.env['sh.back.theme.config.settings'].sudo().search([
            ('id', '=', 1)], limit=1)
        theme_style = 'color_' + \
                      theme_setting_rec.theme_color.split(
                          '_')[1] + '_' + color_id.split('_')[1]

        if selected_theme_style_dict:
            theme_setting_rec.update(selected_theme_style_dict)
            theme_setting_rec.write(
                {'theme_style': 'style_' + color_id.split('_')[1]})

        return {}

    @http.route('/update/navbar_style', type='json', auth="public")
    def update_theme_style(self, is_navbar_style):
        theme_setting_rec = request.env['sh.back.theme.config.settings'].sudo().search([
            ('id', '=', 1)], limit=1)
        if theme_setting_rec:
            if is_navbar_style:
                theme_setting_rec.write({'is_navbar_style':True})
            else:
                theme_setting_rec.write({'is_navbar_style': False})
        return {}


    @http.route('/update/theme_style_pre_color', type='json', auth="public")
    def theme_style_pre_color(self, pre_color_id):
        theme_setting_rec = request.env['sh.back.theme.config.settings'].sudo().search([
            ('id', '=', 1)], limit=1)
        pre_theme_color = pre_color_id

        selected_theme_style_dict = dict_pre_theme_color_style.get(
            pre_theme_color, False)

        predefined_style_1_back_image = request.env.ref(
            'sh_backmate_theme_adv.sh_back_theme_config_adv_attachment_predefined_theme_1')

        selected_theme_style_dict.update({
            'body_background_image': predefined_style_1_back_image.datas
        })

        if selected_theme_style_dict:
            theme_setting_rec.update(selected_theme_style_dict)
            theme_setting_rec.write({'pre_theme_style': pre_theme_color})
        return {}

    # MULTI TAB START
    @http.route(['/add/mutli/tab'], type='json', auth='public')
    def add_multi_tab(self, **kw):
        user = request.env.user

        multi_tab_ids = user.multi_tab_ids.filtered(
            lambda mt: mt.name == kw.get('name'))
        if not multi_tab_ids:
            user.sudo().write({
                'multi_tab_ids': [(0, 0,  {
                    'name': kw.get('name'),
                    'url': kw.get('url'),
                    'actionId': kw.get('actionId'),
                    'menuId': kw.get('menuId'),
                    'menu_xmlid': kw.get('menu_xmlid'),
                })]
            })

        return True

    @http.route(['/get/mutli/tab'], type='json', auth='public')
    def get_multi_tab(self, **kw):
        obj = request.env['biz.multi.tab']
        user = request.env.user
        if user.multi_tab_ids:
            record_dict = user.multi_tab_ids.sudo().read(set(obj._fields))
            return record_dict
        else:
            return False

    @http.route(['/remove/multi/tab'], type='json', auth='public')
    def remove_multi_tab(self, **kw):
        multi_tab = request.env['biz.multi.tab'].sudo().search(
            [('id', '=', kw.get('multi_tab_id'))])
        multi_tab.unlink()
        user = request.env.user
        multi_tab_count = len(user.multi_tab_ids)
        values = {
            'removeTab': True,
            'multi_tab_count': multi_tab_count,
        }
        return values

    @http.route(['/update/tab/details'], type='json', auth='public')
    def update_tabaction(self, **kw):
        tabId = kw.get('tabId')
        TabTitle = kw.get('TabTitle')
        url = kw.get('url')
        ActionId = kw.get('ActionId')
        menu_xmlid = kw.get('menu_xmlid')

        multi_tab = request.env['biz.multi.tab'].sudo().search(
            [('id', '=', tabId)])
        if multi_tab:
            multi_tab.sudo().write({
                'name': TabTitle or multi_tab.name,
                'url': url or multi_tab.url,
                'actionId': ActionId or multi_tab.ActionId,
                'menu_xmlid': menu_xmlid or multi_tab.menu_xmlid,
            })
        return True
    # MULTI TAB END

    @http.route(['/get/attachment/data'], type='json', auth='public')
    def get_attachment_data(self, **kw):
        rec_ids = kw.get('rec_ids')
        for rec in rec_ids:
            if isinstance(rec, str):
                rec_ids.remove(rec)
        if kw.get('model') and rec_ids:
            # FOR DATA SPEED ISSUE; SEARCH ATTACHMENT DATA WITH SQL QUERY
            attachments = request.env['ir.attachment'].sudo().search([
                ('res_model', '=', kw.get('model'))
            ])
            attachment_data = []
            attachment_res_id_set = set()
            for attachment in attachments:
                attachment_res_id_set.add(attachment.res_id)
            dict = {}
            for res_id in attachment_res_id_set:
                filtered_attachment_record = attachments.filtered(
                    lambda attachment: attachment.res_id == res_id)
                for fac in filtered_attachment_record:
                    if dict.get(res_id):
                        dict[res_id].append({
                            'attachment_id': fac.id,
                            'attachment_mimetype': fac.mimetype,
                            'attachment_name': fac.name,
                        })
                    else:
                        dict[res_id] = [{
                            'attachment_id': fac.id,
                            'attachment_mimetype': fac.mimetype,
                            'attachment_name': fac.name,
                        }]
            attachment_data.append(dict)
            return attachment_data

    @http.route('/recent_records/fetch', type='json', auth='user')
    def fetch_recent_records(self):
        user_id = request.env.user.id
        recent_records = request.env['sh.recent.records'].sudo().search([('sh_user_id', '=', user_id)])
        return {
            'data': [{
                'sh_model': record.sh_model,
                'record_id': record.record_id,
                'name': record.name,
            } for record in recent_records]
        }
    
#----------------------------------------------------------
# Odoo quick create web Controllers
#----------------------------------------------------------
class QuickCreate(http.Controller):

    @http.route(['/create/quick/action'], type='json', auth='user', methods=['POST'])
    def create_quick_action_records(self,data):
        action_vals={
            'name': data.get('name'),
            'icon': data.get('icon'),
            'sequence': data.get('sequence'),
            'model_id': data.get('model_id'),
            'sh_user_id': request.env.user.id,
        }
        new_record=request.env['sh.quick.create'].sudo().create(action_vals)
        return True


        # return mentioned_dict
    
    @http.route(['/get/quick/action/data'], type='json', auth='user', methods=['POST'])
    def get_quick_action_data(self):
        final_data_list=[]
        total_data=request.env['sh.quick.create'].sudo().search([('sh_user_id','=',request.env.user.id)],order='sequence asc')
        for action in total_data:
            data_dict={
                'id':action.id,
                'name':action.name,
                'model_id':action.model_id.id,
                'icon':action.icon,
                'sequence':action.sequence,
                'model_name':action.model_name,
            }
            final_data_list.append(data_dict)

        allow_model_dict={}
        models=request.env['ir.model'].sudo().search([])

        for model in models:
            allow_model_dict[model.id]=model.display_name

        if not final_data_list:
            final_data_list=False

        return final_data_list,allow_model_dict

    
    @http.route(['/get/edit/quick/action/data'], type='json', auth='user', methods=['POST'])
    def get_edit_quick_action_data(self,action_id):
        data=request.env['sh.quick.create'].sudo().browse(action_id)

        final_data_list=[]
        data_dict={
            'id':data.id,
            'name':data.name,
            'model_id':data.model_id.id,
            'icon':data.icon,
            'sequence':data.sequence,
            'model_name':data.model_name,
        }
        final_data_list.append(data_dict)
        return final_data_list

    
    @http.route(['/unlink/quick/action/data'], type='json', auth='user', methods=['POST'])
    def unlink_quick_action_data(self,action_id):
        data=request.env['sh.quick.create'].sudo().browse(action_id)
        data.sudo().unlink()
       
        return True
    
    @http.route(['/update/quick/action'], type='json', auth='user', methods=['POST'])
    def update_quick_action_data(self,data,action_id):
        current_record=request.env['sh.quick.create'].sudo().browse(action_id)
        action_vals={
            'name': data.get('name'),
            'icon': data.get('icon'),
            'sequence': data.get('sequence'),
            'model_id': data.get('model_id'),
            'sh_user_id': request.env.user.id,
        }
        current_record.sudo().write(action_vals)
        return True

