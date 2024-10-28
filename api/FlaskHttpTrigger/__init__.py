import logging
import azure.functions as func
from app import app as flask_app

def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.WsgiMiddleware(flask_app).handle(req, context)
