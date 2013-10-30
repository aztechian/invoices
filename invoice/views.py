from invoice.models import Invoice
from invoice.serializers import InvoiceSerializer
from rest_framework import viewsets, filters, permissions


class InvoiceViewSet(viewsets.ModelViewSet):
	serializer_class = InvoiceSerializer
	model = Invoice
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('pk', 'shorturl', 'lineitems__description', 'first_name', 'last_name', 'email')
	ordering = 'invoice_date',

	def pre_save(self, obj):
		obj.owner = self.request.user

	def get_queryset(self):
		user = self.request.user
		return Invoice.objects.filter(owner=user)

