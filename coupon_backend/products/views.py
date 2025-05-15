from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Product, ProductCoupon
from .serializers import ProductSerializer, ProductCouponSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductCouponViewSet(ModelViewSet):
    queryset = ProductCoupon.objects.all()
    serializer_class = ProductCouponSerializer

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        coupon = self.get_object()
        coupon.likes += 1
        coupon.save()
        return Response({'likes': coupon.likes})

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk=None):
        coupon = self.get_object()
        coupon.dislikes += 1
        coupon.save()
        return Response({'dislikes': coupon.dislikes})

    @action(detail=True, methods=['post'])
    def use(self, request, pk=None):
        coupon = self.get_object()
        coupon.used_count += 1
        coupon.used_today += 1
        coupon.save()
        return Response({'used_count': coupon.used_count, 'used_today': coupon.used_today})
