# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, models, fields
from odoo.exceptions import ValidationError


class QuickCreate(models.Model):
    _name = 'sh.quick.create'
    _description = "Quick Create"

    name=fields.Char('Name')
    model_name=fields.Char('Model Name',related='model_id.model')
    model_id = fields.Many2one(
        "ir.model", string="Model", required=True, ondelete="cascade", help="Model on which the automation rule runs."
    )    
    icon=fields.Text('icon')
    sequence = fields.Integer(default=1)
    sh_user_id = fields.Many2one(
        comodel_name='res.users',
        string='User Id',
    )