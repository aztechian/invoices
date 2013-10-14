/*global $, jQuery */

var Utilities = (function($){
	var login = function(user, password){
		var def = $.Deferred();
		$.ajax({
			url: '/login',
			data: {username: user, password: password},
			type: "POST",
			beforeSend: function(xhr, settings){
				xhr.setRequestHeader("X-CSRFToken", utils.getCookie('csrftoken'));
			}
		}).done(function(data){
			$(".navbar-inner li.dropdown").text(data.first_name);
			def.resolve();
		});
		return def.promise();
	},

	init = function(){
		$("#login-btn").click(function(event){
			var u = $("#username").val(),
			p = $("#password").val();
			login(u, p);
		});
	},
	
	getCookie = function(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	};

	return {
		login: login,
		getCookie: getCookie,
		init: init
	};
});

var utils = Utilities(jQuery);
utils.init();
