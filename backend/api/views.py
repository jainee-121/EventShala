from datetime import timezone
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import OrderSerializer, UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Categories, Note,Order
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
     
    def get_queryset(self):
        user = self.request.user
        booked_notes = Order.objects.filter(author=user).values_list('note_id', flat=True)
        queryset = Note.objects.exclude(id__in=booked_notes).filter(is_published=True, is_expired=False)
        
        slug_query = self.request.query_params.get('slug', None)
        if slug_query:
            queryset = queryset.filter(slug__icontains=slug_query)

        category_query = self.request.query_params.get('category', None)
        if category_query and category_query in dict(Categories.choices):
            queryset = queryset.filter(category=category_query)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        slug = title.replace(" ", "-").lower()
        serializer.save(author=self.request.user, slug=slug)

class NoteListByAuthor(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    # Filter notes by the current user (author)
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user, is_published=True).order_by('-created_at')


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class NoteBook(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            note = Note.objects.get(pk=pk, is_published=True)  # Ensure the note is published
            # Check if the user has already booked this note
            if Order.objects.filter(note=note, author=request.user).exists():
                return Response({"message": "You have already booked this event."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the order
            Order.objects.create(note=note, author=request.user)

            return Response({"message": "Note booked successfully!"}, status=status.HTTP_201_CREATED)

        except Note.DoesNotExist:
            return Response({"error": "Note not found or already booked."}, status=status.HTTP_404_NOT_FOUND)


class MyTickets(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get all notes the user has booked
        return Note.objects.filter(notes_object__author=self.request.user)

class OrderListByNote(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['note_id']
        # Ensure the requesting user is the author of the note
        note = Note.objects.get(id=note_id)
        if note.author != self.request.user:
            raise  PermissionDenied("You do not have permission to view these orders.")
        return Order.objects.filter(note=note).select_related('author')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]