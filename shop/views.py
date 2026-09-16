from django.shortcuts import render
from .models import Product


def start_page(request):
    products = process_products(request)
    return render(request, 'index.html', {'products': products})


def process_products(request):
    products = Product.objects.filter(is_popular=True)
    return products