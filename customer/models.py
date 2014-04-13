from django.db import models
from django.contrib.auth.models import User
from localflavor.us.models import USPostalCodeField, PhoneNumberField


class Address(models.Model):
	street1 = models.CharField(max_length=60, verbose_name="Address	1")
	street2 = models.CharField(max_length=60, blank=True, verbose_name="Address	2")
	city = models.CharField(max_length=30)
	state = USPostalCodeField(blank=True)
	zip_code = models.CharField(max_length=10, verbose_name="Zip Code")
	
	def __unicode__(self):
		fullStr = "%s %s %s, %s %s" % (self.street1, self.street2, self.city, self.state, self.zip_code)
		if len(fullStr) > 30:
			return fullStr[:18] + "..." + fullStr[-9:]
		return fullStr

class Customer(models.Model):
	user = models.OneToOneField(User)
	owner = models.OneToOneField(User, related_name='owner')
	billing_address = models.ForeignKey(Address)
	phone = PhoneNumberField()
	email = models.CharField(max_length=50, blank=True)

	def __unicode__(self):
		if self.user.first_name == "" or self.user.last_name == "":
			return self.user.username
		return "%s %s" % (self.user.first_name, self.user.last_name)
	
