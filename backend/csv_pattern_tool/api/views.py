from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.


def addCSV(request):
    if request.method == 'POST':
        csv_file = request.FILES['file']
        print(csv_file)
        return JsonResponse({'success': 'File received'})
    else:
        return JsonResponse({'error': 'Invalid request'})
