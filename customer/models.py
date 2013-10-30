from django.db import models
from django.contrib.auth.models import User
from django_localflavor_us.models import USPostalCodeField, PhoneNumberField


class Customer(User):
	#inheriting all fields from auth.User too
	street1 = models.CharField(max_length=60, verbose_name="Address	1")
	street2 = models.CharField(max_length=60, blank=True, verbose_name="Address	2")
	city = models.CharField(max_length=30)
	state = USPostalCodeField(blank=True)
	zip_code = models.CharField(max_length=10, verbose_name="Zip Code")
	phone = PhoneNumberField()
	owner = models.ForeignKey('self', null=False)

