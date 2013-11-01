from rest_framework.viewsets import ModelViewSet
from rest_framework import filters, permissions
from customer.models import Customer
from django.contrib.auth.models import Permission, User
from customer.serializers import CustomerSerializer, PermissionSerializer, UserSerializer

class CustomerViewSet(ModelViewSet):
	serializer_class = CustomerSerializer
	model = Customer
	permission_classes = (permissions.IsAuthenticated,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('first_name', 'last_name', 'username', 'street1', 'street2', 'city', 'zip_code')
	
	def pre_save(self, obj):
		obj.owner = self.request.user
	
	def get_queryset(self):
		user = self.request.user
		return Customer.objects.filter(owner=user)

class PermissionViewSet(ModelViewSet):
	serializer_class = PermissionSerializer
	model = Permission
	permission_classes = (permissions.IsAuthenticated,)

class UserViewSet(ModelViewSet):
	serializer_class = UserSerializer
	model = User
	permission_classes = (permissions.IsAuthenticated,)
