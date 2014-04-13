from django.conf import settings
from django.db import models
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.models import User
from localflavor.us.models import USPostalCodeField, PhoneNumberField
import math
import time
import datetime


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
	service_street1 = models.CharField(max_length=60, verbose_name="Address 1", editable=False)
	service_street2 = models.CharField(max_length=60, blank=True, verbose_name="Address 2", editable=False)
	service_city = models.CharField(max_length=30, editable=False)
	service_state = USPostalCodeField()
	service_zip_code = models.CharField(max_length=10, verbose_name="Zip Code")
	billing_street1 = models.CharField(max_length=60, verbose_name="Address 1", editable=False)
	billing_street2 = models.CharField(max_length=60, blank=True, verbose_name="Address 2", editable=False)
	billing_city = models.CharField(max_length=30, editable=False)
	billing_state = USPostalCodeField()
	billing_zip_code = models.CharField(max_length=10, verbose_name="Zip Code")
	email = models.CharField(max_length=65, editable=False)
	phone = PhoneNumberField()


	def __unicode__(self):
		return "%s #%d (%s)" % (self.customer.get_full_name(), self.pk, self.shorturl)

	def _get_grand_total(self):
		total = Decimal("0.0")
		taxable = Decimal("0.0")
		for li in self.lineitems.all():
			if li.taxable:
				taxable += li.total
			else:
				total += li.total
		taxable = taxable * Decimal(settings.TAX_RATE)
		total += taxable
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_taxable_total(self):
		total = Decimal("0.0")
		for li in self.lineitems.all():
			if li.taxable:
				total += li.total
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_total_tax(self):
		total = Decimal("0.0")
		inv_tax_rate = Decimal(settings.TAX_RATE) - Decimal("1.0")
		for li in self.lineitems.all():
			if li.taxable:
				total += Decimal(li.unit_price * li.quantity)
		total = total * inv_tax_rate
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
			return self.num_to_base56(math.floor(int(num)/56)) + charList[int(num) % 56]
		else:
			return charList[int(num)]

	def save(self, force_insert=False, force_update=False):
		if self.shorturl is None or self.shorturl == '':
			notpk = int(time.mktime(datetime.datetime.now().timetuple()))
			urlStr = self.num_to_base56(notpk)
			while len(urlStr) < 5:
				urlStr = self.num_to_base56('0') + urlStr
			self.shorturl = urlStr

		if self.pk is None:
			linked_customer = self.customer
			self.first_name = linked_customer.first_name
			self.last_name = linked_customer.last_name
			self.billing_street1 = linked_customer.street1
			self.billing_street2 = linked_customer.street2
			self.billing_city = linked_customer.city
			self.billing_state = linked_customer.state
			self.billing_zip_code = linked_customer.zip_code
			#just make service the same as billing to start
			self.service_street1 = linked_customer.street1
			self.service_street2 = linked_customer.street2
			self.service_city = linked_customer.city
			self.service_state = linked_customer.state
			self.service_zip_code = linked_customer.zip_code
			self.phone = linked_customer.phone
			self.email = linked_customer.email
		super(Invoice, self).save(force_insert, force_update)
