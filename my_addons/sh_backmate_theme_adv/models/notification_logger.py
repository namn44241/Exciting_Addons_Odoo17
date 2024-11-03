from odoo import fields, models

class NotificationLogger(models.Model):
    _name = 'sh.notification.logger'
    _description = 'It keeps updated about the notification being sent'
    _order = 'id desc'

    name = fields.Char("Name")
    error = fields.Char("Message")
    datetime = fields.Datetime("Date & Time")
    base_config_id = fields.Many2one('sh.send.notification')
    status = fields.Selection([('success','Success'),('error','Failed')],string="Notification")