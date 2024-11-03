odoo.define('backmate_backend_theme.VerticalPane', function (require) {
"use strict";

var FormRenderer = require('web.FormRenderer');
var rpc = require('web.rpc');
var config = require('web.config');

var tab_style = 'horizontal';
var tab_style_mobile = 'horizontal';


rpc.query({
    model: 'sh.back.theme.config.settings',
    method: 'search_read',
    domain: [['id','=',1]],
    fields: ['tab_style','tab_style_mobile']
}).then(function(data) {
    if (data) {
    	 if(data[0]['tab_style']=='vertical'){
    		 tab_style = 'vertical';
    	 }
    	 if(data[0]['tab_style_mobile']=='vertical'){
    		 tab_style_mobile = 'vertical';
    	 }
    }
});

FormRenderer.include({

    _renderTabHeaderVertical: function (page, page_id) {
        var $a = $('<a>', {
            'data-toggle': 'collapse',
            'data-parent': '#accordionEx',
            'data-target' :'#' + page_id,
            href: '#' + page_id,
            class: 'sh_notebook_title',
            text: page.attrs.string,
        });
        var $tab_title = $('<h5 class="mb-0 o_default_notebook_title"><span class="fa fa-plus" /></h5>')
        
        $a.append($tab_title)
        return $('<div>', {class: 'card-header'}).append($a);
    },
    _renderTabPageVertical: function (page, page_id) {
        var $result = $('<div class="card-body collapse" data-parent="#accordionEx" id="' + page_id + '">');
        $result.append(_.map(page.children, this._renderNode.bind(this)));
        return $result;
    },
    
	 _renderTagNotebookVertical: function(node){
	        var self = this;
	       
	        var $pages = $(' <div class="accordion md-accordion" id="accordionEx" role="tablist" aria-multiselectable="true"></div>');
	        var $headers = $('<ul class="nav nav-tabs">');
	        
	        var renderedTabs = _.map(node.children, function (child, index) {
	            var pageID = _.uniqueId('notebook_page_'); 
	            var $header = self._renderTabHeaderVertical(child, pageID);
	            var $page = self._renderTabPageVertical(child, pageID);
	            self._handleAttributes($header, child);
	            $pages.append($header);
	            $pages.append($page);
	            
	            return {
	                $page: $page,
	                node: child,
	            };
	        });
	        
	     
	        var $notebook = $('<div class="o_notebook">')
	                .data('name', node.attrs.name || '_default_')
	                .append($pages);

	        this._registerModifiers(node, this.state, $notebook);
	        this._handleAttributes($notebook, node);
	       

	        $notebook.find('.card-header').first().removeClass('collapsed');
	        $notebook.find('.card-header').find('a').first().attr('aria-expanded','true');
	        $notebook.find('.card-header').first().find('.fa-plus').removeClass('fa-plus').addClass('fa-minus');
	        $notebook.find('.card-body.collapse').first().addClass('show');
	        
	        $notebook.find('.sh_notebook_title').click(function() {
	        	
	            if ($(this).find('span').hasClass('fa-plus')){
	            	$(this).parents('#accordionEx').find('span.fa-minus').removeClass('fa-minus').addClass('fa-plus');
	            	$(this).find('span').addClass('fa-minus').removeClass('fa-plus');
	            }else{
	            	$(this).parents('#accordionEx').find('span.fa-minus').removeClass('fa-minus').addClass('fa-plus');
	            	$(this).find('span').addClass('fa-plus').removeClass('fa-minus');
	            }
	                
	        });
	        
	        return $notebook;
	    },
	    _renderTagNotebook: function (node) {
	        var self = this;
	        if(tab_style == 'vertical' && tab_style_mobile == 'vertical'){
	            return self._renderTagNotebookVertical(node);
	        }else if(tab_style == 'horizontal' && tab_style_mobile == 'horizontal'){
	        	return this._super.apply(this, arguments);
	        }else if(tab_style == 'horizontal' && tab_style_mobile == 'vertical'){
	        	if(config.device.isMobile){
	        		return self._renderTagNotebookVertical(node);
	        	}else{
	        		return this._super.apply(this, arguments);
	        	}
	        }else if(tab_style == 'vertical' && tab_style_mobile == 'horizontal'){
	        	if(config.device.isMobile){
	        		return this._super.apply(this, arguments);
	        	}else{
	        		return self._renderTagNotebookVertical(node);
	        	}
	        }
	        
	    },
});




});