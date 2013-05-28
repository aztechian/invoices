from django.http import HttpResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.detail import SingleObjectTemplateResponseMixin
from invoice.models import Invoice
from invoices.JsonResponse import JSONResponseMixin
from datetime import datetime, timedelta
import json


class IndexView(generic.ListView):
	template_name = 'invoice/index.html'
	context_object_name = 'latest_invoice_list'

	def get_queryset(self):
		return Invoice.objects.order_by('-invoice_date')[:6]

# def index(request):
# 	latest_invoice_list = Invoice.objects.order_by('-invoice_date')[:6]
# 	context = {
# 		'latest_invoice_list': latest_invoice_list,
# 	}
# 	return render(request, 'invoice/index.html', context)

class DetailView(generic.DetailView):
	model = Invoice


class ListView(generic.ListView):
	model = Invoice

	def get_queryset(self):
		filter = self.request.GET['filter'].lower()
		resultSet = None
		if filter == 'unpaid' or filter == '' or filter == None:
			resultSet = Invoice.objects.filter(paid_date__isnull=True)
		elif filter == 'unsent':
			resultSet = Invoice.objects.filter(sent_date__isnull=True)
		elif filter == 'recent':
			start = datetime.datetime.now() - datetime.timedelta(-35)
			resultSet = Invoice.objects.filter(invoice_date__gt=start)
		# if self.request.META['X_REQUESTED_WITH'] == 'XmlHttpRequest':
		return json.dumps(resultSet)

# class HybridDetailView(JSONResponseMixin, SingleObjectTemplateResponseMixin, BaseDetailView):
#     def render_to_response(self, context):
#         # Look for a 'format=json' GET argument
#         if self.request.GET.get('format','html') == 'json':
#             return JSONResponseMixin.render_to_response(self, context)
#         else:
#             return SingleObjectTemplateResponseMixin.render_to_response(self, context)


def list(request):
	unsent_list = Invoice.objects.filter(paid_date__isnull=True)
	context = {
		'filtered_list': unsent_list
	}
	return render(request, 'invoice/list.html', context)

def add(request):
	return HttpResponse("Blah")
