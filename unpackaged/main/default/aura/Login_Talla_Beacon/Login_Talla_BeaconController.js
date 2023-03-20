({
	myAction : function(component, event, helper) {
	
        scripts="{!join($Resource.jsLibraries + '/soap/ajax/35.0/connection.js', $Resource.jsLibraries + '/soap/ajax/29.0/apex.js', $Resource.jsLibraries + 'https://assets.talla.com/latest/embeddedjs/talla.js')}"

       var appID = "00c26be3-4421-41e6-bb00-1dee68740f67" // token for anonymous profile
       var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODI4MDQzNDF9.RYf2x65FXvdDURzM h00i76KfUrYlsDLsw6mVuEv6zmE'
       Talla.config = Talla.init(appID, Talla.OptionJWTCredentials(token),
                                 Talla.OptionBotName("Brightcove Support"), 
                                 Talla.OptionAnonymous(true), 
                                 Talla.OptionThemeColor('#1bb9d5'), 
                                 Talla.OptionDisplayName('Brightcove Support'),
                                 Talla.OptionWideBeacon(true),Talla.OptionBeaconCTA("Ask a question"), 
                                 Talla.OptionOpenIcon('https://support.brightcove.com/sites/default/files/favicon-64.png'), 
                                 Talla.OptionBotIcon('https://support.brightcove.com/sites/default/files/favicon-64.png'),
                                 Talla.OptionAutodetectSession,
                                 Talla.OptionHideClose(true),
                                 Talla.OptionRequestSubmittedCallback( function(widget, data) {
                                    widget.display.hide() 
                                    window.parent.location= "/s/createrecord/Create_a_new_case"
                                    })
                                 );   
       
       Talla.chat = Talla.config.configure(Talla.OptionLoadChat);
    
    }
})