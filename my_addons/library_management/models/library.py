from odoo import models, fields, api
from odoo.exceptions import UserError
from odoo.exceptions import ValidationError

class Book(models.Model):
    _name = 'library.book'
    _description = 'Library Book'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char('Tiêu đề', required=True)
    author = fields.Char('Tác giả', required=True)
    isbn = fields.Char('Mã sách')
    state = fields.Selection([
        ('available', 'Còn trong kho'),
        ('borrowed', 'Đã được mượn'),
    ], default='available', tracking=True)
    description = fields.Text('Mô tả')
    cover_url = fields.Char('URL')

    active = fields.Boolean(default=True)
    color = fields.Integer('Màu sắc')
    tag_ids = fields.Many2many('library.book.tag', string='Tags')
    copies_count = fields.Integer('Lượng sách còn lại', default=1)
    borrow_history_ids = fields.One2many('library.book.history', 'book_id', string='Lịch sử mượn')

    subtopic_ids = fields.One2many(
        'library.book.subtopic',
        'book_id',
        string='Thể loại'
    )
    subtopic_count = fields.Integer(
        'Số lượng thể loại',
        compute='_compute_subtopic_count'
    )

    @api.depends('subtopic_ids')
    def _compute_subtopic_count(self):
        for record in self:
            record.subtopic_count = len(record.subtopic_ids)

    def action_mark_borrowed(self):
        for book in self:
            if book.state == 'available':
                book.state = 'borrowed'
            # else:
            #     raise UserError('Book is already borrowed!')

    def action_mark_available(self):
        for book in self:
            if book.state == 'borrowed':
                book.state = 'available'
            # else:
            #     raise UserError('Book is already available!')

    # Domain Constraint: Cho phép mở trang web chỉ khi có ISBN
    def action_open_website(self):
        self.ensure_one()
        if not self.isbn:
            raise ValidationError("Không thể mở trang web do thiếu mã sách")
        return {
            'type': 'ir.actions.act_url',
            'url': f'https://www.goodreads.com/search?q={self.isbn}',
            'target': 'new'
        }

    # Python Constraint: Kiểm tra độ dài ISBN
    @api.constrains('isbn')
    def _check_isbn_length(self):
        for record in self:
            if record.isbn and len(record.isbn.replace('-', '')) != 13:
                raise ValidationError("Mã sách phải có đúng 13 chữ số (không tính dấu gạch ngang)")

    # Python Constraint: Kiểm tra tính duy nhất của ISBN
    @api.constrains('isbn')
    def _check_unique_isbn(self):
        for record in self:
            if record.isbn:
                existing_books = self.search([
                    ('id', '!=', record.id),
                    ('isbn', '=', record.isbn)
                ])
                if existing_books:
                    raise ValidationError(f"Mã sách {record.isbn} đã tồn tại ở một cuốn sách khác")

    # Python Constraint: Kiểm tra tên sách không quá ngắn
    @api.constrains('name')
    def _check_book_name_length(self):
        for record in self:
            if len(record.name.strip()) < 3:
                raise ValidationError("Tên sách phải có ít nhất 3 ký tự")

    # SQL Constraint: Đảm bảo ISBN là duy nhất
    _sql_constraints = [
        ('unique_isbn', 'unique(isbn)', 'Mã sách phải là duy nhất'),
    ]

    def action_view_subtopics(self):
        self.ensure_one()
        action = {
            'name': 'Các thể loại sách',
            'type': 'ir.actions.act_window',
            'res_model': 'library.book.subtopic',
            'view_mode': 'tree,form',
            'domain': [('book_id', '=', self.id)],
            'context': {
                'default_book_id': self.id,
                'search_default_group_by_parent': 1
            }
        }
        return action