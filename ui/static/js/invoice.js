/*globals ko, $, lineitem */
var Invoice = (function($) {
	'use strict';
	var invoiceList = ko.observableArray(),
	currentInvoice = {
		detailedInvoice: ko.observable(null)
	},
	TAX_RATE = 1.0675,
	
	InvoiceViewModel = function(serverData){
		var self = this,
		populateLineItems = function(){
			ko.utils.arrayForEach(self.lineitems(), function(uri){
				console.log("Calling GET for: " + uri);
				$.getJSON(uri, function(data){
					self.lineitemObjs.push(new lineitem.LineItemViewModel(data));
				});
			});
		};
		
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
		self.lineitems = ko.observableArray();
		self.lineitemObjs = ko.observableArray();
		
		self.pk = ko.computed(function(){
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		});
		
		$.each(serverData.lineitems, function(i,v){
			var relUrl = $('<a/>').attr('href',v)[0].pathname.replace(/^[^\/]/,'/');
			self.lineitems.push(relUrl);
		});
		console.log("lineitems for invoice #" + self.pk() + ": " + self.lineitems());
		populateLineItems();
		
		self.full_name = ko.computed(function(){
			return self.first_name() + " " + self.last_name();
		});
		
		self.grand_total = ko.computed(function(){
			var gTotal = 0.0,
			taxableTotal = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					taxableTotal += lineitem.total();
				else
					gTotal = lineitem.total();
			});
			taxableTotal = taxableTotal * TAX_RATE;
			return gTotal + taxableTotal;
		});
		
		self.taxable_total = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					total += lineitem.total();
			});
			return total;
		});
		
		self.total_tax = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				if( lineitem.taxable() )
					total += lineitem.total();
			});
			return total * (1.0 - TAX_RATE);
		});
		
		self.sub_total = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitemObjs(), function(lineitem){
				total += lineitem.total();
			});
			return total;
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
		currentInvoice = invoiceList()[idx];
	};

	return {
		init: init,
		invoiceList: invoiceList,
		addInvoice: addInvoice,
		InvoiceViewModel: InvoiceViewModel,
		currentInvoice: currentInvoice,
		setInvoice: setInvoice
	};
});

var invoice = Invoice(jQuery);
invoice.init();