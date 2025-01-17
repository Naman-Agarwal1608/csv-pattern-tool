from django.http import JsonResponse, StreamingHttpResponse
import pandas as pd
from .regexllm import RegexLLM
from .models import receivedFile
import re
import json


CHUNKSIZE = 500  # Number of rows in go


def addCSV(request):
    if request.method == 'POST':
        file = request.FILES['file']

        try:

            if file.name.endswith('.csv'):
                reader = pd.read_csv(file, chunksize=CHUNKSIZE)
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                # reader = pd.read_excel(file, chunksize=CHUNKSIZE)
                df = pd.read_excel(file, engine='openpyxl')

                # Process the DataFrame in chunks
                reader = (df.iloc[i:i + CHUNKSIZE]
                          for i in range(0, df.shape[0], CHUNKSIZE))
            else:
                return JsonResponse({'error': 'Invalid file format'})
            saveFile = receivedFile.objects.create(file=file)

            def data_yielder():

                for chunk in reader:
                    yield chunk.to_json(orient='records')
                yield json.dumps([{"uuid": str(saveFile.uuid)}])

            # df = pd.concat(chunks)
            response = StreamingHttpResponse(
                data_yielder(), content_type='application/json')
            # response['Content-Disposition'] = f'attachment; filename="{file.name}"'
            # response['X-SaveFile-ID'] = saveFile.uuid

            # return JsonResponse({'success': 'File received', 'data': df[0:5].to_dict(orient='records'), "id": saveFile.uuid})

            return response

        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})


def getRegex(request):
    if request.method == 'POST':
        try:
            pattern = request.POST.get('pattern')
            regexllm_instance = RegexLLM()

            result = regexllm_instance.invokeLLM(pattern)
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})


def getDesc(request):
    if request.method == 'POST':
        try:
            uuid = request.POST.get('uuid')
            regexllm_instance = RegexLLM(task="desc", id=uuid)

            result = regexllm_instance.invokeLLM()
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})


def getDummyData(request):
    if request.method == 'POST':
        try:
            uuid = request.POST.get('uuid')
            regexllm_instance = RegexLLM(task="dummy", id=uuid)

            result = regexllm_instance.invokeLLM()
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})


def replace(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        regexLst = data.get('regex')
        replacementLst = data.get('replacement')
        file_id = data.get('id')

        try:
            file = receivedFile.objects.get(uuid=file_id).file
            if file.name.endswith('.csv'):
                reader = pd.read_csv(file, chunksize=CHUNKSIZE)
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                df = pd.read_excel(file, engine='openpyxl')
                # Process the DataFrame in chunks
                reader = (df.iloc[i:i + CHUNKSIZE]
                          for i in range(0, df.shape[0], CHUNKSIZE))

            def regexReplace(reader):
                for chunk in reader:
                    for (regex, replacement) in zip(regexLst, replacementLst):
                        chunk = chunk.map(
                            lambda x: re.sub(regex, replacement, str(x)))
                    yield chunk.to_json(orient='records')

            response = StreamingHttpResponse(
                regexReplace(reader), content_type='application/json')
            # df = df.applymap(lambda x: re.sub(regexStr, replacement, str(x)))
            return response
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request'})
