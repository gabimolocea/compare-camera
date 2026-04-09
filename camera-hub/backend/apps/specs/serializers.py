from rest_framework import serializers
from .models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec


class SensorSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorSpec
        exclude = ("camera",)


class VideoSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoSpec
        exclude = ("camera",)


class BodySpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodySpec
        exclude = ("camera",)


class AutofocusSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutofocusSpec
        exclude = ("camera",)


class ConnectivitySpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectivitySpec
        exclude = ("camera",)


class AllSpecsSerializer(serializers.Serializer):
    sensor = SensorSpecSerializer()
    video = VideoSpecSerializer()
    body = BodySpecSerializer()
    autofocus = AutofocusSpecSerializer()
    connectivity = ConnectivitySpecSerializer()
