from django.db import models
from tinymce.models import HTMLField

class Product(models.Model):
    name = models.CharField('Название', max_length=100)
    description = HTMLField('Описание', blank=True, default='Описание товара')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField('Количество на складе')
    type = models.CharField('Тип', max_length=50, choices=[
            ('sneakers', 'Кроссовки'),
            ('canvas_sneakers', 'Кеды'),
            ('running_shoes', 'Беговые кроссовки'),
            ('basketball_shoes', 'Баскетбольные кроссовки'),
            ('slip_ons', 'Слипоны'),
            ('boots', 'Ботинки'),
        ]
    )
    sex = models.CharField('Пол', max_length=10, choices=[('male', 'Мужской'), ('female', 'Женский')])
    image = models.ImageField('Изображение', upload_to='products/', blank=True, null=True)
    size = models.CharField(
        'Размер',
        max_length=10,
        choices=[
            ('36', '36'),
            ('37', '37'),
            ('38', '38'),
            ('39', '39'),
            ('40', '40'),
            ('41', '41'),
            ('42', '42'),
            ('43', '43'),
            ('44', '44'),
            ('45', '45')
        ]
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return self.name

