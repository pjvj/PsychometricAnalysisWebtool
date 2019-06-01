from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
import base64
from math import ceil
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from django.http import HttpResponse
from rest_framework import generics
import numpy as np
import scipy.io.wavfile
import pyaudio
import subprocess
import wave
from array import array
import time
from io import BytesIO
from PIL import Image, ImageFile
import speech_recognition as sr
#import httplib
#import http.client
import PIL.ImageTk
from PIL import Image,ImageEnhance,ImageFilter,ImageTk, VERSION, PILLOW_VERSION, _plugins
import json
import random
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.snowball import SnowballStemmer
from sklearn.feature_extraction.text import CountVectorizer
import matplotlib
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
matplotlib.use('PS')
import nltk
from nltk.util import ngrams
from nltk.tokenize import word_tokenize
import csv
import re,os
import pandas as pd  
import numpy as np
from pprint import pprint
import math
from nltk.tokenize import WordPunctTokenizer
import matplotlib.pyplot as plt
from bs4 import BeautifulSoup
from keras.models import model_from_json
from keras.preprocessing import image

import chatterbot
from chatterbot.response_selection import get_random_response
from chatterbot import ChatBot
from chatterbot.comparisons import LevenshteinDistance
from chatterbot.trainers import ListTrainer
from django.http import JsonResponse
from chatterbot.ext.django_chatterbot import settings
a=0
b=-1
c=5
highscore=True
index=-1
ques_list=[]
ques_dict={}
expected={}
difficulty={}
class Splitter(object):
    def __init__(self):
        self.nltk_splitter = nltk.data.load('tokenizers/punkt/english.pickle')
        self.nltk_tokenizer = nltk.tokenize.TreebankWordTokenizer()
    def split(self, text):
        sentences = self.nltk_splitter.tokenize(text)
        tokenized_sentences = [self.nltk_tokenizer.tokenize(sent) for sent in sentences]
        return tokenized_sentences

class POSTagger(object):
    def __init__(self):
        pass
    def pos_tag(self, sentences):
        pos = [nltk.pos_tag(sentence) for sentence in sentences]
        pos = [[(word, word, [postag]) for (word, postag) in sentence] for sentence in pos]
        return pos

def text_cleaner(text):
    splitter = Splitter()
    tok = WordPunctTokenizer()
    postagger = POSTagger()
    stemmer = SnowballStemmer("english")
    pat1 = r'@[A-Za-z0-9]+'
    pat2 = r'https?://[A-Za-z0-9./]+'
    combined_pat = r'|'.join((pat1,pat2))
    negations_dic = { "ain't": "am not", "aren't": "are not", "can't": "cannot", "can't've": "cannot have",
                "'cause": "because", "could've": "could have", "couldn't": "could not", "couldn't've": "could not have",
                "didn't": "did not", "doesn't": "does not", "don't": "do not", "hadn't": "had not", "hadn't've": "had not have",
                "hasn't": "has not", "haven't": "have not", "he'd": "he would", "he'd've": "he would have", "he'll": "he will",
                "he'll've": "he will have", "he's": "he is", "how'd": "how did", "how'd'y": "how do you", "how'll": "how will",
                "how's": "how is", "i'd": "i would", "i'd've": "i would have", "i'll": "i will", "i'll've": "i will have",
                "i'm": "i am", "i've": "i have", "isn't": "is not", "it'd": "it would", "it'd've": "it would have",
                "it'll": "it will", "it'll've": "it will have", "it's": "it is", "let's": "let us", "ma'am": "madam",
                "mayn't": "may not", "might've": "might have", "mightn't": "might not", "mightn't've": "might not have",
                "must've": "must have", "mustn't": "must not", "mustn't've": "must not have", "needn't": "need not",
                "needn't've": "need not have", "o'clock": "of the clock", "oughtn't": "ought not",
                "oughtn't've": "ought not have", "shan't": "shall not", "sha'n't": "shall not", "shan't've": "shall not have",
                "she'd": "she would", "she'd've": "she would have", "she'll": "she will", "she'll've": "she will have",
                "she's": "she is", "should've": "should have", "shouldn't": "should not", "shouldn't've": "should not have",
                "so've": "so have", "so's": "so is", "that'd": "that would", "that'd've": "that would have", "that's": "that is",
                "there'd": "there would", "there'd've": "there would have", "there's": "there is", "they'd": "they would",
                "they'd've": "they would have", "they'll": "they will", "they'll've": "they will have", "they're": "they are",
                "they've": "they have", "to've": "to have", "wasn't": "was not", "we'd": "we would", "we'd've": "we would have",
                "we'll": "we will", "we'll've": "we will have", "we're": "we are", "we've": "we have", "weren't": "were not",
                "what'll": "what will", "what'll've": "what will have", "what're": "what are", "what's": "what is",
                "what've": "what have", "when's": "when is", "when've": "when have", "where'd": "where did",
                "where's": "where is", "where've": "where have", "who'll": "who will", "who'll've": "who will have",
                "who's": "who is", "who've": "who have", "why's": "why is", "why've": "why have", "will've": "will have",
                "won't": "will not", "won't've": "will not have", "would've": "would have", "wouldn't": "would not",
                "wouldn't've": "would not have", "y'all": "you all", "y'all'd": "you all would",
                "y'all'd've": "you all would have", "y'all're": "you all are", "y'all've": "you all have", "you'd": "you would",
                "you'd've": "you would have", "you'll": "you will", "you'll've": "you will have", "you're": "you are",
                "you've": "you have", "ve": "have", "favor":"favour", "favorite":"favourite", "color":"colour",
                "behavior": "behaviour", "labor": "labour", "neighbor": "neighbour", "flavor":"flavour"}

    neg_pattern = re.compile(r'\b(' + '|'.join(negations_dic.keys()) + r')\b')
    soup = BeautifulSoup(text, 'lxml')
    souped = soup.get_text()
    stripped = re.sub(combined_pat, '', souped)
    try:
        clean = stripped.decode("utf-8-sig").replace(u"\ufffd", "?")
    except:
        clean = stripped
    lower_case=""
    for i in range(0,len(clean)):
        if text[i].isalpha():
            lower_case=lower_case+text[i].lower()
        elif text[i].isdigit():
            lower_case=lower_case
        else:
            lower_case=lower_case+text[i]
    neg_handled = neg_pattern.sub(lambda x: negations_dic[x.group()], lower_case)
    letters_only = re.sub("[^a-zA-Z]", " ", neg_handled)
    words = [x for x  in tok.tokenize(letters_only) if len(x) > 1]
    forpos= " ".join(words).strip()
    splitted_sentences = splitter.split(forpos)
    pos_tagged_sentences = postagger.pos_tag(splitted_sentences)
    altered_text=""
    for sentences in pos_tagged_sentences:
        for word in sentences:
            v=word[2]
            for val in v:
                if (val=="JJ" or val=="JJR" or val=="JJS" or val=="VB" or val=="VBD" or val=="VBG"
                    or val=="VBN" or val=="VBP" or val=="VBZ" or val=="RB" or val=="RBR" or val=="RBS" ):
                    altered_text=altered_text+stemmer.stem(word[0])+" "
    # print("cleaner poora chala")
    return altered_text

class FindSentiment(APIView):
    def post(self, request, format=None):
        anss = request.data['answers']
        print(len(anss))
        output_emots=[]
        # load json and create model
        json_file = open('../modelsentif.json', 'r')
        # print("model aa gaya")
        loaded_model_json = json_file.read()
        json_file.close()
        loaded_model = model_from_json(loaded_model_json)
        # print('model chala ')
        # load weights into new model
        loaded_model.load_weights("../modelsentif.h5")
        print("model loaded from disk")
        if anss:
            # output_emots=[]
            for ans in anss:
                createfeed=pd.read_csv('../finallexicon.csv',index_col=0)
                feature_values=[0,0,0]
                str_result = text_cleaner(ans)
                words= str_result.split()
                for j in range(0, len(words)):
                    try:
                        feature_values = np.add(feature_values,[createfeed.loc[words[j]][0],createfeed.loc[words[j]][1],createfeed.loc[words[j]][2]])
                    except:
                        pass
                try:
                    feature_values = feature_values.tolist()
                    feature_values = np.array(feature_values)
                    final_feature_values = []
                    final_feature_values.append(feature_values)
                    final_feature_values = np.array(final_feature_values)
                   
                    # Predict sentiment class using model
                    custom = loaded_model.predict(final_feature_values)
                    output_emot = custom[0]
                    disp_output = "Probability assigned to each sentiment class as percentage:", "\n\nNegative: ", output_emot[0]*100, "\n\nNeutral: ", output_emot[1]*100, "\n\nPositive: ", output_emot[2]*100
                    print(disp_output,output_emot)
                    print(custom[0])            
                except:
                    disp_output=("A longer description is required to get accurate sentiment estimation.")
                    output_emot=[0,0,0]
                print("eusvfiukbrf")
                output_emots.append(output_emot)
            return Response(output_emots)
        return Response(status=status.HTTP_404_NOT_FOUND)
            #return Response(status_code=404)

class RecordFindSentiment(APIView):
    conf1 = {'absolute', 'absolutely', 'affirm', 'affirmative', 'affirmed', 'aim', 'assert', 'assertive', 'assure', 'assured', 'assuredly', 'belief', 'believe', 'believed', 'believing', 'bold', 'boldly', 'calm', 'can', 'capable', 'certain', 'certainly', 'certainty', 'clear', 'clearly', 'collected', 'completely', 'concluded', 'conclusive', 'conclusively', 'confidence', 'confident', 'confidently', 'conviction', 'convinced', 'courage', 'decide', 'decided', 'decidedly', 'decisive', 'decisively', 'definite', 'definitely', 'determined', 'determinedly', 'direct', 'directly', 'doubtless', 'doubtlessly', 'downright', 'ease', 'easily', 'easy', 'encouraged', 'entrust', 'faith', 'fearless', 'firm', 'firmly', 'happy', 'heartily', 'unwavering', 'hopeful', 'immediately', 'indisputably', 'instantly', 'know', 'literally', 'opine', 'opinion', 'optimistic', 'optimistically', 'outright', 'particular', 'particularly', 'passion', 'perfect', 'perfectly', 'persuade', 'persuasive', 'positive', 'positively', 'power', 'questionless', 'questionlessly', 'really', 'resolve', 'resolved', 'satisfied', 'simply', 'specific', 'specifically', 'strength', 'sure', 'surely', 'therefore', 'thorough', 'thoroughly', 'together', 'undaunted', 'undeniable', 'undeniably', 'undoubtedly', 'unquestionably', 'want', 'will', 'yeah', 'yes'}
    conf2 = {'beyond doubt', 'by myself', 'certain belief', 'certain of', 'complete confidence', 'confident of', 'count on', 'counted on', 'counting on', 'feel certain', 'feel sure', 'firm belief', 'firmly convinced', 'for certain', 'for sure', 'full confidence', 'fully confident', 'fully convinced', 'give confidence', 'great confidence', 'great faith', 'have faith', 'have trust', 'high hopes', 'of course', 'rest assured', 'strong belief', 'strong opinion', 'strongly believe', 'sure about', 'sure thing', 'with conviction', 'without doubt'}
    conf3 = {'can be confident', 'have no doubt', 'have confidence in', 'in the belief', 'know about that', 'know for certain', 'lot of confidence', 'lot of faith', 'put faith in', 'sure of it', 'sure of that', 'without a doubt', 'you got to', 'you have to'}

    unconf1 = {'actual', 'actually', 'allegedly', 'anxiety', 'anxious', 'apparently', 'attempt', 'bewildered', 'bother', 'concern', 'confused', 'could', 'dazed', 'difficulty', 'dilemma', 'doubtful', 'dubious', 'fear', 'guess', 'guesswork', 'hesitant', 'hopefully', 'hunch', 'impossible', 'indecisive', 'lack', 'likely', 'literally', 'lose', 'loss', 'lost', 'may', 'misgiving', 'puzzle', 'shy', 'so', 'still', 'suspect', 'suspicion', 'suspicious', 'tiresome', 'um', 'uncertain', 'uneasiness', 'uneasy', 'unnerving', 'unpredictable', 'usually', 'waver', 'well', 'wonder', 'worried', 'worrisome', 'worry', 'worrying', 'difficult', 'disbelief', 'fail', 'falter', 'maybe', 'mildly', 'mistrust', 'need', 'no', 'notion', 'often', 'perhaps', 'possibly', 'quandary', 'sense', 'try', 'quit', 'sensed', 'surprised', 'think', 'tired', 'tiring', 'trouble'}
    unconf2 = {'am afraid', 'cannot decide', 'funny feeling', 'give up', 'good enough', 'good luck', 'gut feeling', 'hang back', 'i cannot', 'i think', 'if only', 'it appears', 'it seems', 'just luck', 'kind of', 'little bit', 'little credit', 'little faith', 'mixed up', 'sort of', 'what if', 'not sure', 'not certain', 'got lucky', 'hope to', 'i feel', 'i just', 'no expert', 'not possible', 'sneaking suspicion', 'doubt that'}
    unconf3 = {'dou you mind', 'hard to say', 'it looks like', 'would you mind', 'not too sure', 'not very sure', 'not very certain', 'of the impression', 'not too certain', 'do not think', 'if it is', 'like i said', 'would it be', 'do not know', 'not so sure', 'not too certain', 'not so certain'}

    cert1 = {'absolutely', 'am', 'believe', 'can', 'cannot', 'certain', 'certainly', 'certainty', 'clear', 'clearly', 'could', 'decide', 'determine', 'doubtless', 'doubtlessly', 'obvious', 'obviously', 'ought', 'realise', 'should', 'undoubtedly', 'would', 'are', 'is', 'know', 'must', 'never', 'sure', 'surely', 'was', 'were', 'will', 'definitely', 'definite', 'positive'}
    cert2 = {'beyond doubt', 'certain belief', 'very sure', 'want to', 'will have', 'certain of', 'have to', 'need to', 'quite sure', 'no doubt', 'should have', 'quite certain', 'very certain', 'must be', 'will be', 'should be', 'would be'}
    cert3 = {'must have to', 'will have to', 'without a doubt', 'would have to', 'ought to have', 'should have to', 'ought to be'}

    uncert1 = {'allegedly', 'apparently', 'assume', 'doubt', 'doubtful', 'doubtfully', 'guess', 'imagine', 'may', 'maybe', 'might', 'perchance', 'presume', 'presuppose', 'probable', 'reckon', 'suppose', 'supposedly', 'surmise', 'uncertain', 'possible', 'possibly', 'probably', 'seems', 'unlikely', 'unsure', 'shall', 'think', 'likely', 'seemingly', 'presumably'}
    uncert2 = {'can have', 'could have', 'it appears', 'may have', 'not definite', 'shall have', 'would have', 'cannot decide', 'might have', 'must have', 'it seems', 'not certain', 'not decide', 'not sure', 'can be', 'could be', 'may be', 'might be', 'shall be'}
    uncert3 = {'could have to', 'may have to', 'shall have to', 'not too sure', 'as far as', 'not too certain', 'not very sure', 'might have to', 'not very certain', 'not so sure', 'not so certain'}
    def post(self, request, format=None):
        audios=[]
        pattern1=r'rec(.*).wav'
        dirr='/Users/pallavi/Downloads/'
        for file in os.listdir(dirr):
            # print(file)
            if re.search(pattern1, file):
                audios.append(file)
        audios.sort()
        print(audios)
        output_emots=[]

        r = sr.Recognizer()
        for file in audios:
            filename=""+dirr+file

            harvard = sr.AudioFile(filename)
            with harvard as source:
                audio = r.record(source)
                try:
                    print("Google Speech Recognition thinks you said " + r.recognize_google(audio))
                except sr.UnknownValueError:
                    print("Speech Recognition could not understand audio")
                except sr.RequestError as e:
                    print("Could not request results from Speech Recognition service; {0}".format(e))
       
                ans= r.recognize_google(audio)
                # x=r.recognize_google(au)
                # print((x))
                # print(calculate_score((x)))

                print((ans))
                l= self.calculate_score(ans)
                conf=l[0]
                cert=l[1]
                output_emot=[conf,cert]
                output_emots.append(output_emot)
        return Response([output_emots,ans])
        return Response(status=status.HTTP_404_NOT_FOUND)
              
    def calculate_score(self,text):
        text = text.lower()
        text = contrac_pattern.sub(lambda x: contractions[x.group()], text)
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        grams1, grams2, grams3 = [], [], []
        n_grams = ngrams(text.split(), 3)
        grams3 = [' '.join(grams) for grams in n_grams]
        n_grams = ngrams(text.split(), 2)
        grams2 = [' '.join(grams) for grams in n_grams]
        n_grams = ngrams(text.split(), 1)
        grams1 = [' '.join(grams) for grams in n_grams]
        
        p1 = len(set(grams1) & self.conf1)
        p2 = len(set(grams2) & self.conf2)
        p3 = len(set(grams3) & self.conf3)
        psum = p1 + 2*p2 + 3*p3
        n1 = len(set(grams1) & self.unconf1)
        n2 = len(set(grams2) & self.unconf2)
        n3 = len(set(grams3) & self.unconf3)
        nsum = n1 + 2*n2 + 3*n3
        if (psum+nsum)!=0:
            confidence_score = (psum-nsum)/(psum+nsum)
        else:
            confidence_score = 0
        
        p1 = len(set(grams1) & self.cert1)
        p2 = len(set(grams2) & self.cert2)
        p3 = len(set(grams3) & self.cert3)
        psum = p1 + 2*p2 + 3*p3
        n1 = len(set(grams1) & self.uncert1)
        n2 = len(set(grams2) & self.uncert2)
        n3 = len(set(grams3) & self.uncert3)
        nsum = n1 + 2*n2 + 3*n3
        if (psum+nsum)!=0:
            certainty_score = (psum-nsum)/(psum+nsum)
        else:
            certainty_score = 0

        return (confidence_score, certainty_score)
        
    def truncate(self,f, n):
        s = '{}'.format(f)
        if 'e' in s or 'E' in s:
            return '{0:.{1}f}'.format(f, n)
        i, p, d = s.partition('.')
        return '.'.join([i, (d+'0'*n)[:n]])

class ChatterBot(APIView):

    chatterbot = ChatBot(**settings.CHATTERBOT)

    def post(self, request, *args, **kwargs):
        input_data=request.data['text']
        quesans3 = request.data['quesans3']
        print(input_data)
        print(len(quesans3))
        global c, a, highscore,index, ques_list, ques_dict, expected, difficulty
        print(index)
        d={}
        expect={}
        dif={}
        if (len(quesans3)>=1) & (c==5):
            i=0
            ll=[]
            for x in quesans3:
                l=[i,x['difficulty'],True]
                d[i]=x['question']
                expect[i]=x['answer']
                dif[i]=x['difficulty']
                ll.append(l)
                i=i+1
            ques_list=ll
            ques_list = sorted(ques_list, key=lambda x: x[1])
            ques_dict=d
            expected=expect
            difficulty=dif
            print("ques_list",ques_list)
            print("ques_dict",ques_dict)
            print("expected",expected)
            print("difficulty",difficulty)
        if (len(ques_list)>=5) &  (a<5):
            print("aaya",a,index)
            if a==0:
                q,index=self.ask_question( highscore, c,index)
                response_data="Alright, so without further ado, lets start the interview.\n"+q
                a =  a + 1
                # b=b+1
                c=c-1
                with open("/Users/pallavi/college/PsychometricAnalysisWebtool/Datastore/phase3result.json", "w") as write_file:
                    json.dump({},(write_file))
                return Response(response_data, status=200)
            else:
                print("aaai....",index)
                exp=expected[ques_list[index][0]]
                act=input_data
                dif=difficulty[ques_list[index][0]]
                print(exp,act,dif,ques_dict[ques_list[index][0]])
                score=self.score_answer([act,exp],dif)
                print(score)
                with open('/Users/pallavi/college/PsychometricAnalysisWebtool/Datastore/phase3result.json', 'r+') as f:
                    data = json.load(f)
                    data[index]={
                                    "ques":ques_dict[ques_list[index][0]],
                                    "exp":exp,
                                    "act":act,
                                    "dif":dif,
                                    "score":score
                                }
                    f.seek(0) 
                    json.dump(data, f, indent=4)
                    f.truncate()
                x=10*int(dif)
                print(x)
               
                # print(x.dtype)
                if score >= x:
                    highscore=True
                else:
                    highscore=False
                q,index=self.ask_question(highscore, c, index)
                print("q....",q)
                response_data=q
                a=a+1
                # b=b+1
                c=c-1
                return Response(response_data, status=200)

        if a==5:
            a=a+1
            print("are yiu entering here",index)

            exp=expected[ques_list[index][0]]
            act=input_data
            dif=difficulty[ques_list[index][0]]
            score=self.score_answer([act,exp],dif)
            with open('/Users/pallavi/college/PsychometricAnalysisWebtool/Datastore/phase3result.json', 'r+') as f:
                data = json.load(f)
                data[index]={
                                "ques":ques_dict[ques_list[index][0]],
                                "exp":exp,
                                "act":act,
                                "dif":dif,
                                "score":score
                            }
                f.seek(0) 
                json.dump(data, f, indent=4)
                f.truncate()
                response_data = "Alright, that would be all for the interview. Feel free to ask any questions that you may have."
                return Response(response_data, status=200)
        if not input_data:
            return Response({
                'text': [
                    'The attribute "text" is required.'
                ]
            }, status=400)

        message = self.text_clean(input_data)
        if self.check_str(message, self.ender[0]) or self.check_str(message, self.ender[1]) or self.check_str(message, self.ender[2]) or self.check_str(message, self.ender[3]) or self.check_str(message, self.ender[4]) or self.check_str(message, self.ender[5]) or self.check_str(message, self.ender[6]) or self.check_str(message, self.ender[7]) or self.check_str(message, self.ender[8]) or self.check_str(message, self.ender[9]):
            print('ChatBot: It was nice talking to you. Goodbye!')
            response = "It was nice talking to you. Goodbye!"
        else:
            # message = {"text":message}
            response = self.chatterbot.get_response(message)
            response = response.text
        response = response.capitalize()
        response += "."

        response_data = response

        return Response(response_data, status=200)

    contractions = { "ain't": "am not", "aren't": "are not", "can't": "cannot", "can't've": "cannot have",
                "'cause": "because", "could've": "could have", "couldn't": "could not", "couldn't've": "could not have",
                "didn't": "did not", "doesn't": "does not", "don't": "do not", "hadn't": "had not", "hadn't've": "had not have",
                "hasn't": "has not", "haven't": "have not", "he'd": "he would", "he'd've": "he would have", "he'll": "he will",
                "he'll've": "he will have", "he's": "he is", "how'd": "how did", "how'd'y": "how do you", "how'll": "how will",
                "how's": "how is", "i'd": "i would", "i'd've": "i would have", "i'll": "i will", "i'll've": "i will have",
                "i'm": "i am", "i've": "i have", "isn't": "is not", "it'd": "it would", "it'd've": "it would have",
                "it'll": "it will", "it'll've": "it will have", "it's": "it is", "let's": "let us", "ma'am": "madam",
                "mayn't": "may not", "might've": "might have", "mightn't": "might not", "mightn't've": "might not have",
                "must've": "must have", "mustn't": "must not", "mustn't've": "must not have", "needn't": "need not",
                "needn't've": "need not have", "o'clock": "of the clock", "oughtn't": "ought not",
                "oughtn't've": "ought not have", "shan't": "shall not", "sha'n't": "shall not", "shan't've": "shall not have",
                "she'd": "she would", "she'd've": "she would have", "she'll": "she will", "she'll've": "she will have",
                "she's": "she is", "should've": "should have", "shouldn't": "should not", "shouldn't've": "should not have",
                "so've": "so have", "so's": "so is", "that'd": "that would", "that'd've": "that would have", "that's": "that is",
                "there'd": "there would", "there'd've": "there would have", "there's": "there is", "they'd": "they would",
                "they'd've": "they would have", "they'll": "they will", "they'll've": "they will have", "they're": "they are",
                "they've": "they have", "to've": "to have", "wasn't": "was not", "we'd": "we would", "we'd've": "we would have",
                "we'll": "we will", "we'll've": "we will have", "we're": "we are", "we've": "we have", "weren't": "were not",
                "what'll": "what will", "what'll've": "what will have", "what're": "what are", "what's": "what is",
                "what've": "what have", "when's": "when is", "when've": "when have", "where'd": "where did",
                "where's": "where is", "where've": "where have", "who'll": "who will", "who'll've": "who will have",
                "who's": "who is", "who've": "who have", "why's": "why is", "why've": "why have", "will've": "will have",
                "won't": "will not", "won't've": "will not have", "would've": "would have", "wouldn't": "would not",
                "wouldn't've": "would not have", "y'all": "you all", "y'all'd": "you all would",
                "y'all'd've": "you all would have", "y'all're": "you all are", "y'all've": "you all have", "you'd": "you would",
                "you'd've": "you would have", "you'll": "you will", "you'll've": "you will have", "you're": "you are",
                "you've": "you have", "ve": "have", "favor":"favour", "favorite":"favourite", "color":"colour"}

    contrac_pattern = re.compile(r'\b(' + '|'.join(contractions.keys()) + r')\b')
    ender = ['bye', 'goodbye', 'finish the interview', 'quit the interview', 'end the interview', 'it was great talking to you', 'byebye', 'end this chat', 'quit this chat', 'finish this chat']
    stemmer = SnowballStemmer("english")
    num_ques = 5

    def ask_question(self,highscore, n, ind):
        global ques_list, ques_dict
        if n == self.num_ques:
            # select question of median difficulty
            ind = ceil(len(ques_list)/2)
            ques_list[ind][2] = False
            print(ind,ques_dict[ques_list[ind][0]])
            return ques_dict[ques_list[ind][0]], ind
        elif n > 0:
            flag = False
            if highscore:
                while ind<=len(ques_list)-1 and ques_list[ind][2]!=True:
                    ind += 1
                    flag = True
                    if ind>len(ques_list)-1:
                        flag=False
                        ind-=1
                        break
                if not flag:
                    while ind>=0 and ques_list[ind][2]!=True:
                        ind -= 1
                    
            else:
                while ind>=0 and ques_list[ind][2]!=True:
                    ind -= 1
                    flag = True
                    if ind<0:
                        flag=False
                        ind+=1
                        break
                if not flag:
                    while ind<=len(ques_list)-1 and ques_list[ind][2]!=True:
                        ind += 1
            # print(ind)
            ques_list[ind][2] = False
            return ques_dict[ques_list[ind][0]], ind
        else:
            return "END", -1

    # cosine similarity
    def cosine_sim(self,strs):
        print("strs cosine",strs)
        cossim = []
        if len(strs[0].split())==1 or len(strs[1].split())==1:
            vectorizer = CountVectorizer(strs, stop_words = {'a', 'an', 'the'}, ngram_range=(1,1))
            vectorizer.fit(strs)
            vectors = vectorizer.transform(strs).toarray()
            cossim.append(cosine_similarity(vectors)[0][1])
            cossim.append(0)
        else:
            for i in range(1,3):
                vectorizer = CountVectorizer(strs, stop_words = {'a', 'an', 'the'}, ngram_range=(i,i))
                vectorizer.fit(strs)
                vectors = vectorizer.transform(strs).toarray()
                cossim.append(cosine_similarity(vectors)[0][1])
        return cossim

    # Jaccard similarity
    def jaccard_sim(self,str1, str2):
        a = set(str1.split())
        b = set(str2.split())
        c = a.intersection(b)
        return float(len(c)) / (len(a) + len(b) - len(c))

    def score_answer(self,strs, difficulty):
        print(strs[0])
        print(strs[1])
        strs[0] = self.text_cleaner_two(strs[0])
        strs[1] = self.text_cleaner_two(strs[1])
        cossim = self.cosine_sim(strs)
        # print("cossim",cossim)
        # print("cossim[0]",cossim[0])
        # print("jacc",self.jaccard_sim(strs[0], strs[1]))
        score = (cossim[0]*6) + (self.jaccard_sim(strs[0], strs[1])*2.4)
        print(score)
        if cossim[0]<0.2:
            score += cossim[0]
        elif cossim[0]<=0.3:
            score += 0.4
        elif cossim[0]<=0.5:
            score += 0.8
        elif cossim[0]<=0.7:
            score += 1
        else:
            score += 1.6
        return ceil(score)*float(difficulty)

    def text_clean(self,text):
        text = text.lower()
        text = self.contrac_pattern.sub(lambda x: self.contractions[x.group()], text)
        text = re.sub('[^A-Za-z0-9 ]+', '', text)
        return text

    def text_cleaner_two(self,text):
        text = text.lower()
        text = self.contrac_pattern.sub(lambda x: self.contractions[x.group()], text)
        text = re.sub('[^A-Za-z0-9 ]+', '', text)
        final_text = ""
        for word in text.split(" "):
            final_text = final_text + self.stemmer.stem(word) + " "
        return final_text

    def check_str(self,string, sub_str):
        if (string.find(sub_str) == -1):
            return False
        else:
            return True



class FindSimilarity(APIView):
    def post(self, request, format=None):
        exp_ans = request.data['expectedAnswer']
        given_ans= request.data['givenAnswer']
        if exp_ans and given_ans:
            responses = []
            responses.append("")
            responses.append("")
            stemmer = SnowballStemmer("english")
            nltk_splitter = nltk.data.load('tokenizers/punkt/english.pickle')
            nltk_tokenizer = nltk.tokenize.TreebankWordTokenizer()
            one=""
            two=""
            sentences = nltk_splitter.tokenize(exp_ans)
            tokenized_sentences = [nltk_tokenizer.tokenize(sent) for sent in sentences]
            for word in tokenized_sentences[0]:
                word = (stemmer.stem(word))
                one=one+" "+word
            print(one)    
            sentences = nltk_splitter.tokenize(given_ans)
            tokenized_sentences = [nltk_tokenizer.tokenize(sent) for sent in sentences]
            for word in tokenized_sentences[0]:
                word = (stemmer.stem(word))
                two=two+" "+word
            print(two)
            responses[0]=one
            responses[1]=two
            score = self.scaled_score(responses)
            disp_results = "Similarity measures:", "\n\nThe 1-gram cosine similarity of the expected and given answer is ", self.cosine_sim(responses)[0], "\n\nThe 2-gram cosine similarity of the expected and given answer is ", self.cosine_sim(responses)[1],"\n\nThe jaccard similarity of the expected and given answer is ", self.jaccard_sim(responses[0], responses[1])
            disp_score = "\n\nThe overall score out of 100 is ", score
            print(disp_score)
            return Response(score)

        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


    def cosine_sim(self, strs):
        cossim= []
        for i in range(1,3):
            vectorizer = CountVectorizer(strs, stop_words = {'a', 'an', 'the'}, ngram_range=(i,i))
            vectorizer.fit(strs)
            vectors = vectorizer.transform(strs).toarray()
            cossim.append(cosine_similarity(vectors)[0][1])
        return cossim
    
    def jaccard_sim(self, str1, str2):
        a = set(str1.split())
        b = set(str2.split())
        c = a.intersection(b)
        return float(len(c)) / (len(a) + len(b) - len(c))
    
    def scaled_score(self, strs):
        cossim = self.cosine_sim(strs)
        score = cossim[0]*60 + cossim[1]*16 + self.jaccard_sim(strs[0], strs[1])*24
        if(cossim[1]>=0.1 and cossim[1]<=0.2):
            score += 3
        elif(cossim[1]>0.2 and cossim[1]<=0.4):
            score += 6
        elif(cossim[1]>0.4 and cossim[1]<=0.6):
            score += 6
        elif(cossim[1]>0.6 and cossim[1]<=0.8):
            score += 3
        elif(cossim[1]>0.8):
            score += 16 * (1 - cossim[1])
        return score

class FindEmotionSpeech(APIView):

    def post(self, request, format=None):

        file= request.data['filenumber']
        if file:

            subprocess.call(["ffmpeg","-i","/Users/pallavi/Downloads/rec"+file+".webm","-vn","-acodec","copy","/Users/pallavi/Downloads/rec"+file+".opus"])
            subprocess.call(["ffmpeg","-i","/Users/pallavi/Downloads/rec"+file+".opus","/Users/pallavi/Downloads/rec"+file+".wav"])


        # frames2= request.data['frames']
        # if frames2:
        #     FORMAT=pyaudio.paInt16
        #     CHANNELS=2
        #     RATE=44100
        #     CHUNK=1024
        #     #RECORD_SECONDS = 10
        #     FILE_NAME="RECORDING.wav"
        #     audio=pyaudio.PyAudio() #instantiate the pyaudio
        #     #recording prerequisites
        #     stream=audio.open(format=FORMAT,channels=CHANNELS, 
        #                       rate=RATE,
        #                       input=True,
        #                       frames_per_buffer=CHUNK)
        # #writing to file
        #     wavfile=wave.open("../"+FILE_NAME,'wb')
        #     wavfile.setnchannels(CHANNELS)
        #     wavfile.setsampwidth(audio.get_sample_size(FORMAT))
        #     wavfile.setframerate(RATE)
        #     wavfile.writeframes(b''.join(frames2))#append frames recorded to file
        #     wavfile.close()
            
            # load json and create model
            print('done making wav file..................')
            json_file = open('../modelser.json', 'r')
            loaded_model_json = json_file.read()
            json_file.close()
            loaded_model = model_from_json(loaded_model_json)
            # load weights into new model
            loaded_model.load_weights("../modelser.h5")
            print("Loaded model from disk")
            
            rate, data = scipy.io.wavfile.read("/Users/pallavi/Downloads/rec"+file+".wav")
            #print (rate)
            #print(len(data))
            #print(data[0])
            # new=[]
            # for b in data:
            #     b=max(b[0],b[1])
            #     if b>0:
            #         new.append(b)
            new=data
            print(len(new))
            new=np.array(new)
            l=len(new)
            c=int(l/100000)
            left=len(new)-(c*100000)
            rec=[]
            i=0
            for i in range(0,c):
                rec.append(new[100000*i:100000*(i+1)])

            if left>=70000:
                j=new[(c*100000):(c*100000)+left]
                l=len(j)
                l=100000-l
                for k in range(0,l):
                    j=np.append(j,new[(c*100000)+k])
                c=c+1
                rec.append(j)
            rec=np.array(rec)    
            print(rec.shape)

            summ=np.zeros([7])
            for i in range(0,c):
                find=rec[i]
                find=find.reshape(1,10,10000)
                custom = loaded_model.predict(find)
                percent_emot = custom[0]
                output_emot = custom[0].tolist()
                for k in range(0,7):
                    summ[k]=summ[k]+(output_emot[k])
            for k in range(0,7):
                summ[k]=summ[k]/c
            for k in range(0,7):
                summ[k]=float(self.truncate(summ[k],4))*100
            print(summ)
            output=summ
        else:
            output=[]
        return Response(output)
        return Response(status=status.HTTP_404_NOT_FOUND)  
    def truncate(self,f, n):
        s = '{}'.format(f)
        if 'e' in s or 'E' in s:
            return '{0:.{1}f}'.format(f, n)
        i, p, d = s.partition('.')
        return '.'.join([i, (d+'0'*n)[:n]])

class FindEmotionFace(APIView):
    def post(self,request,format=None):
        # img_data=request.data['imgString']
        # img_data="b"+"\'"+img_data+"\'"
        # b = bytes(img_data, 'utf-8')
        # img_data=base64.b64encode(b)
        # im = Image.open(BytesIO(img_data))
        # im.save('imagefer.png', 'PNG')
        # print("file save hui kya")
        # with open("/Users/pallavi/college/psychometricAnalysis/imagefer.png", "wb") as fh:
        #     fh.write(base64.b64decode(img_data))
        # load json and create model
        json_file = open('../modelg9.json', 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        loaded_model = model_from_json(loaded_model_json)
        # load weights into new model
        loaded_model.load_weights("../model_weightsg9.h5")
        ImageFile.LOAD_TRUNCATED_IMAGES = True
        dirr="/Users/pallavi/college/PsychometricAnalysisWebtool/Datastore/Ferimages/"
        output_emots=[]
        images=[]
        pattern1="image*"
        for file in os.listdir(dirr):
            # print(file)
            if re.search(pattern1, file):
                images.append(file)
        images.sort()
        print(images)
        for file in images:
            
            filename=""+dirr+file
            final_emot = [0, 0, 0, 0, 0, 0, 0]

            
            # filename = "/Users/pallavi/college/psychometricAnalysis/UsersData/imagefer.png"
            # with open(filename, 'rb') as f:
            #     b = BytesIO()
            #     f.seek(15, 0)
            #     b.write(f.read())
            #     img = Image.open(b)
            #     img.load(color_mode = "grayscale")
            img = image.load_img(filename, color_mode = "grayscale")
            img = ImageEnhance.Brightness(img).enhance(3)
            img = img.filter(ImageFilter.GaussianBlur(3))
            img= img.resize((48,48))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis = 0)
            custom = loaded_model.predict(x)
            output_emot = custom[0].tolist()
            print(output_emot)
            for i in range(0,7):
                output_emot[i]=float(self.truncate(output_emot[i],4))*100
            disp = "\n\nProbability assigned to each emotion class as percentage for FER:" + "\n\nAngry: "+ str(final_emot[0]*100)+ "\n\nDisgust: "+ str(final_emot[1]*100)+ "\n\nFear: "+ str(final_emot[2]*100)+ "\n\nHappy: "+ str(final_emot[3]*100) + "\n\nSad: "+ str(final_emot[4]*100) + "\n\nSurprised: "+ str(final_emot[5]*100) + "\n\nNeutral: " +str(final_emot[6]*100 ) 
            output_emots.append(output_emot)
            
        return Response(output_emots)
        return Response(status=status.HTTP_404_NOT_FOUND)  

    def truncate(self,f, n):
        s = '{}'.format(f)
        if 'e' in s or 'E' in s:
            return '{0:.{1}f}'.format(f, n)
        i, p, d = s.partition('.')
        return '.'.join([i, (d+'0'*n)[:n]])
        