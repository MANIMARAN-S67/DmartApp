/**
 * DmartUserAPI
 * Apex REST Controller — Users (Register / Login / Get Profile)
 * URL: /services/apexrest/DmartUserAPI/
 *
 * ENDPOINTS:
 *   POST /services/apexrest/DmartUserAPI/register   → Creates a new Dmart_User__c
 *   POST /services/apexrest/DmartUserAPI/login      → Authenticates by email or phone
 *   GET  /services/apexrest/DmartUserAPI/{id}       → Returns user profile by record Id
 */
@RestResource(urlMapping='/DmartUserAPI_v2/*')
global without sharing class DmartUserAPI_v2 {

    private static final String FIREBASE_API_KEY = 'AIzaSyBf-lk3GW-xcptx5J0v3rXCSkY-KeF6Kdw';

    /* ─── Request / Response wrappers ─── */
    global class RegisterRequest {
        public String firstName;
        public String lastName;
        public String email;
        public String phone;
        public String password;
    }

    global class LoginRequest {
        public String identifier; // email OR phone
        public String password;   // optional — not validated server-side for now
    }

    global class GoogleLoginRequest {
        public String idToken;
    }

    global class UpdateProfileRequest {
        public String userId;
        public String phone;
        public String address;
    }

    global class UserWrapper {
        public String id;
        public String name;
        public String email;
        public String phone;
        public String address;

        public UserWrapper(Dmart_User__c u) {
            this.id    = u.Id;
            this.name  = u.Name;
            this.email = u.Email__c;
            this.phone = u.Phone__c;
            this.address = u.Address__c;
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

    /* ─────────────────────────────────────────────────────────────
     *  Email Helpers  (called via @future to avoid mixed-DML limits)
     * ───────────────────────────────────────────────────────────── */

    /** Sent when a brand-new user registers (any auth method). */
    @future
    public static void sendWelcomeEmail(String userEmail, String userName) {
        if (String.isBlank(userEmail)) return;
        String firstName = userName != null ? userName.split(' ')[0] : 'there';

        String htmlBody =
            '<!DOCTYPE html>' +
            '<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<title>Welcome to DMart</title></head>' +
            '<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">' +
            '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">' +
            '<tr><td align="center">' +
            '<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.1);">' +

            '<!-- HEADER -->' +
            '<tr><td style="background:linear-gradient(135deg,#0d47a1 0%,#1565c0 50%,#1e88e5 100%);padding:40px 40px 30px;text-align:center;">' +
            '<h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:2px;">🛒 DMart Online</h1>' +
            '<p style="margin:8px 0 0;color:#bbdefb;font-size:14px;letter-spacing:1px;">Your Smart Shopping Partner</p>' +
            '</td></tr>' +

            '<!-- WELCOME BANNER -->' +
            '<tr><td style="background:#e3f2fd;padding:20px 40px;text-align:center;border-bottom:2px solid #bbdefb;">' +
            '<p style="margin:0;font-size:18px;color:#0d47a1;font-weight:700;">🎉 Welcome to the DMart Family!</p>' +
            '</td></tr>' +

            '<!-- BODY -->' +
            '<tr><td style="padding:36px 40px;">' +
            '<p style="font-size:20px;color:#1a1a1a;margin:0 0 12px;">Hi <strong>' + firstName + '</strong>,</p>' +
            '<p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">Your account has been created successfully. We\'re thrilled to have you on board!</p>' +

            '<div style="background:#f0f4ff;border-left:4px solid #1565c0;border-radius:6px;padding:18px 20px;margin-bottom:24px;">' +
            '<p style="margin:0;font-size:14px;color:#333;"><strong>Account Email:</strong> ' + userEmail + '</p>' +
            '</div>' +

            '<p style="font-size:15px;color:#444;margin:0 0 8px;">Here\'s what you can do on DMart:</p>' +
            '<ul style="font-size:14px;color:#555;line-height:2;padding-left:20px;">' +
            '<li>🛍️ Shop from 1000+ products across all categories</li>' +
            '<li>📦 Track your orders in real-time</li>' +
            '<li>💳 Enjoy fast and secure checkout</li>' +
            '<li>🏠 Save multiple delivery addresses</li>' +
            '</ul>' +

            '<div style="text-align:center;margin:32px 0;">' +
            '<a href="https://dmart-auth-1e37a.web.app" style="background:linear-gradient(135deg,#0d47a1,#1e88e5);color:#fff;text-decoration:none;padding:14px 40px;border-radius:30px;font-size:16px;font-weight:700;display:inline-block;">Start Shopping Now →</a>' +
            '</div>' +
            '</td></tr>' +

            '<!-- FOOTER -->' +
            '<tr><td style="background:#f0f4ff;padding:20px 40px;text-align:center;border-top:1px solid #e3e8f0;">' +
            '<p style="margin:0;font-size:12px;color:#888;">© 2025 DMart Online. All rights reserved.</p>' +
            '<p style="margin:6px 0 0;font-size:12px;color:#888;">This email was sent to <strong>' + userEmail + '</strong> because you created an account with us.</p>' +
            '</td></tr>' +

            '</table>' +
            '</td></tr></table>' +
            '</body></html>';

        String plainText =
            'Welcome to DMart Online, ' + firstName + '!\n\n' +
            'Your account has been created with email: ' + userEmail + '\n\n' +
            'Start shopping at: https://dmart-auth-1e37a.web.app\n\n' +
            'Thank you,\nDMart Team';

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { userEmail });
        mail.setSubject('🎉 Welcome to DMart Online — Your account is ready!');
        mail.setHtmlBody(htmlBody);
        mail.setPlainTextBody(plainText);
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } catch (Exception e) {
            System.debug('Welcome email failed: ' + e.getMessage());
        }
    }

    /** Sent on every subsequent login (email/phone/Google). */
    @future
    public static void sendLoginEmail(String userEmail, String userName) {
        if (String.isBlank(userEmail)) return;
        String firstName = userName != null ? userName.split(' ')[0] : 'there';
        String loginTime = System.now().format('dd MMM yyyy, hh:mm a');

        String htmlBody =
            '<!DOCTYPE html>' +
            '<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<title>DMart Login</title></head>' +
            '<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">' +
            '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">' +
            '<tr><td align="center">' +
            '<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.1);">' +

            '<!-- HEADER -->' +
            '<tr><td style="background:linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#43a047 100%);padding:40px 40px 30px;text-align:center;">' +
            '<h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:2px;">🛒 DMart Online</h1>' +
            '<p style="margin:8px 0 0;color:#c8e6c9;font-size:14px;letter-spacing:1px;">Secure Login Notification</p>' +
            '</td></tr>' +

            '<!-- BODY -->' +
            '<tr><td style="padding:36px 40px;">' +
            '<p style="font-size:20px;color:#1a1a1a;margin:0 0 12px;">👋 Welcome back, <strong>' + firstName + '</strong>!</p>' +
            '<p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">We noticed a successful login to your DMart account. If this was you, no action is needed.</p>' +

            '<div style="background:#f1f8e9;border:1px solid #c8e6c9;border-radius:8px;padding:20px;margin-bottom:24px;">' +
            '<table width="100%" cellpadding="0" cellspacing="0">' +
            '<tr><td style="font-size:13px;color:#555;padding:4px 0;"><strong>📧 Account:</strong></td><td style="font-size:13px;color:#333;">' + userEmail + '</td></tr>' +
            '<tr><td style="font-size:13px;color:#555;padding:4px 0;"><strong>🕒 Time:</strong></td><td style="font-size:13px;color:#333;">' + loginTime + '</td></tr>' +
            '</table>' +
            '</div>' +

            '<div style="background:#fff8e1;border-left:4px solid #fbc02d;border-radius:6px;padding:14px 18px;margin-bottom:24px;">' +
            '<p style="margin:0;font-size:13px;color:#555;">⚠️ <strong>Not you?</strong> If you did not login, please contact our support team immediately.</p>' +
            '</div>' +

            '<div style="text-align:center;margin:28px 0;">' +
            '<a href="https://dmart-auth-1e37a.web.app" style="background:linear-gradient(135deg,#1b5e20,#43a047);color:#fff;text-decoration:none;padding:14px 40px;border-radius:30px;font-size:16px;font-weight:700;display:inline-block;">Go to My Dashboard →</a>' +
            '</div>' +
            '</td></tr>' +

            '<!-- FOOTER -->' +
            '<tr><td style="background:#f9fbe7;padding:20px 40px;text-align:center;border-top:1px solid #dcedc8;">' +
            '<p style="margin:0;font-size:12px;color:#888;">© 2025 DMart Online. All rights reserved.</p>' +
            '<p style="margin:6px 0 0;font-size:12px;color:#888;">This is an automated security notification for <strong>' + userEmail + '</strong>.</p>' +
            '</td></tr>' +

            '</table>' +
            '</td></tr></table>' +
            '</body></html>';

        String plainText =
            'Welcome back to DMart, ' + firstName + '!\n\n' +
            'A successful login was detected on your account.\n' +
            'Email: ' + userEmail + '\n' +
            'Time: ' + loginTime + '\n\n' +
            'If this was not you, contact our support immediately.\n\n' +
            'Thank you,\nDMart Team';

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { userEmail });
        mail.setSubject('👋 Welcome back to DMart — Login Successful');
        mail.setHtmlBody(htmlBody);
        mail.setPlainTextBody(plainText);
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } catch (Exception e) {
            System.debug('Login email failed: ' + e.getMessage());
        }
    }

    /* ─── GET  /DmartUserAPI/{id} — fetch user profile ─── */
    @HttpGet
    global static void doGet() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String userId = req.requestURI.substringAfterLast('/');

            if (String.isBlank(userId) || userId == 'DmartUserAPI') {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'User Id is required', null))
                );
                return;
            }

            List<Dmart_User__c> users = [
                SELECT Id, Name, Email__c, Phone__c, Address__c
                FROM   Dmart_User__c
                WHERE  Id = :userId
                LIMIT  1
            ];

            if (users.isEmpty()) {
                res.statusCode = 404;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'User not found', null))
                );
                return;
            }

            res.statusCode = 200;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(true, 'OK', new UserWrapper(users[0])))
            );

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, e.getMessage(), null))
            );
        }
    }

    /* ─── POST  /DmartUserAPI/register  OR  /DmartUserAPI/login ─── */
    @HttpPost
    global static void doPost() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String action = req.requestURI.substringAfterLast('/');
            String body   = req.requestBody.toString();

            /* ── REGISTER ── */
            if (action == 'register') {
                RegisterRequest payload = (RegisterRequest) JSON.deserialize(body, RegisterRequest.class);

                if (String.isBlank(payload.firstName) || String.isBlank(payload.email)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'First Name and Email are required', null))
                    );
                    return;
                }

                // Prevent duplicate email
                List<Dmart_User__c> existing = [
                    SELECT Id FROM Dmart_User__c WHERE Email__c = :payload.email LIMIT 1
                ];
                if (!existing.isEmpty()) {
                    res.statusCode = 409;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'Email already registered', null))
                    );
                    return;
                }

                Dmart_User__c newUser = new Dmart_User__c(
                    Name      = payload.firstName + ' ' + (payload.lastName != null ? payload.lastName : ''),
                    Email__c  = payload.email,
                    Phone__c  = payload.phone != null ? payload.phone : ''
                );
                
                // Password field removed

                insert newUser;

                // Re-query to get all field values after insert
                newUser = [SELECT Id, Name, Email__c, Phone__c, Address__c FROM Dmart_User__c WHERE Id = :newUser.Id LIMIT 1];

                // Send HTML welcome email for new registration
                sendWelcomeEmail(newUser.Email__c, newUser.Name);

                res.statusCode = 201;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(true, 'User registered successfully',
                        new UserWrapper(newUser)))
                );
                return;
            }

            /* ── GOOGLE LOGIN (QUICKPLATE PATTERN) ── */
            if (action == 'google-login') {
                GoogleLoginRequest payload = (GoogleLoginRequest) JSON.deserialize(body, GoogleLoginRequest.class);

                if (String.isBlank(payload.idToken)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'idToken is required', null)));
                    return;
                }

                Http http = new Http();
                HttpRequest httpReq = new HttpRequest();
                httpReq.setEndpoint('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY);
                httpReq.setMethod('POST');
                httpReq.setHeader('Content-Type', 'application/json');
                httpReq.setBody('{"idToken":"' + payload.idToken + '"}');

                HttpResponse httpRes = http.send(httpReq);
                if (httpRes.getStatusCode() != 200) {
                    res.statusCode = 401;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Invalid Firebase Token', null)));
                    return;
                }

                Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(httpRes.getBody());
                List<Object> usersList = (List<Object>) responseMap.get('users');
                Map<String, Object> fbUser = (Map<String, Object>) usersList[0];

                String email = (String) fbUser.get('email');
                String displayName = (String) fbUser.get('displayName');
                String firebaseUid = (String) fbUser.get('localId');

                if (String.isBlank(email)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Email not found in token', null)));
                    return;
                }

                List<Dmart_User__c> existing = [
                    SELECT Id, Name, Email__c, Phone__c, Address__c, Firebase_UID__c 
                    FROM Dmart_User__c 
                    WHERE Email__c = :email 
                    LIMIT 1
                ];

                if (!existing.isEmpty()) {
                    if (existing[0].Firebase_UID__c != firebaseUid) {
                        existing[0].Firebase_UID__c = firebaseUid;
                        update existing[0];
                    }
                    res.statusCode = 200;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'Login successful', new UserWrapper(existing[0]))));
                    // Send login notification email for returning Google user
                    sendLoginEmail(existing[0].Email__c, existing[0].Name);
                    return;
                } else {
                    Dmart_User__c newUser = new Dmart_User__c(
                        Name = (displayName != null ? displayName : 'DMart User'),
                        Email__c = email,
                        Phone__c = '',
                        Firebase_UID__c = firebaseUid
                    );
                    insert newUser;

                    newUser = [SELECT Id, Name, Email__c, Phone__c, Address__c FROM Dmart_User__c WHERE Id = :newUser.Id LIMIT 1];
                    res.statusCode = 201;
                    res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'User registered via Google', new UserWrapper(newUser))));
                    // Send welcome email for first-time Google user
                    sendWelcomeEmail(newUser.Email__c, newUser.Name);
                    return;
                }
            }

            /* ── LOGIN ── */
            if (action == 'login') {
                LoginRequest payload = (LoginRequest) JSON.deserialize(body, LoginRequest.class);

                if (String.isBlank(payload.identifier)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'Email or Phone is required', null))
                    );
                    return;
                }

                String id = payload.identifier;
                String phoneNoPrefix = id.startsWith('+91') ? id.substring(3) : id;
                
                List<Dmart_User__c> users = [
                    SELECT Id, Name, Email__c, Phone__c, Address__c
                    FROM   Dmart_User__c
                    WHERE  Email__c = :id 
                       OR  Phone__c = :id 
                       OR  Phone__c = :phoneNoPrefix
                    LIMIT  1
                ];

                if (users.isEmpty()) {
                    res.statusCode = 404;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'User not found', null))
                    );
                    return;
                }

                // Password verification removed as field is deleted

                res.statusCode = 200;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(true, 'Login successful',
                        new UserWrapper(users[0])))
                );
                // Send login notification email for email/phone login
                sendLoginEmail(users[0].Email__c, users[0].Name);
                return;
            }

            /* ── UPDATE PROFILE ── */
            if (action == 'update-profile') {
                UpdateProfileRequest payload = (UpdateProfileRequest) JSON.deserialize(body, UpdateProfileRequest.class);
                
                if (String.isBlank(payload.userId)) {
                    res.statusCode = 400;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'User Id is required', null))
                    );
                    return;
                }
                
                List<Dmart_User__c> users = [SELECT Id, Name, Email__c, Phone__c, Address__c FROM Dmart_User__c WHERE Id = :payload.userId LIMIT 1];
                if (users.isEmpty()) {
                    res.statusCode = 404;
                    res.responseBody = Blob.valueOf(
                        JSON.serialize(new ApiResponse(false, 'User not found', null))
                    );
                    return;
                }
                
                users[0].Phone__c = payload.phone;
                users[0].Address__c = payload.address;
                
                try {
                    if (String.isNotBlank(payload.address)) {
                        List<Object> addressList = (List<Object>) JSON.deserializeUntyped(payload.address);
                        if (!addressList.isEmpty()) {
                            Map<String, Object> addrObj = (Map<String, Object>) addressList[0];
                            for (Object obj : addressList) {
                                Map<String, Object> a = (Map<String, Object>) obj;
                                if (a.get('default') == true) {
                                    addrObj = a;
                                    break;
                                }
                            }
                            String formatted = '';
                            if (addrObj.get('flat') != null) formatted += addrObj.get('flat') + ', ';
                            if (addrObj.get('street') != null) formatted += addrObj.get('street') + '\n';
                            if (addrObj.get('city') != null) formatted += addrObj.get('city') + ' - ';
                            if (addrObj.get('pin') != null) formatted += addrObj.get('pin');
                            
                            users[0].Formatted_Address__c = formatted.trim();
                        } else {
                            users[0].Formatted_Address__c = '';
                        }
                    } else {
                        users[0].Formatted_Address__c = '';
                    }
                } catch (Exception ex) {
                    System.debug('Error formatting address: ' + ex.getMessage());
                }
                
                update users[0];
                
                res.statusCode = 200;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(true, 'Profile updated successfully', new UserWrapper(users[0])))
                );
                return;
            }

            // Unknown action
            res.statusCode = 400;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, 'Unknown action: ' + action, null))
            );

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, e.getMessage(), null))
            );
        }
    }
}