/**
 * DmartActivityAPI
 * Apex REST Controller — Activity Logging
 * URL: /services/apexrest/DmartActivityAPI/
 *
 * ENDPOINTS:
 *   POST /services/apexrest/DmartActivityAPI/    → Logs a user activity (page view, click, login, order)
 *   GET  /services/apexrest/DmartActivityAPI/{contactId} → Returns activity logs for a user
 *
 * REQUIRED CUSTOM OBJECT: Activity_Log__c
 *   Fields: Contact_Id__c (Text), Action__c (Text), Details__c (Long Text Area),
 *           Path__c (Text), Timestamp__c (Text)
 */
@RestResource(urlMapping='/DmartActivityAPI/*')
global with sharing class DmartActivityAPI {

    /* ─── Response Wrapper ─── */
    global class ApiResponse {
        public Boolean success;
        public String  message;
        public Object  data;
        public ApiResponse(Boolean s, String m, Object d) {
            success = s; message = m; data = d;
        }
    }

    /* ─── Activity Wrapper for GET responses ─── */
    global class ActivityWrapper {
        public String id;
        public String contactId;
        public String action;
        public String details;
        public String path;
        public String activityTimestamp;
        public String createdDate;

        public ActivityWrapper(Activity_Log__c a) {
            this.id                = a.Id;
            this.contactId         = a.Contact_Id__c;
            this.action            = a.Action__c;
            this.details           = a.Details__c;
            this.path              = a.Path__c;
            this.activityTimestamp  = String.valueOf(a.Timestamp__c);
            this.createdDate       = String.valueOf(a.CreatedDate);
        }
    }

    /* ─── POST  /DmartActivityAPI/ — log a new activity ─── */
    @HttpPost
    global static void doPost() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String body = req.requestBody.toString();
            Map<String, Object> payload = (Map<String, Object>) JSON.deserializeUntyped(body);

            String contactId = (String) payload.get('contactId');
            String action    = (String) payload.get('action');
            String details   = (String) payload.get('details');
            String path      = (String) payload.get('path');
            String timestamp = (String) payload.get('timestamp');

            if (String.isBlank(contactId) || String.isBlank(action)) {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'contactId and action are required', null))
                );
                return;
            }

            // Create Activity Log record
            Activity_Log__c newActivity = new Activity_Log__c();
            newActivity.Contact_Id__c = contactId;
            newActivity.Action__c     = action;
            newActivity.Details__c    = String.isNotBlank(details) ? details : '';
            newActivity.Path__c       = String.isNotBlank(path) ? path : '';
            Datetime parsedTimestamp;
            if (String.isNotBlank(timestamp)) {
                parsedTimestamp = (Datetime) JSON.deserialize('"' + timestamp + '"', Datetime.class);
            } else {
                parsedTimestamp = Datetime.now();
            }
            newActivity.Timestamp__c  = parsedTimestamp;

            insert newActivity;

            res.statusCode = 201;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(true, 'Activity logged successfully',
                    new ActivityWrapper(newActivity)))
            );

        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(
                JSON.serialize(new ApiResponse(false, e.getMessage(), null))
            );
        }
    }

    /* ─── GET  /DmartActivityAPI/{contactId} — fetch activity logs for a user ─── */
    @HttpGet
    global static void doGet() {
        RestRequest  req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            String contactId = req.requestURI.substringAfterLast('/');

            if (String.isBlank(contactId) || contactId == 'DmartActivityAPI') {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(
                    JSON.serialize(new ApiResponse(false, 'Contact Id is required', null))
                );
                return;
            }

            List<Activity_Log__c> activities = [
                SELECT Id, Contact_Id__c, Action__c, Details__c, Path__c, Timestamp__c, CreatedDate
                FROM   Activity_Log__c
                WHERE  Contact_Id__c = :contactId
                ORDER BY CreatedDate DESC
                LIMIT 200
            ];

            List<ActivityWrapper> result = new List<ActivityWrapper>();
            for (Activity_Log__c a : activities) {
                result.add(new ActivityWrapper(a));
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
}
