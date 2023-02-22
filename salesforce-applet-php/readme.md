# Salesforce Applet with Webhooks in PHP

This applet was designed to pull in the salesforce record (based on the configured object) and display it in the applet for ease of use. This applet does allow editing the record within the applet and pushes the changes to Salesforce through the Salesforce JS API. 

## Requirements

	Okay, so basic req’s of the Salesforce Applet:
	√	- Be able to log into Salesforce from the Applet
	√	- Pull up a customer record based on a custom attribute of visitor on Glia
	√	- Be able to modify that record
	√	- Create a Lead record within Applet - * Not in scope of applet, but in webhooks the data can be created * 
	√	- Show synced data between post-engagement Glia data export to Lead record
    √   - Update ability - click to be able to edit all fields, one save button
    √   - Add a link out to the SF record to open 



 ## Exports End -
    - Meta Data if possible
    √ - Chat transcript as a note "Engagement - MM/DD/YYYY"
    √ - Any notes from the engagement from the visitor panel - Operator Notes (userproof maybe below)
    √ - Send over the survey and create a new note "Engagement - MM/DD/YYYY - Operator Notes"

Configuration changes needed:
- config.php - This file will handle all of the PHP Webhook configurations. Each line is described in line but to break it down:
    - clientid: This is the salesforce API key (setup through Connected Apps)
    - clientsecret: This is the salesforce API secret (again, setup through Connected Apps)
    - sfUsername: your salesforce username (this isn't a required field, added this just in case OAUTH isn't going to be used)
    - sfPassword: Your Salesforce Password (again, not required, added this just in case OATUH isn't going to be used)
    - url: This is your Salesforce domain prior to .my.salesforce.com (Ex: glia-dev not glia-dev.my.salesforce.com)
    - gliaSiteKey: This is your Glia SITE API key
    - gliaSiteSecret: This is your Glia SITE API secret
    - gliaKey: This is your Glia USER API key
    - gliaSecret: This is your Glia USER API secret
    - sfObject: This will be your salesforce object. What module do you want to be searching for / creating in? Contact, Lead, Account, Opportunity
    - exportTranscriptAsNote: If set to true, it will export the chat transcript into salesforce notes related to the sfObject, if false, no chat transcript is created in salesforce
- salesforce_applet.html - This file is the applet itself. The form can be updated to include fields / remove fields, and change a couple of variables.
    - Variables to change: clientId, redirectURI, sfObject, orgDomain (all of these should match above config [orgDomain = url above])
    - Functions to change if you add/remove fields:
        - useSalesforceLeadData - This function actually displays the data that is pulled in from Salesforce calls. You should update this only if you are adding/removing fields from the form. 
        - $('#sfForm').on('submit', function(e) [not technically function, but still needs to be updated if you update the form] - 
            - This "function" is used to update salesforce. If you add a field,  you'll need to grab the field's id and add it to the javascript array (which will be turned into JSON later, be mindful of that). The array is named: formData
            - After the fetch in this "function" you will need to make any new / removed fields as readonly again. This is already provided and a simple copy/paste can be used as long as you update the #id of the field. 