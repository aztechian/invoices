from django.views.generic import TemplateView

class LandingPageView(TemplateView):
	template_name = 'ui/index.html'

class InvoiceDetailView(TemplateView):
	template_name = 'ui/invoice_detail.html'

class CustomerView(TemplateView):
	template_name = 'ui/customer.html'
