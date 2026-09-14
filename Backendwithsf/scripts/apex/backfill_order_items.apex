List<DMart_Order_Item__c> itemsToUpdate = new List<DMart_Order_Item__c>();

// Fetch all order items that don't have a lookup populated
List<DMart_Order_Item__c> items = [SELECT Id, Product_Name__c, Product_dmart__c FROM DMart_Order_Item__c WHERE Product_dmart__c = NULL];
Set<String> productNames = new Set<String>();

for (DMart_Order_Item__c item : items) {
    if (String.isNotBlank(item.Product_Name__c)) {
        productNames.add(item.Product_Name__c);
    }
}

// Map Names to Product IDs
Map<String, Id> nameToProductId = new Map<String, Id>();
for (Product_dmart__c prod : [SELECT Id, Name FROM Product_dmart__c WHERE Name IN :productNames]) {
    nameToProductId.put(prod.Name, prod.Id);
}

// Link them up
for (DMart_Order_Item__c item : items) {
    if (String.isNotBlank(item.Product_Name__c) && nameToProductId.containsKey(item.Product_Name__c)) {
        item.Product_dmart__c = nameToProductId.get(item.Product_Name__c);
        itemsToUpdate.add(item);
    }
}

if (!itemsToUpdate.isEmpty()) {
    update itemsToUpdate;
    System.debug('Updated ' + itemsToUpdate.size() + ' order items with product lookups.');
}
