from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponseForbidden, HttpResponse
from django.core.urlresolvers import reverse
from json import dumps


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
				if request.is_ajax():
					data = {}
					data.first_name = user.first_name
					data.username = user.username
					return HttpResponse(content=dumps(data), content_type="application/json; charset=UTF-8", status=200)
				else:
					return HttpResponseRedirect(reverse('ui:ui-index'))
			else:
				return HttpResponseForbidden()
		else:
			return HttpResponse(status=401)


class SignupView(TemplateView):
	template_name = 'ui/signup.html'
