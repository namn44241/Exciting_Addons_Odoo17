from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError


class Ebook(models.Model):
    _name = 'library.ebook'
    _description = 'E-Book'
    _inherits = {'library.book': 'book_id'}

    book_id = fields.Many2one(
        'library.book',
        required=True,
        ondelete='cascade'
    )
    file_url = fields.Char('Download URL')
    file_size = fields.Float('Dung lượng (MB)')
    format = fields.Selection([
        ('pdf', 'PDF'),
        ('epub', 'EPUB'),
        ('mobi', 'MOBI')
    ], string='Loại File')