from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

class Worker(models.Model):
    name = models.CharField('Имя', max_length=100)
    position = models.CharField('Должность', max_length=100)
    photo = models.ImageField('Фото', upload_to='workers/', blank=True, null=True)
    email = models.EmailField('Email', blank=True, null=True)
    phonenumber = PhoneNumberField('Номер телефона', blank=True, null=True)
    created_at = models.DateTimeField('Дата найма', auto_now_add=True)
    is_active = models.BooleanField('Активен', default=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    def __str__(self):
        return self.name
