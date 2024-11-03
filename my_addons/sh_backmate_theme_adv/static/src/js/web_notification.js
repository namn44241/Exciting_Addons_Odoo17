odoo.define('sh_backmate_theme_adv.ActionManager', function (require) {
	"use strict";


	var session = require('web.session');
	var ActionManager = require('web.ActionManager');
	var AbstractWebClient = require('web.AbstractWebClient');
	var dom = require('web.dom');
	var rpc = require("web.rpc");
	var display_notice = false;
	var font_color = '#ffffff';
	var background_color = '#212121';
	var font_size = 12;
	var font_family = 'Roboto';
	var padding = 5;
	var content = ''
	var is_animation = false;
	var direction = 'right';
	var simple_text = false;
	var is_popup_notification = false;
	var close_notification = false;



	rpc.query({
		model: 'sh.announcement',
		method: 'search_read',
		args: [[['is_popup_notification', '=', false], ['user_ids.id', 'in', [session.user_context.uid]]], ['is_popup_notification', 'font_size', 'font_family', 'padding', 'name', 'description', 'is_animation', 'direction', 'user_ids', 'simple_text', 'background_color', 'font_color', 'description_text']],
	}, { async: false }).then(function (output) {
		if (output) {
			var i;
			for (i = 0; i < output.length; i++) {
				if (output[i]['user_ids'].includes(session.user_context.uid)) {
					display_notice = true;
					background_color = output[i]['background_color']
					font_size = output[i]['font_size']
					font_family = output[i]['font_family']
					padding = output[i]['padding']
					font_color = output[i]['font_color']
					is_animation = output[i]['is_animation']
					direction = output[i]['direction']
					simple_text = output[i]['simple_text']
					is_popup_notification = output[i]['is_popup_notification']
					if (simple_text) {
						content = output[i]['description_text'] || ''
					} else {
						content = output[i]['description']
					}
				}

			}
		}
	});



	AbstractWebClient.include({
		set_action_manager: function () {
			var self = this;
			this.action_manager = new ActionManager(this, session.user_context);

			this.env.bus.on('do-action', this, payload => {
				this.do_action(payload.action, payload.options || {})
					.then(payload.on_success || (() => { }))
					.guardedCatch(payload.on_fail || (() => { }));
			});
			var fragment = document.createDocumentFragment();
			return this.action_manager.appendTo(fragment).then(function () {
				if (display_notice && !is_popup_notification) {
					if (simple_text) {
						var style = "position:relative;background:" + background_color + ";color:" + font_color + ";font-size:" + font_size + "px;font-family:" + font_family + ";padding-right:" + padding + "px;padding-top:" + padding + "px;padding-bottom:" + padding + "px;"
						if (is_animation) {
							self.$el.append($("<div id='object'  style='position:relative;'><marquee direction=" + direction + " style=" + style + "><div id='object1'>" + content + "</div></marquee><div class=\"sh_animated_notification\" style='position: absolute;right: 5px;font-size: 15px;top: 0px;cursor: pointer;'><span class='fa fa-times sh_close_notification' /><div></div>"))
						} else {
							self.$el.append($("<div id='object1' style=" + style + ">" + content + "<div class=\"sh_simple_text_notification\" style='position: absolute;right: 5px;font-size: 15px;top: 0px;cursor: pointer;'><span class='fa fa-times sh_close_notification'/></div></div>"))
						}
					} else {
						if (is_animation) {
							self.$el.append($("<div id='object'  style='position:relative;'><marquee direction=" + direction + "><div id='object1'>" + content + "</div></marquee><div class=\"sh_animated_notification\" style='position: absolute;right: 5px;font-size: 15px;top: 0px;cursor: pointer;'><span class='fa fa-times sh_close_notification' /></div></div>"))
						} else {
							self.$el.append($("<div id='object1' style='position:relative;'>" + content + "<div class=\"sh_simple_text_notification\" style='position: absolute;right: 5px;font-size: 15px;top: 0px;cursor: pointer;'><span class='fa fa-times sh_close_notification' /></div></div>"))
						}

					}

				}

				dom.append(self.$el, fragment, {
					in_DOM: true,
					callbacks: [{ widget: self.action_manager }],
				});

			});
		},
	});


});