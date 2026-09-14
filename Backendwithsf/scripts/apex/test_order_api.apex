HttpRequest req = new HttpRequest();
req.setEndpoint(URL.getOrgDomainUrl().toExternalForm() + '/services/apexrest/DmartOrderAPI');
req.setMethod('POST');
req.setHeader('Content-Type', 'application/json');
req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());

String jsonBody = '{"contactId":"a04g7000001MaSTAA0","totalAmount":250.50,"items":[{"name":"Apple","qty":2,"price":100.0},{"name":"Banana","qty":1,"price":50.5}]}';
req.setBody(jsonBody);

Http http = new Http();
HttpResponse res = http.send(req);
System.debug('STATUS: ' + res.getStatusCode());
System.debug('BODY: ' + res.getBody());
