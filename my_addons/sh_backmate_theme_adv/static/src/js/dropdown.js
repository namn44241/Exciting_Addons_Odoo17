/** @odoo-module **/
import { Dropdown } from '@web/core/dropdown/dropdown';

import { patch } from "@web/core/utils/patch";
import { useBus, useService } from "@web/core/utils/hooks";
import { usePosition } from "@web/core/position_hook";
import { useDropdownNavigation } from "@web/core/dropdown/dropdown_navigation_hook";
import { localization } from "@web/core/l10n/localization";
const components = { Dropdown };
import {
    Component,
    EventBus,
    onWillStart,
    status,
    useEffect,
    useExternalListener,
    useRef,
    useState,
    useChildSubEnv,
} from "@odoo/owl";
var theme_style = 'style4';
const DIRECTION_CARET_CLASS = {
    bottom: "dropdownnnn",
    top: "dropup",
    left: "dropstart",
    right: "dropend",
};
var sidebar_theme_style = ''
var sidebar_collapse_style = ''
var search_style = ''

export const DROPDOWN = Symbol("Dropdown");

patch(components.Dropdown.prototype, {

    setup() {
        super.setup()
        this.orm = useService("orm");
        this.get_theme_style()
        if(this.props.class == 'o_navbar_apps_menu sh_backmate_theme_appmenu_div' && theme_style == 'style4'){
                this.state = useState({
                    open: true,
                    groupIsOpen: this.props.startOpen,
                });
           
        }else{
            this.state = useState({
                open: this.props.startOpen,
                groupIsOpen: this.props.startOpen,
            });
        }
    
    },

    async get_theme_style(){
        const data = await this.orm.searchRead(
                    "sh.back.theme.config.settings",
                    [['id', '=', 1]],
                    ['theme_style', 'sidebar_collapse_style','search_style']
                    );
        if (data) {
			if (data[0]['sidebar_collapse_style'] == 'collapsed') {
				sidebar_collapse_style = 'collapsed'
			} else {
				sidebar_collapse_style = 'expanded'
			}
			if (data[0]['search_style'] == 'collapsed') {
				search_style = 'collapsed'
			} else {
				search_style = 'expanded'
			}
				sidebar_theme_style = 'style_1'
		}

    },

    // -------------------------------------------------------------------------
    // Private
    // -------------------------------------------------------------------------

    /**
     * Changes the dropdown state and notifies over the Dropdown bus.
     *
     * All state changes must trigger on the bus, except when reacting to
     * another dropdown state change.
     *
     * @see onDropdownStateChanged()
     *
     * @param {Partial<DropdownState>} stateSlice
     */
    async changeStateAndNotify(stateSlice) {
        if (stateSlice.open && this.props.beforeOpen) {
            await this.props.beforeOpen();
            if (status(this) === "destroyed") {
                return;
            }
        }

        if (!stateSlice.open) {
            this.state.directionCaretClass = DIRECTION_CARET_CLASS[this.defaultDirection];
        }

        // Update the state
        Object.assign(this.state, stateSlice);
        // Notify over the bus
        /** @type DropdownStateChangedPayload */
        const stateChangedPayload = {
            emitter: this,
            newState: { ...this.state },
        };
        Dropdown.bus.trigger("state-changed", stateChangedPayload);
        this.props.onStateChanged({ ...this.state });
    },

    /**
     * Closes the dropdown.
     *
     * @returns {Promise<void>}
     */
    close() {
        return this.changeStateAndNotify({ open: false, groupIsOpen: false });
    },

    /**
     * Opens the dropdown.
     *
     * @returns {Promise<void>}
     */
    open() {
        return this.changeStateAndNotify({ open: true, groupIsOpen: this.props.autoOpen });
    },

     get showCaret() {
        return this.props.showCaret === undefined ? this.parentDropdown : this.props.showCaret;
    },





    /**
     * Toggles the dropdown open state.
     *
     * @returns {Promise<void>}
     */
    toggle() {

        if (this.props.class == 'o_navbar_apps_menu sh_backmate_theme_appmenu_div' && theme_style == 'style4') {
            return this.changeStateAndNotify({ open: true, groupIsOpen: true });
        } else {
            const toggled = !this.state.open;
            return this.changeStateAndNotify({ open: toggled, groupIsOpen: toggled });
        }


    },

     onDropdownStateChanged(args) {

        if(this.props.class == 'o_navbar_apps_menu sh_backmate_theme_appmenu_div' && theme_style == 'style4'){
            this.state.open = true;
        }

        if (
            !this.rootRef.el ||
            this.rootRef.el.contains(args.emitter.rootRef.el) ||
            args.emitter.myActiveEl !== this.myActiveEl
        ) {
            // Do not listen to events emitted by self or children
            return;
        }
        // Emitted by direct siblings ?
        if (args.emitter.rootRef.el.parentElement === this.rootRef.el.parentElement) {
            // Sync the group status (will not apply if autoOpen is set to false)
            this.state.groupIsOpen = args.newState.groupIsOpen && this.props.autoOpen;

            // Another dropdown is now open ? Close myself without notifying siblings.
            if (this.state.open && args.newState.open) {
                this.state.open = false;
            }
        } else {
            // Another dropdown is now open ? Close myself and notify the world (i.e. siblings).
            if (this.state.open && args.newState.open) {
                this.close();
            }
        }
    },


    /**
     * Toggles the dropdown on its toggler click.
     */
    onTogglerClick() {
        this.toggle();
    },

    /**
     * Opens the dropdown when the mouse enters its toggler if its group is open. (see autoOpen prop)
     * NB: only if its siblings dropdown group is opened and if not a sub dropdown.
     */
    onTogglerMouseEnter() {
        if (this.state.groupIsOpen && !this.state.open) {
            this.togglerRef.el.focus();
            this.open();
        }
    },

    /**
     * Used to close ourself on outside click.
     *
     * @param {MouseEvent} ev
     */
    onWindowClicked(ev) {
        // Return if already closed
        if (!this.state.open) {
            return;
        }
        // Return if it's a different ui active element
        if (this.ui.activeElement !== this.myActiveEl) {
            return;
        }

        if (ev.target.closest(".o_datetime_picker")) {
            return;
        }

        // Close if we clicked outside the dropdown, or outside the parent
        // element if it is the toggler
        const rootEl =
            this.props.toggler === "parent" ? this.rootRef.el.parentElement : this.rootRef.el;
        const gotClickedInside = rootEl.contains(ev.target);
        if (!gotClickedInside) {
            this.close();
        }
    },

});

Dropdown.bus = new EventBus();
Dropdown.defaultProps = {
    menuDisplay: "d-block",
    autoOpen: true,
    holdOnHover: false,
    onOpened: () => {},
    onStateChanged: () => {},
    onScroll: () => {},
};