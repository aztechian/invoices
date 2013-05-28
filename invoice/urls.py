from django.conf.urls import patterns, url
from invoice import views

urlpatterns = patterns(r'^$', 
	url(r'^$', views.IndexView.as_view(), name='index'),
	url(r'^(?P<pk>\d+)/$', views.DetailView.as_view(), name='detail'),
	url(r'^add/$', views.add, name='add'),
	url(r'^list/$', views.list, name='list'),
)
