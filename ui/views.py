from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponseForbidden, HttpResponse
from django.core.urlresolvers import reverse


class LandingPageView(TemplateView):
	template_name = 'ui/index.html'


class InvoiceDetailView(TemplateView):
	template_name = 'ui/invoice_detail.html'


class CustomerView(TemplateView):
	template_name = 'ui/customer.html'


class LoginView(TemplateView):
	template_name = 'ui/login.html'

	def post(self, request, *args, **kwargs):
		username = request.POST['username']
		password = request.POST['password']

		user = authenticate(username = username, password = password)
		if user is not None:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/')
			else:
				return HttpResponseForbidden()
		else:
			return HttpResponse(status=401)


# class LogoutView(View):
	# def get
