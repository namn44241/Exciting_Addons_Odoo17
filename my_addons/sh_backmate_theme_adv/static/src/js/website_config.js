odoo.define('sh_website_header_config.website_config', function (require) {
    'use strict';

    var config = require('web.config');
    var core = require('web.core');
    var ColorpickerDialog = require('web.colorpicker');
    var Dialog = require('web.Dialog');
    var widgets = require('web_editor.widget');
    var websiteNavbarData = require('website.navbar');
    var websitetheme = require('website.theme');
    var ajax = require('web.ajax');


    var _t = core._t;



    var websitetheme = websitetheme.include({

        start: function () {
            var self = this;
            this._super.apply(this, arguments);

            ajax.jsonRpc("/get_header_tag_color_value", 'call').then(function (data) {

            });


        },



        _generateDialogHTML: function () {
            var $contents = this.$el.children('content');

            if ($contents.length === 0) {
                return;
            }

            $contents.remove();
            this.$el.append(core.qweb.render('website.theme_customize_modal_layout'));
            var $navLinksContainer = this.$('.nav');
            var $navContents = this.$('.tab-content');

            _.each($contents, function (content) {
                var $content = $(content);

                var contentID = _.uniqueId('content-');

                // Build the nav tab for the content
                $navLinksContainer.append($('<li/>', {
                    class: 'nav-item mb-1',
                }).append($('<a/>', {
                    href: '#' + contentID,
                    class: 'nav-link',
                    'data-toggle': 'tab',
                    text: $content.attr('string'),
                })));

                // Build the tab pane for the content
                var $navContent = $(core.qweb.render('website.theme_customize_modal_content', {
                    id: contentID,
                    title: $content.attr('title'),
                }));
                $navContents.append($navContent);
                var $optionsContainer = $navContent.find('.o_options_container');

                // Process content items
                _processItems($content.children(), $optionsContainer);
            });

            this.$('[title]').tooltip();

            function _processItems($items, $container) {
                var optionsName = _.uniqueId('option-');

                _.each($items, function (item) {
                    var $item = $(item);
                    var $col;

                    switch (item.tagName) {
                        case 'OPT':
                            var colorPalette = $item.data('colorPalette') === 'user';
                            var icon = $item.data('icon');

                            // Build the options template
                            var $multiChoiceLabel = $(core.qweb.render('website.theme_customize_modal_option', {
                                name: optionsName,
                                id: $item.attr('id') || _.uniqueId('o_theme_customize_input_id_'),

                                string: $item.attr('string'),
                                icon: icon,
                                color: $item.data('color'),
                                font: $item.data('font'),

                                colorPalette: colorPalette,

                                xmlid: $item.data('xmlid'),
                                enable: $item.data('enable'),
                                disable: $item.data('disable'),
                                reload: $item.data('reload'),
                            }));

                            //sh start

                            var colorPalette = $item.data('colorPalette') === 'sh_header_tag_color_palette';
                            var icon = $item.data('icon');

                            // Build the options template
                            //FIXME: template not found error needs to solve                       
                            var $sh_header_color_tag = $(core.qweb.render('website.sh_whc_website_header_color_tmpl'));


                            //sh end

                            $multiChoiceLabel.find('.o_theme_customize_color[data-color="primary"]').addClass('d-none').removeClass('d-flex');
                            $multiChoiceLabel.find('.o_theme_customize_color[data-color="secondary"]').addClass('d-none').removeClass('d-flex');

                            if ($container.hasClass('form-row')) {
                                $col = $('<div/>', { class: (icon ? 'col-4' : (colorPalette ? 'col-12' : 'col-6')) });
                                $col.append($multiChoiceLabel);
                                $container.append($col);
                            } else {
                                $container.append($multiChoiceLabel);
                            }
                            break;

                        case 'MORE':
                            var collapseID = _.uniqueId('collapse-');

                            $col = $('<div/>', {
                                class: 'col-12',
                            }).appendTo($container);

                            var string = $item.attr('string');
                            if (string) {
                                var $button = $('<button/>', {
                                    'type': 'button',
                                    class: 'btn btn-primary d-block mx-auto mt-3 collapsed',
                                    'data-toggle': 'collapse',
                                    'data-target': "#" + collapseID,
                                    text: string,
                                });
                                $col.append($button);
                            }

                            var $collapse = $('<div/>', {
                                id: collapseID,
                                class: 'collapse form-row justify-content-between mt-3',
                                'data-depends': $item.data('depends'),
                            });
                            $col.append($collapse);

                            _processItems($item.children(), $collapse);
                            break;

                        case 'LIST':
                            var $listContainer = $('<div/>', { class: 'py-1 px-2 o_theme_customize_option_list' });
                            $col = $('<div/>', {
                                class: 'col-6 mt-2',
                                'data-depends': $item.data('depends'),
                            }).append($('<h6/>', { text: $item.attr('string') }), $listContainer);
                            $container.append($col);
                            _processItems($item.children(), $listContainer);
                            break;
                    }
                });
            }
        },






    });
});
