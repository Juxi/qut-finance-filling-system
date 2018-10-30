# QUT FFS (finance-filling-system)
A greasemonkey / Tampermonkey script that helps filling in travel expenses in QUT's iexpense webform

To install this script click on the raw of the script file here and tampermonkey will ask you to import it (it Tampermonkey is installed already, if not follow the instructions below).

The script will display a few options once you are in various steps along your (travel) expense reconciliation.

## Currently QUT FFS can help with:

- auto selection of drop down boxes (because how many clicks does it take you to select: STAFF TRAVEL - DOMESTIC - TRANSPORT OTHER 10 times in a row?)
- auto filling of the Justification (so all the underscores are in the right places, at least until they change it again)
- easier navigation from Step 6 back to Step 3, because you have forgotten an attachment and for some reason you can’t click on missing receipt in step 6…
- auto clicking of missing receipts (why is that not built in?!!)
- some visual highlighting of attachments and what is still missing
- and a few other little things…

---

## User Guide:

- Step 3: QUT FFS will fill the dropdown boxes "Expense Type" and fill the justication and even will guess the tax code dropdown for you. An overlay allows you to specify domestic or international travel and to specify the travel region. Once the "RUN Auto Finance Filling System" button is pressed, the dropdowns will be selected, with a few guesses for hotels and air lines already in the code (if yours is not classified correctly, please email me or fork and update the list in the userscript), it also fills the justification with TYPE_PLACE_DATE based on the information already in the form.
![Step3](http://juxi.net/img/qut-ffs-step3.png)

- Line mode: if you have lost some receipts and need to click missing receipts, FFS automates this. After you have uploaded all receipts you have you can click on the details of any line in Step 3 (currently best to do that for the first line you do not have a receipt for). In the line view a different overlay will allow you to check all missing receipts by clicking the "check all missing receipts" button. It ticks the tick mark (if no uploads are registered) and will click next until it reaches the last line element.
![LineExpense](http://juxi.net/img/qut-ffs-line.png)

- Step 1, 2 and 4: are simple and/or not used by me and so have no automation, feel free to add to the script or suggest edits

- Step 5: the QUT finance system actually has a decent way of storing your account codes already (under My Allocation), so no need for FFS in this section

- Step 6: currently in progress to help with the upload, but not working yet.



---


### Installing and Using Tampermonkey
Unlike Greasemonkey, which only runs on Firefox, Tampermonkey is available for a wide range of web browsers. What is similar to Greasemonkey, however, is that the Tampermonkey add-on is also managed through the menu associated with its address bar button. From here you can toggle its functionality off and on, check for updates, create your own user script as well as open a dashboard where you can manage Tampermonkey's settings as well as all scripts that have been installed.

To install Tampermonkey on Chrome, Microsoft Edge, Firefox, Safari, Opera, Dolphin (Android only) or UC Browser (Android only), visit the extension's webpage at https://tampermonkey.net/ and follow the instructions specific to your browser.
