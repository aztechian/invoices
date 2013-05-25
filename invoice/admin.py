from django.contrib import admin
from invoice.models import Invoice
from lineitem.models import LineItem

class LineItemInvoice(admin.TabularInline):
	model = LineItem
	extra = 3

class InvoiceAdmin(admin.ModelAdmin):
	list_display = ('customer', 'invoice_date', 'taxable_total', 'grand_total')
	fieldsets = [
		(None,       {'fields': ['customer']}
		)
	]
	inlines = [LineItemInvoice]

admin.site.register(Invoice, InvoiceAdmin)
