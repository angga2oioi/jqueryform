(function( $ ){
	$(document).ready(function(){
		$('body').append('<iframe id="frame" style="display:none;"></iframe>');
	});
	$.fn.upload = function(option) {	
		var obj = this;	
		var original_content=obj.contents();
		
		$("#frame").contents().find('body').html(original_content);		
		
		if (option.extradata){
			for (property in option.extradata)
			{
				$("#frame").contents().find('body').children("form").append('<textarea name="'+property+'">'+option.extradata[property]+'</textarea>');
			}
		}	
		var ori = $("#frame").contents().find('body').html();
		$("#frame").contents().find('body').children("form").submit();		
		
		obj.html(original_content);
		if (option.extradata){
			for (property in option.extradata)
			{
				obj.find('textarea[name='+property+']').remove();
			}
		}
		if (option.before){
			option.before();
		}
		$("#frame").on('load',function(){
			var result = $("#frame").contents().find('body').html();
			if (option.callback){
				option.callback(result);
			}
			$("#frame").off('load');
		});
		//$("#frame").remove();
	};
})( jQuery );
