from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from shop.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('canceled', 'Отменен'),
    ]

    customer_name = models.CharField('Имя клиента', max_length=100)
    customer_email = models.EmailField('Email клиента')
    customer_phone = PhoneNumberField('Телефон клиента', blank=True, null=True)
    status = models.CharField('Статус заказа', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField('Дата заказа', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return f"Заказ {self.id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items'
    )

    quantity = models.PositiveIntegerField('Количество')

    def __str__(self):
        return f"Заказ {self.order.id} - {self.product.name} (x{self.quantity})"


class Customer(models.Model):
    name = models.CharField('Имя', max_length=100)
    email = models.EmailField('Email', unique=True)
    phone = PhoneNumberField('Телефон', blank=True, null=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return self.name