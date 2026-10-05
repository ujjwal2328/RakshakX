import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.sql import text
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)

async def check():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, username FROM users"))
        rows = res.fetchall()
        print("Users in DB:", rows)

asyncio.run(check())
