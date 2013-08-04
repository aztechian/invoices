/*globals ko, $, lineitem */
var invoice = (function($) {
	'use strict';
	var invoiceList = ko.observableArray(),
	currentInvoice = ko.observable(),
	TAX_RATE = 1.0675,
	
	InvoiceViewModel = function(serverData){
		var self = this;
		
		self.populateLineItems = function(){
			ko.utils.arrayForEach(self.lineitems(), function(uri){
				console.log("Calling GET for: " + uri);
				$.getJSON(uri, function(data){
					self.lineitemObjs.push(new lineitem.LineItemViewModel(data));
				});
			});
		};
		
		self.lineitems = ko.observableArray();
		self.lineitemObjs = ko.observableArray();
		if( serverData !== null && serverData !== undefined ){
			self.url = ko.observable(serverData.url);
			self.invoice_date = ko.observable(serverData.invoice_date);
			self.paid_date = ko.observable(serverData.paid_date);
			self.sent_date = ko.observable(serverData.sent_date);
			self.customer = ko.observable(serverData.customer);
			self.owner = ko.observable(serverData.owner);
			self.shorturl = ko.observable(serverData.shorturl);
			self.first_name = ko.observable(serverData.first_name);
			self.last_name = ko.observable(serverData.last_name);
			self.street1 = ko.observable(serverData.street1);
			self.street2 = ko.observable(serverData.street2);
			self.city = ko.observable(serverData.city);
			self.state = ko.observable(serverData.state);
			self.zip_code = ko.observable(serverData.zip_code);
			self.email = ko.observable(serverData.email);
			self.phone = ko.observable(serverData.phone);
			
			$.each(serverData.lineitems, function(i,v){
				var relUrl = $('<a/>').attr('href',v)[0].pathname.replace(/^[^\/]/,'/');
				self.lineitems.push(relUrl);
			});
		}
		else {
			self.url = ko.observable("");
			self.invoice_date = ko.observable("");
			self.paid_date = ko.observable("");
			self.sent_date = ko.observable("");
			self.customer = ko.observable("");
			self.owner = ko.observable("");
			self.shorturl = ko.observable("");
			self.first_name = ko.observable("");
			self.last_name = ko.observable("");
			self.street1 = ko.observable("");
			self.street2 = ko.observable("");
			self.city = ko.observable("");
			self.state = ko.observable("");
			self.zip_code = ko.observable("");
			self.email = ko.observable("");
			self.phone = ko.observable("");
		}
	
		self.pk = ko.computed(function(){
			if( self.url() === "" )
				return -1;
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		});
		
		self.full_name = ko.computed(function(){
			return self.first_name() + " " + self.last_name();
		});
		
		self.grand_total = ko.computed(function(){
			var gTotal = 0.0,
			taxableTotal = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					taxableTotal += parseFloat(lineitem.total());
				else
					gTotal += parseFloat(lineitem.total());
			});
			taxableTotal = taxableTotal * TAX_RATE;
			return (gTotal + taxableTotal).toFixed(2);
		});
		
		self.taxable_total = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					total += parseFloat(lineitem.total());
			});
			return total.toFixed(2);
		});
		
		self.total_tax = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					total += parseFloat(lineitem.total());
			});
			return (total * (TAX_RATE - 1.0)).toFixed(2);
		});
		
		self.sub_total = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				total += parseFloat(lineitem.total());
			});
			return total.toFixed(2);
		});
	},
	
	addInvoice = function(){
		var newInvoice = new InvoiceViewModel();
		invoiceList.push(newInvoice);
		return newInvoice;
	},

	init = function() {
		$.getJSON("/api/invoices/", function(data){
			$.each(data, function(i, val){
				var inv = new InvoiceViewModel(val);
				invoiceList.push(inv);
			});
			setInvoice(0);
		});
	},

	setInvoice = function(idx) {
		console.log("Called setInvoice with " + idx);
		currentInvoice(invoiceList()[idx]);
		currentInvoice().populateLineItems();
	};

	return {
		init: init,
		invoiceList: invoiceList,
		addInvoice: addInvoice,
		InvoiceViewModel: InvoiceViewModel,
		currentInvoice: currentInvoice,
		setInvoice: setInvoice
	};
})(jQuery);
invoice.init();

