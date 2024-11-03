from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError

class AudioBook(models.Model):
    _name = 'library.audiobook'
    _inherit = 'library.book'

    book_id = fields.Many2one(
        'library.book',
        required=True,
        ondelete='cascade'
    )

    duration = fields.Float('Độ dài (tiếng)')
    narrator = fields.Char('Người kể')
    audio_format = fields.Selection([
        ('mp3', 'MP3'),
        ('aac', 'AAC'),
        ('wav', 'WAV')
    ], string='Loại File')