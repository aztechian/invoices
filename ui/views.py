from django.views.generic import TemplateView, View
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


class AjaxLoginView(View):
	http_method_names = ['get','post']
	
	def get(self, request, *args, **kwargs):
		return HttpResponseRedirect(reverse('ui:ui-login'))
	
	def post(self, request, *args, **kwargs):
		username = request.POST['username']
		password = request.POST['password']

		user = authenticate(username = username, password = password)
		data = {}
		if user is not None:
			if user.is_active:
				login(request, user)
				data.first_name = user.first_name
				data.username = user.username
				data.status = True
				return HttpResponse(content=dumps(data), content_type="application/json; charset=UTF-8", status=200)
			else:
				data.status = False
				data.reason = "Your account is not yet active. Please, check your email first."
		else:
			data.status = False
			data.reason = "Invalid username or password"
			return HttpResponse(content=dumps(data), content_type="application/json; charset=UTF-8", status=403)


class SignupView(TemplateView):
	template_name = 'ui/signup.html'
