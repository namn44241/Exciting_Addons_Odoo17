/* @odoo-module */

import { patch } from "@web/core/utils/patch";
import { Message } from "@mail/core/common/message";
import { session } from "@web/session";
const components = { Message };

patch(components.Message.prototype, {

    get attClass() {
        var isLoginUser = false
        if (this.props.message && this.props.message.author && session.partner_id == this.props.message.author.id){
    		isLoginUser = true
    	}else{
    		isLoginUser = false
    	}
        return {
            [this.props.className]: true,
            "o-highlighted bg-view shadow-lg": this.props.highlighted,
            "o-selfAuthored": this.message.isSelfAuthored && !this.env.messageCard,
            "o-selected": this.props.messageToReplyTo?.isSelected(
                this.props.thread,
                this.props.message
            ),
            "o-squashed pb-1": this.props.squashed,
            "py-1": !this.props.squashed,
            "mt-2": !this.props.squashed && this.props.thread && !this.env.messageCard,
            "px-3": !this.props.isInChatWindow && !this.env.messageCard,
            "px-2": this.props.isInChatWindow,
            "opacity-50": this.props.messageToReplyTo?.isNotSelected(
                this.props.thread,
                this.props.message
            ),
            'sh_right_chat':isLoginUser,
             'sh_left_chat':!isLoginUser,
        };
    },


});