# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from odoo import models,fields,api
from odoo.http import request
from operator import itemgetter

class Lang(models.Model):
    _inherit = "res.lang"
    
    @api.model
    def sh_get_installed_lang(self):
        """ Return the installed languages as a list of (code, name) sorted by name. """
        langs = self.with_context(active_test=True).search([])
        return sorted([(lang.code, lang.name, lang.flag_image_url) for lang in langs], key=itemgetter(1))


class sh_wqm_quick_menu(models.Model):
    _name = "sh.wqm.quick.menu"
    _description = "quick / Shortcut menu model"
    _order = "id desc"
    
    menu_id = fields.Many2one(comodel_name = "ir.ui.menu",
                              string = "Menu",
                              ondelete='cascade')
    user_id = fields.Many2one(comodel_name = "res.users",
                              string = "User",
                              required = True,
                              ondelete='cascade')
    
    parent_menu_id = fields.Integer(string = "Parent Menu ID")
    
    sh_url = fields.Char("Url ")
    name = fields.Char("Name")

    @api.model
    def get_search_result(self,query):
        search_quick_menu = self.sudo().search([
            ('name', 'ilike', query[0].lower()),
            ('user_id', '=', self.env.uid)
            ])
        final_quick_menu_list = []
        if search_quick_menu:
            for rec in search_quick_menu:
                type = 'other'
                if len(rec.sh_url.split("view_type=")) >1:
                    type = rec.sh_url.split("view_type=")[1]
                    if len(type.split("&")) > 1:
                        type = type.split("&")[0]

                vals = {
                    'id'             : rec.id,
                    'name'           : rec.name,
                    'sh_url'      : rec.sh_url,
                    'type' :type
                    }
                final_quick_menu_list.append(vals)
                
        return final_quick_menu_list

    def prepare_result(self):
        final_quick_menu_list = []
        search_quick_menu = self.sudo().search([
                ('user_id', '=', self.env.user.id),
                ])
        if search_quick_menu:
            for rec in search_quick_menu:
                type = 'other'
                if len(rec.sh_url.split("view_type=")) >1:
                    type = rec.sh_url.split("view_type=")[1]
                    if len(type.split("&")) > 1:
                        type = type.split("&")[0]
                vals = {
                    'id'             : rec.id,
                    'name'           : rec.name,
                    'sh_url'      : rec.sh_url,
                    'type' :type
                    }
                final_quick_menu_list.append(vals)
        return  final_quick_menu_list        
    

    def set_quick_menu(self, action_id,parent_menu_id):
        if action_id:
            menu = self.env['ir.ui.menu'].sudo().search([('action', 'like', '%,' + str(action_id))], limit=1)
            if not menu:
                action = self.env['ir.actions.actions'].sudo().browse(int(action_id))
                if action:
                    menu = self.env['ir.ui.menu'].sudo().search([('name', '=', action.name), ('action', '!=', '')], limit=1)

            
            if menu:
                rec = self.sudo().search(
                    [('menu_id', '=', menu.id),
                     ('user_id', '=', self.env.user.id)])
                if (rec):
                    if (rec.sudo().unlink()):
                        return {
                            'is_set_quick_menu': False
                        }
                else:
                    if (menu and menu.action):
                        if (self.sudo().create({
                            'menu_id': menu.id,
                            'user_id': self.env.user.id,
                            'parent_menu_id' : int(parent_menu_id),
                        })):
                            return {
                                'is_set_quick_menu': True
                            }
        return {}
    
    def set_quick_url(self, url, model, res_id, action_id):
        bookmark_name = ''
        if model and res_id:
            read_data = self.env[model].sudo().search_read([('id','=',res_id)],[],order='id')
            if len(read_data) > 0:
                if 'name' in read_data[0]:
                    bookmark_name = read_data[0]['name']
                elif 'display_name' in read_data[0]:
                    bookmark_name = read_data[0]['display_name']
                elif 'reference' in read_data[0]:
                    bookmark_name = read_data[0]['reference']
                elif 'id' in read_data[0]:
                    bookmark_name = read_data[0]['id']

            

        elif action_id and model != 'mail.box_inbox':
            action = self.env['ir.actions.act_window'].sudo().browse(int(action_id))
            if action:
                bookmark_name = action.name

        if model == 'mail.box_inbox':
            bookmark_name = 'Discuss'

        if url:
             
            
            rec = self.sudo().search(
                [('sh_url', '=', url),
                    ('user_id', '=', self.env.user.id)])
            if (rec):
                if (rec.sudo().unlink()):
                    final_quick_menu_list = self.prepare_result()
                    return {
                        'is_set_quick_menu': False,
                        'final_quick_menu_list':final_quick_menu_list
                    }
            else:
                if (url):
                    if (self.sudo().create({
                        'sh_url': url,
                        'name': bookmark_name,
                        'user_id': self.env.user.id,
                    })):
                        final_quick_menu_list = self.prepare_result()
                        return {
                            'is_set_quick_menu': True,
                            'final_quick_menu_list':final_quick_menu_list
                        }
        
        return {}

    def is_quick_menu_avail(self, action_id):
        if action_id:
            menu = self.env['ir.ui.menu'].sudo().search([('action', 'like', '%,' + str(action_id))], limit=1)
#             menu = False
            if not menu:
                action = self.env['ir.actions.actions'].sudo().browse(int(action_id))
                if action:
                    menu = self.env['ir.ui.menu'].sudo().search([('name', '=', action.name), ('action', '!=', '')], limit=1)
            
            if menu:
                result = self.is_already_have_in_quick_menu(menu.id)
                return result       

    def is_quick_menu_avail_url(self, url):
        if url:
          
            result = self.is_already_have_in_quick_url(url)
            return result    
                    
    def is_already_have_in_quick_menu(self, menu_id):
        menu = self.env['ir.ui.menu'].sudo().browse(int(menu_id))
        if (menu and menu.action):
            rec = self.sudo().search(
                [('menu_id', '=', menu_id),
                 ('user_id', '=', self.env.user.id)])
            if (rec):
                return True
        return False

    def is_already_have_in_quick_url(self, url):        
        if (url):
            rec = self.sudo().search(
                [('sh_url', '=', url),
                 ('user_id', '=', self.env.user.id)])
            if (rec):
                return True
        return False

    def get_quick_menu_data(self, fields=[]): 
        final_quick_menu_list = self.prepare_result()
        return final_quick_menu_list

    def remove_quick_menu_data(self, menu_id):
        if menu_id:
            rec = self.sudo().search(
                [('id', '=', menu_id),
                 ('user_id', '=', self.env.user.id)])
            if rec:
                json = {
                    'id': rec.id,
                    'name': rec.name,
                    'sh_url': rec.sh_url,
                }
                
                rec.sudo().unlink()
                final_quick_menu_list = self.prepare_result()
                json.update({'final_quick_menu_list':final_quick_menu_list})
                return json
        return False

    
class res_users(models.Model):
    _inherit = "res.users"
    
    sh_wqm_web_quick_menu_line = fields.One2many(comodel_name="sh.wqm.quick.menu",
                                                inverse_name="user_id",
                                                string = "Quick Menu",
                                                )
    
    sh_enable_night_mode = fields.Boolean('Night Mode',default=False)
    sh_enable_language_selection = fields.Boolean('Language Selection',default=True)
    sh_enable_zoom = fields.Boolean('Zoom View',default=False)
    sh_enable_multi_tab = fields.Boolean('Multi Tab View',default=False)
    sh_enable_calculator_mode = fields.Boolean('Calculator Mode')
    sh_enable_gloabl_search_mode = fields.Boolean('Global Search Mode')
    sh_enable_quick_menu_mode  = fields.Boolean("Quick Menu Mode")
    sh_enable_todo_mode  = fields.Boolean("To Do Feature")
    sh_disable_auto_edit_model = fields.Boolean("Disable Auto Edit mode", default=False)
    sh_enable_expand_collapse = fields.Boolean("Group by List View Expand/Collapse",default=False)
    show_attachment_in_list_view = fields.Boolean(string="Show Attachment In List View")
    sh_enable_open_record_in_new_tab = fields.Boolean("Open Record in New Tab",default=False)
    multi_tab_ids = fields.One2many('biz.multi.tab', 'user_id', string="Multi Tabs")
    sh_enable_recent_record_view = fields.Boolean(string="Enable Recent Record View")
    recent_record_ids = fields.One2many('sh.recent.records','sh_user_id')
    quick_create_view = fields.Boolean(string="Enable Quick Create View")

    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS + ['quick_create_view','sh_enable_recent_record_view','sh_disable_auto_edit_model','sh_enable_todo_mode','sh_enable_quick_menu_mode','sh_enable_gloabl_search_mode','sh_enable_night_mode', 'sh_enable_language_selection','sh_enable_zoom','sh_enable_multi_tab','sh_enable_calculator_mode','sh_enable_expand_collapse','show_attachment_in_list_view','sh_enable_open_record_in_new_tab']

    @property
    def SELF_WRITEABLE_FIELDS(self):
            return super().SELF_WRITEABLE_FIELDS + ['quick_create_view','sh_enable_recent_record_view','sh_disable_auto_edit_model','sh_enable_todo_mode','sh_enable_quick_menu_mode','sh_enable_gloabl_search_mode','sh_enable_night_mode', 'sh_enable_language_selection','sh_enable_zoom','sh_enable_multi_tab','sh_enable_calculator_mode','sh_enable_expand_collapse','show_attachment_in_list_view','sh_enable_open_record_in_new_tab']

    @api.model
    def get_attachment_data(self,model,res_ids):
        
        if model and res_ids and self.env.user.show_attachment_in_list_view:
            self.env.cr.execute("""select id,mimetype,name,res_id from ir_attachment where res_model=%s and res_id in %s """,(model,tuple(res_ids)))
            data_list = self.env.cr.fetchall()

            attachment_data_dict = {}

            for item in data_list:
                if attachment_data_dict.get(item[3]):
                    attachment_data_dict.get(item[3]).append({
                        'attachment_id': item[0],
                        'attachment_mimetype': item[1],
                        'attachment_name': item[2],
                    })
                else:
                    attachment_data_dict[item[3]] = [{
                        'attachment_id': item[0],
                        'attachment_mimetype': item[1],
                        'attachment_name': item[2]
                    }]

            return [attachment_data_dict],True
        
        else:
            return [],False

class Http(models.AbstractModel):
    _inherit = 'ir.http'
    
    def session_info(self):
        info = super().session_info()
        user = request.env.user
        info["sh_enable_night_mode"] = user.sh_enable_night_mode
        info["sh_enable_language_selection"] = user.sh_enable_language_selection
        info["sh_enable_zoom"] = user.sh_enable_zoom
        info["sh_enable_multi_tab"] = user.sh_enable_multi_tab
        info["sh_enable_calculator_mode"] =user.sh_enable_calculator_mode
        info["sh_enable_gloabl_search_mode"] = user.sh_enable_gloabl_search_mode
        info["sh_enable_quick_menu_mode"] = user.sh_enable_quick_menu_mode
        info["sh_enable_todo_mode"] = user.sh_enable_todo_mode
        info["sh_disable_auto_edit_model"] = user.sh_disable_auto_edit_model
        info["sh_enable_expand_collapse"] = user.sh_enable_expand_collapse
        info["sh_enable_open_record_in_new_tab"] = user.sh_enable_open_record_in_new_tab
        info["show_attachment_in_list_view"] = user.show_attachment_in_list_view
        info["sh_enable_recent_record_view"] = user.sh_enable_recent_record_view        
        info["quick_create_view"] = user.quick_create_view        
        return info
    

    