from django.http import JsonResponse
from django.shortcuts import render
import pandas as pd

# Create your views here.


def addCSV(request):
    if request.method == 'POST':
        file = request.FILES['file']

        try:

            if file.name.endswith('.csv'):
                df = pd.read_csv(file, low_memory=False)
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                df = pd.read_excel(file, low_memory=False)
            else:
                return JsonResponse({'error': 'Invalid file format'})
            return JsonResponse({'success': 'File received', 'data': df.to_dict(orient='records')})

        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})
