from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse
from ui.views import LandingPageView, InvoiceDetailView, CustomerView, LoginView

urlpatterns = patterns(
	'',
	url(r'^$', LandingPageView.as_view(), name="ui-index"),
	url(r'^invoices/', InvoiceDetailView.as_view(), name="ui-invoice"),
	url(r'^customers/', CustomerView.as_view(), name="ui-customer"),
	url(r'^login/$', LoginView.as_view(), name="ui-login"),
	url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'})
)
