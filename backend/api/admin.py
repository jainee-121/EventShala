from django.contrib import admin
from .models import Note, Order  # Import DeletedNote model
admin.site.register(Note)
admin.site.register(Order)
