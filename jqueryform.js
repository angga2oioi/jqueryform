
(function( $ ){
	$(document).ready(function(){
		$('body').append('<iframe id="frame" style="display:none;"></iframe>');
	});
	$.fn.upload = function(option) {	
		var obj = this;	
		function supportAjaxUploadWithProgress() {
			return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();

		  	function supportFileAPI() {
		    	var fi = document.createElement('INPUT');
		    	fi.type = 'file';
		    	return 'files' in fi;
		  	};

		  	function supportAjaxUploadProgressEvents() {
		    	var xhr = new XMLHttpRequest();
		    	return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
		  	};

		  	function supportFormData() {
		    	return !! window.FormData;
		  	}
		}
		function useFrameHack(){
			var original_content=obj.contents();
			
			$("#frame").contents().find('body').html(original_content);		
			
			if (option.extradata){
				for (property in option.extradata)
				{
					$("#frame").contents().find('body').children("form").append('<textarea name="'+property+'">'+option.extradata[property]+'</textarea>');
				}
			}
			var ori = $("#frame").contents().find('body').html();
			
			
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
				$("#frame").off('load');
				var result = $("#frame").contents().find('body').html();
				if (option.callback && typeof option.callback =="function"){
					option.callback(result);
				}
			});
			$("#frame").contents().find('body').children("form").submit();
			//$("#frame").remove();
			return;
		}
		function useXHR(){
			var frm = $(obj).children("form")[0];
			$(frm).submit(function(event) {
				event.preventDefault();
				console.log("here");
				return false
			})
			var request = new XMLHttpRequest();
			request.withCredentials = true
			request.addEventListener('readystatechange', onreadystatechangeHandler, false);
			request.open($(frm).attr("method"), $(frm).attr("action"),true);


			var formData = new FormData($(frm)[0]);
			if (option.extradata){
				for (property in option.extradata)
				{
					formData.append(property, option.extradata[property]);
				}
			}
			if (option.before){
				option.before();
			}
			request.send(formData);
			
		}
		function onreadystatechangeHandler(evt) {
			  var status, text, readyState;
			  try {
			    readyState = evt.target.readyState;
			    text = evt.target.responseText;
			    status = evt.target.status;
			  }
			  catch(e) {
			    return;
			  }
			  if (readyState == 4 && status == '200' && evt.target.responseText) {
			    if (option.callback && typeof option.callback =="function"){
					option.callback(evt.target.responseText);
				}
			  }
		}
		if(!supportAjaxUploadWithProgress()){
			useFrameHack();
			return;
		}
		
		useXHR();

	};
})( jQuery );
