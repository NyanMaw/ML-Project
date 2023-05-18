from django.db import models


# Create your models here.
class SecurityFootage(models.Model):
    video = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)