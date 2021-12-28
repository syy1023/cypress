from locust import HttpUser, task,between,constant,constant_throughput
import time

class UserConsumBook(HttpUser):
    #wait_time = constant_throughput(0.1)
    @task
    def consum_book(self):
        with self.client.get("/apibook1/?apikey=abcdefghigklmn&isbn=20211216", catch_response=True) as response:
            if response.text == "charge money":
                response.failure("right response")
            elif response.elapsed.total_seconds() < 0.5:
                response.failure("Request took too short")
            elif response.status_code == 200:
                response.success()

        response = self.client.get("/apibook1/?apikey=abcdefghigklmn&isbn=20211216")
        print("Response status code:", response.status_code)
        print("Response text:", response.text)
        author=response.json()[0]["author"]
        print(author)


  
        
    
        
    
        

        #self.client.get("/apibook1/?apikey=abcdefghigklmn&isbn=20211216")

    #自定义task间隔时间
    #def wait_time(self):
       # self.last_wait_time += 1
        #return self.last_wait_time








   # @task(3)
   # def view_items(self):
     #   for item_id in range(10):
   #         self.client.get(f"/item?id={item_id}", name="/item")
     #       time.sleep(1)


   # def on_start(self):
     #   self.client.post("/admin/login/?next=/admin/", json={"username":"anryan", "password":"1234"})


        