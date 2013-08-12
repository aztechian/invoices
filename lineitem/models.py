from django.conf import settings
from django.db import models
from decimal import Decimal, ROUND_HALF_UP

# Create your models here.

class LineItem(models.Model):
	invoice = models.ForeignKey('invoice.Invoice', related_name='lineitems')
	description = models.CharField(max_length=120)
	quantity = models.IntegerField(default=1)
	taxable = models.BooleanField(default=True)
	unit_price = models.DecimalField(max_digits=6, decimal_places=2)
	
	def _get_total(self):
		# DON'T return total + tax here. Tax should be calc'd on the sum total, not per item.
		# so, we can't do that summing in LineItem
		return Decimal(self.quantity * self.unit_price);
	
	total = property(_get_total)
	
	def __unicode__(self):
		desc_txt = self.description[:27]+'...' if len(self.description) >= 30 else self.description
		return "%s (%d @ %.2f)"  % (desc_txt, self.quantity, round(self.unit_price,2))

