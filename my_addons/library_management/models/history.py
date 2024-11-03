from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError

class BookHistory(models.Model):
    _name = 'library.book.history'
    book_id = fields.Many2one('library.book')
    borrow_date = fields.Date()
    return_date = fields.Date()
    borrower_id = fields.Many2one('res.partner')
    state = fields.Selection([
        ('borrowed', 'Đã được mượn'),
        ('returned', 'Đã trả'),
        ('overdue', 'Quá hạn trả'),
        ('lost', 'Mất')
    ])