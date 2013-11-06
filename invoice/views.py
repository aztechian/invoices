from invoice.models import Invoice
from invoice.serializers import InvoiceSerializer
from rest_framework import viewsets, filters, permissions, generics

from datetime import datetime, timedelta

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
		if user.is_authenticated():
			query = Invoice.objects.filter(owner=user)
			paid = self.request.QUERY_PARAMS.get('paid', None)
			if paid is not None:
				#the not is needed here because we're checking against null
				paid = paid not in ['True', 'true', 't', 'T', '1', 'y', 'Y']
				query = query.filter(paid_date__isnull=paid)
			sent = self.request.QUERY_PARAMS.get('sent', None)
			if sent is not None:
				sent = sent not in ['True', 'true', 't', 'T', '1', 'y', 'Y']
				query = query.filter(sent_date__isnull=sent)
			recent = self.request.QUERY_PARAMS.get('recent', None)
			if recent is not None:
				todayMinus30 = datetime.now() - timedelta(days=30)
				query = query.filter(invoice_date__gt=todayMinus30)
			return query
		else:
			return Invoice.objects.none()

