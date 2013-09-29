from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse
from ui.views import LandingPageView, InvoiceDetailView, CustomerView, AjaxLoginView, SignupView

urlpatterns = patterns(
	'',
	url(r'^$', LandingPageView.as_view(), name="ui-index"),
	url(r'^invoices/', InvoiceDetailView.as_view(), name="ui-invoice"),
	url(r'^customers/', CustomerView.as_view(), name="ui-customer"),
	url(r'^login$', AjaxLoginView.as_view()),
	url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'ui/login.html'}, name="ui-login"),
	url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
	url(r'^signup/$', SignupView.as_view())
)
