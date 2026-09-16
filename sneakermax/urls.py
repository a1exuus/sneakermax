from django.contrib import admin
from django.urls import include, path
from shop import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),
    path('', views.start_page, name='start_page'),
]
