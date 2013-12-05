from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return render(request, 'stackedit/index.html')

def viewer(request):
    return render(request, 'stackedit/viewer.html')

def recovery(request):
    return render(request, 'stackedit/recovery.html')