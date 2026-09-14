@RestResource(urlMapping='/DmartProductAPI/*')
global without sharing class DmartProduct{

    global class ProductWrapper {
        public String  id;
        public String  name;
        public Decimal price;
        public Decimal mrp;
        public String  cat;
        public String  image;
        public String  emoji;
        public String  badge;

        public ProductWrapper(Product_dmart__c p) {
            this.id    = p.Id;
            this.name  = p.Name;
            this.price = p.Price__c != null ? p.Price__c : 0;
            this.mrp   = p.MRP__c   != null ? p.MRP__c   : 0;
            this.cat   = p.Category__c  != null ? p.Category__c  : 'All';
            this.image = p.Image_URL__c != null ? p.Image_URL__c : '';
            this.emoji = p.Emoji__c     != null ? p.Emoji__c     : '';
            this.badge = p.Badge__c     != null ? p.Badge__c     : '';
        }
    }

    global class ApiResponse {
        public Boolean success;
        public String  message;
        public Object  data;
        public ApiResponse(Boolean s, String m, Object d) {
            success = s; message = m; data = d;
        }
    }

    @HttpGet
    global static void doGet() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String recordId = req.requestURI.substringAfterLast('/');

            if (String.isNotBlank(recordId) && recordId != 'DmartProductAPI') {
                List<Product_dmart__c> prods = [
                    SELECT Id, Name, Price__c, MRP__c, Category__c,
                           Image_URL__c, Emoji__c, Badge__c
                    FROM   Product_dmart__c
                    WHERE  Id = :recordId
                    LIMIT  1
                ];
                if (prods.isEmpty()) {
                    res.statusCode = 404;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Product not found', null)));
                    return;
                }
                res.statusCode = 200;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'OK', new ProductWrapper(prods[0]))));
                return;
            }

            List<Product_dmart__c> allProds = [
                SELECT Id, Name, Price__c, MRP__c, Category__c,
                       Image_URL__c, Emoji__c, Badge__c
                FROM   Product_dmart__c
                WHERE  Is_Active__c = true
                ORDER BY Name
            ];

            List<ProductWrapper> result = new List<ProductWrapper>();
            for (Product_dmart__c p : allProds) {
                result.add(new ProductWrapper(p));
            }

            res.statusCode = 200;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'OK', result)));

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, e.getMessage(), null)));
        }
    }
}