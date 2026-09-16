from django.shortcuts import render
from .models import Product
from staff.models import Worker


def start_page(request):
    products, workers = process_data(request)
    return render(request, 'index.html', {'products': products, 'workers': workers})


def process_data(request):
    products = Product.objects.filter(is_popular=True).prefetch_related('image')
    workers = Worker.objects.filter(is_active=True)
    return products, workers