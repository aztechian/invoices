from django.conf.urls import patterns, url
from invoice import views

urlpatterns = patterns(r'^$', 
	url(r'^$', views.index, name='index'),
	url(r'^(?P<invoice_id>\d+)/$', views.details, name='detail'),
	url(r'^add/$', views.add, name='add'),
)
