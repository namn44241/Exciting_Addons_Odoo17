/* @odoo-module */

// ===========================================
//	Calculator
// ===========================================

import { Component, useState, xml, onMounted } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { renderToElement } from "@web/core/utils/render";

export class CalculaterSh extends Component {
    static template = "sh_backmate_theme_adv.CalculatorTemplate";

    setup() {
        this.orm = useService("orm");
        this.search_sh_enable_calculator_mode();
        this.currentValue = "";
        onMounted(() => {
            var self = this;
            if(session.sh_enable_calculator_mode){
                window.addEventListener(
                "keydown",
                function (event) {
                    const target = event.target;
                    if (event.altKey && event.shiftKey && event.key === "C") {
                        event.preventDefault(); // Prevent the default action
                        self.render_calculator_template();
                    }
                    if(event.key === "Escape"){
                        self.close_calculator()
                    }
                    if (event.key === "Backspace" && target.classList.contains("calculator_input")) {
                        self.currentValue = self.currentValue.slice(0, -1);
                        $(".calculator_input").val(self.currentValue);
                        event.preventDefault();  // Prevent the default backspace behavior
                    }
                    if (event.altKey && event.shiftKey && event.key === "K") {
                         event.preventDefault();
                         self.currentValue += '√';
                         $(".calculator_input").val(self.currentValue);
                    }
                    if (event.altKey && event.shiftKey && event.key === "L") {
                         event.preventDefault();
                         self.currentValue += '^';
                         $(".calculator_input").val(self.currentValue);
                    }
                },
                true
            );
            }
        });
    }

    search_sh_enable_calculator_mode() {
        this.sh_enable_calculator_mode = session.sh_enable_calculator_mode;
    }

    close_calculator(){
        $(".sh_calc_results").html("");
        $('.sh_calc_util').removeClass('active')
        $(".calculator_input").val("");
        this.currentValue = "";
       }

    onClickCalculator() {
        if ($(".calculator").length > 0) {
            $(".sh_calc_results").html("");
            $(".sh_calc_util").removeClass("active");
        } else {
            this.render_calculator_template();
        }
    }

    render_calculator_template() {
        var self = this;
        var qweb_data = renderToElement(
            "sh_backmate_theme_adv.Calculator",
            {
                on_button_click: function (ev) {
                    self.on_button_click(ev);
                },
                on_keypress: function (ev) {
                    self.on_keypress(ev);
                },
            }
        );
        $(".sh_calc_results").html(qweb_data);
        // Add input event listener to the calculator input
        document.querySelector(".calculator_input").addEventListener("input", function (event) {
                self.currentValue = event.target.value;
            });

        document.querySelector(".calculator_input").addEventListener("focusout", function (event) {
            // Prevent focus out from the calculator input
            event.preventDefault();
            $(".calculator_input").focus();
        });

        $(".calculator_input").val("");
        this.currentValue = "";
        $(".sh_calc_util").addClass("active");

         // Focus on the calculator input field
        $("#sh_calculator_input").focus();

        // close other popup
        $(".sh_user_language_list_cls").css("display", "none");
        $(".sh_wqm_quick_menu_submenu_list_cls").css("display", "none");
        $(".todo_layout").removeClass("sh_theme_model");
    }

    on_button_click(ev) {
        const value = ev.currentTarget.getAttribute("data-value");
        if (value === "=") {
            this.calculate_result();
        } else if (value === "C") {
            this.currentValue = "";
        } else {
            this.currentValue += value;
        }
        $(".calculator_input").val(this.currentValue);
    }

    on_keypress(ev) {
        if (ev.key === "Enter") {
            this.calculate_result();
        }
    }

    calculate_result() {
        try {
            let expression = this.currentValue;
            expression = expression.replace(/√([0-9]+)/g, "Math.sqrt($1)");
            expression = expression.replace(/([0-9]+)\^/g, "Math.pow($1, 2)");
            expression = expression.replace(/([0-9]+)%/g, "($1 / 100)");
            // Evaluate the expression
            this.currentValue = eval(expression).toString();
        } catch (e) {
            this.currentValue = "";
        }
        $(".calculator_input").val(this.currentValue);
    }
}

registry.category("systray").add("sh_backmate_theme_adv.calculater_sh", { Component: CalculaterSh }, { sequence: 25 });
