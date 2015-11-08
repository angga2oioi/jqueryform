# jqueryform
Jqueryplugin for submitting form element via javascript (using iframe hack)

#Usage
```sh

<div id="form">
			<p>LOGIN TO YOUR ACCOUNT</p>
			<p>
				<input name="username" placeholder="Input your Username"/>
			</p>
			<p>
				<input name="password" type="password" placeholder="Input your Password"/>
			</p>
			<p>
				<a class="ui-btn ui-btn-red ui-icon-arrow-r ui-btn-icon-right" onclick="login()">Login</a>
			</p>
			<p>
				Forgot your password ?
			</p>
		</div>
	<script type="text/javascript" src="/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="/jqueryform.js"></script>
	<script>
	  function login(){
	     $('#form').upload({
        extradata:{action:'login'},
        callback: function (data) {
          console.log(data);
        }
      });
	  }
	</script>
```
