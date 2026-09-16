from django.contrib import admin
from django.urls import include, path
from shop import views
import sneakermax.settings as settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),
    path('', views.start_page, name='start_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
