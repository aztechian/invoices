/*global ko, $ */

var LineItem = (function($){
	'use strict';
	var zeroPrice = parseFloat("0", 10).toFixed(2),
	LineItemViewModel = function(serverData){
		var self = this;
		self.description = ko.observable(serverData.description || "");
		self.taxable = ko.observable(serverData.taxable || false);
		self.unit_price = ko.observable(serverData.unit_price || zeroPrice);
		self.quantity = ko.observable(serverData.quantity || 1);
		self.invoice = ko.observable(serverData.invoice);
		self.url = ko.observable(serverData.url || "");
		self.loadData(serverData);
		
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
			var promise = self.save();
			promise.done(function(data){
				
			});
		});
	};
	
	LineItemViewModel.prototype.save = function(){
		var self = this;
		if( self.invoice() === "" || self.invoice() === undefined || 
			self.description() === "" || self.description() === undefined ||
			self.unit_price() === undefined ){
			return undefined;
		}
		var def = $.Deferred(),
		ajaxType = (self.pk() > 0) ? "PUT" : "POST";
		$.ajax({
			url: (self.pk() > 0) ? self.url() :'/api/lineitems/',
			contentType: "application/json; charset=UTF-8",
			data: ko.toJSON(self),
			type: ajaxType
		}).done(function(data){
			self.loadData(data);
			console.log("Saved lineitem." + self.pk());
			def.resolve();
		}).fail(function(jqXhr, statusText, status){
			console.log(status);
			def.reject(jqXhr);
		});
		return def.promise();
	};
	
	LineItemViewModel.prototype.loadData = function(serverData){
		if( typeof(serverData) !== 'object' || !serverData.hasOwnProperty("invoice") ){
			throw "Must provide an object with at least a property of 'invoice' to create a LineItem";
		}
		var self = this;
		self.description(serverData.description || "");
		self.taxable(serverData.taxable || false);
		self.unit_price(serverData.unit_price || zeroPrice);
		self.quantity(serverData.quantity || 1);
		self.invoice(serverData.invoice);
		self.url(serverData.url || "");
	};

	LineItemViewModel.prototype.toJSON = function(){
		var clone = ko.toJS(this);
		delete clone.save;
		delete clone.view_unit_price;
		delete clone.view_qty;
		delete clone.allAttrs;
		delete clone.pk;
		delete clone.total;
		delete clone.url;
		return clone;
	};
	
	LineItemViewModel.prototype.load = function(){
		var self = this;
		if( self.url() !== null && self.url() !== undefined ){
			console.log("Loading line item " + self.pk() + " from server");
			$.getJSON(self.url(), function(data){
				self.loadData(data);
			});
		}
	};
	
	var init = function(){
		return true;
	};
	
	return {
		LineItemViewModel: LineItemViewModel,
		init: init
	};

});

var lineitem = LineItem(jQuery);
lineitem.init();
