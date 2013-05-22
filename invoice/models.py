from django.db import models

# Create your models here.

class Invoice(models.Model):
	def _get_grand_total(self):
		return 120.02

	grand_total = property(_get_grand_total)
