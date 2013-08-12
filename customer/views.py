from rest_framework.viewsets import ModelViewSet
from customer.models import Customer
from django.contrib.auth.models import Permission, User
from customer.serializers import CustomerSerializer, PermissionSerializer, UserSerializer

class CustomerViewSet(ModelViewSet):
	serializer_class = CustomerSerializer
	model = Customer

class PermissionViewSet(ModelViewSet):
	serializer_class = PermissionSerializer
	model = Permission

class UserViewSet(ModelViewSet):
	serializer_class = UserSerializer
	model = User