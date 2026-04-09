from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "display_name", "role", "reputation_score", "is_active")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "username", "display_name")
    ordering = ("-created_at",)
    fieldsets = UserAdmin.fieldsets + (
        ("Profile", {"fields": ("display_name", "avatar", "bio", "role", "reputation_score")}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "country", "review_count_cache", "contribution_count_cache")
    search_fields = ("user__email", "user__username")
