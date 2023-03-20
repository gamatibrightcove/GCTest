@isTest
public class PostChatRatingTest {
    
    
    @isTest static void TestPostChat () {
        
        Contact con = new Contact(FirstName = 'TestName', LastName = 'TestLastName',Phone='415.555.1212', Email='Gamati@brightcove.com');
    insert con;
            Id personContact = [select Id, Name from Contact where Contact.Name = 'TestName TestLastName'].Id;

        //create case
        Case c = new Case();
        //enter details
        c.ContactId = personContact; 
        c.Type = 'Customer Support Cases';
        c.Origin =   'Live Chat';
        c.Status = 'Status example'; 
        insert c;
        system.debug('');
        system.debug('Case Info - Origin '+ c.Origin + ' Contact Name ' + c.Contact.Name + ' CaseNumber ' + c.CaseNumber+ ' Status ' + c.Status);
        Case [] c2;
        c2 = [SELECT ContactId, Contact.Name, Id, AccountId, Status,  Account.Name, Account_Account_ID__c, OwnerId, Zapier_Case_Owner__c, CaseNumber, CreatedDate, ClosedDate, Account_Tier__c, Support_Package__c, Origin, ContactEmail, Account_Edition__c 
             FROM Case 
             WHERE ContactId = :personContact
             ORDER BY CaseNumber 
             DESC 
             Limit 1];
         
        if (c2.size()!= 0){
        system.debug('Case2 Info - Origin '+ c2[0].Origin + ' Contact2 Name ' + c2[0].Contact.Name + ' Case2Number ' + c2[0].CaseNumber+ ' Status2 ' + c2[0].Status);
        c2[0].Origin = 'Live Chat';
        update c2;
            }
        
        PostChatRating p = new PostChatRating();
        p.getCase();
    }
    
    @isTest static void TestErrorChat () {
        
        Contact con = new Contact(FirstName = 'TestName', LastName = 'TestLastName',Phone='415.555.1212', Email='Gamati@brightcove.com');
    insert con;
            Id personContact = [select Id, Name from Contact where Contact.Name = 'TestName TestLastName'].Id;

        //create case
        Case c = new Case();
        //enter details
        c.ContactId = personContact; 
        c.Type = 'Customer Support Cases';
        c.Origin =   'Live Chat';
        c.Status = 'Status example'; 
        insert c;
        system.debug('');
        system.debug('Case Info - Origin '+ c.Origin + ' Contact Name ' + c.Contact.Name + ' CaseNumber ' + c.CaseNumber+ ' Status ' + c.Status);
        Case [] c2;
        c2 = [SELECT ContactId, Contact.Name, Id, AccountId, Status,  Account.Name, Account_Account_ID__c, OwnerId, Zapier_Case_Owner__c, CaseNumber, CreatedDate, ClosedDate, Account_Tier__c, Support_Package__c, Origin, ContactEmail, Account_Edition__c 
             FROM Case 
             WHERE ContactId = :personContact
             ORDER BY CaseNumber 
             DESC 
             Limit 1];
         
      
        
        PostChatRating p = new PostChatRating();
        p.getCase();
    }
}