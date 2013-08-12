from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer
from django.contrib.auth.models import Permission, User
from customer.models import Customer

class CustomerSerializer(HyperlinkedModelSerializer):
	class Meta:
		model = Customer

class PermissionSerializer(ModelSerializer):
	class Meta:
		model = Permission

class UserSerializer(ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'first_name', 'last_name', 'email', 'is_active')