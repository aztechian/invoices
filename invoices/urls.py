from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from lineitem.views import LineItemViewSet
from invoice.views import InvoiceViewSet
from customer.views import CustomerViewSet, PermissionViewSet, UserViewSet

router = DefaultRouter()
router.register(r'lineitems', LineItemViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'users', UserViewSet)

urlpatterns = patterns('',
	# Examples:
	# url(r'^$', 'invoices.views.home', name='home'),
	# url(r'^invoices/', include('invoices.foo.urls')),

	# Uncomment the admin/doc line below to enable admin documentation:
	# url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

	# Uncomment the next line to enable the admin:
	# url(r'^admin/', include(admin.site.urls)),

	url(r'^api/', include(router.urls)),
	url(r'^', include('ui.urls', namespace="ui"))
)
