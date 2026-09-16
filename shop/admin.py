from django.contrib import admin
from .models import Product
from adminsortable2.admin import SortableAdminBase, SortableTabularInline
from django.utils.html import format_html
from .models import ProductImage


def preview_inline(obj):
    if obj.image:
        return format_html(
            '<img src="{}" style="max-width: 300px; max-height: 200px" />',
            obj.image.url
        )
    return format_html('<span style="color: red;">Изображение не загружено</span>')


class AdminInLine(SortableTabularInline):
    model = ProductImage
    can_delete = False
    extra = 0
    fields = (('image', preview_inline))
    readonly_fields = [preview_inline,]
    verbose_name_plural = 'Фотографии'

@admin.register(Product)
class ProductAdmin(SortableAdminBase, admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'price', 'created_at')
    inlines = [AdminInLine]
    list_filter = ('type', 'created_at')
    search_fields = ('name', 'description')

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    def preview(obj):
        return format_html(
            '<img src="{}" style="max-width: 300px; max-height: 200px" />',
            obj.image.url
            )

    list_display = ['product',]
    raw_id_fields = ['product',]
    readonly_fields = [preview,]