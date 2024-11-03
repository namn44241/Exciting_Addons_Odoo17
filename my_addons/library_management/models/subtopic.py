from odoo import models, fields, api
from odoo.exceptions import ValidationError


class BookSubtopic(models.Model):
    _name = 'library.book.subtopic'
    _description = 'Book Subtopic'
    _parent_store = True
    _parent_name = "parent_id"
    _rec_name = 'complete_name'
    _order = 'sequence, id'

    name = fields.Char('Tên', required=True)
    complete_name = fields.Char('Tên thể loại', compute='_compute_complete_name', store=True)
    book_id = fields.Many2one('library.book', string='Sách', required=True, ondelete='cascade')
    parent_id = fields.Many2one(
        'library.book.subtopic',
        string='Thể loại cha',
        ondelete='cascade',
        domain="[('book_id', '=', book_id)]"
    )
    child_ids = fields.One2many('library.book.subtopic', 'parent_id', string='Thể loại con')
    parent_path = fields.Char(index=True)
    sequence = fields.Integer('Độ ưu tiên', default=10)

    content = fields.Html('Nội dung')
    is_folder = fields.Boolean('Phân loại', default=False)
    icon = fields.Char('Icon', default='fa-book')
    color = fields.Integer('Màu sắc')

    # Đếm số lượng subtopic con
    child_count = fields.Integer(
        'Đếm lượng chủ đề con',
        compute='_compute_child_count',
        store=True
    )

    @api.depends('name', 'parent_id.complete_name')
    def _compute_complete_name(self):
        for subtopic in self:
            if subtopic.parent_id:
                subtopic.complete_name = f'{subtopic.parent_id.complete_name} / {subtopic.name}'
            else:
                subtopic.complete_name = subtopic.name

    @api.depends('child_ids')
    def _compute_child_count(self):
        for record in self:
            record.child_count = len(record.child_ids)

    @api.constrains('parent_id')
    def _check_parent_id(self):
        for record in self:
            if record.parent_id and record.parent_id.book_id != record.book_id:
                raise ValidationError("Parent subtopic must belong to the same book / Thể loại cha phải thuộc về cùng cuốn sách")

    def name_get(self):
        result = []
        for record in self:
            result.append((record.id, record.complete_name))
        return result

    def toggle_is_folder(self):
        """Toggle is_folder status"""
        for record in self:
            record.is_folder = not record.is_folder
        return True

    @api.constrains('is_folder', 'content', 'child_ids')
    def _check_folder_constraints(self):
        for record in self:


            if record.is_folder and record.content:
                raise ValidationError("Folder type subtopics cannot have content / Loại thư mục chủ đề con không thể có nội dung.")
            if not record.is_folder and record.child_ids:
                raise ValidationError("Content type subtopics cannot have children / Loại nội dung chủ đề con không thể có mục con.")
