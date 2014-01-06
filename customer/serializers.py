from rest_framework import serializers
from django.contrib.auth.models import Permission, User
from customer.models import Customer

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Customer
		read_only_fields = ('owner',)

class PermissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Permission

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'first_name', 'last_name', 'email', 'is_active')

class StateSerializer(serializers.Serializer):
	id = serializers.CharField()
	text = serializers.CharField()
