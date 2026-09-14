List<Dmart_User__c> users = [SELECT Id, Address__c, Formatted_Address__c FROM Dmart_User__c];
List<Dmart_User__c> toUpdate = new List<Dmart_User__c>();
for (Dmart_User__c u : users) {
    if (String.isNotBlank(u.Address__c)) {
        try {
            List<Object> addressList = (List<Object>) JSON.deserializeUntyped(u.Address__c);
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
                if (addrObj.get('name') != null) formatted += addrObj.get('name') + '\n';
                if (addrObj.get('flat') != null) formatted += addrObj.get('flat') + ', ';
                if (addrObj.get('street') != null) formatted += addrObj.get('street') + '\n';
                if (addrObj.get('city') != null) formatted += addrObj.get('city') + ' - ';
                if (addrObj.get('pin') != null) formatted += addrObj.get('pin') + '\n';
                if (addrObj.get('phone') != null) formatted += 'Ph: ' + addrObj.get('phone');
                u.Formatted_Address__c = formatted.trim();
                toUpdate.add(u);
            }
        } catch (Exception ex) {
            System.debug('Error formatting address for ' + u.Id + ': ' + ex.getMessage());
        }
    }
}
update toUpdate;
