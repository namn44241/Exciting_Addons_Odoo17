# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, models, _, fields
from odoo.exceptions import ValidationError


class CustomUsers(models.Model):
    _inherit = 'res.users'

    sh_quick_action_line_ids = fields.One2many(
        'sh.quick.create',
        'sh_user_id',
        string='Quick Action lines',
    )