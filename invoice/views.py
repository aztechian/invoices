from invoice.models import Invoice
from invoice.serializers import InvoiceSerializer
from rest_framework import viewsets, filters

class InvoiceViewSet(viewsets.ModelViewSet):
	serializer_class = InvoiceSerializer
	model = Invoice
	filter_backends = (filters.SearchFilter,)
	search_fields = ('pk', 'shorturl', 'lineitems__description', 'first_name', 'last_name', 'email')
	ordering = 'invoice_date',