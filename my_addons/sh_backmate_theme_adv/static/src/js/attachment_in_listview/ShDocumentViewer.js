/** @odoo-module **/

import { Widget } from "@web/views/widgets/widget";
import { registry } from "@web/core/registry";
import { renderToElement } from "@web/core/utils/render";

var scrollZoomStep = 0.1;
var ZOOM_STEP = 0.1;

export class ShDocumentViewer extends Widget {
    static template = "ShDocumentViewer";
    /**
     * The documentViewer takes an array of objects describing attachments in
     * argument, and the ID of an active attachment (the one to display first).
     * Documents that are not of type image or video are filtered out.
     *
     * @override
     * @param {Array<Object>} attachments list of attachments
     * @param {integer} activeAttachmentID
     */
    async setup (parent, attachments, activeAttachmentID) {
        var attachments = this.props.attachments;
        var activeAttachmentID = this.props.activeAttachmentID;

        this.scrollZoomStep = 0.1;
        this.zoomStep = 0.5;
        this.minScale = 0.5;
        this.translate = {
            dx: 0,
            dy: 0,
            x: 0,
            y: 0,
        };
        this.attachment = attachments.filter(attachment => {
            var match = attachment.type === 'url' ? attachment.url.match("(youtu|.png|.jpg|.gif)") : attachment.mimetype.match("(image|video|application/pdf|text)");
            if (match) {
                attachment.fileType = match[1];
                if (match[1].match("(.png|.jpg|.gif)")) {
                    attachment.fileType = 'image';
                }
                if (match[1] === 'youtu') {
                    var youtube_array = attachment.url.split('/');
                    var youtube_token = youtube_array[youtube_array.length-1];
                    if (youtube_token.indexOf('watch') !== -1) {
                        youtube_token = youtube_token.split('v=')[1];
                        var amp = youtube_token.indexOf('&')
                        if (amp !== -1){
                            youtube_token = youtube_token.substring(0, amp);
                        }
                    }
                    attachment.youtube = youtube_token;
                }
                return true;
            }
        });
        this.activeAttachment = attachments.find((attach) => attach.id === activeAttachmentID);
        this.modelName = 'ir.attachment';
        this.widget = this;
        this._reset();
    }
     /**
     * Open a modal displaying the active attachment
     * @override
     */
     start () {
        $('.o_viewer_img').on("load", _.bind(this._onImageLoaded, this));
        $('[data-toggle="tooltip"]').tooltip({delay: 0});
        return this._super.apply(this, arguments);
    }
    /**
     * @override
     */
    destroy () {
        registry.category("main_components").remove('sh_document');
    }

    //--------------------------------------------------------------------------
    // Private
    //---------------------------------------------------------------------------

    /**
     * @private
     */
    _next (e) {
        var index = this.attachment.findIndex(item => item === this.activeAttachment);
        index = (index + 1) % this.attachment.length;
        this.activeAttachment = this.attachment[index];
        this._updateContent(e);
    }
    /**
     * @private
     */
    _previous () {
        var index = this.attachment.findIndex(item => item === this.activeAttachment);
        index = index === 0 ? this.attachment.length - 1 : index - 1;
        this.activeAttachment = this.attachment[index];
        this._updateContent();
    }
    /**
     * @private
     */
    _reset () {
        this.scale = 1;
        this.dragStartX = this.dragstopX = 0;
        this.dragStartY = this.dragstopY = 0;
    }
    /**
     * Render the active attachment
     *
     * @private
     */
    _updateContent (e) {
        var newRender = renderToElement('ShDocumentViewer.Content', {
            widget: this,
        });
        $('.o_viewer_content').after(newRender).remove();
        $('[data-toggle="tooltip"]').tooltip({delay: 0});
        this._reset();
    }
    /**
     * Get CSS transform property based on scale and angle
     *
     * @private
     * @param {float} scale
     * @param {float} angle
     */
    _getTransform (scale, angle) {
        return 'scale3d(' + scale + ', ' + scale + ', 1) rotate(' + angle + 'deg)';
    }
    /**
     * Rotate image clockwise by provided angle
     *
     * @private
     * @param {float} angle
     */
    _rotate (angle) {
        this._reset();
        var new_angle = (this.angle || 0) + angle;
        $('.o_viewer_img').css('transform', this._getTransform(this.scale, new_angle));
        $('.o_viewer_img').css('max-width', new_angle % 180 !== 0 ? $(document).height() : '100%');
        $('.o_viewer_img').css('max-height', new_angle % 180 !== 0 ? $(document).width() : '100%');
        this.angle = new_angle;
    }
    /**
     * Zoom in/out image by provided scale
     *
     * @private
     * @param {integer} scale
     */
    _zoom (scale) {
        if (scale > 0.5) {
            $('.o_viewer_img').css('transform', this._getTransform(scale, this.angle || 0));
            this.scale = scale;
        }
        $('.o_zoom_reset').add('.o_zoom_out').toggleClass('disabled', scale === 1);
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {MouseEvent} e
     */
    _onClose (e) {
        e.preventDefault();
        this.destroy();
    }
    /**
     * When popup close complete destroyed modal even DOM footprint too
     *
     * @private
     */
    _onDestroy () {
        this.destroy();
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onDownload (e) {
        e.preventDefault();
        window.location = '/web/content/' + this.modelName + '/' + this.activeAttachment.id + '/' + 'datas' + '?download=true';
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onDrag (e) {
        e.preventDefault();
        if (this.enableDrag) {
            var $image = this.$('.o_viewer_img');
            var $zoomer = this.$('.o_viewer_zoomer');
            var top = $image.prop('offsetHeight') * this.scale > $zoomer.height() ? e.clientY - this.dragStartY : 0;
            var left = $image.prop('offsetWidth') * this.scale > $zoomer.width() ? e.clientX - this.dragStartX : 0;
            $zoomer.css("transform", "translate3d("+ left +"px, " + top + "px, 0)");
            $image.css('cursor', 'move');
        }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onEndDrag (e) {
        e.preventDefault();
        if (this.enableDrag) {
            this.enableDrag = false;
            this.dragstopX = e.clientX - this.dragStartX;
            this.dragstopY = e.clientY - this.dragStartY;
            this.$('.o_viewer_img').css('cursor', '');
        }
    }
    /**
     * On click of image do not close modal so stop event propagation
     *
     * @private
     * @param {MouseEvent} e
     */
    _onImageClicked (e) {
        e.stopPropagation();
    }
    /**
     * Remove loading indicator when image loaded
     * @private
     */
    _onImageLoaded () {
        $('.o_loading_img').hide();
    }
    /**
     * Move next previous attachment on keyboard right left key
     *
     * @private
     * @param {KeyEvent} e
     */
    _onKeydown (e){
        switch (e.key) {
            case "ArrowRight":
                this._next();
                break;
            case "ArrowLeft":
                this._previous();
                break;
            case "Escape":
                this.destroy();
                break;
            case "q":
                this.destroy();
                break;
        }
    }
    /**
     * Close popup on ESCAPE keyup
     *
     * @private
     * @param {KeyEvent} e
     */
    _onKeyUp (e) {
        switch (e.which) {
            case $.ui.keyCode.ESCAPE:
                e.preventDefault();
                this._onClose(e);
                break;
        }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onNext (e) {
        e.preventDefault();
        this._next(e);
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onPrevious (e) {
        e.preventDefault();
        this._previous();
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onPrint (e) {
        e.preventDefault();
        var src = $('.o_viewer_img').attr('src');
        const printWindow = window.open("about:blank", "_new");
        printWindow.document.open();
        printWindow.document.write(`
                <html>
                    <head>
                        <script>
                            function onloadImage() {
                                setTimeout('printImage()', 10);
                            }
                            function printImage() {
                                window.print();
                                window.close();
                            }
                        </script>
                    </head>
                    <body onload='onloadImage()'>
                        <img src="${src}" alt=""/>
                    </body>
                </html>`);
        printWindow.document.close();
    }
    /**
     * Zoom image on scroll
     *
     * @private
     * @param {MouseEvent} e
     */
    _onScroll (e) {
        var scale;
        if (e.deltaY > 0) {
            scale = this.scale - scrollZoomStep;
            this._zoom(scale);
        } else {
            scale = this.scale + scrollZoomStep;
            this._zoom(scale);
        }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onStartDrag (e) {
        e.preventDefault();
        this.enableDrag = true;
        this.dragStartX = e.clientX - (this.dragstopX || 0);
        this.dragStartY = e.clientY - (this.dragstopY || 0);
    }
    /**
     * On click of video do not close modal so stop event propagation
     * and provide play/pause the video instead of quitting it
     *
     * @private
     * @param {MouseEvent} e
     */
    _onVideoClicked (e) {
        e.stopPropagation();
        var videoElement = e.target;
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onRotate (e) {
        e.preventDefault();
        this._rotate(90);
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onZoomIn (e) {
        e.preventDefault();
        var scale = this.scale + ZOOM_STEP;
        this._zoom(scale);
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onZoomOut (e) {
        e.preventDefault();
        var scale = this.scale - ZOOM_STEP;
        this._zoom(scale);
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onZoomReset (e) {
        e.preventDefault();
        $('.o_viewer_zoomer').css("transform", "");
        this._zoom(1);
    }
    /**
     * @param {Event} ev
     */
    onWheelImage(ev) {
        if (ev.deltaY > 0) {
            this.zoomOut({ scroll: true });
        } else {
            this.zoomIn({ scroll: true });
        }
    }
}