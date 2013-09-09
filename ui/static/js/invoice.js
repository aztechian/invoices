/*globals ko, $, lineitem */
var invoice = (function($) {
	'use strict';
	var invoiceList = ko.observableArray(),
	currentInvoice = ko.observable(),
	TAX_RATE = 1.0675,
	queryType = "all",
	displayMode = ko.observable('loading'),
	
	InvoiceViewModel = function(serverData){
		var self = this;
		
		self.lineitems = ko.observableArray();
		// self.lineitemObjs = ko.observableArray();
		self.loadData(serverData);
		self.pk = ko.computed(function(){
			if( self.url() === "" || self.url() === undefined )
				return -1;
			return parseInt(self.url().split('/').slice(-2,-1), 10);
		});
		
		self.full_name = ko.computed(function(){
			return self.first_name() + " " + self.last_name();
		});
		
		self.grand_total = ko.computed(function(){
			var gTotal = 0.0,
			taxableTotal = 0.0;
			if( self.lineitems().length <= 0 )
				return parseFloat(self.cached_grand_total()).toFixed(2);
			
			ko.utils.arrayForEach(self.lineitems(), function(lineitem){
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
			ko.utils.arrayForEach(self.lineitems(), function(lineitem){
				if( lineitem.taxable() )
					total += parseFloat(lineitem.total());
			});
			return total.toFixed(2);
		});
		
		self.total_tax = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitems(), function(lineitem){
				if( lineitem.taxable() )
					total += parseFloat(lineitem.total());
			});
			return (total * (TAX_RATE - 1.0)).toFixed(2);
		});
		
		self.sub_total = ko.computed(function(){
			var total = 0.0;
			ko.utils.arrayForEach(self.lineitems(), function(lineitem){
				total += parseFloat(lineitem.total());
			});
			return total.toFixed(2);
		});
		
		self.save = function(){
			var def = $.Deferred();
			$.ajax({
				url: self.url(),
				contentType: "application/json; charset=UTF-8",
				data: ko.toJSON(self),
				type: "PUT"
			}).done(function(data){
				console.log("Saved.");
				def.resolve();
			}).fail(function(jqXhr, statusText, status){
				console.log(status);
				def.reject(jqXhr, status);
			});
			return def.promise();
		};
		
		self.allAttrs = ko.computed(function(){
			self.invoice_date();
			self.sent_date();
			self.paid_date();
			self.customer();
			self.owner();
		}).extend( { throttle: 500 });
		
		self.allAttrs.subscribe(function(){
			self.save();
		});
	};
	
	InvoiceViewModel.prototype.addLineItem = function(){
		var self = this;
		self.lineitems.push(new lineitem.LineItemViewModel({invoice: self.url()}));
	};
	
	InvoiceViewModel.prototype.populateLineItems = function() {
		var self = this,
		needsNext = true;
		console.log("Populating line items for invoice " + self.pk());
		ko.utils.arrayForEach(self.lineitems(), function(liObj) {
			if( liObj.url() === '' || liObj.url() === undefined )
				needsNext = false;
			liObj.load();
		});
		if( needsNext )
			self.addLineItem();
	};
		
	InvoiceViewModel.prototype.toJSON = function(){
		var fullCopy = ko.toJS(this),
		copy = {
			paid_date: fullCopy.paid_date,
			sent_date: fullCopy.sent_date,
			customer: fullCopy.customer,
			owner: fullCopy.owner
		};
		return copy;
	};
	
	InvoiceViewModel.prototype.loadData = function(serverData){
		console.log("Loading data from server");
		var self = this;
		if( serverData === null || serverData === undefined )
		{
			return undefined;
		}
		
		self.url = ko.observable(serverData.url || "");
		self.invoice_date = ko.observable(serverData.invoice_date);
		self.paid_date = ko.observable(serverData.paid_date || null);
		self.sent_date = ko.observable(serverData.sent_date || null );
		self.customer = ko.observable(serverData.customer);
		self.owner = ko.observable(serverData.owner || "");
		self.shorturl = ko.observable(serverData.shorturl || "");
		self.first_name = ko.observable(serverData.first_name || "");
		self.last_name = ko.observable(serverData.last_name || "");
		self.street1 = ko.observable(serverData.street1 || "");
		self.street2 = ko.observable(serverData.street2 || "");
		self.city = ko.observable(serverData.city || "");
		self.state = ko.observable(serverData.state || "");
		self.zip_code = ko.observable(serverData.zip_code || "");
		self.email = ko.observable(serverData.email || "");
		self.phone = ko.observable(serverData.phone || "");
		
		self.cached_grand_total = ko.observable(serverData.grand_total || parseFloat("0").toFixed(2));
		
		if( serverData.hasOwnProperty('lineitems') ){
			self.lineitems.removeAll();
			$.each(serverData.lineitems, function(i,v){
				self.lineitems.push(new lineitem.LineItemViewModel({url: v, invoice: self.url()}));
				// self.lineitems.push(v);
			});
		}
	};
	
	var addInvoice = function(customer){
		var def = $.Deferred(),
		postPayload = {
			customer: customer,
			owner: "http://invoices.aztechian.c9.io/api/users/1/"
		};
		$.ajax({
			url: "/api/invoices/",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(postPayload),
			type: "POST"
		}).done(function(data){
			var newInvoice = new InvoiceViewModel(data);
			invoiceList.push(newInvoice);
			def.resolve(newInvoice);
		}).fail(function(jqXhr, statusText, status){
			console.log(status);
			def.reject(jqXhr);
		});
		return def.promise();
	},
	
	deleteInvoice = function(invoice){
		var def = $.Deferred();
		if( invoice === null || invoice === undefined || !invoice.url()){
			def.reject({},{statusText: "No invoice given to deleteInvoice()"});
		}
		$.ajax({
			url: invoice.url(),
			contentType: "application/json; charset=UTF-8",
			type: "DELETE"
		}).done(function(data){
			invoiceList.remove(invoice);
			def.resolve();
		}).fail(function(jqXhr, statusText, status){
			console.log(JSON.stringify(status));
			def.reject(jqXhr, status);
		});
		
		return def.promise();
	},

	init = function() {
		$.getJSON("/api/invoices/", function(data){
			$.each(data, function(i, val){
				var inv = new InvoiceViewModel(val);
				invoiceList.push(inv);
			});
			$("#loading").hide();
			displayMode('invoice-list');
		});
	},

	setInvoice = function(idx) {
		var i = -1; //idx === undefined will keep the -1 value
		if ( typeof idx === 'object' ){
			i = invoiceList.indexOf(idx);
		}
		else if (typeof idx === 'number' ){
			i = idx;
		}
		
		if( i < 0 ){
			currentInvoice(undefined);
			displayMode('invoice-list');
			return undefined;
		}
		currentInvoice(invoiceList()[i]);
		currentInvoice().populateLineItems();
		displayMode('invoice-detail');
	};

	return {
		init: init,
		invoiceList: invoiceList,
		addInvoice: addInvoice,
		deleteInvoice: deleteInvoice,
		InvoiceViewModel: InvoiceViewModel,
		currentInvoice: currentInvoice,
		setInvoice: setInvoice,
		displayMode: displayMode,
		queryType: queryType
	};
})(jQuery);
invoice.init();

