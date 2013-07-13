from django.conf.urls import patterns, url
from invoice.views import InvoiceIndex, InvoiceList, InvoiceDetail, SearchView

urlpatterns = patterns(r'^$',
    url(r'^$', InvoiceIndex.as_view(), name='index'),
    url(r'^invoices/(?P<pk>\d+)/$', InvoiceDetail.as_view(), name='detail'),
    url(r'^invoices/$', InvoiceList.as_view(), name='list'),
    url(r'^search/$', SearchView.as_view(), name='search'),
)
