/*global ko, $ */

var LineItem = (function($){
	'use strict';
	var LineItemViewModel = function(serverData){
		var self = this;
		
		if( serverData === undefined || serverData === null ){
			self.description = ko.observable("");
			self.taxable = ko.observable(false);
			self.unit_price = ko.observable(0);
			self.quantity = ko.observable(1);
			self.invoice = ko.observable(-1);
			self.url = ko.observable("");
		}
		else {
			self.description = ko.observable(serverData.description);
			self.taxable = ko.observable(serverData.taxable);
			self.unit_price = ko.observable(serverData.unit_price);
			self.quantity = ko.observable(serverData.quantity);
			self.invoice = ko.observable(serverData.invoice);
			self.url = ko.observable(serverData.url);
		}
		self.total = ko.computed(function(){
			var price = parseFloat(self.unit_price()),
			qty = parseInt(self.quantity(), 10);
			return (price * qty).toFixed(2);
		});

		self.pk = ko.computed(function(){
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		});
		
		self.view_qty = ko.computed({
			read: function(){
				return parseInt(self.quantity(),10);
			},
			write: function(value){
				var intValue = parseInt(value, 10);
				self.quantity(intValue);
			},
			owner: this
		});
		
		self.view_unit_price = ko.computed({
			read: function(){
				return parseFloat(self.unit_price()).toFixed(2);
			},
			write: function(value){
				self.unit_price(parseFloat(value).toFixed(2));
			},
			owner: this
		});
		
		self.allAttrs = ko.computed(function(){
			self.description();
			self.taxable();
			self.unit_price();
			self.quantity();
			self.invoice();
		}).extend( { throttle: 500 });
		
		self.allAttrs.subscribe(function(){
			self.save();
		});
		
		self.save = function(){
			if( self.pk() > 0 ){
				$.ajax({
					url: self.url(),
					contentType: "application/json; charset=UTF-8",
					data: ko.toJSON(self),
					type: "PUT"
				}).done(function(data){
					console.log("Updated lineitem.");
				}).fail(function(jqXhr, statusText, status){
					console.log(status);
				});
			}
			else{
				$.ajax({
					url: '/api/lineitems/',
					contentType: "application/json; charset=UTF-8",
					data: ko.toJSON(self),
					type: "POST"
				}).done(function(data){
					console.log("Saved lineitem.");
					self.url(data.url);
				}).fail(function(jqXhr, statusText, status){
					console.log(status);
				});
			}
		};
	},
	
	init = function(){
		return true;
	};
	
	LineItem.prototype.toJSON = function(){
		var clone = ko.toJS(this);
		delete clone.save;
		delete clone.view_unit_price;
		delete clone.view_qty;
		delete clone.allAttrs;
		delete clone.pk;
		delete clone.total;
		delete clone.url;
		return JSON.stringify(clone);
	};
	
	return {
		LineItemViewModel: LineItemViewModel,
		init: init
	};

});

var lineitem = LineItem(jQuery);
lineitem.init();
