# QUT FFS (finance-filling-system)
A greasemonkey/tempermonkey script that helps filling in travel expenses in QUT's iexpense webform

To install this script click on the raw of the script and tampermonkey will ask you to import it (it Tampermonkey is installed already).

The script will display a few options once you are in various steps along your (travel) expense reconciliation.

Currently QUT FFS can help in:
- Step 3: QUT FFS will fill the dropdown boxes "Expense Type" and fill the justication and even will guess the tax code dropdown for you. An overlay allows you to specify domestic or international travel and to specify the travel region. Once the "RUN Auto Finance Filling System" button is pressed, the dropdowns will be selected, with a few guesses for hotels and air lines already in the code (if yours is not classified correctly, please email me or fork and update the list in the userscript), it also fills the justification with TYPE_PLACE_DATE based on the information already in the form.

- Line mode: if you have lost some receipts and need to click missing receipts, FFS automates this. After you have uploaded all receipts you have you can click on the details of any line in Step 3 (currently best to do that for the first line you do not have a receipt for). In the line view a different overlay will allow you to check all missing receipts by clicking the "check all missing receipts" button. It ticks the tick mark (if no uploads are registered) and will click next until it reaches the last line element.

- Step 6: currently in progress to help with the upload, but not working yet.




## Installing and Using Tampermonkey
Unlike Greasemonkey, which only runs on Firefox, Tampermonkey is available for a wide range of web browsers. What is similar to Greasemonkey, however, is that the Tampermonkey add-on is also managed through the menu associated with its address bar button. From here you can toggle its functionality off and on, check for updates, create your own user script as well as open a dashboard where you can manage Tampermonkey's settings as well as all scripts that have been installed.

To install Tampermonkey on Chrome, Microsoft Edge, Firefox, Safari, Opera, Dolphin (Android only) or UC Browser (Android only), visit the extension's webpage at https://tampermonkey.net/ and follow the instructions specific to your browser.
