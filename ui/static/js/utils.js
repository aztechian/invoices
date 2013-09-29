/*global $, jQuery */

var Utilities = (function($){
	var login = function(user, password){
		var def = $.Deferred();
		$.post('/login', {username: user, password: password}, function(data){
			$(".navbar-inner li.dropdown").text(data.first_name);
		});
	},

	init = function(){
		$("#login-btn").click(function(event){
			var u = $("#username").val(),
			p = $("#password").val();
			login(u, p);
		});
	};

	return {
		login: login,
		init: init
	};
});

var utils = Utilities(jQuery);
utils.init();
