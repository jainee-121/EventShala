from django.urls import path
from . import views


urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/mine/", views.NoteListByAuthor.as_view(), name="note-list-by-author"),
    path("notes/book/<int:pk>/", views.NoteBook.as_view(), name="note-book"),
    path("notes/tickets/", views.MyTickets.as_view(), name="my-tickets"),
    path("notes/<int:note_id>/orders/", views.OrderListByNote.as_view(), name="order-list-by-note"),
] 
