from odoo import fields, models
import xlwt
import base64 
import csv
import io

class DownloadFile(models.Model):
    _name = "download.data.file"
    _description = 'File Download'

    contact_file = fields.Binary('Download File', related="file.datas")
    file_name = fields.Char('File', size=64)
    file = fields.Many2one('ir.attachment', string="Download File ")
    import_file = fields.Binary('Upload File')

    def import_data(self):
        if self.import_file:
            backmate_setting_dic = {}
            # with open(self.import_file, 'r') as file:
            file = base64.b64decode(self.import_file)
            data = io.StringIO(file.decode("utf-8"))
            data.seek(0)
            file_reader = []
            csv_reader = csv.reader(data, delimiter=',')
            for row in csv_reader:
                key  = row[0]
                value = row[1]

     
                backmate_setting_dic[key] = value
                
                

            backmate_obj = self.env['sh.back.theme.config.settings'].sudo().browse(1)
            backmate_obj.write(backmate_setting_dic)       

    def download_report(self):

        return{
            'type': 'ir.actions.act_url',
            'url': 'web/content/?model=download.data.file&field=contact_file&download=true&id=%s&filename=%s' % (self.id, self.file_name),
            'target': 'new',
        }


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    def sh_export_data(self):
        
        txt = open('/tmp/Data.xls', 'w')
        csv = open('/tmp/Data.csv', 'w')
        workbook = xlwt.Workbook()
        bold = xlwt.easyxf('font:height 200;font:bold True;')
        heading = xlwt.easyxf('font:height 200;')
        header = xlwt.easyxf(
            'font:height 210; align: horiz center;pattern: pattern solid, fore_color black; font: color white; font:bold True;' "borders: top thin,bottom thin")
        horiz = xlwt.easyxf('align: horiz left')
        border_all = xlwt.easyxf(
            'font:height 200;font:bold True; align: horiz center;' "borders: top thin,bottom thin,right thin,left thin")
        row = 0


        filename = ('backmate_theme_settings.csv')
        model = 'sh.back.theme.config.settings'
        rec_list = [1]
        if model and rec_list:
            partner_dict = {}
           
            worksheet = workbook.add_sheet("Export Data")
            
            col = 0
            row = 0
            for record in rec_list:
                
                rec_obj = self.env[model].sudo().browse(record)
                if rec_obj:
                    name = 'Backmate Theme Settings'
                    
                    # worksheet.write(row, 0, name, header)
                    field_list = ['body_background_color',
'body_background_image',
'body_background_type',
'body_font_family',
'body_google_font_family',
'breadcrumb_style',
'button_style',
'checkbox_style',
'display_name',
'dual_tone_icon_color_1',
'dual_tone_icon_color_2',
'form_element_style',
'header_background_color',
'header_font_color',
'horizontal_tab_style',
'icon_style',
'is_sticky_chatter',
'is_sticky_form',
'is_sticky_list',
'is_sticky_list_inside_form',
'is_sticky_pivot',
'is_used_google_font',
'list_view_border',
'list_view_even_row_color',
'list_view_hover_bg_color',
'list_view_is_hover_row',
'list_view_odd_row_color',
'loading_gif_file_name',
'login_page_background_color',
'login_page_background_image',
'login_page_background_type',
'login_page_banner_image',
'login_page_box_color',
'login_page_icon_img',
'login_page_icon_img_long',
'login_page_style',
'login_page_style_comp_logo',
'name',
'predefined_list_view_boolean',
'predefined_list_view_style',
'primary_color',
'kanban_box_style',
'progress_color',
'progress_height',
'progress_style',
'radio_btn_style',
'scrollbar_style',
'search_style',
'secondary_active',
'secondary_color',
'secondary_hover',
'separator_color',
'separator_style',
'sidebar_background_color',
'sidebar_background_image',
'sidebar_background_style',
'sidebar_collapse_style',
'sidebar_font_color',
'sidebar_is_show_nav_bar',
'tab_style',
'tab_style_mobile',
'theme_color',
'theme_style',
'backend_all_icon_style'
]
                    for field in field_list:
                        
                        col = 0
                        field_name = field
                        field_label = field
                        data = self.env[model].search_read(
                            [('id', '=', record)], [field_name])

                        if data[0]:
                            # Check field Type
                       
                            worksheet.col(col).width = 5000
                            worksheet.col(col+1).width = 5000
                            worksheet.write(
                                row, col, field_label, bold)
                            worksheet.write(
                                row, col+1, str(data[0].get(field_name)), heading)

                            csv.write(field_label+',' +
                                            str(data[0].get(field_name))+'\n')
                            

                        
                            row += 1
  
        csv.close()
        f = open('/tmp/Data.csv', "rb")
        attachment_id = self.env['ir.attachment'].create({'name': 'Export File',
                                                              'datas': base64.b64encode(f.read()),
                                                              'res_model': self._name,
                                                              'res_id': self.id,
                                                              'type': 'binary'
                                                              })
        export_id = self.env['download.data.file'].sudo().create({
            'contact_file': base64.b64encode(f.read()),
            'file_name': filename,
            'file': attachment_id.id
        })


        return {
            'type': 'ir.actions.act_window',
            'res_id': export_id.id,
            'res_model': 'download.data.file',
            'view_type': 'form',
            'view_mode': 'form',
            'target': 'new',
        }

