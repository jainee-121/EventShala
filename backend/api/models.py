from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timezone

class Categories(models.TextChoices):
    WORLD = 'world'
    ENVIRONMENT = 'environment'
    TECHNOLOGY = 'technology'
    DESIGN = 'design'
    CULTURE = 'culture'
    BUSINESS = 'business'
    POLITICS = 'politics'
    TRAVEL = 'travel'

class Note(models.Model):
    title = models.CharField(max_length=100)
    slug = models.CharField(max_length=200, unique=True)
    category = models.CharField(max_length=50, choices=Categories.choices, default=Categories.TECHNOLOGY)
    excerpt = models.CharField(max_length=150, default="This is a default excerpt.")
    content = models.TextField()
    photo = models.ImageField(upload_to='notes_photos/images', default='default_event_photo.jpg')
    location = models.CharField(max_length=255, null=False, default='Unknown location')
    start_date = models.DateTimeField(null=False, default=datetime.today)  # Default set to the current date
    end_date = models.DateTimeField(null=False, default=datetime.today)  # Default to today's date
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False, default=0.00)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    is_published = models.BooleanField(default=True)
    is_expired = models.BooleanField(default=False)



    def save(self, *args, **kwargs):
        """Override save method to check expiry before saving."""
        if self.start_date < datetime.now(timezone.utc):
            self.is_expired = True
        else:
            self.is_expired = False
        super(Note, self).save(*args, **kwargs)  # Save the note without recursion


    def __str__(self):
        return self.title
    
class Order(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE,related_name='notes_object')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="order_notes")
    date_created = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"Order by {self.author.username} for {self.note.title} on {self.date_created.strftime('%Y-%m-%d')}"

