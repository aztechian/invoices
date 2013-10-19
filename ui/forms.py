from django import forms
from customer.models import Customer

class UserCreationForm(forms.ModelForm):
	class Meta:
		model = Customer
		fields = ['username', 'first_name', 'last_name', 'password', 'email', 'street1', 'city', 'zip_code', 'phone']
