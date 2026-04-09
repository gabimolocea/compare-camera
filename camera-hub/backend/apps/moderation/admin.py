from django.contrib import admin
from .models import ModerationAction, Report


@admin.register(ModerationAction)
class ModerationActionAdmin(admin.ModelAdmin):
    list_display = ("moderator", "action", "target_type", "target_id", "created_at")
    list_filter = ("action",)
    readonly_fields = ("created_at",)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("reporter", "reason_type", "status", "target_type", "created_at")
    list_filter = ("reason_type", "status")
    readonly_fields = ("created_at",)
