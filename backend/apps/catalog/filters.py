import django_filters
from .models import Camera


class CameraFilter(django_filters.FilterSet):
    brand = django_filters.CharFilter(field_name="brand__slug", lookup_expr="iexact")
    category = django_filters.CharFilter(lookup_expr="iexact")
    status = django_filters.CharFilter(lookup_expr="iexact")
    release_year_min = django_filters.NumberFilter(field_name="release_date__year", lookup_expr="gte")
    release_year_max = django_filters.NumberFilter(field_name="release_date__year", lookup_expr="lte")
    price_min = django_filters.NumberFilter(field_name="current_price_estimate", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="current_price_estimate", lookup_expr="lte")

    class Meta:
        model = Camera
        fields = ["brand", "category", "status"]
