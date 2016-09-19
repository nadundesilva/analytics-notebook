/**
 * Event receiver paragraph client prototype
 *
 * @param paragraph {jQuery} The paragraph in which the client resides in
 * @constructor
 */
function EventReceiverDefinitionParagraphClient(paragraph) {
    var self = this;
    var utils = new Utils();
    var paragraphUtils = new ParagraphUtils(paragraph);

    /**
     * Initialize the event receiver definition paragraph
     */
    self.initialize = function () {
        // Loading event receiver names into the  event receiver select element
        var eventReceiverSelectElement = $(paragraph).find(".event-receiver-name");
        utils.showLoadingOverlay(paragraph);
        $.ajax({
            type: "GET",
            url: constants.API_URI + "event-receivers",
            success: function (response) {
                if (response.status == constants.response.SUCCESS) {
                    eventReceiverSelectElement.html($("<option disabled selected value> -- select an option -- </option>"));
                    $.each(response.eventReceiverNames, function (index, eventReceiver) {
                        eventReceiverSelectElement.append($("<option>" + eventReceiver + "</option>"));
                    });
                } else if (response.status == constants.response.NOT_LOGGED_IN) {
                    window.location.href = "sign-in.html";
                } else {
                    paragraphUtils.handleNotification("error", "Error", response.message);
                }
                utils.hideLoadingOverlay(paragraph);
            },
            error : function(response) {
                paragraphUtils.handleNotification(
                    "error", "Error", utils.generateErrorMessageFromStatusCode(response.readyState)
                );
                utils.hideLoadingOverlay(paragraph);
            }
        });
    };

    /**
     * Run the event receiver definition paragraph
     *
     * @param callback {ParagraphClientRunCallback} The callback that will be called after running the paragraph
     */
    self.run = function (callback) {
        // TODO : run data visualization paragraph
        callback();
    };
}
