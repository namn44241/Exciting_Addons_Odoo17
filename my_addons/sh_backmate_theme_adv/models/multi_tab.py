from odoo import models, fields, api

class MultiTab(models.Model):
	_name = 'biz.multi.tab'
	_description = "Multi Tab"

	name = fields.Char("App Name")
	url = fields.Char("URL")
	actionId = fields.Char("Action ID")
	menuId = fields.Char("Menu ID")
	user_id = fields.Many2one('res.users')
	menu_xmlid = fields.Char("XML ID Name")