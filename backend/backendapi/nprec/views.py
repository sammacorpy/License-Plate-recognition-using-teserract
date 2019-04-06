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


cred = credentials.Certificate("enter your firebase admin-sdk credential here in Json format")

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


