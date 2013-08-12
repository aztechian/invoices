from rest_framework import serializers
from rest_framework.fields import Field
from lineitem.models import LineItem

class LineItemSerializer(serializers.HyperlinkedModelSerializer):
    total = Field(source='_get_total')

    class Meta:
        model = LineItem

