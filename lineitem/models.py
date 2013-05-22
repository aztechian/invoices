from django.db import models

# Create your models here.

class LineItem(models.Model):
	invoice = models.ForeignKey('invoice.Invoice')
	description = models.CharField(max_length=120)
	quantity = models.IntegerField()
	taxable = models.BooleanField()
	unit_price = models.DecimalField(max_digits=6, decimal_places=2)

	def _get_total(self):
		return self.quantity * self.unit_price

	total = property(_get_total)
	
