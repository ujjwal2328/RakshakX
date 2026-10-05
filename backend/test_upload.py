import asyncio
import httpx

async def test_upload():
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post("http://localhost:8000/api/auth/login", json={"username": "admin", "password": "admin123"})
        if r.status_code != 200:
            print("Login failed:", r.text)
            return
        token = r.json()["access_token"]
        
        headers = {"Authorization": f"Bearer {token}"}
        files = {"file": ("test.doc", b"Hello world, this is a test document.")}
        data = {
            "subsidiary": "CIL",
            "document_type": "Report",
            "department": "Planning",
            "reporting_period": "FY2025"
        }
        r2 = await client.post("http://localhost:8000/api/documents/upload", headers=headers, data=data, files=files)
        print("Upload Status:", r2.status_code)
        print("Upload Response:", r2.text)

asyncio.run(test_upload())
