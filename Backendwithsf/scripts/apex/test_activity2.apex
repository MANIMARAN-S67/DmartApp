Activity_Log__c newActivity = new Activity_Log__c();
newActivity.Contact_Id__c = 'a04g7000001MaSTAA0';
newActivity.Action__c     = 'TEST';
newActivity.Details__c    = 'Details';
newActivity.Path__c       = '/test';
newActivity.Timestamp__c  = '2026-06-07T06:00:00.000Z';
insert newActivity;
System.debug('Success');
