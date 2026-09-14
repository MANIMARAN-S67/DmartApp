@RestResource(urlMapping='/DmartOrderAPI/*')
global without sharing class DmartOrderAPI {

    /* ─── Wrappers ─── */
    global class OrderItem {
        public String  name;
        public Integer qty;
        public Decimal price;
    }

    global class CreateOrderRequest {
        public String         contactId; // Actually the Dmart_User__c ID
        public String         sfContactId; // The standard Contact ID (optional)
        public Decimal        totalAmount;
        public String         paymentStatus; // Payment Status (e.g. 'Paid' or 'Pending')
        public List<OrderItem> items;
    }

    global class OrderWrapper {
        public String  id;
        public String  status;
        public Decimal totalAmount;
        public String  orderItems; // Can keep as a summary or full JSON string, let's keep summary for easy reading
        public String  createdDate;

        public OrderWrapper(DMart_Order__c o) {
            this.id          = o.Id;
            this.status      = o.Order_Status__c;
            this.totalAmount = o.Total_Amount__c;
            // Build item summary string from child records if queried
            String summary = '';
            if (o.DMart_Order_Items__r != null) {
                List<String> parts = new List<String>();
                for (DMart_Order_Item__c item : o.DMart_Order_Items__r) {
                    parts.add(item.Product_Name__c + ' (x' + item.Quantity__c + ')');
                }
                summary = String.join(parts, ', ');
            }
            this.orderItems  = summary;
            this.createdDate = String.valueOf(o.CreatedDate);
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

    @future
    public static void sendOrderConfirmationEmail(String orderId) {
        if (String.isBlank(orderId)) return;
        
        List<DMart_Order__c> orders = [
            SELECT Id, Name, order_Id__c, Order_Status__c, Total_Amount__c, CreatedDate,
                   Dmart_User__r.Name, Dmart_User__r.Email__c, Contact__r.Email, Contact__r.Name,
                   (SELECT Product_Name__c, Quantity__c, Price__c FROM DMart_Order_Items__r)
            FROM DMart_Order__c
            WHERE Id = :orderId
            LIMIT 1
        ];
        
        if (orders.isEmpty()) return;
        DMart_Order__c ord = orders[0];
        
        // Use either Dmart_User__c or Contact__c for email
        String userEmail = ord.Dmart_User__r != null ? ord.Dmart_User__r.Email__c : (ord.Contact__r != null ? ord.Contact__r.Email : null);
        if (String.isBlank(userEmail)) return;
        
        String userName = ord.Dmart_User__r != null ? ord.Dmart_User__r.Name : (ord.Contact__r != null ? ord.Contact__r.Name : 'Customer');
        String firstName = userName != null ? userName.split(' ')[0] : 'there';
        String orderNumber = ord.order_Id__c != null ? ord.order_Id__c : ord.Name;
        
        String itemsHtml = '';
        if (ord.DMart_Order_Items__r != null) {
            for (DMart_Order_Item__c item : ord.DMart_Order_Items__r) {
                itemsHtml += '<tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;">' + item.Product_Name__c + 
                             ' (x' + item.Quantity__c + ')</td><td align="right" style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;">₹' + 
                             item.Price__c + '</td></tr>';
            }
        }
        
        String htmlBody =
            '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:30px;">' +
            '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.1);">' +
            '<div style="background:linear-gradient(135deg,#e65100,#ef6c00);padding:36px;text-align:center;">' +
            '<h1 style="color:#fff;margin:0;font-size:28px;">🛒 DMart Online</h1>' +
            '<p style="color:#ffe0b2;margin:8px 0 0;font-size:14px;">Order Confirmation</p></div>' +
            '<div style="padding:32px;">' +
            '<p style="font-size:20px;color:#1a1a1a;">Hi <strong>' + firstName + '</strong>,</p>' +
            '<p style="font-size:15px;color:#444;">Thank you for your order! Here are the details:</p>' +
            '<div style="background:#fff3e0;border-left:4px solid #ef6c00;border-radius:6px;padding:16px;margin:20px 0;">' +
            '<table width="100%" cellpadding="0" cellspacing="0">' +
            '<tr><td style="color:#555;padding:4px 0;font-size:14px;"><strong>Order ID:</strong></td><td style="color:#333;font-size:14px;">' + orderNumber + '</td></tr>' +
            '<tr><td style="color:#555;padding:4px 0;font-size:14px;"><strong>Status:</strong></td><td style="color:#333;font-size:14px;">' + ord.Order_Status__c + '</td></tr>' +
            '<tr><td style="color:#555;padding:4px 0;font-size:14px;"><strong>Total Amount:</strong></td><td style="color:#333;font-size:14px;">₹' + ord.Total_Amount__c + '</td></tr>' +
            '</table></div>' +
            '<h3 style="color:#1a1a1a;margin-bottom:12px;font-size:16px;">Order Summary</h3>' +
            '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#444;margin-bottom:24px;">' +
            itemsHtml +
            '</table>' +
            '<div style="text-align:center;margin:32px 0;">' +
            '<a href="https://dmart-auth-1e37a.web.app" style="background:#ef6c00;color:#fff;padding:14px 40px;border-radius:30px;text-decoration:none;font-weight:700;display:inline-block;">Track Your Order</a></div>' +
            '</div>' +
            '<div style="background:#fafafa;padding:16px;text-align:center;font-size:12px;color:#888;">© 2025 DMart Online</div></div></body></html>';

        String plainText = 'Hi ' + firstName + ',\n\nThank you for your order! Order ID: ' + orderNumber + '\nTotal Amount: ₹' + ord.Total_Amount__c + '\n\nTrack your order online.\n\nDMart Team';

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { userEmail });
        mail.setSubject('🛍️ Order Confirmation — DMart Online (' + orderNumber + ')');
        mail.setHtmlBody(htmlBody);
        mail.setPlainTextBody(plainText);
        try { Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); }
        catch (Exception e) { System.debug('Order email error: ' + e.getMessage()); }
    }

    /* ─── GET  /DmartOrderAPI/{userId} — fetch orders for a user ─── */
    @HttpGet
    global static void doGet() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String userId = req.requestURI.substringAfterLast('/');

            if (String.isBlank(userId) || userId == 'DmartOrderAPI') {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'User Id is required', null))
                );
                return;
            }

            List<DMart_Order__c> orders = [
                SELECT Id, Order_Status__c, Total_Amount__c, CreatedDate,
                       (SELECT Product_Name__c, Quantity__c, Price__c FROM DMart_Order_Items__r)
                FROM   DMart_Order__c
                WHERE  Dmart_User__c = :userId
                ORDER BY CreatedDate DESC
            ];

            List<OrderWrapper> result = new List<OrderWrapper>();
            for (DMart_Order__c o : orders) {
                result.add(new OrderWrapper(o));
            }

            res.statusCode = 200;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(true, 'OK', result))
            );

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, e.getMessage(), null))
            );
        }
    }

    /* ─── POST  /DmartOrderAPI/ — create a new order ─── */
    @HttpPost
    global static void doPost() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        Savepoint sp = Database.setSavepoint();
        try {
            String body = req.requestBody.toString();
            CreateOrderRequest payload =
                (CreateOrderRequest) JSON.deserialize(body, CreateOrderRequest.class);

            // We require either Dmart_User__c (contactId) or Contact__c (sfContactId)
            if (String.isBlank(payload.contactId) && String.isBlank(payload.sfContactId)) {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'contactId or sfContactId is required', null))
                );
                return;
            }

            DMart_Order__c newOrder = new DMart_Order__c(
                Dmart_User__c     = String.isNotBlank(payload.contactId) ? payload.contactId : null,
                Contact__c        = String.isNotBlank(payload.sfContactId) ? payload.sfContactId : null,
                Total_Amount__c   = payload.totalAmount != null ? payload.totalAmount : 0,
                Order_Status__c   = 'Pending',
                Payment_Status__c = String.isNotBlank(payload.paymentStatus) ? payload.paymentStatus : 'Pending'
            );
            insert newOrder;

            if (payload.items != null && !payload.items.isEmpty()) {
                // Link order items to Product_dmart__c records via Lookup
                Set<String> productNames = new Set<String>();
                for (OrderItem item : payload.items) {
                    productNames.add(item.name);
                }
                
                Map<String, Id> nameToProductId = new Map<String, Id>();
                for (Product_dmart__c prod : [SELECT Id, Name FROM Product_dmart__c WHERE Name IN :productNames]) {
                    nameToProductId.put(prod.Name, prod.Id);
                }

                List<DMart_Order_Item__c> orderItemsToInsert = new List<DMart_Order_Item__c>();
                for (OrderItem item : payload.items) {
                    DMart_Order_Item__c orderItem = new DMart_Order_Item__c();
                    orderItem.DMart_Order__c = newOrder.Id;
                    orderItem.Product_Name__c = item.name;
                    orderItem.Quantity__c = item.qty;
                    orderItem.Price__c = item.price;
                    
                    if (nameToProductId.containsKey(item.name)) {
                        orderItem.Product_dmart__c = nameToProductId.get(item.name);
                    }
                    
                    orderItemsToInsert.add(orderItem);
                }
                insert orderItemsToInsert;
            }

            // Re-query to get CreatedDate and children
            newOrder = [
                SELECT Id, Order_Status__c, Total_Amount__c, CreatedDate,
                       (SELECT Product_Name__c, Quantity__c, Price__c FROM DMart_Order_Items__r)
                FROM DMart_Order__c 
                WHERE Id = :newOrder.Id LIMIT 1
            ];

            // Send Order Confirmation Email asynchronously
            sendOrderConfirmationEmail(newOrder.Id);

            res.statusCode = 201;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(true, 'Order created successfully',
                    new OrderWrapper(newOrder)))
            );

        } catch (Exception e) {
            Database.rollback(sp);
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, e.getMessage(), null))
            );
        }
    }
}