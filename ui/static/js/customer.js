/*global ko, $, utils*/

var customer = (function($) {
	//'use strict';
	
	var states = [
        { id: "AL", text: "Alabama" },
        { id: "AK", text: "Alaska" },
        { id: "AZ", text: "Arizona" },
        { id: "AR", text: "Arkansas" },
        { id: "CA", text: "California" },
        { id: "CO", text: "Colorado" },
        { id: "CT", text: "Connecticut" },
        { id: "DE", text: "Delaware" },
        { id: "FL", text: "Florida" },
        { id: "GA", text: "Georgia" },
        { id: "HI", text: "Hawaii" },
        { id: "ID", text: "Idaho" },
        { id: "IL", text: "Illinois" },
        { id: "IN", text: "Indiana" },
        { id: "IA", text: "Iowa" },
        { id: "KS", text: "Kansas" },
        { id: "KY", text: "Kentucky" },
        { id: "LA", text: "Louisiana" },
        { id: "ME", text: "Maine" },
        { id: "MD", text: "Maryland" },
        { id: "MA", text: "Massachusetts" },
        { id: "MI", text: "Michigan" },
        { id: "MN", text: "Minnesota" },
        { id: "MS", text: "Mississippi" },
        { id: "MO", text: "Missouri" },
        { id: "MT", text: "Montana" },
        { id: "NE", text: "Nebraska" },
        { id: "NV", text: "Nevada" },
        { id: "NH", text: "New Hampshire" },
        { id: "NJ", text: "New Jersey" },
        { id: "NM", text: "New Mexico" },
        { id: "NY", text: "New York" },
        { id: "NC", text: "North Carolina" },
        { id: "ND", text: "North Dakota" },
        { id: "OH", text: "Ohio" },
        { id: "OK", text: "Oklahoma" },
        { id: "OR", text: "Oregon" },
        { id: "PA", text: "Pennsylvania" },
        { id: "RI", text: "Rhode Island" },
        { id: "SC", text: "South Carolina" },
        { id: "SD", text: "South Dakota" },
        { id: "TN", text: "Tennessee" },
        { id: "TX", text: "Texas" },
        { id: "UT", text: "Utah" },
        { id: "VT", text: "Vermont" },
        { id: "VA", text: "Virginia" },
        { id: "WA", text: "Washington" },
        { id: "WV", text: "West Virginia" },
        { id: "WI", text: "Wisconsin" },
        { id: "WY", text: "Wyoming" }
    ],
	base_api = '/api/customers/',
	customerList = ko.observableArray(),
	CustomerViewModel = function(serverData){
		var self = this;
	
		self.url = ko.observable("");
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
		self.username = ko.observable("");
		self.password = ko.observable("");
		self.owner = ko.observable("");
	
		self.loadData(serverData);
		
		self.pk = ko.computed(function(){
			if( self.url() === "" || self.url() === undefined )
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
		customerList.push(new CustomerViewModel({}));
	},
	
	init = function(){
		$.getJSON('/api/customers/', function(data){
			$.each(data.results, function(i, val){
				var cust = new CustomerViewModel(val);
				customerList.push(cust);
			});
		}).complete(function(){
			console.log("Loaded customer list" + customerList().length);
			$('i.icon-spinner').hide();
		});
	};
	
	CustomerViewModel.prototype.loadData = function(serverData){
		var self = this;
		if( serverData === undefined || serverData === null ){
			return undefined;
		}
		
		self.url(serverData.url || "");
		self.first_name(serverData.first_name || "");
		self.last_name(serverData.last_name || "");
		self.email(serverData.email || "");
		self.is_active(serverData.is_active || true);
		self.date_joined(serverData.date_joined || "");
		self.street1(serverData.street1 || "");
		self.street2(serverData.street2 || "");
		self.city(serverData.city || "");
		self.state(serverData.state || "");
		self.zip_code(serverData.zip_code || "");
		self.phone(serverData.phone || "");
		self.username(serverData.username || "");
		self.password(serverData.password || "");
		self.owner(serverData.owner || "");
	};
	
	CustomerViewModel.prototype.toJSON = function(){
		var clone = ko.toJS(this);
		delete clone.pk;
		delete clone.oneline_address;
		delete clone.formatted_phone;
		delete clone.full_name;
		return clone;
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

customer.init();
