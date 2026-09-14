@RestResource(urlMapping='/dmart/address')
global with sharing class DMartAddressAPI {

    @HttpPost
    global static void saveAddress(){

        RestRequest req = RestContext.request;
        Map<String,Object> data =
            (Map<String,Object>) JSON.deserializeUntyped(req.requestBody.toString());

        Address__c addr = new Address__c(
            Account__c = (String)data.get('accountId'),
            First_Name__c = (String)data.get('firstName'),
            Last_Name__c = (String)data.get('lastName'),
            Phone__c = (String)data.get('phone'),
            City__c = (String)data.get('city'),
            Pincode__c = (String)data.get('pincode'),
            Type__c = (String)data.get('type')
        );

        insert addr;
    }
}