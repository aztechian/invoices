from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from lineitem.views import LineItemViewSet
from invoice.views import InvoiceViewSet
from customer.views import CustomerViewSet, PermissionViewSet, UserViewSet, USStateList

router = DefaultRouter()
router.register(r'lineitems', LineItemViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'users', UserViewSet)
router.register(r'states', USStateList, base_name='states')

urlpatterns = patterns('',
	url(r'^api/', include(router.urls)),
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	# url(r'^api/invoices/(?P<unpaid>.+)/$', UnpaidInvoiceView.as_view()),
	url(r'^', include('ui.urls', namespace="ui"))
)
