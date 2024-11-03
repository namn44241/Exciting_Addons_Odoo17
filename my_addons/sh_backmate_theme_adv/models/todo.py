# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from email.policy import default
from odoo import models,fields, api

class Todo(models.Model):
    _name = "sh.todo"
    _description = "To Do"
    _order = "user_id,is_done,sequence"
    
    name = fields.Char("Name")
    is_done = fields.Boolean("Done")
    sequence = fields.Integer("Sequence",default=10)
    user_id = fields.Many2one("res.users",string="User",default=lambda self: self.env.uid)

