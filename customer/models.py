from django.db import models
from django.contrib.auth.models import User
from django_localflavor_us.us_states import STATE_CHOICES
# from django.contrib.localflavor.us.us_states import STATE_CHOICES

# Create your models here.

class Customer(User):
	#inheriting all fields from auth.User too
	street1 = models.CharField(max_length=60, verbose_name="Address 1")
	street2 = models.CharField(max_length=60, verbose_name="Address 2")
	city = models.CharField(max_length=30)
	state = models.CharField(max_length=2, choices=STATE_CHOICES, blank=True)
	zip_code = models.CharField(max_length=10)

