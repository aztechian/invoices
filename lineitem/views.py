# Create your views here.
from lineitem.serializers import LineItemSerializer
from lineitem.models import LineItem
from rest_framework import viewsets, permissions

class LineItemViewSet(viewsets.ModelViewSet):
	serializer_class = LineItemSerializer
	model = LineItem
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

	def get_queryset(self):
		user = self.request.user
		return LineItem.objects.filter(invoice__owner=user)

