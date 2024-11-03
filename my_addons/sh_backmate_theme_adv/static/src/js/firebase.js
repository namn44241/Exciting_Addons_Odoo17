/** @odoo-module **/
import { jsonrpc } from "@web/core/network/rpc_service";

var vapid = ''
var firebaseConfig = {};

jsonrpc("/web/_config", {}).then(function (data) {
    		
    if(data){
    

    var json = JSON.parse(data)
    vapid = json.vapid
    firebaseConfig = json.config
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onMessage((payload) => {

        const notificationOptions = {
            body: payload.notification.body,
        };
        let notification = payload.notification;
        navigator.serviceWorker.getRegistrations().then((registration) => {
            registration[0].showNotification(notification.title, notificationOptions);
        });
    });
    
    messaging.requestPermission()
        .then(function () {
            messaging.getToken({ vapidKey: vapid }).then((currentToken) => {
                if (currentToken) {                        
                    $.post("/web/push_token",
                        {
                            name: currentToken
                        })
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        })
        
    }
});