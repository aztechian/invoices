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
		
		self.populateLineItems = function(){
			if( self.lineitems().length === self.lineitemObjs().length )
				return;
			ko.utils.arrayForEach(self.lineitems(), function(uri){
				console.log("Calling GET for: " + uri);
				$.getJSON(uri, function(data){
					//TODO check if the object exists before pushing
					self.lineitemObjs.push(new lineitem.LineItemViewModel(data));
				});
			});
		};
		
		self.lineitems = ko.observableArray();
		self.lineitemObjs = ko.observableArray();
		if( serverData !== null && serverData !== undefined ){
			// var relUrl = $('<a/>').attr('href',serverData.url)[0].pathname.replace(/^[^\/]/,'/');
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
			
			self.cached_grand_total = ko.observable(serverData.grand_total);
			
			$.each(serverData.lineitems, function(i,v){
				// var relUrl = $('<a/>').attr('href',v)[0].pathname.replace(/^[^\/]/,'/');
				self.lineitems.push(v);
			});
		}
		else {
			self.url = ko.observable();
			self.invoice_date = ko.observable();
			self.paid_date = ko.observable();
			self.sent_date = ko.observable();
			self.customer = ko.observable();
			self.owner = ko.observable();
			self.shorturl = ko.observable();
			self.first_name = ko.observable();
			self.last_name = ko.observable();
			self.street1 = ko.observable();
			self.street2 = ko.observable();
			self.city = ko.observable();
			self.state = ko.observable();
			self.zip_code = ko.observable();
			self.email = ko.observable();
			self.phone = ko.observable();
			
			self.cached_grand_total = ko.observable();
		}
	
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
			if( self.lineitemObjs().length <= 0 )
				return parseFloat(self.cached_grand_total()).toFixed(2);
			
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
		
		self.save = function(){
			$.ajax({
				url: self.url(),
				contentType: "application/json; charset=UTF-8",
				data: ko.toJSON(self),
				type: "PUT"
			}).done(function(data){
				console.log("Saved.");
			}).fail(function(jqXhr, statusText, status){
				console.log(status);
			});
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
			$("#loading").hide();
			displayMode('invoice-list');
		});
		
		$(document).on('click', '#invoice-table tbody tr', function(event){
			console.log("Here");
			var invObj = ko.dataFor(this);
			setInvoice(invoiceList.indexOf(invObj));
		});
		
		$(document).on('click', '#done-btn', function(event){
			var doneInv = currentInvoice();
			$.getJSON(doneInv.url(), function(data){
				doneInv.cached_grand_total(data.grand_total);
				doneInv.first_name(data.first_name);
				doneInv.last_name(data.last_name);
				doneInv.invoice_date(data.invoice_date);
				doneInv.sent_date(data.sent_date);
				doneInv.paid_date(data.paid_date);
			});
			setInvoice(undefined);
		});
	},

	setInvoice = function(idx) {
		if( idx === undefined ){
			currentInvoice(undefined);
			displayMode('invoice-list');
		}
		else{
			console.log("Called setInvoice with " + idx);
			currentInvoice(invoiceList()[idx]);
			currentInvoice().populateLineItems();
			displayMode('invoice-detail');
		}
	};
	
	InvoiceViewModel.prototype.toJSON = function(){
		var copy = {
			paid_date: this.paid_date(),
			sent_date: this.sent_date(),
			customer: this.customer(),
			owner: this.owner()
		};
		return JSON.stringify(copy);
	};

	return {
		init: init,
		invoiceList: invoiceList,
		addInvoice: addInvoice,
		InvoiceViewModel: InvoiceViewModel,
		currentInvoice: currentInvoice,
		setInvoice: setInvoice,
		displayMode: displayMode,
		queryType: queryType
	};
})(jQuery);
invoice.init();

