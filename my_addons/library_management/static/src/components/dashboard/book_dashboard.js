/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { Component, onWillStart } from "@odoo/owl";

class BookDashboard extends Component {
    setup() {
        this.orm = useService("orm");
        this.action = useService("action");

        // Khởi tạo giá trị mặc định cho stats
        this.stats = {
            total: 0,
            available: 0,
            borrowed: 0
        };

        // Sử dụng onWillStart để load data trước khi component render
        onWillStart(async () => {
            await this.loadData();
        });
    }

    async loadData() {
        try {
            const domain = [];
            const fields = ["name", "state"];
            const books = await this.orm.searchRead("library.book", domain, fields);

            this.stats = {
                total: books.length,
                available: books.filter(b => b.state === 'available').length,
                borrowed: books.filter(b => b.state === 'borrowed').length,
            };
        } catch (error) {
            console.error("Error loading data:", error);
            // Giữ giá trị mặc định nếu có lỗi
        }
    }

    openBookList() {
        this.action.doAction("library_management.action_library_book");
    }
}

BookDashboard.components = { Layout };
BookDashboard.template = "library_management.BookDashboard";

registry.category("actions").add("library_book_dashboard", BookDashboard);
