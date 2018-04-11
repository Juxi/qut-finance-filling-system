// ==UserScript==
// @name         QUT FFS - Finance Filling System
// @namespace    https://github.com/Juxi/qut-finance-filling-system
// @version      0.1
// @description  try to take over the world, one travel expense report at a time...
// @author       Juxi | http://Juxi.net
// @match        https://finance.qut.edu.au/OA_HTML/*
// @require      https://code.jquery.com/jquery-2.2.0.min.js
// @grant        none
// ==/UserScript==


// CONSTANTS
    var offsetDomestic = 93;
    var offsetInternational = 100;

// expense type constants
    var ACCOMODATION = 0;
    var AIRFARES = 1;
    var CONFERENCE_FEES = 2;
    var MEALS = 3;
    var OTHER = 4;
    var TRANSPORT = 5;
    var VEHICLE = 6;
    var textStart = ["Accom_", "Flights_", "Rego_", "Meals_", "", "Transport_", "Car_"];


$(document).ready(function() {
    // Parse at which step we are
    var elements = $('.x4a');
    var stepText = $( "span.x4a" ).text();
    var stepNumber = -1;
    if(stepText.startsWith("Step "))
        stepNumber = stepText.slice(5,6);
        
    // If we are in Step 3 we need to fill out the expense type
    if(stepNumber == 3) {
        showAutoFillExpense();
    }

});


function showAutoFillExpense() {
    var htmlString = '<div id="juxi">';
    htmlString += '<input type="button" value="Auto Finance Fill System" id="FFS">';
    htmlString += '<br/><label>Destination:</label><input type="textbox" id="FFS_Destination" name="destination" value="">';
    htmlString += '<br/><input type="radio" id="FFS_Domestic" name="domestic_or_intl" checked>domestic';
    htmlString += '<input type="radio" id="FFS_International" name="domestic_or_intl">international';
    htmlString += '<br/><input type="checkbox" id="FFS_MealsDefault" name="meals_default" checked=checked><label>mark unknowns as meals</label>';
    htmlString += '<br/><input type="button" value="Reset all drop boxes" id="FFS_Reset">';
    htmlString += '<input type="button" value="Reset all text" id="FFS_ResetJusitification">';
    htmlString += '</div>';

    $('body').append(htmlString);

    $("#juxi").css("position", "fixed").css("top", 200).css("left", 200);
    $("#juxi").css("background", "rgba(222, 2, 20,0.75)").css("padding", "20px").css("color", "white");

    var dropDowns = [];

    // find all possible select elements and store the to be set ones in dropdowns
    /// with class x8
    var elements = $(':selected');   
    elements.each(function() {
        // HACK filter for only the correct elements
        // if text is set, some stuff is already selected in that form
        if($(this).text() == "") {
            $(this).parent().parent().css("border", "2px solid blue");
            dropDowns.push($(this));
        }
    }); 
    
    // function fillExpenseType ()
    $('#FFS').click(function(){
        var offset;
        $(dropDowns).each(function() {
            //  check if we are in the expense type or tax code column!
            if($(this).parent().attr('id').includes("ExpenseType")) {
                // we are in the expense type column
                if($("#FFS_Domestic").is(":checked")) offset = offsetDomestic;
                else offset = offsetInternational;

                var merchant = $(this).parent().parent().next().text();
                var exType = guessTypeFromMerchant(merchant);
                if(exType == -1) return false; // no merchant type found
                // select dropbox
                $(this).parent().prop('selectedIndex', offset + exType);
                // fill justification
                $(this).parent().parent().next().next().children().val(createJustification(exType));
                // select gst is a separate dropdown!
            }else if($(this).parent().attr('id').includes("TaxCode")) {
                // We are in the tax/gst code dropbox
                var GST10 = 1; var NO_GST = 2;
                // if domestic (most likely GST 10) // if international most likely no GST
                if($("#FFS_Domestic").is(":checked")) offset = GST10;
                else offset = NO_GST;
                $(this).parent().prop('selectedIndex', offset);
            }
        });
    });

    // fucntion restetAllExpenseType ()
    $('#FFS_Reset').click(function(){
        $(elements).each(function() {
            $(this).parent().prop('selectedIndex', 0);
        });
    });
    // fucntion restetAllExpenseType ()
    $('#FFS_ResetJusitification').click(function(){
        $(elements).each(function() {
            $(this).parent().parent().next().next().children().val("");
        });
    });

}

//////////////////////////////////////////////
function guessTypeFromMerchant(merchantText) {
    // DEBUG alert("text " + merchantText);

    var typeNumber = -1;
    if($("#FFS_MealsDefault").is(":checked")) typeNumber = MEALS; // by default

    var knownMerchants = {
        "CORPORATE TRAVEL MANAG" : OTHER,
        "QANTAS" : AIRFARES,
        "AIR " : AIRFARES,
        "COFFEE" : MEALS,
        "CAFE" : MEALS,
        "CAB": TRANSPORT,
        "TAXI" : TRANSPORT,
        "HOTEL": ACCOMODATION,
        "MARRIOTT" : ACCOMODATION,
        "HGC ": ACCOMODATION,
        "Wells Fargo" : OTHER,

    };

    // check if we know that merchant
    for (var key in knownMerchants) {
        // console.log("key " + key + " has value " +
        if(merchantText.includes(key)) {
            typeNumber = knownMerchants[key];
            break;
        }
    }

    return typeNumber;
}

//////////////////////////////////////////////
function createJustification(expenseType) {
    var city = $("#FFS_Destination").val();
    var month = $('[id*="Date"]:first').val().substr(3,3);
    var verify = $('[id*="Date"]:last').val().substr(3,3);
    if(month != verify) month = month + "-" + verify;

    fillText = textStart[expenseType];
    if(city.length > 0) fillText += city + "_";
    fillText += month;

    return fillText;
}
