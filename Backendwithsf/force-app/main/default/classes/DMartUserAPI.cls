@RestResource(urlMapping='/dmart/user')
global with sharing class DMartUserAPI {

    @HttpPost
    global static String createUser() {

        RestRequest req = RestContext.request;
        String body = req.requestBody.toString();

        Map<String, Object> data = 
            (Map<String, Object>) JSON.deserializeUntyped(body);

        String name = (String) data.get('name');
        String email = (String) data.get('email');
        String phone = (String) data.get('phone');
        String uid = (String) data.get('uid');

        DMart_User__c user = new DMart_User__c(
            Name = name,
            Email__c = email,
            Phone__c = phone,
            Firebase_UID__c = uid
        );

        insert user;

        return 'User Created';
    }

    @HttpGet
    global static DMart_User__c getUser() {

        String uid = RestContext.request.params.get('uid');

        return [
            SELECT Id, Name, Email__c, Phone__c
            FROM DMart_User__c
            WHERE Firebase_UID__c = :uid
            LIMIT 1
        ];
    }
}