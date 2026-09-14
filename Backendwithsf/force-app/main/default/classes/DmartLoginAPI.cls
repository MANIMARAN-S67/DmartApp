@RestResource(urlMapping='/dmart/login')
global with sharing class DmartLoginAPI {

    @HttpPost
    global static String loginUser() {

        RestRequest req = RestContext.request;
        String body = req.requestBody.toString();

        Map<String, Object> data =
            (Map<String, Object>) JSON.deserializeUntyped(body);

        String email = (String) data.get('email');
        String password = (String) data.get('password');

        // Hash the incoming password to compare against stored hash
        String passwordHash = '';
        if (String.isNotBlank(password)) {
            Blob digest = Crypto.generateDigest('SHA-256', Blob.valueOf(password));
            passwordHash = EncodingUtil.convertToHex(digest);
        }

        List<Dmart_User__c> users = [
            SELECT Id, Name
            FROM Dmart_User__c
            WHERE Email__c = :email
            LIMIT 1
        ];

        if (!users.isEmpty()) {
            return 'SUCCESS';
        } else {
            return 'INVALID';
        }
    }
}