import re
from django.http import JsonResponse
import pandas as pd
from .regexllm import RegexLLM
# from backend.csv_pattern_tool.api import regexllm

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


def getRegex(request):
    if request.method == 'POST':
        pattern = request.POST.get('pattern')

        # if 'class_instance' not in request.session:
        #     regexllm_instance = RegexLLM()
        #     request.session['class_instance'] = RegexLLM()
        #     request.session.modified = True

        # else:
        #     regexllm_instance = request.session['class_instance']
        regexllm_instance = RegexLLM()

        result = regexllm_instance.invokeLLM(pattern)
        return JsonResponse(result, safe=False)
