from django.db import models
from decimal import Decimal, ROUND_HALF_UP
from customer.models import Customer
from django.contrib.auth.models import User
from django_localflavor_us.us_states import STATE_CHOICES
from django_localflavor_us.models import USPostalCodeField, PhoneNumberField
import math, time, datetime

class Invoice(models.Model):
	invoice_date = models.DateTimeField(auto_now_add=True)
	paid_date = models.DateTimeField(blank=True, null=True)
	sent_date = models.DateTimeField(blank=True, null=True)
	customer = models.ForeignKey('customer.Customer', related_name='invoiced')
	owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='owns')
	shorturl = models.CharField(max_length=10, editable=False)
	#duplicate fields from customer so that we can archive the invoice.
	# If the customers' info changes in the future, we don't want all old invoices to update too
	first_name = models.CharField(max_length=30, blank=True, null=True)
	last_name = models.CharField(max_length=30, blank=True, null=True)
	street1 = models.CharField(max_length=60, verbose_name="Address 1", editable=False)
	street2 = models.CharField(max_length=60, blank=True, verbose_name="Address 2", editable=False)
	city = models.CharField(max_length=30, editable=False)
	state = USPostalCodeField()
	zip_code = models.CharField(max_length=10, verbose_name="Zip Code")
	email = models.CharField(max_length=65, editable=False)
	phone = PhoneNumberField()
	

	def __unicode__(self):
		return "%s #%d (%s)" % (self.customer.get_full_name(), self.pk, self.shorturl)

	def _get_grand_total(self):
		total = Decimal("0.0")
		for li in self.lineitems.all():
			if li.taxable:
				total += Decimal((li.unit_price * li.quantity)* Decimal("1.0675"))
			else:
				total += Decimal(li.unit_price * li.quantity)
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_taxable_total(self):
		total = Decimal("0.0")
		for li in self.lineitems.all():
			if li.taxable:
				total += Decimal(li.unit_price * li.quantity)
		return total

	def _get_total_tax(self):
		total = Decimal("0.0")
		for li in self.lineitems.all():
			if li.taxable:
				total += Decimal(li.unit_price * li.quantity* Decimal("0.0675"))
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_sub_total(self):
		total = Decimal("0.0")
		for li in self.lineitems.all():
				total += Decimal(li.unit_price * li.quantity)
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	grand_total = property(_get_grand_total)
	total_tax = property(_get_total_tax)
	taxable_total = property(_get_taxable_total)
	sub_total = property(_get_sub_total)

	def _is_paid(self):
		return True if self.paid_date else False
	_is_paid.admin_order_field = 'paid_date'
	_is_paid.boolean = True
	_is_paid.short_description = 'Paid?'

	is_paid = property(_is_paid)

	def num_to_base56(self, num):
		#list of randomized, url-safe, unambiguous chars
		charList = 'x5d8j9A3BmCZDsEtFGwHpJuKLaMkNzPQnS6TvUhV2WfX4cYb7egiqRry'
		if num > 56:
			return self.num_to_base56(math.floor(int(num)/56)) + charList[int(num) % 56];
		else:
			return charList[int(num)];

	def save(self, force_insert=False, force_update=False):
		if self.shorturl is None or self.shorturl == '':
			notpk = int(time.mktime(datetime.datetime.now().timetuple()))
			urlStr = self.num_to_base56(notpk)
			while len(urlStr) < 5:
				urlStr = self.num_to_base56('0') + urlStr
			self.shorturl = urlStr
		
		if self.pk is None:
			linked_customer = self.customer
			self.street1 = linked_customer.street1
			self.street2 = linked_customer.street2
			self.city = linked_customer.city
			self.state = linked_customer.state
			self.zip_code = linked_customer.zip_code
			self.phone = linked_customer.phone
			self.email = linked_customer.email
		super(Invoice, self).save(force_insert, force_update)

