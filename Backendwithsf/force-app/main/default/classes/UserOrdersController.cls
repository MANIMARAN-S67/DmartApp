public with sharing class UserOrdersController {
    
    @AuraEnabled(cacheable=true)
    public static List<DMart_Order__c> getUserOrders(Id userId) {
        if(userId == null) {
            return new List<DMart_Order__c>();
        }
        
        return [
            SELECT Id, Name, order_Id__c, Total_Amount__c, Order_Status__c, Payment_Status__c, CreatedDate,
                (SELECT Id, Name, Product_Name__c, Quantity__c, Price__c 
                 FROM DMart_Order_Items__r)
            FROM DMart_Order__c
            WHERE Dmart_User__c = :userId
            ORDER BY CreatedDate DESC
        ];
    }
}
