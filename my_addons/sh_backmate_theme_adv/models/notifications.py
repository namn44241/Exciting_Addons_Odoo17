# Copyright (C) Softhealer Technologies.
from odoo import fields, models, _, api
# import html2text

class Annoucement(models.Model):
    _name = 'sh.announcement'
    _description = 'Announcement'

    name = fields.Char("Name")
    description = fields.Html("Description",translate=True)
    active = fields.Boolean("Active",default=True)
    user_ids = fields.Many2many('res.users',string="Users")
    font_color = fields.Char("Font Color")
    background_color = fields.Char("Background Color")
    date = fields.Date("Creation Date",default=fields.Date.today())
    is_animation = fields.Boolean("Enable Animation ?")
    direction = fields.Selection([('right','Left to Right'),('left','Right To Left')],string="Direction",default='right')
    simple_text = fields.Boolean("Want Simple Text ?")
    description_text = fields.Text("Description ")
    font_size = fields.Integer("Font Size", default=12)
    padding = fields.Float("Padding", default=5)
    font_family = fields.Selection([
        ('Roboto','Roboto'),
        ('monospace','Monospace'),
        ('serif','Serif'),
        ('sans-serif','Sans-serif'),
        ('fantasy','Fantasy'),
        ('emoji','Emoji'),
        ('math','Math')
        ],string = 'Body Font Family',default='Roboto')
    google_font_family = fields.Char(string = "Google Font Family")
    is_popup_notification = fields.Boolean("Popup Notification ?")
    notification_type = fields.Selection([('warning','Info'),('danger','Alert')], string="Notification Type",default='warning')
    
    @api.onchange('is_popup_notification')
    def _onchange_popup_notification(self):
        if self.is_popup_notification:
            self.simple_text = True
        else:
            self.simple_text = False
        
    
    def notify_user(self):
        notifications = []
        if self.user_ids:
            if self.simple_text:
                if self.notification_type == 'warning':
                    CODE_SOUND_SUCCESS = "" 
                    for user in self.user_ids:
                        notifications.append((
                            user.partner_id,'simple_notification',
                            {'title': _('Notitification'), 'message': CODE_SOUND_SUCCESS + str(self.description_text)}  # sorted to make deterministic for tests
                        ))
                        
                if self.notification_type == 'danger':
                    CODE_SOUND_FAIL = "" 
                    for user in self.user_ids:
                        notifications.append((
                            user.partner_id,'simple_notification',
                            {'title': _('Notitification'), 'message': CODE_SOUND_FAIL + str(self.description_text)}  # sorted to make deterministic for tests
                        ))
                
        self.env['bus.bus']._sendmany(notifications)
