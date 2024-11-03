from odoo import fields, models, api
from datetime import datetime
import requests
import json
from odoo.exceptions import UserError


class SendNotification(models.Model):
    _name = 'sh.send.notification'
    _rec_name = 'title'
    _description = 'Send Push Notification to all the registered user'

    name = fields.Text("Name")
    title = fields.Char("Title")
    message = fields.Text("Message")
    redirect_url = fields.Char("Redirect Url")
    logo = fields.Binary("Choose logo")
    state = fields.Selection([('draft','Draft'),('validated','Validated'),('schedule','Schedule'),('cancel','Cancel'),('error','Error'),('done','Done')],default="draft")
    message_to = fields.Selection([('all','To All'),('specific','To Specific'),('internal','Internal Users / Employee'),('portal','Portal Users / Ecommerce Customers'),('public','Public Users / Non Registers Users')],default="all",string="Send Notification")
    specific_ids = fields.Many2many('sh.push.notification',string="Register Id")
    log_historys = fields.One2many('sh.notification.logger','base_config_id',string="Log History")

    def send_message(self):
        
        if self.env.company.enable_web_push_notification:
            try:
                from pyfcm import FCMNotification
            except ImportError:
                raise UserError ("This module use pyfcm python library. Please install library in odoo server using below commands:\n \n 1) for python 3 using command : pip3 installl pyfcm \n 2) for python 2 use command : pip install pyfcm")
            try:
                domain = ([])
                api_key = self.env.company.api_key
                push_service = FCMNotification(api_key=api_key)
                registration_tokens = []
                if self.message_to == 'all':
                    domain = []
                    reg_ids = self.env['sh.push.notification'].sudo().search(domain)
                    for ids in reg_ids:
                        registration_tokens.append(ids.register_id)
                elif self.message_to == 'specific':
                    for idss in self.specific_ids:
                        registration_tokens.append(idss.register_id)
                elif self.message_to == 'internal':
                    domain = [('user_type','=','internal')]
                    reg_ids = self.env['sh.push.notification'].search(domain)        
                    for ids in reg_ids:
                        registration_tokens.append(ids.register_id)
                elif self.message_to == 'portal':
                    domain = [('user_type','=','portal')]
                    reg_ids = self.env['sh.push.notification'].search(domain)        
                    for ids in reg_ids:
                        registration_tokens.append(ids.register_id)
                elif self.message_to == 'public':
                    domain = [('user_type','=','public')]
                    reg_ids = self.env['sh.push.notification'].search(domain)        
                    for ids in reg_ids:
                        registration_tokens.append(ids.register_id)

                extra_notification_kwargs = {
                    'click_action' : self.redirect_url
                }
                
                message_title = self.title
                message_body = self.message                
                result = push_service.notify_multiple_devices(registration_ids=registration_tokens,message_title=message_title, message_body=message_body,extra_notification_kwargs=extra_notification_kwargs)
                vals = {
                    'datetime' : datetime.now(),
                    'error' : "Done",
                    'status' : 'success',
                    'base_config_id' : self.id
                }
                self.env['sh.notification.logger'].create(vals)
            except Exception as e:
                vals = {
                    'datetime' : datetime.now(),
                    'error' : e,
                    'status' : 'error',
                    'base_config_id' : self.id
                }
                self.env['sh.notification.logger'].create(vals)

    def schedule_notification(self):
        self.state = "schedule"

    def reset(self):
        self.state = "draft"
    
    def validate(self):
        self.state = "validated"
    
    def cancel(self):
        self.state = "cancel"

    def _push_notification_cron(self):
        domain = [('state', '=', 'schedule')]
        find_schedule = self.env['sh.send.notification'].search(domain)
        for schedule in find_schedule:
            schedule.send_message()
