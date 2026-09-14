HttpRequest req = new HttpRequest();
req.setEndpoint(URL.getOrgDomainUrl().toExternalForm() + '/services/apexrest/DmartActivityAPI');
req.setMethod('POST');
req.setHeader('Content-Type', 'application/json');
// use standard auth or don't need auth if guest
req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
req.setBody('{"contactId":"a04g7000001MaSTAA0","action":"TEST","path":"/test","details":"TEST","timestamp":"2026-06-07T06:00:00.000Z"}');
Http http = new Http();
HttpResponse res = http.send(req);
System.debug('STATUS: ' + res.getStatusCode());
System.debug('BODY: ' + res.getBody());
