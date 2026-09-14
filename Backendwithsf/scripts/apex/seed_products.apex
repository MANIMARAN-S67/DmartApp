delete [SELECT Id FROM Product_dmart__c]; // Clean up first just in case

List<Product_dmart__c> prods = new List<Product_dmart__c>{
    new Product_dmart__c(Id__c=1, Name='Fresh Red Apples', Price__c=120, MRP__c=150, Category__c='Fruits', Image_URL__c='https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', Emoji__c='🍎', Badge__c='20% OFF', Is_Active__c=true, Stock_Quantity__c=100),
    new Product_dmart__c(Id__c=2, Name='Amul Milk 1L', Price__c=60, MRP__c=65, Category__c='Dairy', Image_URL__c='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', Emoji__c='🥛', Badge__c='8% OFF', Is_Active__c=true, Stock_Quantity__c=50),
    new Product_dmart__c(Id__c=3, Name='Premium Basmati Rice', Price__c=450, MRP__c=500, Category__c='Groceries', Image_URL__c='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', Emoji__c='🌾', Badge__c='10% OFF', Is_Active__c=true, Stock_Quantity__c=10),
    new Product_dmart__c(Id__c=4, Name='Classic Salted Chips', Price__c=20, MRP__c=20, Category__c='Snacks', Image_URL__c='https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', Emoji__c='🍟', Badge__c='', Is_Active__c=true, Stock_Quantity__c=200),
    new Product_dmart__c(Id__c=5, Name='Coca Cola 500ml', Price__c=40, MRP__c=45, Category__c='Beverages', Image_URL__c='https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', Emoji__c='🥤', Badge__c='5/5 Rating', Is_Active__c=true, Stock_Quantity__c=80),
    new Product_dmart__c(Id__c=6, Name='Multigrain Bread', Price__c=45, MRP__c=55, Category__c='Groceries', Image_URL__c='https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', Product_Image_URL__c='https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', Emoji__c='🍞', Badge__c='Best Seller', Is_Active__c=true, Stock_Quantity__c=5)
};

insert prods;
System.debug('Inserted ' + prods.size() + ' products.');
