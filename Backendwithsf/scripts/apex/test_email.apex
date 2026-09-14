Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
mail.setToAddresses(new String[] { '717823f132@kce.ac.in' });
mail.setSubject('Test');
mail.setPlainTextBody('Test');
Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
System.debug('Email sent successfully');
