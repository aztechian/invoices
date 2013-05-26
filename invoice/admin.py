from django.contrib import admin
from invoice.models import Invoice
from lineitem.models import LineItem

class LineItemInvoice(admin.TabularInline):
	model = LineItem
	extra = 3

class InvoiceAdmin(admin.ModelAdmin):
	readonly_fields = ('invoice_date',)
	list_display = ('pk', 'customer', 'invoice_date', '_is_paid', 'grand_total')
	fieldsets = [
		(None,       {'fields': ['customer', 'invoice_date', 'paid_date']}
		)
	]
	inlines = [LineItemInvoice]
	date_heirarchy = 'invoice_date'

admin.site.register(Invoice, InvoiceAdmin)
