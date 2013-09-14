from rest_framework.viewsets import ModelViewSet
from rest_framework import filters
from customer.models import Customer
from django.contrib.auth.models import Permission, User
from customer.serializers import CustomerSerializer, PermissionSerializer, UserSerializer

class CustomerViewSet(ModelViewSet):
	serializer_class = CustomerSerializer
	model = Customer
	filter_backends = (filters.SearchFilter,)
	search_fields = ('first_name', 'last_name', 'username', 'street1', 'street2', 'city', 'zip_code')

class PermissionViewSet(ModelViewSet):
	serializer_class = PermissionSerializer
	model = Permission

class UserViewSet(ModelViewSet):
	serializer_class = UserSerializer
	model = User
