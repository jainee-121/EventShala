from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Order


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)  # New field for password confirmation

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "confirm_password"]  # Add 'email' and 'confirm_password'
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},  # Ensure password confirmation is write-only
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before creating the user
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # Include author details
    class Meta:
        model = Note
        fields = ['id', 'title', 'slug', 'category', 'excerpt', 'content', 'photo', 'location', 'start_date', 'end_date', 'created_at', 'price', 'author', 'is_published', 'is_expired']

        extra_kwargs = {"author": {"read_only": True}, "slug": {"read_only": True}, 'is_published':{'read_only': True},'is_expired':{'read_only': True}}


class OrderSerializer(serializers.ModelSerializer):
    note = NoteSerializer(read_only=True)  # Include note details in the response if required
    author = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "note", "author", "date_created"]
        extra_kwargs = {"author": {"read_only": True}, "note": {"read_only": True}}
