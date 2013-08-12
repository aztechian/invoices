/*global ko, $ */

var LineItem = (function($){
	'use strict';
	var LineItemViewModel = function(serverData){
		var self = this;
		
		self.description = ko.observable(serverData.description);
		self.taxable = ko.observable(serverData.taxable);
		self.unit_price = ko.observable(serverData.unit_price);
		self.quantity = ko.observable(serverData.quantity);
		self.invoice = ko.observable(serverData.invoice);
		self.url = ko.observable(serverData.url);
		
		self.total = ko.computed(function(){
			var price = parseFloat(self.unit_price()),
			qty = parseInt(self.quantity(), 10);
			return (price * qty).toFixed(2);
		});
		
		self.invoice_pk = function(){
			return parseInt(self.invoice().split('/').slice(-2,-1), 10);
		};
		
		self.pk = function(){
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		};
	},
	
	init = function(){
		return true;
	};
	
	return {
		LineItemViewModel: LineItemViewModel,
		init: init
	};

});

var lineitem = LineItem(jQuery);
lineitem.init();
