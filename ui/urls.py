from django.conf.urls import patterns, url
from ui.views import LandingPageView

urlpatterns = patterns('',
	url(r'^$', LandingPageView.as_view())
)