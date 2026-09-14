@RestResource(urlMapping='/dmart/products')
global with sharing class DmartProductAPI {

    @HttpGet
    global static List<Product__c> getProducts() {
        return [SELECT Id, Name, Price__c, Stock__c, Image_URL__c FROM Product__c];
    }

    @HttpPost
    global static String addProduct() {
        RestRequest req = RestContext.request;
        String body = req.requestBody.toString();
        Product__c p = (Product__c) JSON.deserialize(body, Product__c.class);
        insert p;
        return 'Product Added Successfully';
    }
}