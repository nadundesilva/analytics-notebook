/**
 * Utility prototype constructor for homepage
 *
 * @constructor
 */
function Notebook() {
    var self = this;

    // Private variables
    var utils = new Utils();

    /**
     * Initialize the home page
     */
    self.initialize = function () {
        loadNoteNamesList();

        // Registering event listeners
        $("#sign-out").click(function() {
            utils.signOut("./");
        });

        $("#create-note").click(function() {
            showCreateNoteModal();
        });
    };

    function loadNoteNamesList() {
        var notesList = $("#notes-list");
        utils.showLoadingOverlay(notesList);
        $.ajax({
            type: "GET",
            url: constants.API_URI + "notes",
            success: function (response) {
                if (response.status == constants.response.SUCCESS) {
                    var notes = response.notes;
                    var columns = ["Note Name", "Actions"];

                    // Creating the 2D data array for the notes list table
                    var data = [];
                    $.each(notes, function(index, note) {
                        var row = [];
                        row.push("<span class='note-name'>" + note + "</span>");
                        row.push(
                            "<a href='note.html?note=" + note + "' class='btn padding-reduce-on-grid-view'>" +
                                "<span class='fw-stack'>" +
                                    "<i class='fw fw-ring fw-stack-2x'></i>" +
                                    "<i class='fw fw-view fw-stack-1x'></i>" +
                                "</span>" +
                                "<span class='hidden-xs'>View</span>" +
                            "</a>" +
                            "<a class='delete-note btn padding-reduce-on-grid-view'>" +
                                "<span class='fw-stack'>" +
                                    "<i class='fw fw-ring fw-stack-2x'></i>" +
                                    "<i class='fw fw-delete fw-stack-1x'></i>" +
                                "</span>" +
                                "<span class='hidden-xs'>Delete</span>" +
                            "</a>"
                        );
                        data.push(row);
                    });

                    var listTable = utils.generateListTable(columns, data,
                        { ordering : false, searching : false },
                        { "Actions" : "text-right" }
                    );

                    // Registering event listeners to the list table
                    listTable.find(".delete-note").click(function(event) {
                        showDeleteNoteModal($(event.target).closest("tr").find(".note-name").html());
                    });

                    notesList.html(listTable);
                } else if (response.status == constants.response.NOT_LOGGED_IN) {
                    window.location.href = "sign-in.html";
                } else {

                }
                utils.hideLoadingOverlay(notesList);
            },
            error : function() {
                utils.handlePageNotification("error", "Error", utils.generateErrorMessageFromStatusCode(response.readyState));
                utils.hideLoadingOverlay(notesList);
            }
        });
    }

    function showCreateNoteModal() {
        utils.clearPageNotification();

        // Creating the modal content elements
        var modalBody = $("<div >");
        var noteNameInput = $(
            "<div class='pull-left'><div class='form-group col-sm-12'>" +
                "<input type='text' class='form-control form-control-lg' />" +
            "</div></div>"
        );
        var modalFooter = $("<div class='pull-right'>");
        var createButton = $("<button type='button' class='btn btn-primary'>Create</button>");

        // Appending to create the modal content structure
        modalBody.append(noteNameInput);
        modalFooter.append(createButton);

        var modal = utils.showModalPopup("Enter a name for your new note", modalBody, modalFooter);

        // Registering event listeners for the modal window
        createButton.click(function() {
            createNote(noteNameInput.children().first().val());
            modal.modal("hide");
        });
    }

    function createNote(name) {
        if (name.indexOf(' ') > 0) {
            utils.handlePageNotification("error", "Error", "Note name cannot contain white spaces");
        } else {
            $.ajax({
                type: "POST",
                url: constants.API_URI + "notes/" + name,
                success: function (response) {
                    if (response.status == constants.response.SUCCESS) {
                        window.location.href = "note.html?note=" + name;
                    } else if (response.status == constants.response.NOT_LOGGED_IN) {
                        window.location.href = "sign-in.html";
                    } else {
                        utils.handlePageNotification("error", "Error", response.message);
                    }
                },
                error : function(response) {
                    utils.handlePageNotification("error", "Error", utils.generateErrorMessageFromStatusCode(response.readyState));
                }
            });
        }
    }

    function showDeleteNoteModal(noteName) {
        utils.clearPageNotification();

        // Creating the modal content elements
        var modalFooter = $("<div class='pull-right'>");
        var deleteButton = $("<button type='button' class='btn btn-primary'>Delete</button>");

        // Appending to create the modal content structure
        modalFooter.append(deleteButton);

        var modal = utils.showModalPopup("Do you want to delete " + noteName + " ?", $(), modalFooter);

        // Registering event listeners for the modal window
        deleteButton.click(function() {
            deleteNote(noteName);
            modal.modal("hide");
        });
    }

    function deleteNote(name) {
        $.ajax({
            type: "DELETE",
            url: constants.API_URI + "notes/" + name,
            success: function (response) {
                if (response.status == constants.response.SUCCESS) {
                    utils.handlePageNotification("info", "Info", "Note successfully deleted");
                    loadNoteNamesList();
                } else if (response.status == constants.response.NOT_LOGGED_IN) {
                    window.location.href = "sign-in.html";
                } else {
                    utils.handlePageNotification("error", "Error", response.message);
                }
            },
            error : function(response) {
                utils.handlePageNotification("error", "Error", utils.generateErrorMessageFromStatusCode(response.readyState));
            }
        });
    }
}
