# Generated by Django 3.2.19 on 2023-05-17 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SecurityFootage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
