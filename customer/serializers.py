from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer
from django.contrib.auth.models import Permission
from customer.models import Customer

class CustomerSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Customer

class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
