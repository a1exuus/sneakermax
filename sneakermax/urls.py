from django.contrib import admin
from django.urls import include, path
from shop import views as shop_views
import sneakermax.settings as settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),
    path('', shop_views.start_page, name='start_page'),
    path('catalog/', shop_views.catalog, name='catalog'),
    path('product/<int:product_id>/', shop_views.product_detail, name='product_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
