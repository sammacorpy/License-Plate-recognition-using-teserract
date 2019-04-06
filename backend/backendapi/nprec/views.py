from django.shortcuts import render
import pytesseract

import numpy as np
from django.http import HttpResponse
from skimage.io import imread
from skimage.color import rgb2gray
from skimage.filters import threshold_otsu, threshold_local
from skimage import measure
from skimage.measure import regionprops
from skimage.transform import resize
from skimage.restoration import denoise_bilateral
from skimage import exposure
from skimage.morphology import binary_opening
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
import firebase_admin
from firebase_admin import credentials,firestore
from random import randint
from django.core.mail import send_mail
from time import time


cred = credentials.Certificate({
  "type": "service_account",
  "project_id": "tollbooth-ff5b1",
  "private_key_id": "c9c3a5fc069a7d09395c1b2062487430b900d45e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFyomcUiZWSv9m\nplLexhj5vqqYXEg7PmebeS1wXRW7EmkXs4CutpunkBJWEe209Ya0VwJDDEvqOnTy\nfpgfcFAgzXuNwIz62woxwQvnIQ39pDHHrGYwDLmEon61uIlHiVoT6i7ddIbM63A+\n8oXrmaTQF2KPsi5wZNTf8eUc+afGz229RaNOac+Uh7wmV8NBgh3dsHfCwy53Nrp/\nFL+Tn6QN0YzI3bRVfnNhWk5l0fWtWCWTgPGF8bS1hsw/iXSjN5SF7jydjYm8EZ4s\nOC8ocLiMhz4cNkzCQ5CGyGcC4pFTrDfbVXlss5uL0ZMycxHs2vLT/cfBGhDEVen5\nkjLO+70PAgMBAAECggEABtJ8GaC5wss2cP92p0l07hRWBQhV03lNEI9G8nO7fqbd\nahxeaWhSCR8Oitp2dQHtAgZoRRDFA5C9nOmh7J+um9sKknKcSkDI4rtyYigBOAj0\nUJtRMQIXWgxSy4jQb1+89CflMu1Egwfx6LHrzZsQlL7hvuwZ7vWDZDAPQ4cW8uQA\nLD5Y5XB6hkf6un7dURG9Cai7S0pXCHKwzPcYPTmNuOJ2w5E0S6qA45/Pyelpq3B1\nNgzPIyTqPQaNl97V49JIGeECxdSBzgJ4gzSItvBZxIMFIfHkAKKh99V8uVE0HMiF\nQ0iOVRDXb+so8syEJ+UBl3OXJQbFJM1250vfLfVemQKBgQDuHDcbdP8zsRN1SAr1\noS1yuPHpl3V0thn8WFhPgBVrEHz7hPT+HJzH3sZdOmlxkI6pkkDiMyKMv19DTumM\nraC3NCG0BCYRdUY0fGs3kVycrff2FWGrcDdicHKIA8lOuISJuOKQITvkhY5qrmzj\nzjo0e/5FyH/JeVHGp71SmG1oiQKBgQDUptSH/JgyJA/+VcR47F8TSbCTCVBLMMAw\noPGkTgACA5g3kX0G+85pTSh6dYHRa/2P4RXL8ggiP8pCu+pICJiD8pmq4ApAGl6i\nZ5lVpZErV+4q+3JHdEpJGdnpxv3rH1vFCHqK40I0TiolLfVspLJa+OeZ6PvhTcdM\nvUYgulDi1wKBgQDA0JxXYaCe7U/Cczpcuc4hzl4nOHzmq+fTDn9EsYWmk02CJ6J0\nfBsBRwb+y6RDUDoWWtar1ZiuvPGZgbdiMd+pO0/nhEyHap4VNoNkFhQW1FGtNpdG\nyrIuxrwYJGjJlGXPWKYu7JqhbP1sqh6HQqKjiZzYSYohTlrIMWEAF2rRcQKBgFVL\ngW32LFnYSy352u+h59TFtvSTRMiUClK3C5Waz7f/Fxwa2Cpn7/gewcC0x1hn13HR\nl7uRHiAWtBsmYqd4AyzRrz9x08q4iQLdSQyod10KTPaimsj8ZRuDKfvyHEEl99pF\nN1nkI9b1D0SQdaOZQAzrT4JViEprtygZtzpDYVRLAoGBAJg+bPLldEyTu9XKem89\nhKkobsdEt4djX+tieRBxP86x06Vqc4VzYEcww8C+q2ooaCMswqSUrD9HWDbX5AAa\nYKB9ljIHv/EJGjPD8TiTZjDjE4UTz6/KsNoQBzJjMqFgDfLkprvKlIKv7Y/gwjxg\n9LYuapH7OyIg3RoUX9wvpsra\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-imn03@tollbooth-ff5b1.iam.gserviceaccount.com",
  "client_id": "104255776629378143516",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-imn03%40tollbooth-ff5b1.iam.gserviceaccount.com"
})

firebase_admin.initialize_app(cred)


# @cors_allow_methods('*')
@csrf_exempt
@require_POST 
def recognize(requests):
    img = imread(requests.POST["imgurl"])
    #img = imutils.rotate(img, 270)
    img = rgb2gray(img)



    grayscale = img*255
    tmpGrayscale = rgb2gray(img)
    tmpGrayscale = tmpGrayscale*255

    grayscale = exposure.equalize_hist(grayscale)

    threshold_value = threshold_otsu(grayscale)

    binaryImg = grayscale > threshold_value
    binaryImg = binary_opening(binaryImg)


    label_image = measure.label(binaryImg)

    plate_dimensions = (0.15*label_image.shape[1], 0.5*label_image.shape[1], 0.03*label_image.shape[0], 0.15*label_image.shape[0])

    min_width, max_width, min_height, max_height = plate_dimensions

    plate_objects_cordinates = []
    plate_like_objects = []
    plate_like_objects1 = []


    flag =0

    for region in regionprops(label_image):
        if region.area < 1100:
            continue
        
        min_row, min_col, max_row, max_col = region.bbox
        #print(min_row)
        
        region_height = max_row - min_row
        region_width = max_col - min_col
        
        if min_row>160 and region_height >= min_height and region_height <= max_height and region_width >= min_width and region_width <= max_width and region_height < region_width:
            flag = 1
            #print(region.area)
            plate_like_objects.append(grayscale[min_row:max_row, min_col:max_col+9])
            plate_like_objects1.append(tmpGrayscale[min_row:max_row, min_col:max_col+10])
            plate_objects_cordinates.append((min_row, min_col, max_row, max_col))
            
            
        




    license_plate1 = plate_like_objects1[0]



    config = ('-l eng --oem 1 --psm 6')
    text = pytesseract.image_to_string(license_plate1, config=config)

    cleanPlate = ""
    for char in text:
        if char.isalpha() or char.isdigit():
            if char.islower() or len(cleanPlate)==10:
                continue
            cleanPlate += char
    print(cleanPlate);
    db = firestore.client()
    veh_ref= db.collection(u'carandowner').where(u'vin', u'==', cleanPlate).get()
    rc=randint(60,250)
    resp=[]
    for doc in veh_ref:
        resp.append(doc.to_dict())

    smail=resp[0]['email']
    subject="Hello! from Toll Manager"
    msg="You just checked out from Vellore Toll Booth to bengaluru. your Vehicle Identifiction number "+ str(cleanPlate)+" is charged with total cost of "+str(rc)+".\n Thank you and have a safe journey." 
    send_mail(subject,msg,"sammacorpy@gmail.com",[smail],fail_silently=False)
    car=["Audi R8", "Santro","Alto K10", "Mercedes Benz"];
    carchosen=car[randint(0,3)]
    vref=db.collection(u'Tollrecord').add({'name':resp[0]['name'],"vin":resp[0]['vin'],'email':resp[0]['email'],'car_det':carchosen,'timestamp':time(),'photoURL':requests.POST['imgurl'],'cost':rc})
    return HttpResponse("Success")


