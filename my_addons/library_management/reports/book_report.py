from odoo import models, api

class BookReport(models.AbstractModel):
    _name = 'report.library_management.book_report'
    _description = 'Báo cáo về sách'

    @api.model
    def _get_report_values(self, docids, data=None):
        docs = self.env['library.book'].browse(docids)
        return {
            'doc_ids': docids,
            'doc_model': 'library.book',
            'docs': docs,
        }