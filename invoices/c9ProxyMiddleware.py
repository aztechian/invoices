
class c9ProxyMiddleware(object):
	def process_request(self, request):
		request.META['HTTP_X_FORWARDED_HOST'] = 'invoices-c9-aztechian.c9.io'
