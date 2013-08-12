# Create your views here.
from lineitem.serializers import LineItemSerializer
from lineitem.models import LineItem
from rest_framework import viewsets

class LineItemViewSet(viewsets.ModelViewSet):
    serializer_class = LineItemSerializer
    model = LineItem
