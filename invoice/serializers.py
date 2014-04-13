from rest_framework.serializers import HyperlinkedModelSerializer, HyperlinkedRelatedField
from rest_framework.fields import Field
from invoice.models import Invoice

class InvoiceSerializer(HyperlinkedModelSerializer):
	grand_total = Field(source='_get_grand_total')
	taxable_total = Field(source='_get_taxable_total')
	total_tax = Field(source='_get_total_tax')
	sub_total = Field(source='_get_sub_total')
	lineitems = HyperlinkedRelatedField(read_only=True, many=True, view_name='lineitem-detail')

	class Meta:
		model = Invoice
		read_only_fields = ('owner','first_name','last_name','service_street1','service_street2','service_state','service_zip_code', 'billing_street1','billing_street2','billing_state','billing_zip_code','phone','email')
