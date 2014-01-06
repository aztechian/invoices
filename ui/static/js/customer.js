/*global ko, $, utils*/

var Customer = (function($) {
	//'use strict';
	var base_api = '/api/customers/',
	states = ko.observableArray(),
	customerList = ko.observableArray(),
	mappingOpts = {},
	emptyCustomer = {
		"url": "",
		"password": "",
		"is_superuser": false,
		"username": "",
		"first_name": "",
		"last_name": "",
		"email": "",
		"is_staff": false,
		"is_active": true,
		"date_joined": null,
		"street1": "",
		"street2": "",
		"city": "",
		"state": "",
		"zip_code": "",
		"phone": "",
		"groups": null,
		"user_permissions": null
	},
	
	CustomerViewModel = function(serverData){
		var self = this;
		ko.mapping.fromJS(serverData, mappingOpts, self);
		
		self.pk = ko.computed(function(){
			if( !self.url() )
				return -1;
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		});
		
		self.formatted_phone = ko.computed(function(){
			var orig = String(self.phone());
			orig = orig.replace(/[() -#]/g, '');
			if( orig.length > 9 )
				return orig.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
		});
		
		self.oneline_address = ko.computed(function(){
			var tmpAddr = self.street1();
			if( self.street2().trim().length > 0 )
				tmpAddr += " " + self.street2();
			tmpAddr += " " + self.city() + ", " + self.state() + " " + self.zip_code();
			if( tmpAddr.trim() === ',')
				tmpAddr = '';
			if( tmpAddr.length > 25 )
				return tmpAddr.slice(0,14) + '...' + tmpAddr.slice(-7, -1);
			else
				return tmpAddr;
		});
		
		self.full_name = ko.computed(function(){
			return self.first_name() + " " + self.last_name();
		});
	},
	
	addCustomer = function(){
		customerList.push(new CustomerViewModel(emptyCustomer));
	},
	
	fetchCustomers = function(){
		return $.getJSON('/api/customers/');
	},
	
	fetchStateList = function(){
		return $.getJSON('/api/states/');
	},
	
	init = function(){
		var def = $.Deferred();
		$.when( fetchCustomers(), fetchStateList() )
		.then(function( customerArgs, stateArgs ){
			$.each(customerArgs[0].results, function(i, val){
				var cust = new CustomerViewModel(val);
				customerList.push(cust);
			});
			
			$.each(stateArgs[0], function(i, val){
				states.push(val);
			});
			def.resolve();
		});
		
		return def.promise();
	};
	
	CustomerViewModel.prototype.toJSON = function(){
		return ko.mapping.toJS(this);
	};
	
	CustomerViewModel.prototype.save = function(){
		var self = this,
		def = $.Deferred();
		
		$.ajax({
			url: (self.url()) ? self.url() : base_api,
			contentType: "application/json; charset=UTF-8",
			data: ko.toJSON(self),
			type: (self.pk() > 0) ? 'PUT' : 'POST',
			beforeSend: function(xhr, settings){
				xhr.setRequestHeader("X-CSRFToken", utils.getCookie('csrftoken'));
			}
		}).done(function(data, textStatus, jqXhr){
			def.resolve(data);
		}).fail(function(jqXhr, textStatus, errorThrown){
			def.reject(jqXhr, textStatus, status);
		});
		return def.promise();
	};
	
	return {
		init: init,
		states: states,
		addCustomer: addCustomer,
		customerList: customerList
	};
}(jQuery));
