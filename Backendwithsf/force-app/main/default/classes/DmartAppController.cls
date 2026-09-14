public with sharing class DmartAppController {
    
    // Wrapper class to return to LWC
    public class UserWrapper {
        @AuraEnabled public String id { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public String email { get; set; }
        @AuraEnabled public String phone { get; set; }
    }

    @AuraEnabled
    public static UserWrapper loginUser(String identifier) {
        if (String.isBlank(identifier)) {
            throw new AuraHandledException('Email or Phone is required');
        }

        List<Dmart_User__c> users = [
            SELECT Id, Name, Email__c, Phone__c
            FROM Dmart_User__c
            WHERE Email__c = :identifier OR Phone__c = :identifier
            LIMIT 1
        ];

        if (users.isEmpty()) {
            throw new AuraHandledException('User not found. Please register.');
        }

        UserWrapper wrapper = new UserWrapper();
        wrapper.id = users[0].Id;
        wrapper.name = users[0].Name;
        wrapper.email = users[0].Email__c;
        wrapper.phone = users[0].Phone__c;
        
        return wrapper;
    }

    @AuraEnabled
    public static UserWrapper registerUser(String firstName, String lastName, String email, String phone) {
        List<Dmart_User__c> existing = [SELECT Id FROM Dmart_User__c WHERE Email__c = :email LIMIT 1];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Email already registered');
        }

        Dmart_User__c newUser = new Dmart_User__c(
            Name = firstName + ' ' + (String.isNotBlank(lastName) ? lastName : ''),
            Email__c = email,
            Phone__c = phone
        );
        insert newUser;

        UserWrapper wrapper = new UserWrapper();
        wrapper.id = newUser.Id;
        wrapper.name = newUser.Name;
        wrapper.email = newUser.Email__c;
        wrapper.phone = newUser.Phone__c;
        
        return wrapper;
    }
}