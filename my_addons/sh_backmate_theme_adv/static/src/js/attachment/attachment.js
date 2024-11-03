/* @odoo-module */
import { ListRenderer } from "@web/views/list/list_renderer";
import core from "web.core";
var _t = core._t;
import { patch } from "@web/core/utils/patch";
const { onMounted, Component, useState, useRef, useExternalListener, onWillUpdateProps, onWillStart, onPatched } = owl;
import { useService } from "@web/core/utils/hooks";
import { ListController } from "@web/views/list/list_controller";
import { WebClientViewAttachmentViewContainer } from "@mail/components/web_client_view_attachment_view_container/web_client_view_attachment_view_container";
var shDocumentViewer = require("sh_attachment_in_tree_view.shDocumentViewer");
// open record in new tab feature (action menus) //
import { ActionMenus } from "@web/search/action_menus/action_menus";
const { session } = require("@web/session");
const rpc = require("web.rpc");


// Open Record feature Access Variable :-

var show_open_record_new_tab_button = false
rpc.query({
    model: 'res.users',
    method: 'search_read',
    fields: ['sh_enable_open_record_in_new_tab'],
    domain: [['id', '=', session.uid]]
}, { async: false }).then(function (data) {
    if (data) {
        _.each(data, function (user) {
            if (user.sh_enable_open_record_in_new_tab) {

              show_open_record_new_tab_button = true
            }
        });
      
    }
});

patch(ActionMenus.prototype, "sh_add_custom_inside_action", {
    /**
     * @override
     */

    setup(){
      this.show_open_record_new_tab_button_action = show_open_record_new_tab_button;
      this._super();
    },

    onOpenRecord() {
      let record_activeIds = this.props.getActiveIds();
      for (var j in record_activeIds) {
        var url = window.location.href;
        var latest_url = url + "&id=" + record_activeIds[j];
        let result = latest_url.replace("view_type=list", "view_type=form");
        window.open(result, "_blank");
      }
    },
});

patch(ListRenderer.prototype, 'sh_attachment_in_tree_view/static/src/js/list_controller.js', {

    setup(){

        this.dialogService = useService("dialog");
        this.orm = useService("orm");
        this.notificationService = useService("notification");
        this.messaging = useService("messaging");

        //Open Record Code :-
        this.show_open_record_new_tab_button_listrenderer = show_open_record_new_tab_button;
        this.is_list_view = true;
        var Many2one_protect = this["env"]["config"]["actionType"];
        var view_type = this["props"]["activeActions"]["type"];
        if (view_type != "view" || Many2one_protect == false) {
          this.is_list_view = false;
        }

        onWillStart(async () => {
            
            const data = await this.orm.call('res.users', 'get_attachment_data', [this.props.list.resModel, this.props.list.records.map((rec)=>rec.resId)], {});

            this.sh_attachments = data[0]
            this.sh_show_attachment_in_list_view = data[1]
            
        });
        onMounted(this.onMounted);
        this._super();
        
    },

    // Open Record Method :-

    onMounted() {
      if (show_open_record_new_tab_button) {
        if (this.is_list_view) {
          var trElements = $("table tr:not([class])");
          // var header = trElements[0];
          var header = trElements.first();
          var table_header = $("<th>Open</th>");
          header.children().eq(0).after(table_header);
          var footer = trElements.last();
          var table_footer = $("<td></td>");
          footer.children().eq(0).after(table_footer);

        
        var trsWithColspan6 = $('tr:has(td[colspan])');
        if (trsWithColspan6) {
          trsWithColspan6.each(function() {
            $(this).append('<td></td>');
          });
        }
        }
      }
   },

   setDefaultColumnWidths() {
    if (show_open_record_new_tab_button) {
      var trsWithGroupheader = $('tr:has(th.o_group_name)');
      trsWithGroupheader.each(function() {
        var hasCustomClass = false;

        // Check if any <td> inside the <tr> contains the custom class
        $(this).find("td").each(function() {
            if ($(this).hasClass("sh_custom_class")) {
                hasCustomClass = true;
                return false; // Exit the loop if the custom class is found in a <td>
            }
        });

        // If the custom class is not found, add a new <td> with the custom class
        if (!hasCustomClass) {
            // $(this).append("<td class='sh_custom_class'>  with custom class</td>");
            $(this).children().eq(0).after("<td class='sh_custom_class'></td>");
        }
    });
    this._super();
    }
    else {
      this._super();
    }
  },

    
    OpenRecord(res_id) {
      var url = window.location.href;
      var latest_url = url + "&id=" + res_id;
      let result = latest_url.replace("view_type=list", "view_type=form");
      window.open(result, "_blank");
    },
    
    _shloadattachmentviewer: function (ev) {

        let attachment_id = parseInt($(ev.currentTarget).data("id"));
        let record_id = parseInt($(ev.currentTarget).data("record_id"));
        let attachment_mimetype = $(ev.currentTarget).data("mimetype");
        let mimetype_match = attachment_mimetype.match("(image|application/pdf|text|video)");
        let attachment_name = $(ev.currentTarget).data("data-name");
        var attachment_data = this.sh_attachments[0];

      if (mimetype_match) {

        var sh_attachment_id = attachment_id;
        var sh_attachment_list = [];
          attachment_data[record_id].forEach((attachment) => {
              if (attachment.attachment_mimetype.match("(image|application/pdf|text|video)")) {
                  sh_attachment_list.push({
                      id: attachment.attachment_id,
                      filename: attachment.attachment_name,
                      name: attachment.attachment_name,
                      url: "/web/content/" + attachment.attachment_id + "?download=true",
                      type: attachment.attachment_mimetype,
                      mimetype: attachment.attachment_mimetype,
                      is_main: false,
                  });
              }
          });
        var sh_attachmentViewer = new shDocumentViewer(self,sh_attachment_list,sh_attachment_id);
        sh_attachmentViewer.appendTo($(".o_DialogManager"));

      }
      else{

        this.notificationService.add(this.env._t("Preview for this file type can not be shown"), {
            title: this.env._t("File Format Not Supported"),
            type: 'danger',
            sticky: false
        });
      }

    }
})

Object.assign(ListRenderer.components, {
    WebClientViewAttachmentViewContainer,
});
