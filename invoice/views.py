from django.http import HttpResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.detail import SingleObjectTemplateResponseMixin
from invoice.models import Invoice
from invoices.JsonResponse import JSONResponseMixin
from datetime import datetime, timedelta
from django.core import serializers
import re
from django.db.models import Q


class IndexView(generic.ListView):
	template_name = 'invoice/index.html'
	context_object_name = 'latest_invoice_list'

	def get_queryset(self):
		return Invoice.objects.order_by('-invoice_date')[:6]

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
		return serializers.serialize('json', resultSet)

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

def search(request):
	query_string = ''
	found_entries = None
	if ('q' in request.GET or 'q' in request.POST) and (request.GET['q'].strip() or request.POST['q'].strip()):
		query_string = request.GET['q']
		entry_query = get_query(query_string, ['customer']) #'body',])
		print "Searching for %s" % query_string
		found_entries = Invoice.objects.filter(customer__contains=query_string).order_by('-invoice_date')

	# return HttpResponse(serializers.serialize('json',found_entries), content_type="application/json")
	return render(request, 'invoice/list.html', {'filtered_list': found_entries})
	# return render_to_response('search/search_results.html',
	# 	{ 'query_string': query_string, 'found_entries': found_entries },
	# 	context_instance=RequestContext(request)
	#)

def normalize_query(query_string,
	findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
	normspace=re.compile(r'\s{2,}').sub):
	''' Splits the query string in invidual keywords, getting rid of unecessary spaces
		and grouping quoted words together.
		Example:

		>>> normalize_query('  some random  words "with   quotes  " and   spaces')
		['some', 'random', 'words', 'with quotes', 'and', 'spaces']
	'''
	return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)] 

def get_query(query_string, search_fields):
	''' Returns a query, that is a combination of Q objects. That combination
		aims to search keywords within a model by testing the given search fields.
	'''
    
	query = None # Query to search for every search term        
	terms = normalize_query(query_string)
	for term in terms:
		or_query = None # Query to search for a given term in each field
		for field_name in search_fields:
			q = Q(**{"%s__icontains" % field_name: term})
			if or_query is None:
				or_query = q
			else:
				or_query = or_query | q
				if query is None:
					query = or_query
				else:
					query = query & or_query
	return query

