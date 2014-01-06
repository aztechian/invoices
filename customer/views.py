from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import filters, permissions, mixins
from customer.models import Customer
from django.contrib.auth.models import Permission, User
from django_localflavor_us import us_states
from customer.serializers import CustomerSerializer, PermissionSerializer, UserSerializer, StateSerializer

class CustomerViewSet(ModelViewSet):
	serializer_class = CustomerSerializer
	model = Customer
	permission_classes = (permissions.IsAuthenticated,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('first_name', 'last_name', 'username', 'street1', 'street2', 'city', 'zip_code')
	
	def pre_save(self, obj):
		obj.owner = self.request.user.customer
	
	def get_queryset(self):
		user = self.request.user.customer
		return Customer.objects.filter(owner=user)

class PermissionViewSet(ModelViewSet):
	serializer_class = PermissionSerializer
	model = Permission
	permission_classes = (permissions.IsAuthenticated,)

class UserViewSet(ModelViewSet):
	serializer_class = UserSerializer
	model = User
	permission_classes = (permissions.IsAuthenticated,)

class USStateList(GenericViewSet, mixins.ListModelMixin):
	serializer_class = StateSerializer
	permission_classes = (permissions.AllowAny,)
	paginate_by = None
	
	def get_queryset(self):
		results = []
		for obj in us_states.STATE_CHOICES:
			results.append({ 'id': obj[0], 'text': obj[1] })
		return results



