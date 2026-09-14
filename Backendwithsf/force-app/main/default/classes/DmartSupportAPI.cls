/**
 * DmartSupportAPI
 * Apex REST Controller — Support Callback Requests
 * URL: /services/apexrest/DmartSupportAPI/
 *
 * ENDPOINTS:
 *   POST /services/apexrest/DmartSupportAPI/    → Creates a new Case for a callback request
 */
@RestResource(urlMapping='/DmartSupportAPI/*')
global with sharing class DmartSupportAPI {

    global class ApiResponse {
        public Boolean success;
        public String  message;
        public Object  data;
        public ApiResponse(Boolean s, String m, Object d) {
            this.success = s; 
            this.message = m; 
            this.data = d;
        }
    }

    @HttpPost
    global static void doPost() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        try {
            Map<String, Object> payload = (Map<String, Object>) JSON.deserializeUntyped(req.requestBody.toString());

            String name = (String) payload.get('name');
            String phone = (String) payload.get('phone');
            String issue = (String) payload.get('issue');
            String contactId = (String) payload.get('contactId');

            if (String.isBlank(name) || String.isBlank(phone)) {
                res.statusCode = 400;
                res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, 'Name and Phone are required', null)));
                return;
            }

            Case newCase = new Case();
            newCase.SuppliedName = name;
            newCase.SuppliedPhone = phone;
            
            // Map the frontend issue label to Subject
            String subjectSuffix = String.isNotBlank(issue) && issue != 'Select Issue Type' ? issue : 'General Query';
            newCase.Subject = 'Callback Request: ' + subjectSuffix;
            
            newCase.Description = 'User requested a callback via DMart Support App.\n\nName: ' + name + '\nPhone: ' + phone + '\nIssue Type: ' + subjectSuffix;
            newCase.Origin = 'Web';
            newCase.Status = 'New';
            
            // Link to Contact if provided
            if (String.isNotBlank(contactId)) {
                newCase.ContactId = contactId;
            }

            insert newCase;

            res.statusCode = 201;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(true, 'Callback requested successfully', newCase.Id)));
        } catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(JSON.serialize(new ApiResponse(false, e.getMessage(), null)));
        }
    }
}
