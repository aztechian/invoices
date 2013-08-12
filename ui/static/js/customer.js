/*global ko, $*/

var customer = (function($) {
	//'use strict';

	var customerList = ko.observableArray(),
	CustomerViewModel = function(serverData){
		var self = this,
		tempPk;
		
		if( serverData === undefined || serverData === null ){
			self.first_name = ko.observable("");
			self.last_name = ko.observable("");
			self.email = ko.observable("");
			self.is_active = ko.observable(true);
			self.date_joined = ko.observable("");
			self.street1 = ko.observable("");
			self.street2 = ko.observable("");
			self.city = ko.observable("");
			self.state = ko.observable("");
			self.zip_code = ko.observable("");
			self.phone = ko.observable("");
			self.pk = ko.observable(0);
			self.username = ko.observable("");
			self.password = ko.observable("");
		}
		else {
			self.first_name = ko.observable(serverData.first_name);
			self.last_name = ko.observable(serverData.last_name);
			self.email = ko.observable(serverData.email);
			self.is_active = ko.observable(serverData.is_active);
			self.date_joined = ko.observable(serverData.date_joined);
			self.street1 = ko.observable(serverData.street1);
			self.street2 = ko.observable(serverData.street2);
			self.city = ko.observable(serverData.city);
			self.state = ko.observable(serverData.state);
			self.zip_code = ko.observable(serverData.zip_code);
			self.phone = ko.observable(serverData.phone);
			tempPk = parseInt(serverData.url.split('/').slice(-2,-1)[0], 10);
			self.pk = ko.observable(tempPk);
			self.username = ko.observable(serverData.username);
			self.password = ko.observable(serverData.password);
		}
		
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
		customerList.push(new CustomerViewModel());
	},
	
	init = function(){
		$.getJSON('/api/customers/', function(data){
			$.each(data, function(i, val){
				var cust = new CustomerViewModel(val);
				customerList.push(cust);
			});
		}).complete(function(){
			console.log("Loaded customer list" + customerList().length);
			$('i.icon-spinner').hide();
		});
	};
	
	return {
		init: init,
		addCustomer: addCustomer,
		customerList: customerList
	};
}(jQuery));

customer.init();
