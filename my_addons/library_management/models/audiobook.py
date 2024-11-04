from odoo import models, fields, api
from odoo.exceptions import ValidationError

class AudioBook(models.Model):
    _name = 'library.audiobook'
    _description = 'Audio Book'
    _delegate = {
        'library.book': 'book_id'
    }

    # Trường tham chiếu đến model được delegate
    book_id = fields.Many2one(
        'library.book',
        required=True,
        ondelete='cascade',
        delegate=True
    )

    # Các trường riêng của AudioBook
    duration = fields.Float('Độ dài (tiếng)')
    narrator = fields.Char('Người kể')
    audio_format = fields.Selection([
        ('mp3', 'MP3'),
        ('aac', 'AAC'),
        ('wav', 'WAV')
    ], string='Loại File')

    # Kiểm tra độ dài audio phải dương
    @api.constrains('duration')
    def _check_duration(self):
        for record in self:
            if record.duration <= 0:
                raise ValidationError('Độ dài audio phải lớn hơn 0')