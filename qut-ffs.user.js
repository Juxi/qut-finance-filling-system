// ==UserScript==
// @name         QUT FFS - Finance Filling System
// @namespace    https://github.com/Juxi/qut-finance-filling-system
// @version      0.2
// @description  try to take over the world, one travel expense report at a time...
// @author       Juxi | http://Juxi.net
// @match        https://finance.qut.edu.au/OA_HTML/*
// @require      https://code.jquery.com/jquery-2.2.0.min.js
// @grant GM_setValue
// @grant GM_getValue
// @//grant        none
// @license         MIT
// ==/UserScript==
// ==OpenUserJS==
// @author juxi
// @collaborator username
// @license         MIT
// ==/OpenUserJS==

// expense type constants
var ACCOMODATION = 0;
var AIRFARES = 1;
var CONFERENCE_FEES = 2;
var MEALS = 3;
var OTHER = 4;
var TRANSPORT = 5;
var VEHICLE = 6;
var textStart = ["Accom_", "Flights_", "Rego_", "Meals_", "", "Transport_", "Car_"];


//////////////////////////////
// START Of USERSCRIPT
$(document).ready(function() {
    ///////////////////////////////
    // VARIABLES and CONSTANTS
    ///////////////////////////////
    // console.log('[Juxi]  constants');
    // CONSTANTS
    var offsetDomestic = 93;
    var offsetInternational = 100;
    // configuration/setting storage variables
    var storageKey = '_TM_Juxi_QUTFFS_cfg_';
    var storedConfig = {};

    /////////////////////////////////////
    // Parse which step we are currently
    var elements = $('.x4a');
    var stepText = $( "span.x4a" ).text();
    var stepNumber = -1;
    if(stepText.startsWith("Step ")) stepNumber = stepText.slice(5,6);
    //DEBUG alert("We are at Step: " + stepNumber);

    // What's the current step
    if(stepNumber == 3) {
        // We are in Step 3
        // We need to fill out the expense type for each element in the form by selecting the drop down... grr
        showAutoFillExpenseDiv();
    }
    if(stepNumber == 6) {
        // We are in Step 6
        // This is where all the upload is happening!
        showAutoUploadDiv();
    }
    if(stepNumber == -1) {
        console.log("We did not find a step number! " + stepNumber);
        if(stepText.startsWith("Line ")) {
            stepText = stepText.slice(5,stepText.indexOf(" of"));
            console.log("We are in line view! " + stepText);
            showLineDiv(parseInt(stepText));
        }
    }

    //////////////////////////////////////////////
    // Functions
    //////////////////////////////////////////////

    /****************************/
    /* When we are in the line view, meaning each expense
       what we can automate is clicking missing receipt
       (as last step once we have done all the other receipts)
       Maybe in the future we can do the uploading too?! TODO
    ////////////////////////////*/
    function showLineDiv(currentLineNumber) {
        // Append HTML
        appendLineHTML ();

        var theElementToCheck = null;
        var autoRunning = GM_getValue(storageKey+'AutoMissing', "-1");
        console.log( currentLineNumber  + " is the value" +  autoRunning);
        autoRunning = currentLineNumber == autoRunning;

        var lastLineNumber = $( "span.x4a" ).first().text();
        lastLineNumber = lastLineNumber.substr(lastLineNumber.indexOf(" of ") + 4, lastLineNumber.length);
        console.log ("last number : " + lastLineNumber);

        // hightlight all relevant fields
        var elements = $('[id*="LineAttachments_"] :nth-child(3)');   // "N3:ExpenseType:0"
        elements.each(function() {
            // filter for only the ones without attachment
            // if it has 2 child a elements, it means we have already uploaded something

            if($(this).children('a').length == 1) {
                $(this).css("border", "2px solid green");
                // we have an attachment already
            } else {
                $(this).css("border", "2px solid blue");
                // DEBUG
                // console.log($(this).children('a').length + " is the value");

                // do this only if we have no attachment yet!
                // TODO upload in the future?

                // if we have clicked auto fill missing
                if(autoRunning) {
                    // DEBUG        console.log("AutoRunnnig: " + $('[id="DetailReceiptMissing"]')[0].checked);
                    $('[id="DetailReceiptMissing"]')[0].checked = true;

                    // set the GM value to know we are auto clicking
                    GM_setValue(storageKey+'AutoMissing', -1);

                    if(currentLineNumber != lastLineNumber) {
                        GM_setValue(storageKey+'AutoMissing', currentLineNumber+1);
                        //                        DEBUG console.log("not at the end" + lastLineNumber);
                        //                        console.log("setting GM value: " + currentLineNumber+1);
                    }

                    $('[id="DetailReceiptMissing"]')[0].checked = true;

                    // click on next button
                    var fooCall = $("button[title='Next']").attr('onclick') + ";";
                    Function(fooCall)();

                }else {
                    console.log("not auto running");
                    if($('[id="DetailReceiptMissing"]')[0].checked == false)
                        theElementToCheck = $('[id="DetailReceiptMissing"]')[0];
                }
            }
            // DEBUG alert("# of elements:" + lineAttachment.length);
        });



        /**************************/
        $('#FFS').click(function(){
            ////////////////////////////////////
            // function uploadReceiptsForEach ()
            // to loop through all we need a cookie

            if(theElementToCheck != null) {
                theElementToCheck.checked = true;
            }
            // set auto click cookie

            // set the GM value to know we are auto clicking
            GM_setValue(storageKey+'AutoMissing', -1);

            if(currentLineNumber != lastLineNumber) {
                console.log("not at the end" + lastLineNumber);
                GM_setValue(storageKey+'AutoMissing', currentLineNumber+1);
            }else{
                alert("Already at the end of all line elements!");
                return false;
            }

            // click on next button
            var fooCall = $("button[title='Next']").attr('onclick') + ";";
            Function(fooCall)();

        });
    }


    /****************************/
    function showAutoUploadDiv() {
        // Append HTML
        appendStep6HTML ();

        // list of all missing receipts
        var lineAttachment = []; // new array

        // hightlight all relevant fields
        var elements = $('[id*=":LineAttachments"]');   // "N3:ExpenseType:0"
        elements.each(function() {
            // filter for only the ones without attachment
            // if it has 2 child a elements, it means we have already uploaded something
            if($(this).children('a').length == 1) {
                $(this).parent().css("border", "2px solid blue");
                lineAttachment.push($(this));

                // DEBUG return false;
                // stop after one element

            } else {
                $(this).parent().css("border", "2px solid green");
                // DEBUG console.log($(this).children('a').length + " is the value");
            }
            // DEBUG alert("# of elements:" + lineAttachment.length);
        });

        $("#FFS_MissingAttachments").val(lineAttachment.length + " attachments missing!").css("visibility", "visible");

        /**************************/
        $('#FFS').click(function(){
            ////////////////////////////////////
            // function uploadReceiptsForEach ()
            // loop through all
            jQuery.each(lineAttachment, function(index, line) {
                // DEBUG console.log("test: " + $(line).children('a').attr('onmouseover'));

                // TODO do this only if we have a file
                // TODO check for file

                var fooCall = $(line).children('a').attr('onmouseover') + ";";
                //$(line).children('a').trigger('mouseenter');... didn't work somehow
                Function(fooCall)();

                // The pop up has id #WzTtDiV we need to wait until it pops up
                var dfd = $.Deferred();
                var pollVisible = setInterval(function () {
                    if ($("#WzTtDiV").css("visibility") == "visible") {
                        dfd.resolve();
                        clearInterval(pollVisible);
                    }
                }, 1000);

                dfd.done(function () {
                    // DEBUG console.log('it is visible');

                    // click on File
                    $("#attType").val('File')
                        .trigger('change');

                });


            });
        });
    }

    function pollVisibility() {
        if (!$("#hideThis").is(":visible")) {
            // call a function here, or do whatever now that the div is not visible
            $("#thenShowThis").show();
        } else {
            setTimeout(pollVisibility, 500);
        }
    }

    /*********************************/
    function showAutoFillExpenseDiv() {
        // Append HTML
        appendStep3HTML ();

        // list of all drop down menus (in step 3)
        var dropDowns = []; // new array

        // for each select element        with class x8
        var elements = $(':selected');   // "N3:ExpenseType:0"
        // DEBUG alert("# of elements:" + elements.length);
        // TODO filter for only the correct elements
        elements.each(function() {
            // HACKING filter for only the correct elements
            // if text is set, some stuff is selected
            // DEBUG alert($(this).text());
            if($(this).text() == "") {
                $(this).parent().parent().css("border", "2px solid blue");
                // do the actual stuff here :)
                dropDowns.push($(this));
            }
        });

        // TODO clean up better, such as here:
        //    // The .each() method is unnecessary here:
        //    $( "li" ).each(function() {
        //      $( this ).addClass( "foo" );
        //    });
        //
        //    // Instead, you should rely on implicit iteration:
        //    $( "li" ).addClass( "bar" );


        /*************************/
        $('#FFS').click(function(){
            //////////////////////////////
            // function fillExpenseType ()
            // store settings
            GM_setValue(storageKey+'destination', document.getElementById('FFS_Destination').value);
            if($("#FFS_Domestic").is(":checked")) GM_setValue(storageKey+'domintl', "domestic");
            else GM_setValue(storageKey+'domintl', "international");

            // DEBUG alert("drop" + dropDowns); alert("drop" + dropDowns.length);
            //        console.log("Test;" + GM_getValue(storageKey+'destination'));

            // do your thing
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

                    // fill justification, if not empty
                    var justification = $(this).parent().parent().next().next().children();
                    if(justification.val() == "") justification.val(createJustification(exType));

                    // select gst? (is a separate dropbox!)
                    // colour the text? $(this).parent().parent().next().css("color","red");
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

        // Reset Options Box, showing ResetDropboxes and ResetText
        /***************************************/
        $('#FFS_ResetOptions').click(function() {
            //////////////////////////////
            // function showResetOptions()
            //alert("alaladsfa");
            var htmlSt = '<div id="juxi_reset">';
            htmlSt += '<input type="button" value="Reset all drop boxes" id="FFS_Reset">';
            htmlSt += '<input type="button" value="Reset all text" id="FFS_ResetJusitification">';
            htmlSt += '</div>';
            $('body').append(htmlSt);
            // Add style
            $("#juxi_reset").css("position", "fixed").css("top", 281).css("left", 455);
            $("#juxi_reset").css("background", "rgba(222, 2, 20,0.75)").css("padding", "20px").css("color", "white");

            // function restetAllExpenseType ()
            $('#FFS_Reset').click(function(){
                $(elements).each(function() {
                    $(this).parent().prop('selectedIndex', 0);
                });
            });
            // fucntion resetAllExpenseType ()
            $('#FFS_ResetJusitification').click(function(){
                $(elements).each(function() {
                    $(this).parent().parent().next().next().children().val("");
                });
            });
        });
        /////////////////////////////////

    }
    /***************************************/


    /********************************************/
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
        // type is related to dropdown elements and their index:
        // 93: STAFF TRAVEL - DOMESTIC - ACCOMMODATION
        // 94: STAFF TRAVEL - DOMESTIC - AIRFARES
        // 95: STAFF TRAVEL - DOMESTIC - CONFERENCE FEES
        // 96: STAFF TRAVEL - DOMESTIC - MEALS
        // 97: STAFF TRAVEL - DOMESTIC - OTHER
        // 98: STAFF TRAVEL - DOMESTIC - TRANSPORT OTHER
        // 99: STAFF TRAVEL - DOMESTIC - VEHICLE ALLOWANCES
        // 100: STAFF TRAVEL - INTL - ACCOMODATION
        // 101: STAFF TRAVEL - INTERNATIONAL - AIRFARES
        // 102: STAFF TRAVEL - INTERNATIONAL - CONFERENCE FEES
        // 103: STAFF TRAVEL - INTERNATIONAL - MEALS
        // 104: STAFF TRAVEL - INTERNATIONAL - OTHER
        // 105: STAFF TRAVEL - INTERNATIONAL - TRANSPORT OTHER
        // books are: 75?: OFFICE CONSUMABLES SUPPLIES - Other.

        return typeNumber;
    }

    /*****************************************/
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

    /***************************************/
    function appendStep3HTML() {
        // load setting variables (stored previously;
        storedConfig.dest = GM_getValue(storageKey+'destination', "");
        storedConfig.domintl = GM_getValue(storageKey+'domintl', "international");

        // Create HTML
        var htmlString = '<div id="juxi">';
        htmlString += '<input type="button" value="RUN Auto Finance Fill System" id="FFS">';
        htmlString += '<br/><label>Destination:</label><input type="textbox" id="FFS_Destination" name="destination" value="' + storedConfig.dest + '">';
        htmlString += '<br/><input type="radio" id="FFS_Domestic" name="domestic_or_intl"';
        if(storedConfig.domintl == "domestic") htmlString += ' checked';
        htmlString += '>domestic';
        htmlString += '<input type="radio" id="FFS_International" name="domestic_or_intl"';
        if(storedConfig.domintl == "international") htmlString += ' checked';
        htmlString += '>international';
        htmlString += '<br/><input type="checkbox" id="FFS_MealsDefault" name="meals_default" checked=checked><label>mark unknowns as meals</label>';
        htmlString += '<br/><small><input type="button" value="Show reset options" id="FFS_ResetOptions"</small>';
        htmlString += '</div>';

        // Append HTML
        $('body').append(htmlString);

        addStyle(3);
    }

    /********************************/
    function appendStep6HTML() {
        // load settings?

        // Create HTML
        var htmlString = '<div id="juxi">';
        htmlString += '<input type="textbox" id="FFS_MissingAttachments" name="attachments" value="xxx attachments missing!" style="visibility:hidden;"><br/>';
        htmlString += '<input type="button" value="RUN Auto Finance Fill System" id="FFS">';
        //        htmlString += '<input type="radio" id="FFS_International" name="domestic_or_intl"';
        //        if(storedConfig.domintl == "international") htmlString += ' checked';
        htmlString += '</div>';

        // Append HTML
        $('body').append(htmlString);

        addStyle(6);
    }

    /********************************/
    function     appendLineHTML() {
        // load settings?

        // Create HTML
        var htmlString = '<div id="juxi">';
        //htmlString += '<input type="textbox" id="FFS_MissingAttachments" name="attachments" value="xxx attachments missing!" style="visibility:hidden;"><br/>';
        htmlString += '<input type="button" value="check all missing receipts [Auto Finance Fill System]" id="FFS">';
        //        htmlString += '<input type="radio" id="FFS_International" name="domestic_or_intl"';
        //        if(storedConfig.domintl == "international") htmlString += ' checked';
        htmlString += '</div>';

        // Append HTML
        $('body').append(htmlString);

        addStyle(6);
    }


    /**************************/
    function addStyle(step) {
        // Add stylesheet to divs
        var color = [ "", "", "", "rgba(182, 22, 40, 0.75)", // Step 3
                     "", "", "rgba(22, 2, 182, 0.75)" // step 6
                    ];
        $("#juxi").css("position", "fixed").css("top", 200).css("left", 200);
        $("#juxi").css("background", color[step]).css("padding", "20px").css("color", "white");
        //        $("#juxi").css("background", "rgba(182, 2, 20,0.75)").css("padding", "20px").css("color", "white");
        //$("#FFS").css("background", "rgba(182, 2, 20,0.75)").css("padding", "20px").css("color", "white");
    }
});
