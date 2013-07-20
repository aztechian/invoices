from django.http import HttpResponse, Http404
from django.views.generic import ListView, DetailView
from invoice.models import Invoice
from invoice.serializers import InvoiceSerializer
from invoices.JsonResponse import JSONResponseMixin
from datetime import datetime, timedelta
from django.core import serializers
import re
from django.db.models import Q
from rest_framework import viewsets

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    model = Invoice

class SearchView(ListView):
    def get_queryset(self):
        query_string = ''
        found_entries = None
        if ('q' in self.request.GET or 'q' in self.request.POST) and (self.request.GET['q'].strip() or self.request.POST['q'].strip()):
            query_string = self.request.GET['q']
            entry_query = get_query(query_string, ['customer']) #'body',])
            print "Searching for %s" % query_string
            found_entries = Invoice.objects.filter(customer__contains=query_string).order_by('-invoice_date')

        return HttpResponse(serializers.serialize('json',found_entries), content_type="application/json")
        # return render(request, 'invoice/list.html', {'filtered_list': found_entries})
        # return render_to_response('search/search_results.html',
        #       { 'query_string': query_string, 'found_entries': found_entries },
        #       context_instance=RequestContext(request)
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
                    or_query = or_query | q
                    if query is None:
                        query = or_query
                    else:
                        query = query & or_query
        return query
