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
			$("#frame").contents().find('body').children("form").removeAttr("onsubmit");
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
			request.upload.addEventListener("progress", function (event) {
				var percent = (event.loaded / event.total) * 100;
				if(option.progress){
					option.progress(percent)
				}
			});
			if (option.before){
				option.before();
			}
			request.open($(frm).attr("method"), $(frm).attr("action"),true);


			var formData = new FormData($(frm)[0]);
			if (option.extradata){
				for (property in option.extradata)
				{
					formData.append(property, option.extradata[property]);
				}
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
			if (readyState == 4) {
				if( status == '200' && evt.target.responseText){
					if (option.callback && typeof option.callback =="function"){
						option.callback(evt.target.responseText);
					}  
				}else{
					var rfrm = $(obj).children("form")[0];
					var method = $(rfrm).attr("method")
					var action = $(rfrm).attr("action")
					option.callback("Error, status code : " + status + ", method :"+method+", action:"+action +", response text:" +evt.target.responseText);
				}
			}
		}
		if($(obj).find('form').attr('enctype')=="multipart/form-data"){
			if(!supportAjaxUploadWithProgress()){
				useFrameHack();
				return;
			}
			useXHR();
			return;
		}
		if (option.before){
			option.before();
		}
		var url = $(obj).find('form').attr('action');
		var post_data = $(obj).find('form').serialize();
		if (option.extradata){
			post_data += '&' +jQuery.param( option.extradata );
		}
		
		$.post(url,post_data)
		.done(function( data ) {
			if (option.callback && typeof option.callback =="function"){
					option.callback(data);
				}
		})
		.fail(function(){
			if (option.callback && typeof option.callback =="function"){
				option.callback("Connection Error");
			}
		    console.log("Connection Error");    
        });

	};
})( jQuery );
