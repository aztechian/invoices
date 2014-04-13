from rest_framework import serializers
from django.contrib.auth.models import Permission, User
from customer.models import Customer, Address

class AddressSerializer(serializers.ModelSerializer):
	class Meta:
		model = Address

class PermissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Permission

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_active']

	def restore_object(self, attrs, instance=None):
		user = super(UserSerializer, self).restore_object(attrs, instance)
		user.set_password(attrs['password'])
		return user

	def to_native(self, obj):
		ret = super(UserSerializer, self).to_native(obj)
		del ret['password']
		return ret

class CustomerSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	owner = UserSerializer()
	
	class Meta:
		model = Customer

class StateSerializer(serializers.Serializer):
	id = serializers.CharField()
	text = serializers.CharField()
