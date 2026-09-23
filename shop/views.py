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

    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    selected_genders = request.GET.getlist('gender')
    selected_size = request.GET.get('size')

    if min_price:
        products = products.filter(price__gte=min_price)

    if max_price:
        products = products.filter(price__lte=max_price)

    if selected_genders:
        products = products.filter(sex__in=selected_genders)

    if selected_size:
        products = products.filter(size=selected_size)

    sizes = (
        Product.objects
        .values_list('size', flat=True)
        .distinct()
    )

    sizes = sorted(
        sizes,
        key=lambda x: int(x.split('-')[0])
    )

    return render(request, 'catalog.html', {
        'products': products,
        'sizes': sizes,
        'min_price': min_price or 1850,
        'max_price': max_price or 25768,
        'selected_gender': selected_genders,
        'selected_size': selected_size,
    })


# def cart(request):


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    return render(request, 'product_detail.html', {
        'product': product,
    })