from rest_framework import serializers
from apps.catalog.serializers import CameraListSerializer


class CompareResponseSerializer(serializers.Serializer):
    overview = serializers.DictField()
    winner_by_section = serializers.DictField()
    field_diffs = serializers.ListField()
