from django.shortcuts import render
from .models import Product
from staff.models import Worker
from django.shortcuts import get_object_or_404


def start_page(request):
    products, workers = process_data(request)
    return render(request, 'index.html', {'products': products, 'workers': workers})


def process_data(request):
    products = Product.objects.filter(is_popular=True).prefetch_related('image')
    workers = Worker.objects.filter(is_active=True)
    return products, workers


def catalog(request):
    products = Product.objects.all().prefetch_related('image')
    sizes = []
    for product in products:
        size = product.size
        sizes.append(size)
    sizes = list(dict.fromkeys(sizes))
    sizes = sorted(sizes, key=lambda x: int(x.split('-')[0]))

    return render(request, 'catalog.html', {'products': products, 'sizes': sizes})


# def cart(request):


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    return render(request, 'product_detail.html', {
        'product': product,
    })