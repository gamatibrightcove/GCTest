/**
* Add Required Block Script
*/
var RequiredBlockUtil = {
	
	/**
	* Add required block to input controls
	*
	* @param {String} identifier Css class to identify input controls to add required block
	*/
	addRequiredBlock : function(identifier){
		$(identifier).each(function(){
       		if ($(this).parent().hasClass('dateInput')) {
       			$(this).parent().wrap('<div class="requiredInput">').before('<div class="requiredBlock" />');
       		} else {
       			$(this).wrap('<div class="requiredInput">').before('<div class="requiredBlock" />');
       		}
		});
	}
}	