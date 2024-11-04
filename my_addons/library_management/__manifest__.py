{
    'name': 'Quản lí thư viện',
    'version': '1.0.0',
    'category': 'Services',
    'summary': 'Manage library books and borrowings',
    'depends': ['base', 'mail', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/library_views.xml',
        'reports/book_report_template.xml',
        'views/subtopic_views.xml',
        'views/ebook_views.xml',
        'views/audiobook_views.xml',
        'views/book_search_view.xml',
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'library_management/static/src/components/**/*.js',
            'library_management/static/src/components/**/*.xml',
            'library_management/static/src/components/**/*.scss',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}