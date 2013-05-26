from django.http import HttpResponse, Http404
from django.shortcuts import render, get_object_or_404
from invoice.models import Invoice

def index(request):
	latest_invoice_list = Invoice.objects.order_by('-invoice_date')[:6]
	context = {
		'latest_invoice_list': latest_invoice_list,
	}
	return render(request, 'invoice/index.html', context)

def details(request, invoice_id):
	inv = get_object_or_404(Invoice, pk=invoice_id)
	return HttpResponse("Invoice #%d details" % inv.pk)

def add(request):
	return HttpResponse("Creating a new invoice")
