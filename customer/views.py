# Create your views here.
from rest_framework.viewsets import ModelViewSet
from customer.models import Customer
from django.contrib.auth.models import Permission
from customer.serializers import CustomerSerializer, PermissionSerializer

class CustomerViewSet(ModelViewSet):
    serializer_class = CustomerSerializer
    model = Customer

class PermissionViewSet(ModelViewSet):
    serializer_class = PermissionSerializer
    model = Permission