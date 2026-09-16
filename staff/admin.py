from django.contrib import admin
from .models import Worker

@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'phonenumber', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'position')
    search_fields = ('name', 'position', 'email', 'phonenumber')
    ordering = ('-created_at',)