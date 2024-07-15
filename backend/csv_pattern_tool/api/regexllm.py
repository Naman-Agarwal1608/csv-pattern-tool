from typing import Union
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
import json
import re


class normalResponse(BaseModel):
    regex: str = Field(
        description="The regex pattern to find the specific pattern")
    replacement: str = Field(
        description="The replacement text to replace the specific pattern")


class errorResponse(BaseModel):
    error: str = Field(description="Error message")


class Response(BaseModel):
    output: Union[normalResponse, errorResponse]


class RegexLLM:

    prompt = """You are a chatbot assistant. Your task is to analyze a natural language instruction.
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

    def __init__(self):

        prompt_template = PromptTemplate(
            template=self.prompt,
            input_variables=["instruction"],
        )

        output_parser = StrOutputParser()
        model = ChatOpenAI(model="gpt-4-turbo", temperature=0.0)

        self.chain = prompt_template | model | output_parser

    def invokeLLM(self, instruction):
        response = self.chain.invoke(instruction)
        clean_response = response.strip('```json').strip().replace('\n', '')
        data = json.loads(clean_response)
        # regex = re.compile(data.get('regex'))
        # dict = {
        #     "regex": regex.pattern,
        #     "replacement": data.get('replacement')
        # }
        # print(dict)
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
