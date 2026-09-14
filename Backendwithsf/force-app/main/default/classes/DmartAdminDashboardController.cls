public with sharing class DmartAdminDashboardController {
    
    @AuraEnabled(cacheable=true)
    public static List<Dmart_User__c> getAllUsers() {
        return [
            SELECT Id, Name, Email__c, Phone__c, Formatted_Address__c, Address__c, CreatedDate
            FROM Dmart_User__c
            ORDER BY CreatedDate DESC
        ];
    }
    
    public class UserDetailWrapper {
        @AuraEnabled public List<DMart_Order__c> orders;
        @AuraEnabled public List<Activity_Log__c> activityLogs;
    }
    
    @AuraEnabled(cacheable=true)
    public static UserDetailWrapper getUserData(Id userId) {
        UserDetailWrapper wrapper = new UserDetailWrapper();
        if (userId == null) {
            wrapper.orders = new List<DMart_Order__c>();
            wrapper.activityLogs = new List<Activity_Log__c>();
            return wrapper;
        }
        
        wrapper.orders = [
            SELECT Id, Name, order_Id__c, Total_Amount__c, Order_Status__c, Payment_Status__c, CreatedDate,
                (SELECT Id, Name, Product_Name__c, Quantity__c, Price__c FROM DMart_Order_Items__r)
            FROM DMart_Order__c
            WHERE Dmart_User__c = :userId
            ORDER BY CreatedDate DESC
        ];
        
        String contactIdStr = String.valueOf(userId);
        wrapper.activityLogs = [
            SELECT Id, Action__c, Details__c, Path__c, Timestamp__c, CreatedDate
            FROM Activity_Log__c
            WHERE Contact_Id__c = :contactIdStr
            ORDER BY CreatedDate DESC
            LIMIT 200
        ];
        
        return wrapper;
    }

    public class DashboardSummaryWrapper {
        @AuraEnabled public Integer totalUsers;
        @AuraEnabled public Integer totalProducts;
        @AuraEnabled public Integer totalOrders;
        @AuraEnabled public Decimal revenue;
        
        @AuraEnabled public List<Dmart_User__c> recentUsers;
        @AuraEnabled public List<Product_dmart__c> recentProducts;
        @AuraEnabled public List<DMart_Order__c> recentOrders;
        @AuraEnabled public List<Activity_Log__c> recentActivities;
        @AuraEnabled public List<Product_dmart__c> lowStockProducts;
        
        @AuraEnabled public List<StatusCount> orderStatusCounts;
        @AuraEnabled public List<CategoryCount> categoryCounts;
    }
    
    public class StatusCount {
        @AuraEnabled public String status;
        @AuraEnabled public Integer count;
        public StatusCount(String status, Integer count) {
            this.status = status;
            this.count = count;
        }
    }
    
    public class CategoryCount {
        @AuraEnabled public String category;
        @AuraEnabled public Integer count;
        public CategoryCount(String category, Integer count) {
            this.category = category;
            this.count = count;
        }
    }

    @AuraEnabled(cacheable=true)
    public static DashboardSummaryWrapper getDashboardSummary() {
        DashboardSummaryWrapper summary = new DashboardSummaryWrapper();
        
        // 1. KPI Metrics
        summary.totalUsers = [SELECT COUNT() FROM Dmart_User__c];
        summary.totalProducts = [SELECT COUNT() FROM Product_dmart__c];
        summary.totalOrders = [SELECT COUNT() FROM DMart_Order__c];
        
        AggregateResult[] revResult = [SELECT SUM(Total_Amount__c) rev FROM DMart_Order__c];
        summary.revenue = 0.00;
        if (revResult != null && !revResult.isEmpty() && revResult[0].get('rev') != null) {
            summary.revenue = (Decimal) revResult[0].get('rev');
        }
        
        // 2. Recent Lists
        summary.recentUsers = [
            SELECT Id, Name, Email__c, Phone__c, Formatted_Address__c, CreatedDate 
            FROM Dmart_User__c 
            ORDER BY CreatedDate DESC 
            LIMIT 5
        ];
        
        summary.recentProducts = [
            SELECT Id, Name, Category__c, Price__c, Stock_Quantity__c, CreatedDate 
            FROM Product_dmart__c 
            ORDER BY CreatedDate DESC 
            LIMIT 5
        ];
        
        summary.recentOrders = [
            SELECT Id, Name, order_Id__c, Total_Amount__c, Order_Status__c, Payment_Status__c, CreatedDate
            FROM DMart_Order__c 
            ORDER BY CreatedDate DESC 
            LIMIT 5
        ];
        
        summary.recentActivities = [
            SELECT Id, Action__c, Details__c, Path__c, Timestamp__c, CreatedDate 
            FROM Activity_Log__c 
            ORDER BY CreatedDate DESC 
            LIMIT 10
        ];
        
        // 3. Low Stock alert
        summary.lowStockProducts = [
            SELECT Id, Name, Category__c, Price__c, Stock_Quantity__c 
            FROM Product_dmart__c 
            WHERE Stock_Quantity__c < 15 
            ORDER BY Stock_Quantity__c ASC 
            LIMIT 5
        ];
        
        // 4. Order status grouping for charts
        summary.orderStatusCounts = new List<StatusCount>();
        for (AggregateResult ar : [SELECT Order_Status__c status, COUNT(Id) cnt FROM DMart_Order__c GROUP BY Order_Status__c]) {
            String statusVal = ar.get('status') != null ? (String) ar.get('status') : 'Unknown';
            Integer countVal = (Integer) ar.get('cnt');
            summary.orderStatusCounts.add(new StatusCount(statusVal, countVal));
        }
        
        // 5. Category grouping for charts
        summary.categoryCounts = new List<CategoryCount>();
        for (AggregateResult ar : [SELECT Category__c cat, COUNT(Id) cnt FROM Product_dmart__c GROUP BY Category__c]) {
            String catVal = ar.get('cat') != null ? (String) ar.get('cat') : 'Uncategorized';
            Integer countVal = (Integer) ar.get('cnt');
            summary.categoryCounts.add(new CategoryCount(catVal, countVal));
        }
        
        return summary;
    }
}
