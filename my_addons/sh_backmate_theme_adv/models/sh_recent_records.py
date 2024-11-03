from odoo import models, fields, api

class ShRecentRecords(models.Model):
    _name = 'sh.recent.records'
    _description = 'Recent Records'

    sh_user_id = fields.Many2one('res.users', required=True, string='User')
    sh_model = fields.Char(required=True, string='Model')
    sh_record_id = fields.Integer(string='Record ID')
    name = fields.Char(required=True, string='Record Name')
    sh_action_name = fields.Char(required=False, string='Action Name')
    sh_is_bookmark = fields.Boolean()
    sh_module_name = fields.Char()

    @api.model
    def create_or_update(self, sh_user_id, sh_model, sh_record_id, name, sh_action_name, sh_module_name):
        print('create_or_update')
        if not sh_model == 'res.config.settings':
            record = self.search(
                [('sh_user_id', '=', sh_user_id), ('sh_model', '=', sh_model), ('sh_record_id', '=', sh_record_id)],
                limit=1)
            if record:
                if sh_action_name:
                    record.write({'name': name, 'sh_action_name': sh_action_name})
            else:
                rec = self.create({'sh_user_id': sh_user_id, 'sh_model': sh_model, 'sh_record_id': sh_record_id, 'name': name, 'sh_action_name': sh_action_name})
                print("rec",rec)
        else:
            record = self.search([('sh_user_id', '=', sh_user_id), ('sh_model', '=', sh_model), ('sh_module_name', '=', sh_module_name)], limit=1)
            if record:
                if sh_action_name:
                    record.write({'name': name, 'sh_action_name': sh_action_name})
            else:
                rec = self.create({'sh_user_id': sh_user_id, 'sh_model': sh_model, 'name': name,'sh_action_name': sh_action_name, 'sh_module_name':sh_module_name})
                print("rec", rec)


    @api.model
    def fetch_recent_records(self):
        user_id = self.env.user.id
        recent_records = self.sudo().search([('sh_user_id', '=', user_id)])
        return {
            'data': [{
                'sh_model': record.sh_model,
                'sh_record_id': record.sh_record_id,
                'name': record.name,
                'sh_action_name': record.sh_action_name
            } for record in recent_records]
        }
