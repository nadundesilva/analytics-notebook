/**
 * Model definition paragraph client prototype
 *
 * @param paragraph The paragraph in which the client resides in
 * @constructor
 */
function ModelDefinitionParagraphClient(paragraph) {
    var self = this;

    self.initialize = function () {
        // Adding event listeners
        paragraph.find(".input-table").focusin(function () {
            new ParagraphUtils().loadAvailableParagraphOutputsToInputElement($(event.target), 'table');
        });
    };

    self.run = function (callback) {
        // TODO : run mode definition paragraph
        callback();
    };
}