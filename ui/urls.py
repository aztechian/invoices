from django.conf.urls import patterns, url
from ui.views import LandingPageView, InvoiceDetailView, CustomerView

urlpatterns = patterns('',
	url(r'^$', LandingPageView.as_view()),
	url(r'^invoices/', InvoiceDetailView.as_view()),
	url(r'^customers/', CustomerView.as_view())
)