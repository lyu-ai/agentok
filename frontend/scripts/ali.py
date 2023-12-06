from modelscope.outputs import OutputKeys
from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks
import json

def segment_documents(documents):
    p = pipeline(
        task=Tasks.document_segmentation,
        model='damo/nlp_bert_document-segmentation_chinese-base')

    result = p(documents=documents)

    return result[OutputKeys.TEXT]

# Testing the function
print(segment_documents('Your input string here'))