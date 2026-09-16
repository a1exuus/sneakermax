from django.db import models
from tinymce.models import HTMLField

class Product(models.Model):
    name = models.CharField('Название', max_length=100)
    description = HTMLField('Описание', blank=True, default='Описание товара')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField('Количество на складе')
    is_popular = models.BooleanField('Популярный', default=False)
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
    size = models.CharField(
        'Размер',
        max_length=10,
        choices=[
            ('36-38', '36-38'),
            ('37-39', '37-39'),
            ('38-40', '38-40'),
            ('39-41', '39-41'),
            ('40-42', '40-42'),
            ('41-43', '41-43'),
            ('42-44', '42-44'),
            ('43-45', '43-45'),
            ('44-46', '44-46'),
            ('45-47', '45-47')
        ]
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='image',
        on_delete=models.CASCADE,
        verbose_name='Товар'
    )
    image = models.ImageField('Картинка', upload_to='products/')
    order = models.PositiveIntegerField(
        default=0, verbose_name='Порядок отображения', db_index=True
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Изображение для {self.product.name}"

