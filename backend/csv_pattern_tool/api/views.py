from django.http import JsonResponse
import pandas as pd
from .regexllm import RegexLLM
from .models import receivedFile
import re
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
            saveFile = receivedFile.objects.create(file=file)
            return JsonResponse({'success': 'File received', 'data': df.to_dict(orient='records'), "id": saveFile.uuid})

        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})


def getRegex(request):
    if request.method == 'POST':
        pattern = request.POST.get('pattern')

        # Not working don't know why
        # if 'class_instance' not in request.session:
        #     regexllm_instance = RegexLLM()
        #     request.session['class_instance'] = RegexLLM()
        #     request.session.modified = True

        # else:
        #     regexllm_instance = request.session['class_instance']
        regexllm_instance = RegexLLM()

        result = regexllm_instance.invokeLLM(pattern)
        return JsonResponse(result, safe=False)


def replace(request):
    if request.method == 'POST':
        regexStr = request.POST.get('regex')
        replacement = request.POST.get('replacement')
        file_id = request.POST.get('id')
        print(regexStr, replacement, file_id)
        try:
            file = receivedFile.objects.get(uuid=file_id).file
            if file.name.endswith('.csv'):
                df = pd.read_csv(file, low_memory=False)
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                df = pd.read_excel(file, low_memory=False)
            # df = df.replace(to_replace=r'{}'.format(regexStr),
            #                 value=replacement, regex=True)
            df = df.applymap(lambda x: re.sub(regexStr, replacement, str(x)))
            print(df)
            return JsonResponse({'success': 'Pattern replaced', 'data': df.to_dict(orient='records')})
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})
