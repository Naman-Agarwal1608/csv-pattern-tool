from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from .models import receivedFile
import pandas as pd

import json
import re

CHUNKSIZE = 10000  # Number of rows in go

# Number of rows to sample from each chunk, 10% of the chunksize
SAMPLE_CHUNKSIZE = int(CHUNKSIZE * 0.1)


class RegexLLM:

    regex_prompt = """
        You are a chatbot assistant. Your task is to analyze a natural language instruction.
        The instruction is a sentence that instrcuts to find a specific pattern and then replace it with
        some other text. You need to generate a regex pattern that can be used to find the specific pattern
        and also to find the replacement text. Then you need to return the response in a JSON formatted
        string with keys:
        {{
            "regex": "regex pattern as a string",
            "replacement": "replacement text here"
        }}
        and if you can't find any pattern or replacement, you need to return the error in the JSON
        formatted string stating the error message:
        {{
            "error": "error message here"
        }}

        Make sure to escape back slashes and other characters in regex pattern. Also don't add any
        markdown info or extra space or newline characters, just return the JSON string.

        The instrcution is: {instruction}
    """

    desc_prompt = """
        You are a chatbot assistant. Your task is to analyse the given data and generat a comprehensive
        and detailed description of the data. Remember the data included is not complete it is just a sample
        data. You need to generate a description of the data in a JSON formatted string with keys:
        {{ "description": "description of the data here" }}
        and if you can't generate the description, you need to return the error in the JSON formatted
        string stating the error message:
        {{ "error": "error message here" }}

        Remember the data will be given in JSON just because it is easy to parse and read. You need to
        assume that the user had provided the data as a CSV or excel file, so just be specific and talk about
        data only.

        The data in the JSON format is: {data} 
    """

    dummyData_prompt = """
        You are a chatbot assistant. Your task is to generate a dummy data based on the given data.
        You need to generate a dummy data in a JSON formatted string/list with keys:
        [{{ "column_1": "value here", "column_2": "value here", ... }}, ...]

        Remember this data is not complete and just a sample data, so don't make any statistical analysis and
        assumptions about the data. Just generate a simple dummy data based on the given data. The data should
        be in the same format as the given data and also of just 10 rows. Also make sure that data looks realistic.

        The data in the JSON format is: {data}
    """

    def __init__(self, task="regex", id=None):
        """
        task: str
            The task to perform by the LLM. Default is 'regex'.
            Other tasks are 'desc' and 'dummy'.
        id: str
            The id of the file to perform the task on. Default is None.
        """

        if task == "regex":
            prompt_template = PromptTemplate(
                template=self.regex_prompt,
                input_variables=["instruction"],
            )
        elif id:
            file = receivedFile.objects.get(uuid=id).file
            self.sample_data = []
            if file.name.endswith('.csv'):
                reader = pd.read_csv(file, chunksize=CHUNKSIZE)
            elif file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                df = pd.read_excel(file, engine='openpyxl')
                # Process the DataFrame in chunks
                reader = (df.iloc[i:i + CHUNKSIZE]
                          for i in range(0, df.shape[0], CHUNKSIZE))

            # Due to limitation of credits, only 20 rows of data would be passed
            # as sample data

            for chunk in reader:
                # self.sample_data.append(chunk.sample(
                #     min(SAMPLE_CHUNKSIZE, len(chunk))).to_json(orient='records'))
                self.sample_data.append(chunk)

            df = pd.concat(self.sample_data)
            self.sample_data = df.sample(min(20, len(df))).to_json(
                orient='records')  # 20 because of limited credits

            if task == "dummy":
                prompt_template = PromptTemplate(
                    template=self.dummyData_prompt,
                    input_variables=["data"],
                )
            elif task == "desc":
                prompt_template = PromptTemplate(
                    template=self.desc_prompt,
                    input_variables=["data"],
                )
        else:
            raise ValueError("Invalid task or id")

        output_parser = StrOutputParser()
        model = ChatOpenAI(model="gpt-4-turbo", temperature=0.0)

        self.chain = prompt_template | model | output_parser

    def invokeLLM(self, instruction=None):
        if instruction:
            response = self.chain.invoke(instruction)
        else:
            response = self.chain.invoke(self.sample_data)
        clean_response = response.strip('```json').strip().replace('\n', '')
        data = json.loads(clean_response)
        return data


if __name__ == "__main__":
    dry_run = RegexLLM()
    resposne = dry_run.invokeLLM(
        "Find email address and replace it with 'email' in the text")
    print(resposne, type(resposne))
    regex = resposne.get('regex')
    print(regex, type(regex))

    pattern = re.compile(regex)
    print(pattern.pattern, type(pattern.pattern))
    print(json.dumps({"regex": r'{}'.format(pattern.pattern), }))
    # du = json.dumps(resposne)
    # print(du, type(du))
