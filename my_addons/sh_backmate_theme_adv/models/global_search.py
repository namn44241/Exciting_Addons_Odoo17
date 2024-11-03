# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields,models,api,_
from odoo.exceptions import UserError
FIELD_TYPES = [(key, key) for key in sorted(fields.Field.by_type)]

class ResCompany(models.Model):
    _inherit = 'res.company'
    
    enable_menu_search = fields.Boolean("Enable Menu Global Search", default=True)
    
class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'
    
    enable_menu_search = fields.Boolean(related="company_id.enable_menu_search", string="Enable Menu Global Search",readonly=False)
 

class GlobalSearch(models.Model):
    _name = 'global.search'
    _description = "Global Search"
    _rec_name ='model_id'
    
    model_id = fields.Many2one('ir.model', string='Applies To', required=True, index=True, ondelete='cascade',
                               help="The model this field belongs to")
    
    
    field_ids = fields.Many2many('ir.model.fields', string='Fields',domain="[('model_id','=',model_id)]")
    main_field_id = fields.Many2one('ir.model.fields',string="Name Field",required=True,domain="[('model_id','=',model_id)]", ondelete='cascade')
    global_field_ids = fields.One2many('global.search.fields','global_search_id', string='Fields ')
    
    
    @api.model
    def get_search_result(self,query):
        search_result ={}
        
        if self.env.user.company_id.enable_menu_search:
            menu_roots = self.env['ir.ui.menu'].search([('parent_id', '=', False)])
            menu_data = self.env['ir.ui.menu'].search([('id', 'child_of', menu_roots.ids),('name','ilike',query[0].lower()),('action','!=',False)])
            if menu_data:
                menu_data = menu_data._filter_visible_menus()
                for menu in menu_data:
                    search_result['menu| '+menu.complete_name] = {'id':menu.id,'action':menu.action.id,'name':menu.complete_name}
        
        
        
        # All Global Search Records
        single_company = self.env['res.company'].search_count([])
        for company in self.env['res.company'].search([]):
            for search_rec in self.env['global.search'].sudo().search([]):
            
                # All Field List including name field
                field_list = []
                for field in search_rec.global_field_ids:
                    field_list.append(field.field_id.name)
                if search_rec.main_field_id.name not in field_list:
                    field_list.append(search_rec.main_field_id.name)
                    
                # Fetch all record of this current model with defined field list
                try:
                    if single_company ==1:
                        model_obj = self.env[search_rec.model_id.model].search_read(['|',('company_id','=',company.id),('company_id','=',False)],field_list,order='id')
                    else:
                        model_obj = self.env[search_rec.model_id.model].search_read([('company_id','=',company.id)],field_list,order='id')
                    for model_rec in model_obj:
                        for field_row in search_rec.global_field_ids:
                            field = field_row.field_id
                            if field.ttype in ['char','boolean','text','date','datetime','float','integer','selection','monetary']:
                                if model_rec.get(field.name):
                                    object_data = model_rec.get(field.name)
                                    if object_data and query[0].lower() in str(object_data).casefold():
                                        model_rec['model']=field.model_id.model
                                        model_rec['model_name']=field.model_id.name
                                        search_result[company.name+'|'+field.field_description+' : '+str(object_data)] = model_rec
                                        
                            if field.ttype in [ 'many2one']:
                                if model_rec.get(field.name):
                                    object_data = model_rec.get(field.name)
                                   
                                    if object_data and query[0].lower() in str(object_data[1]).casefold():
                                        model_rec['model']=field.model_id.model
                                        model_rec['model_name']=field.model_id.name
                                        search_result_model = str(field.model_id.name)
                                        search_result_record = model_rec.get(search_rec.main_field_id.name) or ''
                                        str_object_data = str(object_data[1])
                                        search_result[company.name+'|'+search_result_record+' > '+field.field_description+' : '+str_object_data] = model_rec
                             
                            if field.ttype in [ 'one2many']:
                                if model_rec.get(field.name):
                                    data_list = model_rec.get(field.name)
                                    related_o2m_model = field.relation
                                    o2m_field_list = []
                                    for o2m_field in field_row.field_ids:
                                        o2m_field_list.append(o2m_field.field_id.name)
                        
                                    o2m_model_obj = self.env[related_o2m_model].search_read([('id','in',data_list),('company_id','=',company.id)],o2m_field_list,order='id')
                                    
                                    # o2m for loop
                                    if o2m_model_obj:
                                        for o2m_model_rec in o2m_model_obj:
                                            for o2m_field_row in field_row.field_ids:
                                                o2m_field = o2m_field_row.field_id
                                                if o2m_field.ttype in ['char','boolean','text','date','datetime','float','integer','selection','monetary']:
                                                    if o2m_model_rec.get(o2m_field.name):
                                                        o2m_object_data = o2m_model_rec.get(o2m_field.name)
                                                        if o2m_object_data and query[0].lower() in str(o2m_object_data).casefold():
                                                            
                                                            # link with main object not o2m object
                                                            o2m_model_rec['model']=field.model_id.model
                                                            o2m_model_rec['model_name']=field.model_id.name
                                                            o2m_model_rec['id']=model_rec.get('id')
                                                            search_result_model = str(field.model_id.name)
                                                            search_result_record = model_rec.get(search_rec.main_field_id.name) or ''
                                                            str_object_data = str(o2m_object_data)
                                        
                                                            search_result[company.name+'|'+search_result_record+' > '+o2m_field.field_description+' : '+str_object_data] = o2m_model_rec
                                                            
                                                if o2m_field.ttype in [ 'many2one']:
                                                    if o2m_model_rec.get(o2m_field.name):
                                                        o2m_object_data = o2m_model_rec.get(o2m_field.name)
                                                        if o2m_object_data and query[0].lower() in str(o2m_object_data[1]).casefold():
                                                            
                                                            # link with main object not o2m object
                                                            o2m_model_rec['model']=field.model_id.model
                                                            o2m_model_rec['model_name']=field.model_id.name
                                                            o2m_model_rec['id']=model_rec.get('id')
                                                            search_result_model = str(field.model_id.name)
                                                            search_result_record = model_rec.get(search_rec.main_field_id.name) or ''
                                                            str_object_data = str(o2m_object_data[1])
                                                            
                                                            search_result[company.name+'|'+search_result_record+' > '+o2m_field.field_description+' : '+str_object_data] = o2m_model_rec
                                               
                except Exception as e:
                        pass
        return search_result
    
   

class GlobalSearchFields(models.Model):
    _name = 'global.search.fields'  
    _description = 'Global Search Fields'

    global_search_id = fields.Many2one('global.search', string='Related Model')
    sequence = fields.Integer(string='Sequence', default=10)
    field_id = fields.Many2one('ir.model.fields', string='Position Field', ondelete='cascade')
    name = fields.Char("Label", related="field_id.field_description")
    model_id = fields.Many2one('ir.model',string='Model')
    related_model_id = fields.Char(string='Relation With ', related="field_id.relation")
    ttype = fields.Selection(string='Field Type', required=True,related="field_id.ttype")
    field_ids = fields.One2many('o2m.global.search.fields','global_o2m_search_id', string='Fields')
    
    @api.onchange('field_id')
    def _onchange_field_id(self):
        if self.field_id:
            if self.field_id.relation:
                model = self.env['ir.model'].sudo().search([('model','=',self.field_id.relation)],limit=1)
                if model:
                    self.model_id = model.id
                    
    def sh_o2m_dynamic_action_action(self):
        if self.ttype == 'one2many':
            view = self.env.ref('sh_backmate_theme_adv.sh_o2m_global_search_form')
            return {
                'name': _('O2M Object Fields'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'global.search.fields',
                'views': [(view.id, 'form')],
                'view_id': view.id,
                'target': 'new',
                'res_id': self.id,
    
            }
        else:
            view = self.env.ref('sh_backmate_theme_adv.sh_m2o_global_search_form')
            return {
                'name': _('M2O Object Fields'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'global.search.fields',
                'views': [(view.id, 'form')],
                'view_id': view.id,
                'target': 'new',
                'res_id': self.id,
    
            }
            
class O2MGlobalSearch(models.Model):
    _name = 'o2m.global.search.fields'
    _description = 'O2M Global Search Fields'
    
    sequence = fields.Integer(string='Sequence', default=10)
    name = fields.Char("Label")
    field_id = fields.Many2one('ir.model.fields', string='Position Field', ondelete='cascade')
    global_o2m_search_id = fields.Many2one('global.search.fields', string='Global O2M Search')
    model_id = fields.Many2one('ir.model', string='Relation With', ondelete='cascade')
    related_model_id = fields.Char(string='Relation With ', related="field_id.relation")
    ttype = fields.Selection(string='Field Type', required=True,related="field_id.ttype")
    
    @api.onchange('field_id')
    def _onchange_field_id(self):
        if self.field_id:
            if self.field_id.ttype in ['one2many','many2many']:
                raise UserError("Field type One2many and Many2many not supported inside O2M wizard !")
            self.name = self.field_id.field_description
            if self.field_id.relation:
                model = self.env['ir.model'].sudo().search([('model','=',self.field_id.relation)],limit=1)
                if model:
                    self.model_id = model.id
    
      
