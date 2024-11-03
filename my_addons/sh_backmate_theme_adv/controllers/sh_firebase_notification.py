import json
from odoo import http
from odoo.http import request
from datetime import datetime
from odoo.tools.safe_eval import safe_eval


class Main(http.Controller):

    @http.route('/firebase-messaging-sw.js', type='http', auth="public")
    def sw_http(self):
        if request.env.company and request.env.company.enable_web_push_notification:
            config_obj = request.env.company.config_details

            js = """
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Registration successful, scope is:', registration.scope);
                }).catch(function(err) {
                    console.log('Service worker registration failed, error:', err);
                });
            }
    
            importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
            importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');
            var firebaseConfig =
            """+ config_obj +""" ;
            firebase.initializeApp(firebaseConfig);
    
            const messaging = firebase.messaging();
    
            messaging.setBackgroundMessageHandler(function(payload) {
            const notificationTitle = "Background Message Title";
            const notificationOptions = {
                body: payload.notification.body,
                icon:'https://i.pinimg.com/originals/3f/77/56/3f7756330cd418e46e642254a900a507.jpg',
            };
            return self.registration.showNotification(
                notificationTitle,
                notificationOptions,
            );
            });
    
            """
            return http.request.make_response(js, [('Content-Type', 'text/javascript')])
        else:

            js = """
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Registration successful, scope is:', registration.scope);
                }).catch(function(err) {
                    console.log('Service worker registration failed, error:', err);
                });
            }
    
            """
            return http.request.make_response(js, [('Content-Type', 'text/javascript')])

    @http.route('/web/push_token', type='http', auth="public", csrf=False)
    def getToken(self,**post):
        device_search = request.env['sh.push.notification'].sudo().search(
            [('register_id', '=', post.get('name'))], limit=1)

        if device_search and not request.env.user._is_public() and device_search.user_id != request.env.user.id:
            if request.env.user.has_group('base.group_portal'):
                device_search.write({'user_id':request.env.user.id,'user_type':'portal'})
            elif request.env.user:
                device_search.write({'user_id':request.env.user.id,'user_type':'internal'})

        if not device_search:
            vals = {
                'register_id' : post.get('name'),
                'datetime' : datetime.now()
            }
            if request.env.user._is_public():
                public_users = request.env['res.users'].sudo()
                public_groups = request.env.ref("base.group_public", raise_if_not_found=False)
                if public_groups:
                    public_users = public_groups.sudo().with_context(active_test=False).mapped("users")
                    if public_users:
                        vals.update({'user_id':public_users[0].id,'user_type':'public'})
            elif request.env.user.has_group('base.group_portal'):
                vals.update({'user_id':request.env.user.id,'user_type':'portal'})
            elif request.env.user:
                vals.update({'user_id':request.env.user.id,'user_type':'internal'})

            request.env['sh.push.notification'].sudo().create(vals)

    @http.route('/web/_config', type='json', auth="public")
    def sendConfig(self):

        config_vals = {}
        if request.env.company and request.env.company.enable_web_push_notification:

            config_obj = request.env.company.config_details.replace(" ","")
            config_obj = request.env.company.config_details.replace("\n","").replace("\t","").replace(" ","").replace("\"","'").replace('apiKey','\'apiKey\'').replace('authDomain','\'authDomain\'').replace('projectId','\'projectId\'').replace('storageBucket','\'storageBucket\'').replace('messagingSenderId','\'messagingSenderId\'').replace('appId','\'appId\'').replace('measurementId','\'measurementId\'')

            config_vals['apiKey'] = safe_eval(config_obj)['apiKey']
            config_vals['authDomain'] =  safe_eval(config_obj)['authDomain']
            config_vals['projectId'] =  safe_eval(config_obj)['projectId']
            config_vals['storageBucket'] =  safe_eval(config_obj)['storageBucket']
            config_vals['messagingSenderId'] = safe_eval(config_obj)['messagingSenderId']
            config_vals['appId'] = safe_eval(config_obj)['appId']
            config_vals['measurementId'] =  safe_eval(config_obj)['measurementId']

            vals = {
                'vapid' : request.env.company.vapid,
                'config':   config_vals
            }
            json_vals = json.dumps(vals)
            return json_vals
