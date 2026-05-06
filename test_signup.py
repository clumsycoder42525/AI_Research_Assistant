import requests

res = requests.post("http://127.0.0.1:8000/api/auth/signup", json={
    "username": "test_user_2",
    "email": "test2@gmail.com",
    "password": "mypassword"
})

print(res.status_code)
print(res.text)
