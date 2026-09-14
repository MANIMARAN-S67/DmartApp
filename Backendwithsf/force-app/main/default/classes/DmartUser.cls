@RestResource(urlMapping='/DmartUserAPI/*')
global with sharing class DmartUser {

    global class RegisterRequest {
        public String firstName;
        public String lastName;
        public String email;
        public String phone;
        public String password;
    }

    global class LoginRequest {
        public String identifier;
        public String password;
    }

    global class UserWrapper {
        public String id;
        public String name;
        public String email;
        public String phone;

        public UserWrapper(Dmart_User__c u) {
            this.id    = u.Id;
            this.name  = u.Name;
            this.email = u.Email__c;
            this.phone = u.Phone__c;
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

    /**
     * Hash a password using SHA-256 and return lowercase hex string.
     * This must match the Node.js crypto.createHash('sha256') output.
     */
    private static String hashPassword(String plaintext) {
        if (String.isBlank(plaintext)) {
            return '';
        }
        Blob digest = Crypto.generateDigest('SHA-256', Blob.valueOf(plaintext));
        return EncodingUtil.convertToHex(digest);
    }

    @future
    public static void sendWelcomeEmail(String userEmail, String userName) {
        if (String.isBlank(userEmail)) return;
        String firstName = userName != null ? userName.split(' ')[0] : 'there';
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { userEmail });
        mail.setSubject('🎉 Welcome to DMart Online — Your account is ready!');
        mail.setHtmlBody(
            '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:30px;">' +
            '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.1);">' +
            '<div style="background:linear-gradient(135deg,#0d47a1,#1e88e5);padding:36px;text-align:center;">' +
            '<h1 style="color:#fff;margin:0;font-size:28px;">🛒 DMart Online</h1></div>' +
            '<div style="padding:32px;">' +
            '<p style="font-size:20px;color:#1a1a1a;">Hi <strong>' + firstName + '</strong>, welcome aboard! 🎉</p>' +
            '<p style="font-size:14px;color:#555;">Your account is ready. Start shopping at DMart!</p>' +
            '<p style="font-size:13px;color:#888;">Account: <strong>' + userEmail + '</strong></p>' +
            '<div style="text-align:center;margin:24px 0;">' +
            '<a href="https://dmart-auth-1e37a.web.app" style="background:#0d47a1;color:#fff;padding:12px 36px;border-radius:30px;text-decoration:none;font-weight:700;">Start Shopping</a></div></div>' +
            '<div style="background:#f0f4ff;padding:16px;text-align:center;font-size:12px;color:#888;">© 2025 DMart Online</div></div></body></html>'
        );
        mail.setPlainTextBody('Welcome to DMart, ' + firstName + '! Your account email: ' + userEmail);
        try { Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); }
        catch (Exception e) { System.debug('Email error: ' + e.getMessage()); }
    }

    @future
    public static void sendLoginEmail(String userEmail, String userName) {
        if (String.isBlank(userEmail)) return;
        String firstName = userName != null ? userName.split(' ')[0] : 'there';
        String loginTime = System.now().format('dd MMM yyyy, hh:mm a');
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { userEmail });
        mail.setSubject('👋 Welcome back to DMart — Login Successful');
        mail.setHtmlBody(
            '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:30px;">' +
            '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.1);">' +
            '<div style="background:linear-gradient(135deg,#1b5e20,#43a047);padding:36px;text-align:center;">' +
            '<h1 style="color:#fff;margin:0;font-size:28px;">🛒 DMart Online</h1></div>' +
            '<div style="padding:32px;">' +
            '<p style="font-size:20px;color:#1a1a1a;">👋 Welcome back, <strong>' + firstName + '</strong>!</p>' +
            '<p style="font-size:14px;color:#555;">You successfully logged in to your DMart account.</p>' +
            '<p style="font-size:13px;color:#888;">Account: <strong>' + userEmail + '</strong> &nbsp;|&nbsp; Time: ' + loginTime + '</p>' +
            '<div style="background:#fff8e1;border-left:4px solid #fbc02d;border-radius:6px;padding:12px;margin:16px 0;font-size:13px;color:#555;">' +
            '⚠️ Not you? Contact our support immediately.</div></div>' +
            '<div style="background:#f9fbe7;padding:16px;text-align:center;font-size:12px;color:#888;">© 2025 DMart Online</div></div></body></html>'
        );
        mail.setPlainTextBody('Welcome back, ' + firstName + '! Login at: ' + loginTime + '. Account: ' + userEmail);
        try { Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); }
        catch (Exception e) { System.debug('Login email error: ' + e.getMessage()); }
    }

    @HttpGet
    global static void doGet() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String userId = req.requestURI.substringAfterLast('/');

            if (String.isBlank(userId) || userId == 'DmartUserAPI') {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'User Id is required', null)));
                return;
            }

            List<Dmart_User__c> users = [
                SELECT Id, Name, Email__c, Phone__c
                FROM   Dmart_User__c
                WHERE  Id = :userId
                LIMIT  1
            ];

            if (users.isEmpty()) {
                res.statusCode = 404;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'User not found', null)));
                return;
            }

            res.statusCode = 200;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'OK', new UserWrapper(users[0]))));

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, e.getMessage(), null)));
        }
    }

    @HttpPost
    global static void doPost() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String action = req.requestURI.substringAfterLast('/');
            String body   = req.requestBody.toString();

            if (action == 'register') {
                RegisterRequest payload = (RegisterRequest) JSON.deserialize(body, RegisterRequest.class);

                if (String.isBlank(payload.firstName) || String.isBlank(payload.email)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'First Name and Email are required', null)));
                    return;
                }

                List<Dmart_User__c> existing = [SELECT Id FROM Dmart_User__c WHERE Email__c = :payload.email LIMIT 1];
                if (!existing.isEmpty()) {
                    res.statusCode = 409;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Email already registered', null)));
                    return;
                }

                Dmart_User__c newUser = new Dmart_User__c(
                    Name       = payload.firstName + ' ' + (payload.lastName != null ? payload.lastName : ''),
                    Email__c   = payload.email,
                    Phone__c   = payload.phone != null ? payload.phone : ''
                );
                insert newUser;

                // Send welcome email for new user
                sendWelcomeEmail(newUser.Email__c, newUser.Name);

                res.statusCode = 201;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'User registered successfully', new UserWrapper(newUser))));
                return;
            }

            if (action == 'login') {
                LoginRequest payload = (LoginRequest) JSON.deserialize(body, LoginRequest.class);

                if (String.isBlank(payload.identifier)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Email or Phone is required', null)));
                    return;
                }

                String id = payload.identifier;
                List<Dmart_User__c> users = [
                    SELECT Id, Name, Email__c, Phone__c
                    FROM   Dmart_User__c
                    WHERE  Email__c = :id OR Phone__c = :id
                    LIMIT  1
                ];

                if (users.isEmpty()) {
                    res.statusCode = 404;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'User not found', null)));
                    return;
                }

                // Password verification removed as field is deleted

                res.statusCode = 200;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'Login successful', new UserWrapper(users[0]))));
                // Send login notification email
                sendLoginEmail(users[0].Email__c, users[0].Name);
                return;
            }

            res.statusCode = 400;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Unknown action: ' + action, null)));

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, e.getMessage(), null)));
        }
    }
}