public with sharing class DmartRecordDashboardsController {

    public class OrderDataWrapper {
        @AuraEnabled public DMart_Order__c orderInfo;
        @AuraEnabled public Dmart_User__c userInfo;
        @AuraEnabled public List<DMart_Order_Item__c> orderItems;
    }

    @AuraEnabled(cacheable=true)
    public static OrderDataWrapper getOrderData(Id recordId) {
        OrderDataWrapper wrapper = new OrderDataWrapper();
        if (recordId == null) return wrapper;

        List<DMart_Order__c> orders = [
            SELECT Id, Name, order_Id__c, Order_Status__c, Payment_Status__c, Total_Amount__c, Dmart_User__c, CreatedDate
            FROM DMart_Order__c
            WHERE Id = :recordId
            LIMIT 1
        ];

        if (!orders.isEmpty()) {
            wrapper.orderInfo = orders[0];
            
            if (wrapper.orderInfo.Dmart_User__c != null) {
                List<Dmart_User__c> users = [SELECT Id, Name, Email__c, Phone__c FROM Dmart_User__c WHERE Id = :wrapper.orderInfo.Dmart_User__c LIMIT 1];
                if (!users.isEmpty()) wrapper.userInfo = users[0];
            }

            wrapper.orderItems = [
                SELECT Id, Name, Product_Name__c, Quantity__c, Price__c, Product_dmart__c, Product_dmart__r.Category__c
                FROM DMart_Order_Item__c
                WHERE DMart_Order__c = :recordId
            ];
        }
        return wrapper;
    }

    public class ProductDataWrapper {
        @AuraEnabled public Product_dmart__c productInfo;
        @AuraEnabled public List<DMart_Order_Item__c> recentPurchases;
    }

    @AuraEnabled(cacheable=true)
    public static ProductDataWrapper getProductData(Id recordId) {
        ProductDataWrapper wrapper = new ProductDataWrapper();
        if (recordId == null) return wrapper;

        List<Product_dmart__c> products = [
            SELECT Id, Name, Category__c, Price__c, Stock_Quantity__c
            FROM Product_dmart__c
            WHERE Id = :recordId
            LIMIT 1
        ];

        if (!products.isEmpty()) {
            wrapper.productInfo = products[0];

            wrapper.recentPurchases = [
                SELECT Id, Name, Quantity__c, Price__c, DMart_Order__r.Name, DMart_Order__r.Order_Status__c, CreatedDate
                FROM DMart_Order_Item__c
                WHERE Product_dmart__c = :recordId
                ORDER BY CreatedDate DESC
                LIMIT 50
            ];
        }
        return wrapper;
    }

    public class OrderItemDataWrapper {
        @AuraEnabled public DMart_Order_Item__c itemInfo;
        @AuraEnabled public DMart_Order__c orderInfo;
        @AuraEnabled public Product_dmart__c productInfo;
    }

    @AuraEnabled(cacheable=true)
    public static OrderItemDataWrapper getOrderItemData(Id recordId) {
        OrderItemDataWrapper wrapper = new OrderItemDataWrapper();
        if (recordId == null) return wrapper;

        List<DMart_Order_Item__c> items = [
            SELECT Id, Name, Product_Name__c, Quantity__c, Price__c, DMart_Order__c, Product_dmart__c
            FROM DMart_Order_Item__c
            WHERE Id = :recordId
            LIMIT 1
        ];

        if (!items.isEmpty()) {
            wrapper.itemInfo = items[0];

            if (wrapper.itemInfo.DMart_Order__c != null) {
                List<DMart_Order__c> orders = [SELECT Id, Name, Order_Status__c, Total_Amount__c FROM DMart_Order__c WHERE Id = :wrapper.itemInfo.DMart_Order__c LIMIT 1];
                if (!orders.isEmpty()) wrapper.orderInfo = orders[0];
            }

            if (wrapper.itemInfo.Product_dmart__c != null) {
                List<Product_dmart__c> products = [SELECT Id, Name, Category__c, Stock_Quantity__c FROM Product_dmart__c WHERE Id = :wrapper.itemInfo.Product_dmart__c LIMIT 1];
                if (!products.isEmpty()) wrapper.productInfo = products[0];
            }
        }
        return wrapper;
    }

    public class ActivityLogDataWrapper {
        @AuraEnabled public Activity_Log__c logInfo;
        @AuraEnabled public Dmart_User__c userInfo;
    }

    @AuraEnabled(cacheable=true)
    public static ActivityLogDataWrapper getActivityLogData(Id recordId) {
        ActivityLogDataWrapper wrapper = new ActivityLogDataWrapper();
        if (recordId == null) return wrapper;

        List<Activity_Log__c> logs = [
            SELECT Id, Name, Action__c, Path__c, Details__c, Timestamp__c, Contact_Id__c, CreatedDate
            FROM Activity_Log__c
            WHERE Id = :recordId
            LIMIT 1
        ];

        if (!logs.isEmpty()) {
            wrapper.logInfo = logs[0];

            if (String.isNotBlank(wrapper.logInfo.Contact_Id__c)) {
                try {
                    Id userId = (Id) wrapper.logInfo.Contact_Id__c;
                    List<Dmart_User__c> users = [SELECT Id, Name, Email__c FROM Dmart_User__c WHERE Id = :userId LIMIT 1];
                    if (!users.isEmpty()) wrapper.userInfo = users[0];
                } catch (Exception e) {
                    // Contact_Id__c wasn't a valid ID
                }
            }
        }
        return wrapper;
    }
}
