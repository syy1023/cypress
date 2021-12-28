from locust import HttpUser, task,between,constant,constant_throughput,User,TaskSet
from locust import events
import time,random,csv

from locust_plugins.csvreader import CSVReader


ids=[1,2,3,4,5]
ids2=[[1,10],[2,20],[3,30],[4,40],[5,50]]

ssn_reader = CSVReader("ssn.csv")
ssn_reader2 = CSVReader("ssn2.csv")


class MyUser(User):
    wait_time = between(3, 5)
    stop_timeout = 50 
    
    #wait_time = constant_throughput(5)
    


#class ForumPage(TaskSet):
    #tasks = {UserInfo:15}

class UserInfo(HttpUser):
    #wait_time = constant_throughput(5)
    



    def on_start(self):
        print("user start perform")

    def on_stop(self):
        print("user stop perform")


    @events.test_start.add_listener
    def on_test_start(environment, **kwargs):
        print("A new test is starting")

    @events.test_stop.add_listener
    def on_test_stop(environment, **kwargs):
        print("A new test is ending")

    

    @task
    def user_dynamic1(self):
        print("read multi cols from list")
        for i in ids2:
            print(i[0],i[1])
            self.client.get("/users/"+str(i[0])+'/'+str(i[1]))
          


    @task
    def user_dynamic2(self):
        print("pass multi parameters to next request")
        response = self.client.get("/users/")
        print("Response status code:", response.status_code)
        print("Response text:", response.text)
        print("Count value",response.json()["count"])
        print("First result",response.json()["results"][0])


        for i in range(len(response.json()["results"])):
            id=response.json()["results"][i]["id"]
            username=response.json()["results"][i]["username"]
            print("Id in first result",response.json()["results"][i]["id"])

            print("next request")
            response1=self.client.get('/snippets/'+str(id)+'/'+username)
            print(self.client.get('/snippets/'+str(id)+'/'+username))
            

    @task
    def user_dynamic3(self):
        print("read single col from csv file")
        i = next(ssn_reader)
        response=self.client.get("/users/"+i[0])
        print(response.json()["username"])


    @task
    def user_dynamic4(self):
        print("read parameter from list")
        for i in ids:
            response = self.client.get("/users/"+str(i))
            print(response.text)
            print(response.json()["username"])


    @task
    def user_dynamic5(self):
        print('read parameter generated from int range')
        for i in range(1,5):
            response=self.client.get("/users/"+str(i))
            print(response.text)


    @task
    def user_dynamic6(self):
        print('pass single parameter to next request')
        response = self.client.get("/users/")
        print("Response status code:", response.status_code)
        print("Response text:", response.text)
        print("Count value",response.json()["count"])
        print("First result",response.json()["results"][0])
        id=response.json()["results"][0]["id"]
        print("Id in first result",response.json()["results"][0]["id"])

        print("next request")
        response1=self.client.get('/snippets/'+str(id))
        print(response1.text)
        print(response1.json()["title"])
            
    




        

      
''' 
#print(response.json()["username"])
#print(response1.text)
            #print(response1.json()["title"])
        #for j in i[0].split(' '):
            #print(j)
            #one, two = list(j)
            #response=self.client.get("/users/"+one+'/'+two)


        #print(i[1])
        #response=self.client.get("/users/"+i[0]+'/'+i[0][1])
        #print(response.json()["username"]) 
    @task
    def user_info_4(self):
        response = self.client.get("/users/")
        print("Response status code:", response.status_code)
        print("Response text:", response.text)
        print("Count value",response.json()["count"])
        print("First result",response.json()["results"][0])


        for i in range(len(response.json()["results"])):
            id=response.json()["results"][i]["id"]
            username=response.json()["results"][i]["username"]
            print("Id in first result",response.json()["results"][i]["id"])

            print("next request")
            response1=self.client.get('/snippets/'+str(id)+'/'+username)
            print(self.client.get('/snippets/'+str(id)+'/'+username))
            #print(response1.text)
            #print(response1.json()["title"])
    @task
    def user_dynamic3(self):
        print("user danymic3")
        i = next(ssn_reader)
        response=self.client.get("/users/"+i[0])
        print(response.json()["username"])


    @task
    def user_info_1(self):
        response = self.client.get("/users/")
        print("Response status code:", response.status_code)
        print("Response text:", response.text)
        print("Count value",response.json()["count"])
        print("First result",response.json()["results"][0])
        id=response.json()["results"][0]["id"]
        print("Id in first result",response.json()["results"][0]["id"])

        print("next request")
        response1=self.client.get('/snippets/'+str(id))
        print(response1.text)
        print(response1.json()["title"])

    @task
    def user_dynamic(self):
        print("user_dynamic")
        for i in ids:
            response = self.client.get("/users/"+str(i))
            print(response.text)
            print(response.json()["username"])


    @task
    def user_dynamic2(self):
        print('user_dynamic2')
        for i in range(1,6):
            response=self.client.get("/users/"+str(i))
            print(response.text)
            #print(response.json()["username"])
'''
    
    

        

        
  
        #id=response.json()["results"](0)["id"]
        #print(id)
        #url=response.json()["results"][0]["url"]
       # print(url)
        #print("next request")
        #response2=self.client.get('/snippets/'+str(id))
        #title=response2.json()["title"]
        #print(response2.text)
        #print(title)

    