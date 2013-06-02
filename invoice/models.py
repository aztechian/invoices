from django.db import models
from decimal import Decimal, ROUND_HALF_UP

# Create your models here.

class Invoice(models.Model):
	invoice_date = models.DateTimeField(auto_now_add=True)
	paid_date = models.DateTimeField(blank=True, null=True)
	sent_date = models.DateTimeField(blank=True, null=True)
	customer = models.CharField(max_length=90)

	def _get_grand_total(self):
		total = Decimal(0.0)
		for li in self.lineitem_set.all():
			if li.taxable:
				total += Decimal((li.unit_price * li.quantity)* Decimal(1.0675))
			else:
				total += Decimal(li.unit_price * li.quantity)
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_taxable_total(self):
		total = Decimal(0.0)
		for li in self.lineitem_set.all():
			if li.taxable:
				total += Decimal(li.unit_price * li.quantity)
		return total

	def _get_total_tax(self):
		total = Decimal(0.0)
		for li in self.lineitem_set.all():
			if li.taxable:
				total += Decimal(li.unit_price * li.quantity* Decimal(0.0675))
		return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

	def _get_sub_total(self):
		total = Decimal(0.0)
		for li in self.lineitem_set.all():
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
