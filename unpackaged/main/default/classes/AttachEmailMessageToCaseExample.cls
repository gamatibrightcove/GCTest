global with sharing class AttachEmailMessageToCaseExample implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(
        Messaging.inboundEmail email,
        Messaging.InboundEnvelope env
    ) {
        // Create an InboundEmailResult object for returning the result of the
        // Apex Email Service.
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();

        // Try to find the Case ID using threading tokens in email attributes.
        Id caseId = EmailMessages.getRecordIdFromEmail(
            email.subject,
            email.plainTextBody,
            email.htmlBody
        );

        // If we haven't found the Case ID, try finding it using headers.
        if (caseId == null) {
            caseId = Cases.getCaseIdFromEmailHeaders(email.headers);
        }

        // If a Case isn’t found, create a new Case record.
        if (caseId == null) {
            result.success = true;
            return result;
        }

        // Process recipients
        String toAddresses;
        if (email.toAddresses != null) {
            toAddresses = String.join(email.toAddresses, '; ');
        }

        // To store an EmailMessage for threading, you need at minimum
        // the Status, the MessageIdentifier, and the ParentId fields.
        EmailMessage em = new EmailMessage(
            Status = '0',
            MessageIdentifier = email.messageId,
            ParentId = caseId,
            // Other important fields.
            FromAddress = email.fromAddress,
            FromName = email.fromName,
            ToAddress = toAddresses,
            TextBody = email.plainTextBody,
            HtmlBody = email.htmlBody,
            Subject = email.subject,
            // Parse thread-index header to remain consistent with Email-to-Case.
            ClientThreadIdentifier = getClientThreadIdentifier(email.headers)
            // Other fields you wish to add.
        );

        // Insert the new EmailMessage.
        insert em;
        System.debug('New EmailMessage Object: ' + em);

        // Set the result to true. No need to send an email back to the user
        // with an error message.
        result.success = true;

        // Return the result for the Apex Email Service.
        return result;
    }

    private String getClientThreadIdentifier(
        List<Messaging.InboundEmail.Header> headers
    ) {
        if (headers == null || headers.size() == 0)
            return null;
        try {
            for (Messaging.InboundEmail.Header header : headers) {
                if (header.name.equalsIgnoreCase('thread-index')) {
                    Blob threadIndex = EncodingUtil.base64Decode(
                        header.value.trim()
                    );
                    return EncodingUtil.convertToHex(threadIndex)
                        .substring(0, 44)
                        .toUpperCase();
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}