/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { ActionContainer } from "@web/webclient/actions/action_container";
import { NavBar } from "@web/webclient/navbar/navbar";
import { NotUpdatable } from "@web/core/utils/components";
import { MainComponentsContainer } from "@web/core/main_components_container";
// import {NavFooter} from "./navfooter/navfooter"
import {ZoomWidget} from "./zoomwidget/zoomwidget"
const { Component, hooks } = owl;

	WebClient.components = {
		ActionContainer,
        ZoomWidget,
        NavBar,

        NotUpdatable,
        MainComponentsContainer,
	};

WebClient.template = "web.WebClient";


	



