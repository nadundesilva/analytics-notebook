function onDataSourceDefinitionDataSourceTypeChange(selectElement) {
    // TODO : implement fetching the datasource names
    var type;
    var url;
    var authHeader;
    switch (selectElement.value) {
        case "Database" :
            type = "GET";
            url = serverURI + "analytics/tables";
            authHeader = "YWRtaW46YWRtaW4=";
            break;
        case "CSV File" :
            break;
    }
    $.ajax({
        type: type,
        url : url,
        headers : { "Authorization" : "Basic_" + authHeader },
        success: function(data) {
            inputTableSelectElement = $(selectElement).closest(".source").find(".table-name > select");
            inputTableSelectElement.html($("<option disabled selected value> -- select an option -- </option>"));
            $.each(data, function(index, table) {
                 inputTableSelectElement.append($("<option>" + table + "</option>"));
            });
        }
    });
    $(selectElement).closest(".source").find(".table-name").fadeIn();
}

function onDataSourceDefinitionInputTableChange(selectElement) {
    $(selectElement).closest(".source").find(".output-table").fadeIn();
}

function onDataSourceDefinitionOutputTableKeyUp(inputElement) {
    var sourceView = $(inputElement).closest(".source");
    var checkBox = sourceView.find(".output-table > label > input");
    if (inputElement.value.length != 0) {
        checkBox.prop('checked', true);
        checkBox.prop('disabled', false);
//        sourceView.closest(".paragraph").find(".run").prop('disabled', false);
    } else {
        checkBox.prop('checked', false);
        checkBox.prop('disabled', true);
//        sourceView.closest(".paragraph").find(".run").prop('disabled', true);
    }
}

function runDataSourceDefinitionParagraph(paragraph) {
    // TODO : run data source definition paragraph
}