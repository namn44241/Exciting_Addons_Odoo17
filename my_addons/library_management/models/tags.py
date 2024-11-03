from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError

class BookTag(models.Model):
    _name = 'library.book.tag'
    name = fields.Char()
    color = fields.Integer()